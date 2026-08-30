import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"

async function loadOwnedGroup(groupId: string, coachId: string) {
  const { data } = await createServiceClient()
    .from("coach_groups")
    .select("id, coach_id, is_active")
    .eq("id", groupId)
    .maybeSingle()

  return data && data.is_active && data.coach_id === coachId ? data : null
}

/** Removes a member, or archives the whole group. */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  if (!(await loadOwnedGroup(id, userId))) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 })
  }

  const memberId = new URL(request.url).searchParams.get("member")
  const supabase = createServiceClient()

  if (memberId) {
    const { error } = await supabase
      .from("coach_group_members")
      .delete()
      .eq("group_id", id)
      .eq("user_id", memberId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  // Archive rather than delete: assignments and the results behind them hang
  // off the group, and a coach closing out a season should not lose those.
  const { error } = await supabase.from("coach_groups").update({ is_active: false }).eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
