import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/service"
import { checkAnswer, CONFIDENCE_THRESHOLD } from "@/lib/check-answer"
import { findPublicPack, findGuestAttempt, scenarioIsInPack } from "@/lib/public-pack"

const MAX_ANSWER = 2000

/**
 * Grades and records one guest answer.
 *
 * The grading happens here rather than in the browser because the scenario's
 * stored answer is the thing being graded against — shipping it to an
 * unauthenticated page would hand the answer key to anyone with the link.
 * The guest sends their words; the server sends back the verdict.
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

    const { data: scenario } = await supabase
      .from("scenarios")
      .select("title, ai_answer, ai_description")
      .eq("id", scenarioId)
      .single()

    const check = await checkAnswer(
      answerText,
      scenario?.ai_answer || "",
      `${scenario?.title || "Scenario"}: ${scenario?.ai_description || ""}`,
    )
    const isCorrect = check.isCorrect && check.confidence >= CONFIDENCE_THRESHOLD

    const { error } = await supabase.from("pack_guest_answers").upsert(
      {
        attempt_id: attempt.id,
        scenario_id: scenarioId,
        answer_text: answerText,
        is_correct: isCorrect,
        time_taken_seconds:
          typeof body.timeTakenSeconds === "number" ? Math.max(0, body.timeTakenSeconds | 0) : 0,
      },
      { onConflict: "attempt_id,scenario_id" },
    )

    if (error) {
      console.error("Guest answer error:", error)
      return NextResponse.json({ error: "Could not save your answer" }, { status: 500 })
    }

    return NextResponse.json({
      isCorrect,
      verdict: check.verdict,
      explanation: check.explanation,
    })
  } catch (err) {
    console.error("Public pack answer error:", err)
    return NextResponse.json({ error: "Could not check your answer" }, { status: 500 })
  }
}
