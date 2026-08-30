import { createServiceClient } from "@/lib/supabase/service"

/**
 * Short codes for anything a coach reads out loud.
 *
 * Pack share links, group join codes and live session codes all get typed off
 * a screen at a training night, so the alphabet drops every look-alike pair
 * (0/O, 1/I/l) and the code stays short enough to put on a whiteboard.
 *
 * Was private to lib/training-packs.ts until groups and live sessions needed
 * the same thing.
 */
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789"

function randomCode(length: number): string {
  // crypto is available in both the Node and Edge runtimes.
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  let code = ""
  for (const byte of bytes) {
    code += ALPHABET[byte % ALPHABET.length]
  }
  return code
}

/**
 * Generates a code that is not already taken in `table`.`column`.
 *
 * A collision over this alphabet is vanishingly unlikely, but every one of
 * these columns is UNIQUE, so a blind insert would surface as an opaque
 * failure to the coach. A handful of retries removes that entirely.
 */
export async function generateUniqueCode(
  table: string,
  column: string,
  length: number,
): Promise<string> {
  const supabase = createServiceClient()

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomCode(length)
    const { data } = await supabase.from(table).select("id").eq(column, code).maybeSingle()
    if (!data) return code
  }

  throw new Error(`Could not allocate a code for ${table}.${column}`)
}

/** An opaque token, not a code: never shown to anyone, so no alphabet games. */
export function randomToken(): string {
  return crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "")
}
