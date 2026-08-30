import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { loadOwnedPack } from "@/lib/pack-ownership"

const MAX_NOTE = 1000

/**
 * The coach's verdict on one answer.
 *
 * Answers are graded by a model at >=70% confidence, and it gets calls wrong —
 * a referee who described the right decision in unusual words should not be
 * marked down by a machine. This is where a coach says so.
 *
 * The override is stored beside the model's call rather than replacing it, so
 * the results view can show that a human changed it, and so a run of overrides
 * is visible as a signal about the grading rather than quietly absorbed.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
  const source = body.source === "guest" ? "guest" : "member"
  const rowId = typeof body.rowId === "string" ? body.rowId : ""

  if (!rowId) return NextResponse.json({ error: "Missing answer" }, { status: 400 })

  // null clears the override and hands the call back to the model.
  const override =
    body.isCorrect === null || body.isCorrect === undefined ? null : !!body.isCorrect
  const note =
    typeof body.note === "string" && body.note.trim() ? body.note.trim().slice(0, MAX_NOTE) : null

  const supabase = createServiceClient()
  const table = source === "guest" ? "pack_guest_answers" : "training_pack_progress"

  // Scoping the update to this pack is what stops a coach editing an answer in
  // somebody else's pack by passing its row id.
  const scope =
    source === "guest"
      ? await (async () => {
          const { data: attempts } = await supabase
            .from("pack_guest_attempts")
            .select("id")
            .eq("pack_id", id)
          return { column: "attempt_id", values: (attempts || []).map((a) => a.id) }
        })()
      : null

  let query = supabase
    .from(table)
    .update({
      coach_override_correct: override,
      coach_note: note,
      coach_reviewed_by: userId,
      coach_reviewed_at: new Date().toISOString(),
    })
    .eq("id", rowId)

  if (scope) {
    if (scope.values.length === 0) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 })
    }
    query = query.in(scope.column, scope.values)
  } else {
    query = query.eq("pack_id", id)
  }

  const { error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
