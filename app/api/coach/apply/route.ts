import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { requireAuth } from "@/lib/auth"
import { isCoach } from "@/lib/coach"
import { createServiceClient } from "@/lib/supabase/service"

const MIN_REASON = 40
const MAX_REASON = 2000
const MAX_FIELD = 200

/** Submits — or resubmits — a Referee Coach application. */
export async function POST(request: Request) {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (await isCoach(userId)) {
    return NextResponse.json({ error: "You already have a coach account" }, { status: 400 })
  }

  try {
    const body = await request.json()
    const reason = typeof body.reason === "string" ? body.reason.trim() : ""

    if (reason.length < MIN_REASON) {
      return NextResponse.json(
        { error: `Please write at least ${MIN_REASON} characters about what you would use it for` },
        { status: 400 },
      )
    }

    const trim = (value: unknown) =>
      typeof value === "string" && value.trim() ? value.trim().slice(0, MAX_FIELD) : null

    const supabase = createServiceClient()

    // One row per user, so a rejected applicant reapplying overwrites their
    // own row rather than adding a second near-identical one to the queue.
    // Resetting the review fields is what puts it back in front of an admin.
    const { error } = await supabase.from("coach_applications").upsert(
      {
        user_id: userId,
        display_name: trim(body.display_name),
        email: (await currentUser())?.emailAddresses?.[0]?.emailAddress ?? null,
        association: trim(body.association),
        level: trim(body.level),
        reason: reason.slice(0, MAX_REASON),
        status: "pending",
        review_note: null,
        reviewed_by: null,
        reviewed_at: null,
      },
      { onConflict: "user_id" },
    )

    if (error) {
      console.error("Coach application error:", error)
      return NextResponse.json({ error: "Could not save your application" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Coach application error:", err)
    return NextResponse.json({ error: "Could not send your application" }, { status: 500 })
  }
}
