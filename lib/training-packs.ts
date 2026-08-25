import { createServiceClient } from "@/lib/supabase/service"

/**
 * Share codes for training packs.
 *
 * Packs are shared by code rather than uuid so the link is short enough to
 * read out or put on a whiteboard, and so pack ids are not enumerable.
 *
 * Alphabet excludes look-alike characters (0/O, 1/I/l) because these get typed
 * off a screen at training nights.
 */
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789"
const CODE_LENGTH = 8

function randomCode(): string {
  // crypto is available in both the Node and Edge runtimes.
  const bytes = crypto.getRandomValues(new Uint8Array(CODE_LENGTH))
  let code = ""
  for (const byte of bytes) {
    code += ALPHABET[byte % ALPHABET.length]
  }
  return code
}

/**
 * Generates a share code that is not already taken.
 *
 * With a 31-character alphabet over 8 characters a collision is vanishingly
 * unlikely, but the column is UNIQUE, so a blind insert would surface as an
 * opaque failure to the coach. A handful of retries removes that entirely.
 */
export async function generateShareCode(): Promise<string> {
  const supabase = createServiceClient()

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomCode()
    const { data } = await supabase
      .from("training_packs")
      .select("id")
      .eq("share_code", code)
      .maybeSingle()

    if (!data) return code
  }

  throw new Error("Could not allocate a share code")
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
