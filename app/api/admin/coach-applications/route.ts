import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"

/** Approves or rejects a Referee Coach application. */
export async function POST(request: Request) {
  let adminId: string
  try {
    adminId = await requireAdmin()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { applicationId, action, note } = await request.json()

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 })
    }
    if (typeof applicationId !== "string" || !applicationId) {
      return NextResponse.json({ error: "Missing application" }, { status: 400 })
    }
    // The applicant reads this note, and a rejection with nothing attached
    // gives them no way to write a better one.
    if (action === "reject" && !(typeof note === "string" && note.trim())) {
      return NextResponse.json({ error: "A rejection needs a note" }, { status: 400 })
    }

    const supabase = createServiceClient()

    const { data: application } = await supabase
      .from("coach_applications")
      .select("user_id")
      .eq("id", applicationId)
      .single()

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    const { error: reviewError } = await supabase
      .from("coach_applications")
      .update({
        status: action === "approve" ? "approved" : "rejected",
        review_note: typeof note === "string" && note.trim() ? note.trim() : null,
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", applicationId)

    if (reviewError) {
      return NextResponse.json({ error: reviewError.message }, { status: 500 })
    }

    // The flag on the profile is what actually opens the library, so it is set
    // second: an application marked approved with no flag behind it is a
    // confusing half-state, and this way a failure here leaves the application
    // reviewable rather than silently granting access.
    const { error: flagError } = await supabase
      .from("profiles")
      .update({
        is_coach: action === "approve",
        // Dates the grant, so an expiry can be put on it later without
        // guessing when it started (scripts/040_coach_platform.sql).
        coach_since: action === "approve" ? new Date().toISOString() : null,
        coach_expires_at: null,
      })
      .eq("id", application.user_id)

    if (flagError) {
      return NextResponse.json(
        { error: `Reviewed, but the account flag did not save: ${flagError.message}` },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Coach application review error:", err)
    return NextResponse.json({ error: "Could not save that decision" }, { status: 500 })
  }
}
