import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/service"
import { findPublicPack, findGuestAttempt } from "@/lib/public-pack"

/** Marks a guest attempt finished, so the coach can tell it apart from one abandoned halfway. */
export async function POST(request: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params
    const pack = await findPublicPack(code)
    if (!pack) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const body = await request.json().catch(() => ({}))
    const attempt = await findGuestAttempt(pack.id, typeof body.token === "string" ? body.token : "")
    if (!attempt) return NextResponse.json({ error: "Unknown attempt" }, { status: 401 })

    await createServiceClient()
      .from("pack_guest_attempts")
      .update({ completed_at: new Date().toISOString() })
      .eq("id", attempt.id)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Could not finish" }, { status: 500 })
  }
}
