import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"

/**
 * Grants, revokes or re-dates a coach account directly.
 *
 * The application queue covers people who asked. This covers everything else:
 * granting one to an association contact who never applied, taking one back,
 * and putting an expiry on a grant — which is the switch that makes "free for
 * the 2026 season" a thing an admin can do rather than a thing that needs a
 * release.
 */
export async function POST(request: Request) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { userId, isCoach: grant, expiresAt } = await request.json()

    if (typeof userId !== "string" || !userId) {
      return NextResponse.json({ error: "Missing user" }, { status: 400 })
    }
    if (typeof grant !== "boolean") {
      return NextResponse.json({ error: "Missing decision" }, { status: 400 })
    }

    let expiry: string | null = null
    if (grant && typeof expiresAt === "string" && expiresAt) {
      const parsed = new Date(expiresAt)
      if (Number.isNaN(parsed.getTime())) {
        return NextResponse.json({ error: "That date did not parse" }, { status: 400 })
      }
      expiry = parsed.toISOString()
    }

    const supabase = createServiceClient()

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, coach_since")
      .eq("id", userId)
      .maybeSingle()

    if (!profile) return NextResponse.json({ error: "No such user" }, { status: 404 })

    const { error } = await supabase
      .from("profiles")
      .update({
        is_coach: grant,
        // Regranting after a revoke starts a new grant; an unchanged grant
        // keeps its original date so "coach since" means what it says.
        coach_since: grant ? profile.coach_since || new Date().toISOString() : null,
        coach_expires_at: expiry,
      })
      .eq("id", userId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // A revoked coach should not keep a pending application in the queue
    // implying the question is still open.
    if (!grant) {
      await supabase
        .from("coach_applications")
        .update({ status: "rejected", review_note: "Coach access was removed." })
        .eq("user_id", userId)
        .eq("status", "pending")
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Coach grant error:", err)
    return NextResponse.json({ error: "Could not change that account" }, { status: 500 })
  }
}
