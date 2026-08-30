import { createServiceClient } from "@/lib/supabase/service"
import { generateUniqueCode } from "@/lib/share-codes"

/**
 * Share codes for training packs.
 *
 * Packs are shared by code rather than uuid so the link is short enough to
 * read out or put on a whiteboard, and so pack ids are not enumerable.
 *
 * The alphabet and the retry-on-collision live in lib/share-codes.ts now,
 * shared with group join codes and live session codes — all three get typed
 * off a screen at a training night and want the same look-alike-free letters.
 */
const CODE_LENGTH = 8

export async function generateShareCode(): Promise<string> {
  return generateUniqueCode("training_packs", "share_code", CODE_LENGTH)
}

export interface PackSummary {
  id: string
  title: string
  description: string | null
  category: string | null
  share_code: string
  created_by: string
  created_at: string
  itemCount: number
}

/** Packs a coach has built, newest first. */
export async function listPacksForCoach(userId: string): Promise<PackSummary[]> {
  const supabase = createServiceClient()

  const { data } = await supabase
    .from("training_packs")
    .select("id, title, description, category, share_code, created_by, created_at, training_pack_items(id)")
    .eq("created_by", userId)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  return (data || []).map((pack) => ({
    id: pack.id,
    title: pack.title,
    description: pack.description,
    category: pack.category,
    share_code: pack.share_code,
    created_by: pack.created_by,
    created_at: pack.created_at,
    itemCount: ((pack as any).training_pack_items || []).length,
  }))
}
