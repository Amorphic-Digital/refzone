import { NextResponse } from "next/server"
import {
  checkClerkPublishableKey,
  checkSupabaseKey,
  supabaseProjectRef,
  type KeyCheck,
} from "@/lib/config-check"

export const dynamic = "force-dynamic"

/**
 * Public config health check — reports whether each deployed key is *shaped*
 * correctly, never what it is.
 *
 * Deliberately outside Clerk middleware (see the bypass list in proxy.ts): when
 * the Clerk key is the thing that is broken, an endpoint behind Clerk cannot
 * tell you so. Nothing here is exploitable — it returns the name of a
 * misconfigured environment variable and why it looks wrong, which is what
 * turns a page full of 401s into a one-line fix in the hosting panel.
 */
export async function GET() {
  const projectRef = supabaseProjectRef(process.env.NEXT_PUBLIC_SUPABASE_URL)

  const checks: Record<string, KeyCheck> = {
    NEXT_PUBLIC_SUPABASE_URL: projectRef
      ? { ok: true }
      : { ok: false, problem: "not set, or not a https://<ref>.supabase.co URL" },
    NEXT_PUBLIC_SUPABASE_ANON_KEY: checkSupabaseKey(
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      "anon",
      projectRef,
    ),
    SUPABASE_SERVICE_ROLE_KEY: checkSupabaseKey(
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      "service_role",
      projectRef,
    ),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: checkClerkPublishableKey(
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    ),
    CLERK_SECRET_KEY: /^sk_(test|live)_.{20,}$/.test(process.env.CLERK_SECRET_KEY ?? "")
      ? { ok: true }
      : { ok: false, problem: "not set, or not a sk_test_/sk_live_ key" },
  }

  const broken = Object.entries(checks)
    .filter(([, check]) => !check.ok)
    .map(([name, check]) => ({ name, problem: (check as { problem: string }).problem }))

  return NextResponse.json(
    { ok: broken.length === 0, broken },
    { status: broken.length === 0 ? 200 : 503, headers: { "cache-control": "no-store" } },
  )
}
