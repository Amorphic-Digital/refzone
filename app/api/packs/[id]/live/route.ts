import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { isCoach } from "@/lib/coach"
import { createServiceClient } from "@/lib/supabase/service"
import { generateUniqueCode } from "@/lib/share-codes"

const JOIN_CODE_LENGTH = 5

/**
 * The coach's end of a live session: open one, drive it, close it.
 *
 * The room reads the same row through /api/public/live/[code], which is why
 * everything here is a small update to one record rather than a broadcast.
 */
async function loadOwnedPack(packId: string, userId: string) {
  const supabase = createServiceClient()

  const { data: pack } = await supabase
    .from("training_packs")
    .select("id, created_by, is_active, is_public")
    .eq("id", packId)
    .maybeSingle()

  if (!pack || !pack.is_active || pack.created_by !== userId) return null
  return pack
}

/** Opens a session, reusing the one already running for this pack if there is one. */
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
  if (!pack) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // The room answers through the guest routes, and those refuse a pack the
  // coach has not made public. Saying so here beats a session where every
  // phone in the room gets a 404.
  if (!pack.is_public) {
    return NextResponse.json(
      { error: "Turn on the public link for this pack first — the room needs it to answer" },
      { status: 400 },
    )
  }

  const supabase = createServiceClient()

  const { data: running } = await supabase
    .from("pack_live_sessions")
    .select("id, join_code")
    .eq("pack_id", id)
    .eq("is_open", true)
    .maybeSingle()

  if (running) return NextResponse.json({ session: running })

  const joinCode = await generateUniqueCode("pack_live_sessions", "join_code", JOIN_CODE_LENGTH)

  const { data, error } = await supabase
    .from("pack_live_sessions")
    .insert({ pack_id: id, coach_id: userId, join_code: joinCode })
    .select("id, join_code")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ session: data })
}

/** Advances the room, reveals the answer, or ends the session. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  if (!(await loadOwnedPack(id, userId))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const body = await request.json().catch(() => ({}))
  const update: Record<string, unknown> = {}

  if (typeof body.currentIndex === "number") {
    update.current_index = Math.max(0, body.currentIndex | 0)
    // Moving on always hides the previous answer again, so the next clip never
    // opens with the solution already on the projector.
    update.reveal = false
  }
  if (typeof body.reveal === "boolean") update.reveal = body.reveal
  if (body.end === true) {
    update.is_open = false
    update.ended_at = new Date().toISOString()
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to change" }, { status: 400 })
  }

  const { error } = await createServiceClient()
    .from("pack_live_sessions")
    .update(update)
    .eq("pack_id", id)
    .eq("is_open", true)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
