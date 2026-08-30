import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { findGroupByCode } from "@/lib/coach-groups"
import { createServiceClient } from "@/lib/supabase/service"

/**
 * A referee joins a group with the code their coach read out.
 *
 * Joining is always the referee's own action. Being in a group means a coach
 * can read your answers, and that must never happen because someone else added
 * you to a list.
 *
 * No coach account needed on this side — the whole point is that ordinary
 * referees join.
 */
export async function POST(request: Request) {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const code = typeof body.code === "string" ? body.code.trim() : ""

    if (!code) return NextResponse.json({ error: "Enter the code" }, { status: 400 })

    const group = await findGroupByCode(code)
    if (!group) return NextResponse.json({ error: "No group with that code" }, { status: 404 })

    if (group.coach_id === userId) {
      return NextResponse.json({ error: "That is your own group" }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Already a member: say so plainly rather than failing on the unique key.
    const { data: existing } = await supabase
      .from("coach_group_members")
      .select("id")
      .eq("group_id", group.id)
      .eq("user_id", userId)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ group: { id: group.id, name: group.name }, alreadyMember: true })
    }

    const { error } = await supabase
      .from("coach_group_members")
      .insert({ group_id: group.id, user_id: userId })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ group: { id: group.id, name: group.name } })
  } catch (err) {
    console.error("Join group error:", err)
    return NextResponse.json({ error: "Could not join that group" }, { status: 500 })
  }
}
