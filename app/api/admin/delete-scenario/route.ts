import { requireAdmin } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { deleteVideo, isScenarioVideoKey } from "@/lib/r2"
import { NextResponse } from "next/server"

export async function DELETE(request: Request) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const scenarioId = searchParams.get("id")

    if (!scenarioId) {
      return NextResponse.json({ error: "Missing scenario ID" }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Read the video key before the row goes, so the R2 object can follow it.
    const { data: scenario } = await supabase
      .from("scenarios")
      .select("video_key")
      .eq("id", scenarioId)
      .single()

    // Delete scenario responses first (cascade should handle but be explicit)
    await supabase.from("scenario_responses").delete().eq("scenario_id", scenarioId)

    // Delete the scenario using service role (bypasses RLS)
    const { error: deleteError } = await supabase.from("scenarios").delete().eq("id", scenarioId)

    if (deleteError) {
      console.error("[v0] Error deleting scenario:", deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    // Verify deletion
    const { data: stillExists } = await supabase.from("scenarios").select("id").eq("id", scenarioId).single()

    if (stillExists) {
      return NextResponse.json({ error: "Scenario still exists after delete attempt" }, { status: 500 })
    }

    // The row is gone, so the video in R2 is now unreachable. deleteVideo
    // swallows its own failures — a leftover object is not worth failing a
    // delete the admin has already seen succeed.
    if (scenario?.video_key && isScenarioVideoKey(scenario.video_key)) {
      await deleteVideo(scenario.video_key)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete scenario error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
