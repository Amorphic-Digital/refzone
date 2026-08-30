import { createServiceClient } from "@/lib/supabase/service"

/**
 * "Is this your pack?" — asked by every coach-side pack route.
 *
 * Returns null rather than throwing a distinguishable error, so a caller can
 * answer someone else's pack id with a plain 404. Confirming that a pack
 * exists but belongs to another coach is information nobody needs.
 */
export async function loadOwnedPack(packId: string, userId: string) {
  const { data } = await createServiceClient()
    .from("training_packs")
    .select("id, title, description, category, share_code, created_by, is_active, is_public, collect_name")
    .eq("id", packId)
    .maybeSingle()

  if (!data || !data.is_active || data.created_by !== userId) return null
  return data
}
