import { generateText } from "ai"
import { NextResponse } from "next/server"
import { parseAIJsonResponse } from "@/lib/parse-ai-json"
import { getModel } from "@/lib/ai-model"
import { splitDecision } from "@/lib/answer-summary"

export async function POST(req: Request) {
  try {
    const { userAnswer, correctAnswer, questionContext } = await req.json()

    // Used both to steer the model and as the fallback if it gives us nothing
    // usable — the result card must never come back blank.
    const { verdict: fallbackVerdict, detail: fallbackDetail } = splitDecision(correctAnswer)

    const { text } = await generateText({
      model: getModel(),
      prompt: `You are a football referee answer checker for RefZone. You must evaluate answers based on the IFAB Laws of the Game 2025/26.

Return your answer as strict JSON only — no markdown, no explanations, no text before or after the JSON.

The JSON must have exactly this shape:
{
  "isCorrect": true or false,
  "confidence": number between 0-100,
  "verdict": "short summary of the correct decision",
  "explanation": "why the referee's answer was right or wrong"
}

Constraints:
- Compare the user's answer to the correct answer semantically based on IFAB Laws of the Game 2025/26.
- Mark correct if the user's decision matches the correct decision according to the Laws, even with different wording.
- Focus on the core call (card type, restart, foul decision) as defined in the Laws of the Game.
- Be strict: partial answers or vague responses should be marked incorrect.
- Decisions must align with official IFAB Laws of the Game 2025/26 (Laws 11-Offside, 12-Fouls and Misconduct, etc.).
- "verdict" is the call at a glance: at most 12 words, naming the restart and any card. Summarise the Correct Answer given below — never invent a decision it does not state.
- "explanation" is 2 to 3 sentences addressed to the referee as "you". Say how their answer compared to the correct one, name the Law that decides it, and do not restate the verdict word for word.
- Do NOT include any extra fields, comments, or text.

Scenario: ${questionContext}
Correct Answer: ${correctAnswer}
User Answer: ${userAnswer}`,
      maxOutputTokens: 400,
    })

    try {
      const result = parseAIJsonResponse(text) as any
      const verdict = typeof result.verdict === "string" ? result.verdict.trim() : ""
      const explanation = typeof result.explanation === "string" ? result.explanation.trim() : ""

      // With no stored answer there is nothing to summarise, and the model will
      // happily invent a decision instead. Presenting that to a referee as "the
      // correct decision" is worse than showing nothing, so withhold it.
      const hasStoredAnswer = fallbackVerdict.length > 0

      return NextResponse.json({
        isCorrect: result.isCorrect ?? false,
        confidence: result.confidence ?? 0,
        verdict: hasStoredAnswer ? verdict || fallbackVerdict : "",
        explanation: hasStoredAnswer ? explanation || fallbackDetail : "",
      })
    } catch {
      // The model returned something unparseable. Marking the answer wrong is
      // the safe default, but the referee should still see the correct call
      // rather than an empty card.
      return NextResponse.json({
        isCorrect: false,
        confidence: 0,
        verdict: fallbackVerdict,
        explanation: fallbackDetail,
      })
    }
  } catch {
    return NextResponse.json({ error: "Failed to check answer" }, { status: 500 })
  }
}
