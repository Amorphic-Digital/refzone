import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { isCoach } from "@/lib/coach"
import { createServiceClient } from "@/lib/supabase/service"
import { loadOwnedPack } from "@/lib/pack-ownership"

/**
 * Assigns a pack to one of the coach's groups, optionally with a due date.
 *
 * A due date is what turns a link people mean to get to into homework: it
 * shows on the referee's packs page and it is what the reminder cron reads.
 * Assigning also notifies the group, so nobody has to be told twice in person.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!(await isCoach(userId))) {
    return NextResponse.json({ error: "Referee Coach accounts only" }, { status: 403 })
  }

  const { id } = await params
  const pack = await loadOwnedPack(id, userId)
  if (!pack) return NextResponse.json({ error: "Pack not found" }, { status: 404 })

  const body = await request.json().catch(() => ({}))
  const groupId = typeof body.groupId === "string" ? body.groupId : ""
  const dueAt = typeof body.dueAt === "string" && body.dueAt ? new Date(body.dueAt) : null

  if (!groupId) return NextResponse.json({ error: "Pick a group" }, { status: 400 })
  if (dueAt && Number.isNaN(dueAt.getTime())) {
    return NextResponse.json({ error: "That date did not parse" }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data: group } = await supabase
    .from("coach_groups")
    .select("id, name, coach_id, is_active")
    .eq("id", groupId)
    .maybeSingle()

  if (!group || !group.is_active || group.coach_id !== userId) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 })
  }

  // Re-assigning the same pack updates the due date rather than stacking a
  // second assignment on the group.
  const { error } = await supabase.from("pack_assignments").upsert(
    {
      pack_id: id,
      group_id: groupId,
      assigned_by: userId,
      due_at: dueAt ? dueAt.toISOString() : null,
      reminder_sent_at: null,
    },
    { onConflict: "pack_id,group_id" },
  )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: members } = await supabase
    .from("coach_group_members")
    .select("user_id")
    .eq("group_id", groupId)

  if (members?.length) {
    const due = dueAt
      ? ` Due ${dueAt.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" })}.`
      : ""

    // Best effort: the assignment itself is saved, and a notification that did
    // not send is not worth failing the request over.
    await supabase.from("notifications").insert(
      members.map((member) => ({
        user_id: member.user_id,
        type: "pack_assigned",
        title: `New pack: ${pack.title}`,
        message: `${group.name} has been given a training pack.${due}`,
        link: `/packs/${id}`,
        is_read: false,
      })),
    )
  }

  return NextResponse.json({ success: true })
}

/** Unassigns a pack from a group. */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  if (!(await loadOwnedPack(id, userId))) {
    return NextResponse.json({ error: "Pack not found" }, { status: 404 })
  }

  const groupId = new URL(request.url).searchParams.get("group")
  if (!groupId) return NextResponse.json({ error: "Pick a group" }, { status: 400 })

  const { error } = await createServiceClient()
    .from("pack_assignments")
    .delete()
    .eq("pack_id", id)
    .eq("group_id", groupId)
    .eq("assigned_by", userId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
