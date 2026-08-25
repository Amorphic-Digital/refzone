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
 * misconfigured environment variable, its length, and why it looks wrong, which
 * is what turns a page full of 401s into a one-line fix in the hosting panel.
 *
 * NEXT_PUBLIC_* values are reported twice, because they have two lives:
 *
 *  - `build`   — the literal Next.js inlined into the bundles at build time.
 *                This is what the browser actually uses.
 *  - `runtime` — what the running process was handed by the hosting panel,
 *                read through a dynamic lookup so Next cannot inline it.
 *
 * When those two disagree the panel has been fixed but nothing has rebuilt
 * since, and the deploy needs re-running — a distinction that is invisible from
 * the outside and accounts for "the env vars are correct" and a broken site
 * being true at the same time.
 */

/** Dynamic lookup: only statically written process.env.X references get inlined. */
function runtimeValue(name: string): string | undefined {
  return process.env[name]
}

function describe(check: KeyCheck, value: string | undefined) {
  return {
    ok: check.ok,
    length: value?.trim().length ?? 0,
    ...(check.ok ? {} : { problem: (check as { problem: string }).problem }),
  }
}

export async function GET() {
  const buildUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const buildAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const buildClerk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  const runtimeUrl = runtimeValue("NEXT_PUBLIC_SUPABASE_URL")
  const runtimeAnon = runtimeValue("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  const runtimeClerk = runtimeValue("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY")
  const serviceKey = runtimeValue("SUPABASE_SERVICE_ROLE_KEY")
  const clerkSecret = runtimeValue("CLERK_SECRET_KEY")

  const buildRef = supabaseProjectRef(buildUrl)
  const runtimeRef = supabaseProjectRef(runtimeUrl)

  const secretCheck: KeyCheck = /^sk_(test|live)_.{20,}$/.test(clerkSecret ?? "")
    ? { ok: true }
    : { ok: false, problem: "not set, or not a sk_test_/sk_live_ key" }

  const vars = {
    NEXT_PUBLIC_SUPABASE_ANON_KEY: {
      build: describe(checkSupabaseKey(buildAnon, "anon", buildRef), buildAnon),
      runtime: describe(checkSupabaseKey(runtimeAnon, "anon", runtimeRef), runtimeAnon),
    },
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: {
      build: describe(checkClerkPublishableKey(buildClerk), buildClerk),
      runtime: describe(checkClerkPublishableKey(runtimeClerk), runtimeClerk),
    },
    SUPABASE_SERVICE_ROLE_KEY: {
      runtime: describe(
        checkSupabaseKey(serviceKey, "service_role", runtimeRef ?? buildRef),
        serviceKey,
      ),
    },
    CLERK_SECRET_KEY: { runtime: describe(secretCheck, clerkSecret) },
    NEXT_PUBLIC_SUPABASE_URL: {
      build: { ok: Boolean(buildRef), projectRef: buildRef },
      runtime: { ok: Boolean(runtimeRef), projectRef: runtimeRef },
    },
  }

  const broken: string[] = []
  const staleBuild: string[] = []

  for (const [name, states] of Object.entries(vars)) {
    const build = "build" in states ? states.build : undefined
    const runtime = states.runtime

    if (!runtime.ok) broken.push(name)
    else if (build && !build.ok) staleBuild.push(name)
  }

  return NextResponse.json(
    {
      ok: broken.length === 0 && staleBuild.length === 0,
      broken,
      staleBuild,
      hint:
        staleBuild.length > 0 && broken.length === 0
          ? "The hosting panel holds good values but the deployed bundle was built with old ones. Re-run the deploy/build."
          : broken.length > 0
            ? "The running process was given malformed values. Re-paste them in the hosting panel (paste, do not retype), then redeploy."
            : undefined,
      vars,
    },
    { status: broken.length || staleBuild.length ? 503 : 200, headers: { "cache-control": "no-store" } },
  )
}
