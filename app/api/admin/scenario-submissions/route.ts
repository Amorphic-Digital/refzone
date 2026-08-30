import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { deleteVideo } from "@/lib/r2"

/**
 * An admin decides on a coach's clip.
 *
 * Approving creates the scenario for real, carrying the coach's credit and
 * answer across; rejecting deletes the object, because an unapproved clip
 * sitting in the bucket is somebody else's footage that nothing points at.
 */
export async function POST(request: Request) {
  let adminId: string
  try {
    adminId = await requireAdmin()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { submissionId, action, note, difficulty, scenarioType } = await request.json()

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 })
    }
    if (typeof submissionId !== "string" || !submissionId) {
      return NextResponse.json({ error: "Missing submission" }, { status: 400 })
    }
    if (action === "reject" && !(typeof note === "string" && note.trim())) {
      return NextResponse.json({ error: "A rejection needs a note" }, { status: 400 })
    }

    const supabase = createServiceClient()

    const { data: submission } = await supabase
      .from("scenario_submissions")
      .select("*")
      .eq("id", submissionId)
      .single()

    if (!submission) return NextResponse.json({ error: "Not found" }, { status: 404 })
    if (submission.status !== "pending") {
      return NextResponse.json({ error: "Already decided" }, { status: 400 })
    }

    let scenarioId: string | null = null

    if (action === "approve") {
      const { count } = await supabase
        .from("scenarios")
        .select("*", { count: "exact", head: true })

      const { data: scenario, error: insertError } = await supabase
        .from("scenarios")
        .insert({
          title: `Scenario #${(count || 0) + 1}`,
          video_url: submission.video_url,
          video_key: submission.video_key,
          video_credit: submission.video_credit,
          ai_answer: submission.suggested_answer,
          ai_description: submission.suggested_answer,
          category: submission.suggested_category,
          scenario_type: typeof scenarioType === "string" ? scenarioType : "foul",
          difficulty: typeof difficulty === "string" ? difficulty : "medium",
          is_active: true,
          points_value: 10,
        })
        .select("id")
        .single()

      // Leave the submission pending rather than marking it approved with no
      // scenario behind it — that state is impossible to notice later.
      if (insertError || !scenario) {
        return NextResponse.json(
          { error: insertError?.message || "Could not create the scenario" },
          { status: 500 },
        )
      }
      scenarioId = scenario.id
    }

    const { error } = await supabase
      .from("scenario_submissions")
      .update({
        status: action === "approve" ? "approved" : "rejected",
        review_note: typeof note === "string" && note.trim() ? note.trim() : null,
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
        scenario_id: scenarioId,
      })
      .eq("id", submissionId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Rejected footage should not stay in the bucket. Best effort: the
    // decision is recorded either way, and an orphan is not worth failing on.
    if (action === "reject" && submission.video_key) {
      try {
        await deleteVideo(submission.video_key)
      } catch (err) {
        console.error("Could not delete rejected submission video:", err)
      }
    }

    return NextResponse.json({ success: true, scenarioId })
  } catch (err) {
    console.error("Scenario submission review error:", err)
    return NextResponse.json({ error: "Could not save that decision" }, { status: 500 })
  }
}
