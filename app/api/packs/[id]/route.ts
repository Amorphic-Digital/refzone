import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"

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
