import { createServiceClient } from "@/lib/supabase/service"

/**
 * What a squad did with a pack.
 *
 * Two things this pulls together that used to be missing:
 *
 *   * Guests. A public pack is answered by people with no account, and their
 *     answers matter exactly as much as a member's. Both sources are merged
 *     into one list of participants here so no view has to know the difference.
 *
 *   * Law. Per-scenario accuracy tells a coach which clip was hard; accuracy
 *     rolled up by law_category tells them what to run next week. The second
 *     is the one that plans a session.
 *
 * A coach verdict always beats the model's: coach_override_correct is the
 * whole reason a coach reads the answers at all, so it is applied everywhere
 * rather than shown as a footnote.
 */

export interface ParticipantAnswer {
  scenarioId: string
  answerText: string | null
  /** After any coach override. */
  isCorrect: boolean
  /** What the model said, kept so the review UI can show it was changed. */
  modelCorrect: boolean
  overridden: boolean
  coachNote: string | null
  timeTakenSeconds: number
  createdAt: string
  /** Addresses the row for review: guests and members live in different tables. */
  source: "member" | "guest"
  rowId: string
}

export interface Participant {
  key: string
  name: string
  isGuest: boolean
  answered: number
  correct: number
  accuracy: number
  lastActive: string | null
  byScenario: Map<string, ParticipantAnswer>
}

export interface ScenarioStat {
  scenarioId: string
  title: string
  lawCategory: string | null
  attempts: number
  correct: number
  accuracy: number | null
}

export interface LawStat {
  law: string
  attempts: number
  correct: number
  accuracy: number
}

export interface PackResults {
  items: { scenarioId: string; title: string; lawCategory: string | null }[]
  participants: Participant[]
  scenarioStats: ScenarioStat[]
  lawStats: LawStat[]
  hardest: ScenarioStat[]
  guestCount: number
}

/** The model's call unless the coach said otherwise. */
function verdict(row: { is_correct: boolean; coach_override_correct: boolean | null }): boolean {
  return row.coach_override_correct ?? row.is_correct
}

