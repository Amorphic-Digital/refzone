/**
 * Runtime validation for the API keys this app reads out of the environment.
 *
 * Production has twice been deployed with a key that was transcribed by eye
 * rather than pasted — the Clerk publishable key lost a base64 block, and the
 * Supabase keys picked up l/I and u/b substitutions. Neither failure says
 * anything useful at the point it breaks: Supabase answers every request with a
 * flat 401 "Invalid API key", so a mistyped character surfaces as a wall of
 * failed fetches and a "Something went wrong" page with no clue which env var
 * is at fault.
 *
 * These helpers decode the key and check it actually describes the project and
 * role it is supposed to, so the log line names the broken variable.
 */

export type KeyCheck =
  | { ok: true }
  | { ok: false; problem: string }

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".")
  if (parts.length !== 3) return null
  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    return JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")))
  } catch {
    return null
  }
}

/** The project ref is the first label of the Supabase URL. */
export function supabaseProjectRef(url: string | undefined): string | null {
  const match = url?.match(/^https:\/\/([a-z0-9]+)\.supabase\./)
  return match ? match[1] : null
}

/**
 * Supabase keys are JWTs signed for one project and one role. A key that
 * decodes cleanly but names the wrong project — or does not decode at all — is
 * corrupted, and Supabase will reject every request made with it.
 */
export function checkSupabaseKey(
  key: string | undefined,
  expectedRole: "anon" | "service_role",
  projectRef: string | null,
): KeyCheck {
  if (!key) return { ok: false, problem: "not set" }

  const payload = decodeJwtPayload(key.trim())
  if (!payload) return { ok: false, problem: "not a readable JWT — the value is truncated or mistyped" }
  if (payload.iss !== "supabase") return { ok: false, problem: `issuer is ${String(payload.iss)}, expected "supabase"` }
  if (projectRef && payload.ref !== projectRef) {
    return { ok: false, problem: `signed for project "${String(payload.ref)}", expected "${projectRef}"` }
  }
  if (payload.role !== expectedRole) {
    return { ok: false, problem: `role is "${String(payload.role)}", expected "${expectedRole}"` }
  }
  if (typeof payload.exp === "number" && payload.exp * 1000 < Date.now()) {
    return { ok: false, problem: "expired" }
  }
  return { ok: true }
}

/**
 * Clerk publishable keys are base64 of the instance's Frontend API host. A
 * mangled one points the browser at a host that does not resolve — see
 * lib/clerk-key.ts, which repairs that case rather than only reporting it.
 */
export function checkClerkPublishableKey(key: string | undefined): KeyCheck {
  if (!key) return { ok: false, problem: "not set" }

  const encoded = key.trim().replace(/^pk_(test|live)_/, "")
  if (encoded === key.trim()) return { ok: false, problem: "missing the pk_test_/pk_live_ prefix" }

  let host: string
  try {
    host = atob(encoded)
  } catch {
    return { ok: false, problem: "does not decode — the value is truncated or mistyped" }
  }
  if (!host.endsWith("$")) return { ok: false, problem: "truncated (decoded host has no terminator)" }

  const labels = host.slice(0, -1).split(".")
  if (labels.length < 2 || !labels.some((label) => label.startsWith("clerk"))) {
    return { ok: false, problem: `decodes to "${host.slice(0, -1)}", which is not a Clerk Frontend API host` }
  }
  return { ok: true }
}

/** Logs once per problem, naming the variable so the fix is obvious. */
export function warnIfBadKey(envVarName: string, check: KeyCheck): void {
  if (check.ok || warned.has(envVarName)) return
  warned.add(envVarName)
  console.error(
    `[config] ${envVarName} is ${check.problem}. Requests using it will fail — re-copy the value into the hosting panel (paste it, do not retype it).`,
  )
}

const warned = new Set<string>()
