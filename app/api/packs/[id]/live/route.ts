import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { isCoach } from "@/lib/coach"
import { createServiceClient } from "@/lib/supabase/service"
import { generateUniqueCode } from "@/lib/share-codes"
import { loadOwnedPack } from "@/lib/pack-ownership"
import { findOpenSessionForPack, type LivePhase } from "@/lib/live-session"

const JOIN_CODE_LENGTH = 5
const MIN_SECONDS = 15
const MAX_SECONDS = 600

/**
 * The coach's end of a live session: open one, drive it through its phases,
 * close it.
 *
 * The room reads the same row through /api/public/live/[code], which is why
 * everything here is a small update to one record rather than a broadcast.
 */

/** Opens a session in the lobby, reusing one already running for this pack. */
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

  const running = await findOpenSessionForPack(id)
  if (running) {
    return NextResponse.json({ session: { id: running.id, join_code: running.join_code } })
  }

  const body = await request.json().catch(() => ({}))
  const seconds =
    typeof body.questionSeconds === "number"
      ? Math.min(MAX_SECONDS, Math.max(MIN_SECONDS, body.questionSeconds | 0))
      : 90

  const joinCode = await generateUniqueCode("pack_live_sessions", "join_code", JOIN_CODE_LENGTH)

  const { data, error } = await createServiceClient()
    .from("pack_live_sessions")
    .insert({
      pack_id: id,
      coach_id: userId,
      join_code: joinCode,
      phase: "lobby",
      question_seconds: seconds,
    })
    .select("id, join_code")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ session: data })
}

/**
 * Drives the session.
 *
 * Accepts a phase, a clip index, a time limit, or an end. Moving to a question
 * always restarts the clock — the countdown and the speed bonus are both
 * measured from question_started_at, so it has to be stamped server-side or a
 * phone with a wrong clock could buy itself points.
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
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const body = await request.json().catch(() => ({}))
  const update: Record<string, unknown> = {}

  const phases: LivePhase[] = ["lobby", "question", "reveal", "leaderboard", "ended"]
  const phase: LivePhase | null = phases.includes(body.phase) ? body.phase : null

  if (typeof body.questionSeconds === "number") {
    update.question_seconds = Math.min(
      MAX_SECONDS,
      Math.max(MIN_SECONDS, body.questionSeconds | 0),
    )
  }

  for (const [key, column] of [
    ["timerEnabled", "timer_enabled"],
    ["scoringEnabled", "scoring_enabled"],
    ["leaderboardEnabled", "leaderboard_enabled"],
  ] as const) {
    if (typeof body[key] === "boolean") update[column] = body[key]
  }

  if (typeof body.currentIndex === "number") {
    update.current_index = Math.max(0, body.currentIndex | 0)
  }

  if (phase) {
    update.phase = phase
    // reveal is the 040 flag; keeping it in step means nothing that still
    // reads it has to learn about phases.
    update.reveal = phase === "reveal"

    // Entering a question — whether that is the next clip or a restart of this
    // one — starts the clock fresh.
    if (phase === "question") update.question_started_at = new Date().toISOString()
    if (phase === "ended") {
      update.is_open = false
      update.ended_at = new Date().toISOString()
    }
  }

  if (body.end === true) {
    update.phase = "ended"
    update.reveal = false
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
