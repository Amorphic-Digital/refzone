import { NextResponse } from "next/server"
import { checkAnswer } from "@/lib/check-answer"

/**
 * Grades a signed-in referee's written decision.
 *
 * The grading itself lives in lib/check-answer.ts, shared with the public
 * guest route — see the note there about why the answer key never travels.
 */
export async function POST(req: Request) {
  try {
    const { userAnswer, correctAnswer, questionContext } = await req.json()

    const result = await checkAnswer(userAnswer, correctAnswer, questionContext)

    return NextResponse.json({
      isCorrect: result.isCorrect,
      confidence: result.confidence,
      verdict: result.verdict,
      explanation: result.explanation,
    })
  } catch {
    return NextResponse.json({ error: "Failed to check answer" }, { status: 500 })
  }
}
