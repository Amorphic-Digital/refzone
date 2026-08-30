import { requireAuth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { recordScenarioCredit } from "@/lib/scenario-credit"

/**
 * Records that a signed-in referee judged a scenario.
 *
 * The recording itself lives in lib/scenario-credit.ts, shared with the live
 * session path so a referee in a training night is credited exactly the same
 * way as one training on their own.
 */
export async function POST(request: Request) {
  try {
    const userId = await requireAuth()

    const body = await request.json()
    const { scenarioId, userDecision, isCorrect, timeElapsed, pointsEarned, lawCategory, lawSection } =
      body as {
        scenarioId: string
        userDecision: string
        isCorrect: boolean
        timeElapsed: number
        pointsEarned: number
        lawCategory?: string
        lawSection?: string
      }

    if (!scenarioId || !userDecision) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await recordScenarioCredit({
      userId,
      scenarioId,
      decision: userDecision,
      isCorrect,
      timeTakenSeconds: timeElapsed,
      pointsEarned,
      lawCategory,
      lawSection,
    })

    // Revalidate dashboard and scenarios pages so data is fresh
    revalidatePath("/dashboard")
    revalidatePath("/scenarios")

    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
