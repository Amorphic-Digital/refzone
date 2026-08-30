import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/service"

export const dynamic = "force-dynamic"

/**
 * Where the room is up to in a live session.
 *
 * Polled by every phone in the room a few times a minute. It is deliberately
 * four small columns and no join: this is the one request in the app that runs
 * once per participant per few seconds, so it stays cheap enough that a
 * hundred-referee session is unremarkable.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params

    const { data: session } = await createServiceClient()
      .from("pack_live_sessions")
      .select("id, pack_id, current_index, reveal, is_open, training_packs(share_code, title)")
      .eq("join_code", code.trim().toLowerCase())
      .maybeSingle()

    if (!session) {
      return NextResponse.json({ error: "No session with that code" }, { status: 404 })
    }

    return NextResponse.json({
      currentIndex: session.current_index,
      reveal: session.reveal,
      isOpen: session.is_open,
      packCode: (session as any).training_packs?.share_code ?? null,
      packTitle: (session as any).training_packs?.title ?? null,
    })
  } catch {
    return NextResponse.json({ error: "Could not read the session" }, { status: 500 })
  }
}
