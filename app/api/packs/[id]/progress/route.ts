import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"

/**
 * Records a trainee's answer to one scenario inside a pack.
 *
 * This is what makes the coach results view work. It is deliberately separate
 * from /api/scenario-submit, which handles points, streaks and law performance
 * — a pack answer still goes through that route as well, so working through a
 * pack counts toward the trainee's normal progress.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id: packId } = await params
    const body = await request.json()
    const { scenarioId, answerText, isCorrect, timeTakenSeconds } = body as {
      scenarioId?: string
      answerText?: string
      isCorrect?: boolean
      timeTakenSeconds?: number
    }

    if (!scenarioId) {
      return NextResponse.json({ error: "Missing scenarioId" }, { status: 400 })
    }

    const supabase = createServiceClient()

    // The scenario has to actually belong to this pack — otherwise the results
    // table could be filled with rows the coach never asked for.
    const { data: item } = await supabase
      .from("training_pack_items")
      .select("id")
      .eq("pack_id", packId)
      .eq("scenario_id", scenarioId)
      .maybeSingle()

    if (!item) {
      return NextResponse.json({ error: "That scenario is not in this pack" }, { status: 400 })
    }

    const { error } = await supabase.from("training_pack_progress").upsert(
      {
        pack_id: packId,
        scenario_id: scenarioId,
        user_id: userId,
        answer_text: answerText || null,
        is_correct: !!isCorrect,
        time_taken_seconds: timeTakenSeconds || 0,
      },
      { onConflict: "pack_id,scenario_id,user_id" },
    )

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Pack progress error:", err)
    return NextResponse.json({ error: "Could not record progress" }, { status: 500 })
  }
}