export async function getPackResults(packId: string): Promise<PackResults> {
  const supabase = createServiceClient()

  const [itemsResult, memberResult, guestAttemptsResult] = await Promise.all([
    supabase
      .from("training_pack_items")
      .select("scenario_id, order_index, scenarios(id, title, law_category)")
      .eq("pack_id", packId)
      .order("order_index"),
    supabase
      .from("training_pack_progress")
      .select(
        "id, user_id, scenario_id, is_correct, coach_override_correct, coach_note, answer_text, time_taken_seconds, created_at",
      )
      .eq("pack_id", packId),
    supabase
      .from("pack_guest_attempts")
      .select("id, display_name, created_at, user_id")
      .eq("pack_id", packId),
  ])

  const items = (itemsResult.data || []).map((item) => ({
    scenarioId: item.scenario_id,
    title: (item as any).scenarios?.title || "Scenario",
    lawCategory: ((item as any).scenarios?.law_category as string | null) ?? null,
  }))

  const memberRows = memberResult.data || []
  const guestAttempts = guestAttemptsResult.data || []

  const { data: guestRows } = guestAttempts.length
    ? await supabase
        .from("pack_guest_answers")
        .select(
          "id, attempt_id, scenario_id, is_correct, coach_override_correct, coach_note, answer_text, time_taken_seconds, created_at",
        )
        .in(
          "attempt_id",
          guestAttempts.map((a) => a.id),
        )
    : { data: [] }

  const progressIds = [...new Set(memberRows.map((row) => row.user_id))]

  // Names in one query rather than per row. Someone who answered a public pack
  // while signed in sits in the guest tables but is not a guest, so their
  // account is resolved here too.
  const nameIds = [
    ...new Set([...progressIds, ...guestAttempts.map((a) => a.user_id).filter(Boolean)]),
  ] as string[]
  const { data: profiles } = nameIds.length
    ? await supabase.from("profiles").select("id, display_name").in("id", nameIds)
    : { data: [] }
  const nameById = new Map((profiles || []).map((p) => [p.id, p.display_name as string]))

  const toAnswer = (row: any, source: "member" | "guest"): ParticipantAnswer => ({
    scenarioId: row.scenario_id,
    answerText: row.answer_text,
    isCorrect: verdict(row),
    modelCorrect: row.is_correct,
    overridden: row.coach_override_correct !== null && row.coach_override_correct !== undefined,
    coachNote: row.coach_note ?? null,
    timeTakenSeconds: row.time_taken_seconds ?? 0,
    createdAt: row.created_at,
    source,
    rowId: row.id,
  })

  const build = (
    key: string,
    name: string,
    isGuest: boolean,
    rows: ParticipantAnswer[],
  ): Participant => {
    const correct = rows.filter((row) => row.isCorrect).length
    return {
      key,
      name,
      isGuest,
      answered: rows.length,
      correct,
      accuracy: rows.length ? Math.round((correct / rows.length) * 100) : 0,
      lastActive:
        rows
          .map((row) => row.createdAt)
          .sort()
          .at(-1) ?? null,
      byScenario: new Map(rows.map((row) => [row.scenarioId, row])),
    }
  }

  // Grouped by the person, not by the table their answers landed in. A
  // signed-in referee can have rows in both — worked through the pack at home,
  // then joined the live session — and that is one participant with one list.
  const grouped = new Map<string, { name: string; isGuest: boolean; rows: ParticipantAnswer[] }>()

  const add = (key: string, name: string, isGuest: boolean, rows: ParticipantAnswer[]) => {
    if (rows.length === 0) return
    const entry = grouped.get(key)
    if (!entry) {
      grouped.set(key, { name, isGuest, rows: [...rows] })
      return
    }
    entry.rows.push(...rows)
    // Knowing the account beats not knowing it, whichever half arrived first.
    if (!isGuest) {
      entry.isGuest = false
      entry.name = name
    }
  }

  for (const id of progressIds) {
    add(
      `member:${id}`,
      nameById.get(id) || "Referee",
      false,
      memberRows.filter((row) => row.user_id === id).map((row) => toAnswer(row, "member")),
    )
  }

  for (const attempt of guestAttempts) {
    add(
      // Keyed by account where there is one, so the same referee answering from
      // two devices is one row rather than two.
      attempt.user_id ? `member:${attempt.user_id}` : `guest:${attempt.id}`,
      (attempt.user_id ? nameById.get(attempt.user_id) : null) || attempt.display_name || "Guest",
      !attempt.user_id,
      (guestRows || [])
        .filter((row) => row.attempt_id === attempt.id)
        .map((row) => toAnswer(row, "guest")),
    )
  }

  const participants: Participant[] = [...grouped.entries()]
    .map(([key, entry]) => build(key, entry.name, entry.isGuest, entry.rows))
    .sort((a, b) => b.accuracy - a.accuracy || b.answered - a.answered)

  const allAnswers = participants.flatMap((p) => [...p.byScenario.values()])

  const scenarioStats: ScenarioStat[] = items.map((item) => {
    const rows = allAnswers.filter((row) => row.scenarioId === item.scenarioId)
    const correct = rows.filter((row) => row.isCorrect).length
    return {
      scenarioId: item.scenarioId,
      title: item.title,
      lawCategory: item.lawCategory,
      attempts: rows.length,
      correct,
      accuracy: rows.length ? Math.round((correct / rows.length) * 100) : null,
    }
  })

  // Roll the same numbers up by law. Scenarios with no law recorded are left
  // out rather than bucketed as "Unknown", which would read as a real weakness.
  const byLaw = new Map<string, { attempts: number; correct: number }>()
  for (const stat of scenarioStats) {
    if (!stat.lawCategory || stat.attempts === 0) continue
    const entry = byLaw.get(stat.lawCategory) || { attempts: 0, correct: 0 }
    entry.attempts += stat.attempts
    entry.correct += stat.correct
    byLaw.set(stat.lawCategory, entry)
  }

  const lawStats: LawStat[] = [...byLaw.entries()]
    .map(([law, entry]) => ({
      law,
      attempts: entry.attempts,
      correct: entry.correct,
      accuracy: Math.round((entry.correct / entry.attempts) * 100),
    }))
    .sort((a, b) => a.accuracy - b.accuracy)

  const hardest = [...scenarioStats]
    .filter((stat) => stat.attempts > 0)
    .sort((a, b) => (a.accuracy ?? 100) - (b.accuracy ?? 100))
    .slice(0, 3)

  return {
    items,
    participants,
    scenarioStats,
    lawStats,
    hardest,
    guestCount: participants.filter((p) => p.isGuest).length,
  }
}

/** One row per answer, for a coach who has to report to their association. */
export function resultsToCsv(packTitle: string, results: PackResults): string {
  const escape = (value: unknown) => {
    const text = value === null || value === undefined ? "" : String(value)
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
  }

  const header = [
    "Pack",
    "Participant",
    "Account",
    "Scenario",
    "Law",
    "Answer",
    "Result",
    "Graded by",
    "Coach note",
    "Seconds",
    "Answered at",
  ]

  const titleById = new Map(results.items.map((item) => [item.scenarioId, item]))

  const rows = results.participants.flatMap((participant) =>
    [...participant.byScenario.values()].map((answer) => {
      const item = titleById.get(answer.scenarioId)
      return [
        packTitle,
        participant.name,
        participant.isGuest ? "guest" : "member",
        item?.title ?? "Scenario",
        item?.lawCategory ?? "",
        answer.answerText ?? "",
        answer.isCorrect ? "correct" : "incorrect",
        answer.overridden ? "coach" : "auto",
        answer.coachNote ?? "",
        answer.timeTakenSeconds,
        answer.createdAt,
      ].map(escape)
    }),
  )

  return [header.map(escape), ...rows].map((row) => row.join(",")).join("\n")
}
