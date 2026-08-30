import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/service"

export const dynamic = "force-dynamic"

/** How far ahead of the due date the nudge goes out. */
const LEAD_TIME_HOURS = 24

/**
 * Nudges anyone who has not finished an assigned pack that is due soon.
 *
 * Called by the same external cron as the other jobs here:
 *   curl -H "Authorization: Bearer $CRON_SECRET" https://app.refzone.com.au/api/cron/pack-due-reminders
 * Hourly is about right — the window is a day wide, so the exact minute does
 * not matter, and reminder_sent_at means a second run inside the window is a
 * no-op rather than a second notification.
 *
 * Only people who have actually not finished are told. A referee who did the
 * pack on Monday should not get chased on Wednesday.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createServiceClient()
  const now = Date.now()
  const window = new Date(now + LEAD_TIME_HOURS * 60 * 60 * 1000).toISOString()

  const { data: assignments, error } = await supabase
    .from("pack_assignments")
    .select("id, pack_id, group_id, due_at, training_packs(title, is_active)")
    .is("reminder_sent_at", null)
    .not("due_at", "is", null)
    .lte("due_at", window)
    .gte("due_at", new Date(now).toISOString())

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let notified = 0

  for (const assignment of assignments || []) {
    const pack = (assignment as any).training_packs
    if (!pack?.is_active) continue

    const [membersResult, progressResult, itemsResult] = await Promise.all([
      supabase.from("coach_group_members").select("user_id").eq("group_id", assignment.group_id),
      supabase
        .from("training_pack_progress")
        .select("user_id, scenario_id")
        .eq("pack_id", assignment.pack_id),
      supabase.from("training_pack_items").select("id").eq("pack_id", assignment.pack_id),
    ])

    const total = (itemsResult.data || []).length
    const doneCount = new Map<string, number>()
    for (const row of progressResult.data || []) {
      doneCount.set(row.user_id, (doneCount.get(row.user_id) || 0) + 1)
    }

    const outstanding = (membersResult.data || []).filter(
      (member) => (doneCount.get(member.user_id) || 0) < total,
    )

    if (outstanding.length) {
      await supabase.from("notifications").insert(
        outstanding.map((member) => ({
          user_id: member.user_id,
          type: "pack_due",
          title: `${pack.title} is due tomorrow`,
          message: "You have scenarios left in this pack.",
          link: `/packs/${assignment.pack_id}`,
          is_read: false,
        })),
      )
      notified += outstanding.length
    }

    // Stamped whether or not anyone needed telling — the window has been
    // handled either way, and re-checking it every hour until the due date
    // passes would be pure load.
    await supabase
      .from("pack_assignments")
      .update({ reminder_sent_at: new Date().toISOString() })
      .eq("id", assignment.id)
  }

  return NextResponse.json({
    success: true,
    assignments: (assignments || []).length,
    notified,
  })
}
