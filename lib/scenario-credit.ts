import { createServiceClient } from "@/lib/supabase/service"

/**
 * Recording that a referee judged a scenario.
 *
 * This is what "a scenario you have done" means everywhere in the app: the
 * response row the dashboard counts, the law performance the recommendations
 * read, the daily streak, the activity log and the points.
 *
 * Lifted out of /api/scenario-submit so the live-session path can credit the
 * same way. Signed-in referees in a training night were getting nothing —
 * their answers went to the guest tables the coach reads and stopped there —
 * and the fix has to be the same code, not a second version of it that drifts.
 */

export interface ScenarioCredit {
  userId: string
  scenarioId: string
  decision: string
  isCorrect: boolean
  timeTakenSeconds: number
  /** The scenario's own points_value, never a live-session score. */
  pointsEarned: number
  lawCategory?: string | null
  lawSection?: string | null
}

export interface CreditResult {
  scenarioStreak: number
  longestScenarioStreak: number
}

export async function recordScenarioCredit(credit: ScenarioCredit): Promise<CreditResult> {
  const supabase = createServiceClient()
  const {
    userId,
    scenarioId,
    decision,
    isCorrect,
    timeTakenSeconds,
    pointsEarned,
    lawCategory,
    lawSection,
  } = credit

  // Insert the response — try with the time column, fall back without it,
  // because it was added later and not every deployment has it.
  const responseData: Record<string, unknown> = {
    user_id: userId,
    scenario_id: scenarioId,
    user_decision: decision,
    is_correct: isCorrect,
    points_earned: pointsEarned,
  }

  let responseError = (
    await supabase
      .from("scenario_responses")
      .insert({ ...responseData, time_taken_seconds: timeTakenSeconds })
  ).error
  if (responseError) {
    responseError = (await supabase.from("scenario_responses").insert(responseData)).error
  }
  if (responseError) throw new Error(responseError.message)

  // Law performance, which is what drives "you are weak on DOGSO". Scenarios
  // with no law recorded are skipped rather than bucketed under an empty
  // string that would read as a real weakness.
  if (lawCategory) {
    const { data: existing } = await supabase
      .from("user_law_performance")
      .select("*")
      .eq("user_id", userId)
      .eq("law_category", lawCategory)
      .eq("law_section", lawSection || "")
      .single()

    if (existing) {
      const total = existing.total_attempts + 1
      const correct = existing.correct_attempts + (isCorrect ? 1 : 0)
      await supabase
        .from("user_law_performance")
        .update({
          total_attempts: total,
          correct_attempts: correct,
          accuracy: (correct / total) * 100,
          last_attempt_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
    } else {
      await supabase.from("user_law_performance").insert({
        user_id: userId,
        law_category: lawCategory,
        law_section: lawSection || "",
        total_attempts: 1,
        correct_attempts: isCorrect ? 1 : 0,
        accuracy: isCorrect ? 100 : 0,
      })
    }
  }

  const today = new Date().toISOString().split("T")[0]

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "current_streak, longest_streak, last_activity_date, total_points, scenario_streak, longest_scenario_streak",
    )
    .eq("id", userId)
    .single()

  if (!profile) return { scenarioStreak: 0, longestScenarioStreak: 0 }

  let dailyStreak = profile.current_streak || 0
  if (profile.last_activity_date !== today) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    dailyStreak =
      profile.last_activity_date === yesterday.toISOString().split("T")[0] ? dailyStreak + 1 : 1
  }

  const scenarioStreak = isCorrect ? (profile.scenario_streak || 0) + 1 : 0
  const longestScenarioStreak = Math.max(scenarioStreak, profile.longest_scenario_streak || 0)

  await supabase
    .from("profiles")
    .update({
      total_points: (profile.total_points || 0) + pointsEarned,
      current_streak: dailyStreak,
      longest_streak: Math.max(dailyStreak, profile.longest_streak || 0),
      scenario_streak: scenarioStreak,
      longest_scenario_streak: longestScenarioStreak,
      last_activity_date: today,
    })
    .eq("id", userId)

  const { data: log } = await supabase
    .from("daily_activity_log")
    .select("id, scenarios_completed")
    .eq("user_id", userId)
    .eq("activity_date", today)
    .single()

  if (log) {
    await supabase
      .from("daily_activity_log")
      .update({ scenarios_completed: (log.scenarios_completed || 0) + 1 })
      .eq("id", log.id)
  } else {
    await supabase.from("daily_activity_log").insert({
      user_id: userId,
      activity_date: today,
      quizzes_completed: 0,
      scenarios_completed: 1,
    })
  }

  return { scenarioStreak, longestScenarioStreak }
}

/**
 * Has this referee already been credited for this scenario?
 *
 * A live session can put a clip in front of someone who judged it last month,
 * and counting it twice would inflate both their total and their accuracy.
 * The coach still sees the new answer — that is the guest-answer row, which is
 * recorded either way.
 */
export async function alreadyCredited(userId: string, scenarioId: string): Promise<boolean> {
  const { data } = await createServiceClient()
    .from("scenario_responses")
    .select("id")
    .eq("user_id", userId)
    .eq("scenario_id", scenarioId)
    .limit(1)
    .maybeSingle()

  return !!data
}
