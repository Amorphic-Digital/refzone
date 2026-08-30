import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { isCoach } from "@/lib/coach"
import { createServiceClient } from "@/lib/supabase/service"
import { generateShareCode } from "@/lib/training-packs"
import { loadOwnedPack } from "@/lib/pack-ownership"

/**
 * Copies a pack, contents and all.
 *
 * The usual case is last season's pack for this season's intake: same clips,
 * fresh results. So the copy takes a new share code and starts private and
 * empty of answers — reusing either would mix two groups' work together.
 */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
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

  const supabase = createServiceClient()

  const { data: items } = await supabase
    .from("training_pack_items")
    .select("scenario_id, order_index")
    .eq("pack_id", id)
    .order("order_index")

  const { data: copy, error } = await supabase
    .from("training_packs")
    .insert({
      title: `${pack.title} (copy)`,
      description: pack.description,
      category: pack.category,
      created_by: userId,
      share_code: await generateShareCode(),
      is_public: false,
    })
    .select("id")
    .single()

  if (error || !copy) {
    return NextResponse.json({ error: error?.message || "Could not copy" }, { status: 500 })
  }

  if (items?.length) {
    const { error: itemsError } = await supabase.from("training_pack_items").insert(
      items.map((item) => ({
        pack_id: copy.id,
        scenario_id: item.scenario_id,
        order_index: item.order_index,
      })),
    )

    // An empty copy is worse than none — the coach would have to notice the
    // clips are missing before rebuilding it.
    if (itemsError) {
      await supabase.from("training_packs").delete().eq("id", copy.id)
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }
  }

  return NextResponse.json({ id: copy.id })
}
