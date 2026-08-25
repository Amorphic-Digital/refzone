import { generateText } from "ai"
import { NextRequest, NextResponse } from 'next/server'
import { parseAIJsonResponse } from "@/lib/parse-ai-json"
import { getModel } from "@/lib/ai-model"
import { SCENARIO_CATEGORIES, isValidCategory } from "@/lib/scenario-categories"

// Give the model the taxonomy verbatim so it picks a real slug rather than
// inventing one. Slug plus label is enough to disambiguate.
const CATEGORY_LIST = SCENARIO_CATEGORIES.map((c) => `- ${c.slug} (${c.label}: ${c.description})`).join("\n")

export async function POST(request: NextRequest) {
  try {
    const { answer } = await request.json()

    if (!answer) {
      return NextResponse.json({ error: 'Answer is required' }, { status: 400 })
    }

    const { text } = await generateText({
      model: getModel(),
      prompt: `You are an expert football/soccer referee analyzing a scenario answer to categorize it by law.

Given the following referee scenario answer, suggest the most relevant law category, specific law section, and training category:

ANSWER: "${answer}"

Respond with ONLY valid JSON in this exact format:
{
  "lawCategory": "Law X: Brief Title",
  "lawSection": "Specific section or subsection if applicable",
  "scenarioType": "one of: foul, offside, handball, misconduct, advantage, penalty, var, other",
  "difficulty": "one of: easy, medium, hard, expert",
  "category": "one of the training category slugs listed below"
}

Examples of law categories:
- Law 11: Offside
- Law 12: Fouls and Misconduct
- Law 14: The Penalty Kick
- Law 5: The Referee
- etc.

The "category" field must be exactly one of these slugs — do not invent new ones:
${CATEGORY_LIST}

Pick the training category a referee coach would file this clip under. If the
scenario spans several, choose the one the decision actually turns on.

Be specific and accurate based on the Laws of the Game.`,
      maxOutputTokens: 260,
    })

    const tags = parseAIJsonResponse(text) as Record<string, unknown> | null

    // Drop a hallucinated slug rather than passing one that matches no category.
    if (tags && !isValidCategory(tags.category as string)) {
      tags.category = ""
    }

    return NextResponse.json({ tags })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 })
  }
}
