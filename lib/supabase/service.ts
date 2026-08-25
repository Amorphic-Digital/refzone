import { createClient } from "@supabase/supabase-js"
import { checkSupabaseKey, supabaseProjectRef, warnIfBadKey } from "@/lib/config-check"

// Service role client for admin operations that don't require user context
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables for service client")
  }

  // Every server-rendered page goes through this client, so a mistyped key
  // turns the whole signed-in app into "Something went wrong" with only a
  // digest in the log. Name the culprit.
  warnIfBadKey(
    "SUPABASE_SERVICE_ROLE_KEY",
    checkSupabaseKey(supabaseServiceKey, "service_role", supabaseProjectRef(supabaseUrl)),
  )

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
