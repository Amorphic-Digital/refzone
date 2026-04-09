import { generateText } from "ai"
import { getModel } from "@/lib/ai-model"

const SYSTEM_PROMPT = `You are RefZone Search, an expert football referee knowledge engine built on the IFAB Laws of the Game.

When a user searches for a referee-related topic, provide a concise, authoritative answer.

RULES:
1. Keep your answer to 2-3 short paragraphs maximum
2. Reference specific Law numbers (e.g. "Law 12.1", "Law 11")
3. Use **bold** for key decisions and law references
4. Be direct — answer the question first, then explain
5. If the query is vague, cover the most likely interpretation
6. Always write as if explaining to an Australian football referee
7. Use Australian English spelling (e.g. "offence" not "offense")
8. End with a one-line summary starting with "**Summary:**"

Do NOT use markdown headers. Do NOT use bullet points. Write in flowing paragraphs.`

export async function POST(req: Request) {
  try {
    const { query } = await req.json()

    if (!query || typeof query !== "string" || query.trim().length < 2) {
      return new Response(JSON.stringify({ text: "" }), {
        headers: { "Content-Type": "application/json" },
      })
    }

    const result = await generateText({
      model: getModel(),
      system: SYSTEM_PROMPT,
      prompt: `Search query: "${query.trim()}"

Provide a concise, authoritative answer about this football refereeing topic based on the IFAB Laws of the Game.`,
      maxTokens: 500,
      temperature: 0.3,
    })

    return new Response(JSON.stringify({ text: result.text }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (e) {
    console.error("Search AI error:", e)
    return new Response(JSON.stringify({ text: "", error: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  }
}
