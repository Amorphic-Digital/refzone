import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { checkSupabaseKey, supabaseProjectRef, warnIfBadKey } from "@/lib/config-check"

let client: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  if (client) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  // A corrupted anon key makes every query come back 401 "Invalid API key",
  // which otherwise reads as a network problem rather than a config one.
  warnIfBadKey(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    checkSupabaseKey(key, "anon", supabaseProjectRef(url)),
  )

  client = createSupabaseClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  })

  return client
}
