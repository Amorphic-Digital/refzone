import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { loadOwnedPack } from "@/lib/pack-ownership"

/** Soft-deletes a pack. Only the coach who built it can. */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const supabase = createServiceClient()

  const { data: pack } = await supabase
    .from("training_packs")
    .select("id, created_by")
    .eq("id", id)
    .single()

  if (!pack) {
    return NextResponse.json({ error: "Pack not found" }, { status: 404 })
  }

  if (pack.created_by !== userId) {
    return NextResponse.json({ error: "That is not your pack" }, { status: 403 })
  }

  // Soft delete: trainees may already hold the share link, and hard-deleting
  // would also destroy the results the coach collected.
  const { error } = await supabase
    .from("training_packs")
    .update({ is_active: false })
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

/**
 * Pack settings.
 *
 * is_public is the one that matters: off, the pack is answerable only by
 * people who sign in; on, anyone with the link can answer, which is how a
 * coach sends a pack to a whole branch. It is off by default, and turning it
 * on is always a deliberate act by the coach who owns the pack.
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

  const body = await request.json().catch(() => ({}))
  const update: Record<string, unknown> = {}

  if (typeof body.title === "string" && body.title.trim()) update.title = body.title.trim().slice(0, 200)
  if (typeof body.description === "string") update.description = body.description.trim() || null
  if (typeof body.isPublic === "boolean") update.is_public = body.isPublic
  if (typeof body.collectName === "boolean") update.collect_name = body.collectName

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to change" }, { status: 400 })
  }

  const { error } = await createServiceClient().from("training_packs").update(update).eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Closing the public link should also close any session running off it,
  // rather than leaving a room staring at a code that no longer answers.
  if (update.is_public === false) {
    await createServiceClient()
      .from("pack_live_sessions")
      .update({ is_open: false, ended_at: new Date().toISOString() })
      .eq("pack_id", id)
      .eq("is_open", true)
  }

  return NextResponse.json({ success: true })
}
