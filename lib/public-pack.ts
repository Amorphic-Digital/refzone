import { createServiceClient } from "@/lib/supabase/service"

/**
 * Shared plumbing for the no-account pack routes.
 *
 * Everything under /api/public is reachable by anyone with a link, so each
 * helper here exists to keep one specific thing off the wire or out of reach:
 * the answer key, packs the coach never made public, and attempts that belong
 * to somebody else's browser.
 */

/** What a guest is allowed to see about a scenario: everything but the answer. */
export interface PublicScenario {
  id: string
  title: string
  video_url: string | null
  video_credit: string | null
  difficulty: string
  scenario_type: string
  law_category: string | null
}

const PUBLIC_SCENARIO_FIELDS =
  "id, title, video_url, video_credit, difficulty, scenario_type, law_category"

/**
 * Resolves a share code to a pack that is actually open to guests.
 *
 * A pack is private until the coach turns is_public on, so an ordinary share
 * code must not work here — otherwise making a pack shareable to your squad
 * would quietly make it answerable by the whole internet.
 */
export async function findPublicPack(code: string) {
  const supabase = createServiceClient()

  const { data } = await supabase
    .from("training_packs")
    .select("id, title, description, share_code, is_public, collect_name, is_active")
    .eq("share_code", code.trim().toLowerCase())
    .maybeSingle()

  if (!data || !data.is_active || !data.is_public) return null
  return data
}

/** The pack's scenarios in the coach's order, answers withheld. */
export async function listPublicScenarios(packId: string): Promise<PublicScenario[]> {
  const supabase = createServiceClient()

  const { data } = await supabase
    .from("training_pack_items")
    .select(`order_index, scenarios(${PUBLIC_SCENARIO_FIELDS})`)
    .eq("pack_id", packId)
    .order("order_index")

  return (data || [])
    .map((item) => (item as any).scenarios as PublicScenario | null)
    .filter((scenario): scenario is PublicScenario => !!scenario)
}

/**
 * The attempt a session token belongs to, scoped to one pack.
 *
 * The token is the guest's only credential. It is generated server-side and
 * never appears in a URL, so holding it is the whole proof that this browser
 * started this attempt — which is why every write checks it against the pack
 * rather than trusting an attempt id from the request.
 */
export async function findGuestAttempt(packId: string, token: string) {
  if (!token || typeof token !== "string") return null

  const supabase = createServiceClient()

  const { data } = await supabase
    .from("pack_guest_attempts")
    .select("id, pack_id, display_name, session_id, completed_at")
    .eq("pack_id", packId)
    .eq("session_token", token)
    .maybeSingle()

  return data ?? null
}

/** Is this scenario actually in this pack? Guards the answers table. */
export async function scenarioIsInPack(packId: string, scenarioId: string): Promise<boolean> {
  const supabase = createServiceClient()

  const { data } = await supabase
    .from("training_pack_items")
    .select("id")
    .eq("pack_id", packId)
    .eq("scenario_id", scenarioId)
    .maybeSingle()

  return !!data
}
