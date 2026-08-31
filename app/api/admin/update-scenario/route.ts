import { requireAdmin } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { NextResponse } from "next/server"
import { isValidCategory } from "@/lib/scenario-categories"
import { isScenarioVideoKey } from "@/lib/r2"

/**
 * Edit an existing scenario from the admin panel.
 *
 * The browser's Supabase client is anonymous — this app authenticates with
 * Clerk, not Supabase auth — so an update sent straight from the page is
 * filtered out by RLS and comes back as a success with zero rows changed. The
 * edit then looks saved until the page is reloaded. Writes have to go through
 * the service client behind requireAdmin, the way inserts and deletes already do.
 */
export async function PATCH(request: Request) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, video_credit, category, video_url, video_key, is_active } = body

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Missing scenario id" }, { status: 400 })
    }

    const patch: Record<string, unknown> = {}

    if (video_credit !== undefined) {
      patch.video_credit =
        typeof video_credit === "string" && video_credit.trim() ? video_credit.trim() : null
    }

    // A category outside the taxonomy would be invisible in the category menu
    // and break the /topics pages, so reject it rather than storing it.
    if (category !== undefined) {
      if (category && !isValidCategory(category)) {
        return NextResponse.json({ error: `Unknown category: ${category}` }, { status: 400 })
      }
      patch.category = category || null
    }

    // Replacement footage: the pair travels together, and the key has to be
    // one of ours or deleting the scenario later would aim at a stranger's object.
    if (video_url !== undefined || video_key !== undefined) {
      if (!video_url || !video_key) {
        return NextResponse.json({ error: "Replacement footage needs both a URL and a key" }, { status: 400 })
      }
      if (!isScenarioVideoKey(video_key)) {
        return NextResponse.json({ error: "Not a scenario video key" }, { status: 400 })
      }
      patch.video_url = video_url
      patch.video_key = video_key
    }

    if (is_active !== undefined) {
      if (typeof is_active !== "boolean") {
        return NextResponse.json({ error: "is_active must be a boolean" }, { status: 400 })
      }
      patch.is_active = is_active
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from("scenarios")
      .update(patch)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, scenario: data })
  } catch (err) {
    console.error("Update scenario error:", err)
    return NextResponse.json({ error: "Failed to update scenario" }, { status: 500 })
  }
}
