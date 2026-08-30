import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/service"
import { checkAnswer, CONFIDENCE_THRESHOLD } from "@/lib/check-answer"
import { findPublicPack, findGuestAttempt, scenarioIsInPack } from "@/lib/public-pack"
import { scoreAnswer } from "@/lib/live-session"
import { recordScenarioCredit, alreadyCredited } from "@/lib/scenario-credit"

const MAX_ANSWER = 2000
/** Grading takes a second or two, and hall wifi is hall wifi. */
const LATE_GRACE_SECONDS = 5

/**
 * Grades and records one guest answer.
 *
 * The grading happens here rather than in the browser because the scenario's
 * stored answer is the thing being graded against — shipping it to an
 * unauthenticated page would hand the answer key to anyone with the link.
 * The guest sends their words; the server sends back the verdict.
 *
 * Inside a live session the answer is also scored, and both the clock and the
 * score are computed from the session row rather than from anything the client
 * says, so a phone with a wrong clock cannot buy itself a speed bonus.
 */
export async function POST(request: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params
    const pack = await findPublicPack(code)

    if (!pack) {
      return NextResponse.json({ error: "That link is not open for answers" }, { status: 404 })
    }

    const body = await request.json()
    const token = typeof body.token === "string" ? body.token : ""
    const scenarioId = typeof body.scenarioId === "string" ? body.scenarioId : ""
    const answerText =
      typeof body.answerText === "string" ? body.answerText.trim().slice(0, MAX_ANSWER) : ""

    const attempt = await findGuestAttempt(pack.id, token)
    if (!attempt) {
      return NextResponse.json({ error: "Start the pack again" }, { status: 401 })
    }
    if (!answerText) {
      return NextResponse.json({ error: "Write your decision first" }, { status: 400 })
    }
    // Without this, the answers table could be filled with scenarios the coach
    // never put in the pack.
    if (!scenarioId || !(await scenarioIsInPack(pack.id, scenarioId))) {
      return NextResponse.json({ error: "That scenario is not in this pack" }, { status: 400 })
    }

    const supabase = createServiceClient()

    // In a live session the clip has to be the one the room is actually on,
    // and the clock has to still be running. Otherwise a tab left open on an
    // earlier clip could keep answering it all night.
    let points = 0
    let answeredIn: number | null = null

    if (attempt.session_id) {
      const { data: session } = await supabase
        .from("pack_live_sessions")
        .select(
          "phase, current_index, question_started_at, question_seconds, is_open, pack_id, timer_enabled, scoring_enabled",
        )
        .eq("id", attempt.session_id)
        .maybeSingle()

      if (!session || !session.is_open) {
        return NextResponse.json({ error: "That session has finished" }, { status: 409 })
      }
      if (session.phase !== "question") {
        return NextResponse.json({ error: "Answers are closed on this one" }, { status: 409 })
      }

      const { data: item } = await supabase
        .from("training_pack_items")
        .select("scenario_id")
        .eq("pack_id", session.pack_id)
        .order("order_index")
        .range(session.current_index, session.current_index)

      if ((item || [])[0]?.scenario_id !== scenarioId) {
        return NextResponse.json({ error: "The room has moved on" }, { status: 409 })
      }

      const startedAt = session.question_started_at
        ? new Date(session.question_started_at).getTime()
        : Date.now()
      answeredIn = Math.max(0, Math.round((Date.now() - startedAt) / 1000))

      // With the timer off the clip stays open until the coach reveals, which
      // the phase check above already enforces.
      if (session.timer_enabled && answeredIn > session.question_seconds + LATE_GRACE_SECONDS) {
        return NextResponse.json({ error: "Time is up on this one" }, { status: 409 })
      }
    }

    const { data: scenario } = await supabase
      .from("scenarios")
      .select("title, ai_answer, ai_description, points_value, law_category, law_section")
      .eq("id", scenarioId)
      .single()

    const check = await checkAnswer(
      answerText,
      scenario?.ai_answer || "",
      `${scenario?.title || "Scenario"}: ${scenario?.ai_description || ""}`,
    )
    const isCorrect = check.isCorrect && check.confidence >= CONFIDENCE_THRESHOLD

    if (attempt.session_id && answeredIn !== null) {
      const { data: session } = await supabase
        .from("pack_live_sessions")
        .select("question_seconds, scoring_enabled, timer_enabled")
        .eq("id", attempt.session_id)
        .single()

      if (session?.scoring_enabled) {
        // No timer means no speed bonus to award, so everyone right gets the
        // base — passing 0 as the limit is what scoreAnswer reads that way.
        points = scoreAnswer(isCorrect, answeredIn, session.timer_enabled ? session.question_seconds : 0)
      }
    }

    const { error } = await supabase.from("pack_guest_answers").upsert(
      {
        attempt_id: attempt.id,
        scenario_id: scenarioId,
        answer_text: answerText,
        is_correct: isCorrect,
        points,
        answered_in_seconds: answeredIn,
        time_taken_seconds:
          typeof body.timeTakenSeconds === "number" ? Math.max(0, body.timeTakenSeconds | 0) : 0,
      },
      { onConflict: "attempt_id,scenario_id" },
    )

    if (error) {
      console.error("Guest answer error:", error)
      return NextResponse.json({ error: "Could not save your answer" }, { status: 500 })
    }

    // A referee with an account gets the same credit here as they would
    // training on their own: the response row the dashboard counts, their law
    // performance, the streak and the points. Best effort — the answer is
    // already saved and the coach can already see it, so a failure here must
    // not fail the request in front of a room.
    //
    // The profile is credited with the scenario's own points_value, never the
    // live score: a game bonus is worth something inside the session and
    // nothing to a season total.
    if (attempt.user_id && !(await alreadyCredited(attempt.user_id, scenarioId))) {
      try {
        await recordScenarioCredit({
          userId: attempt.user_id,
          scenarioId,
          decision: answerText,
          isCorrect,
          timeTakenSeconds: answeredIn ?? 0,
          pointsEarned: isCorrect ? (scenario?.points_value ?? 10) : 0,
          lawCategory: scenario?.law_category,
          lawSection: scenario?.law_section,
        })
      } catch (err) {
        console.error("Could not credit a live answer:", err)
      }
    }

    return NextResponse.json({
      isCorrect,
      points,
      // Inside a live session the call is the coach's to reveal, so the phone
      // that just answered does not get to see it early.
      verdict: attempt.session_id ? "" : check.verdict,
      explanation: attempt.session_id ? "" : check.explanation,
    })
  } catch (err) {
    console.error("Public pack answer error:", err)
    return NextResponse.json({ error: "Could not check your answer" }, { status: 500 })
  }
}
