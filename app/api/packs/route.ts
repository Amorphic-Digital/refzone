import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { isCoach } from "@/lib/coach"
import { createServiceClient } from "@/lib/supabase/service"
import { generateShareCode } from "@/lib/training-packs"
import { isValidCategory } from "@/lib/scenario-categories"

const MAX_SCENARIOS_PER_PACK = 50

/** Creates a training pack. Referee Coach accounts only. */
export async function POST(request: Request) {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Building a pack means choosing from the whole library, so it is gated
  // the same way the library is.
  if (!(await isCoach(userId))) {
    return NextResponse.json(
      { error: "Training packs are a Referee Coach feature — apply at /coach" },
      { status: 403 },
    )
  }

  try {
    const body = await request.json()
    const { title, description, category, scenarioIds } = body as {
      title?: string
      description?: string
      category?: string
      scenarioIds?: string[]
    }

    if (!title?.trim()) {
      return NextResponse.json({ error: "A pack needs a title" }, { status: 400 })
    }

    if (!Array.isArray(scenarioIds) || scenarioIds.length === 0) {
      return NextResponse.json({ error: "Add at least one scenario" }, { status: 400 })
    }

    if (scenarioIds.length > MAX_SCENARIOS_PER_PACK) {
      return NextResponse.json(
        { error: `A pack can hold at most ${MAX_SCENARIOS_PER_PACK} scenarios` },
        { status: 400 },
      )
    }

    if (category && !isValidCategory(category)) {
      return NextResponse.json({ error: `Unknown category: ${category}` }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Only accept ids that exist and are live, so a pack can never contain a
    // dead link. Also de-duplicates, which the UNIQUE(pack_id, scenario_id)
    // constraint would otherwise reject outright.
    const uniqueIds = [...new Set(scenarioIds)]
    const { data: validScenarios } = await supabase
      .from("scenarios")
      .select("id")
      .in("id", uniqueIds)
      .eq("is_active", true)

    const validIds = new Set((validScenarios || []).map((s) => s.id))
    const orderedIds = uniqueIds.filter((id) => validIds.has(id))

    if (orderedIds.length === 0) {
      return NextResponse.json({ error: "None of those scenarios are available" }, { status: 400 })
    }

    const shareCode = await generateShareCode()

    const { data: pack, error: packError } = await supabase
      .from("training_packs")
      .insert({
        title: title.trim(),
        description: description?.trim() || null,
        category: category || null,
        created_by: userId,
        share_code: shareCode,
      })
      .select()
      .single()

    if (packError || !pack) {
      return NextResponse.json({ error: packError?.message || "Could not create pack" }, { status: 500 })
    }

    const { error: itemsError } = await supabase.from("training_pack_items").insert(
      orderedIds.map((scenarioId, index) => ({
        pack_id: pack.id,
        scenario_id: scenarioId,
        order_index: index,
      })),
    )

    if (itemsError) {
      // Leaving an empty pack behind would show up in the coach's list as a
      // broken row, so undo it.
      await supabase.from("training_packs").delete().eq("id", pack.id)
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, pack })
  } catch (err) {
    console.error("Create pack error:", err)
    return NextResponse.json({ error: "Could not create pack" }, { status: 500 })
  }
}
