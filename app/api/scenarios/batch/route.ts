import { requireAuth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/service"

/** Never hand back more than a screenful's worth of lookahead in one call. */
const MAX_IDS = 12

/**
 * Rows for scenarios the feed already knows the ids of.
 *
 * The feed is handed the whole shuffled running order up front — ids only,
 * which is cheap — and pulls the rows in a few at a time as the referee
 * scrolls. Doing it by id rather than by offset is what keeps the order stable
 * across calls: re-running the shuffle on every page would repeat clips and
 * skip others.
 */
export async function POST(request: Request) {
  try {
    await requireAuth()

    const { ids } = (await request.json()) as { ids?: unknown }
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ scenarios: [] })
    }

    const wanted = ids.filter((id): id is string => typeof id === "string").slice(0, MAX_IDS)
    if (wanted.length === 0) {
      return NextResponse.json({ scenarios: [] })
    }

    const { data, error } = await createServiceClient()
      .from("scenarios")
      .select("*")
      .in("id", wanted)
      .eq("is_active", true)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Postgres returns them in whatever order it likes; the feed's running
    // order is the one that matters, so restore it here.
    const byId = new Map((data || []).map((row) => [row.id as string, row]))
    const scenarios = wanted.map((id) => byId.get(id)).filter(Boolean)

    return NextResponse.json({ scenarios })
  } catch {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }
}
