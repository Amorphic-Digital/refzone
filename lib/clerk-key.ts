/**
 * Clerk publishable key resolution.
 *
 * A Clerk publishable key is public by design — it is inlined into the client
 * bundle — and it encodes the instance's Frontend API host as base64:
 *
 *   pk_live_<base64("clerk.refzone.com.au$")>
 *
 * That means a single mistyped character in the hosting panel's env var decodes
 * to a host that does not exist, and every clerk.browser.js / ui.browser.js
 * request dies on ERR_NAME_NOT_RESOLVED — sign-in, sign-up and the whole
 * session are gone with no server-side error to point at. That is exactly what
 * happened in production: the deployed key decoded to `clerefzone.com.au`
 * (the `rk.` block dropped out of the base64) instead of `clerk.refzone.com.au`.
 *
 * So: validate the env value before trusting it, and fall back to the known
 * production key if it is malformed. Nothing secret is being hard-coded here —
 * the secret half of the pair is CLERK_SECRET_KEY, which stays in the env.
 */

/** Production instance key — base64 of "clerk.refzone.com.au$". */
const PRODUCTION_PUBLISHABLE_KEY = "pk_live_Y2xlcmsucmVmem9uZS5jb20uYXUk"

function decodeFrontendApiHost(key: string): string | null {
  const encoded = key.replace(/^pk_(test|live)_/, "")
  if (encoded === key) return null // not a publishable key at all

  try {
    // atob exists in the browser, in the edge runtime and in Node >= 16.
    const decoded = atob(encoded)
    // Clerk terminates the host with "$"; anything else means a truncated key.
    if (!decoded.endsWith("$")) return null
    return decoded.slice(0, -1)
  } catch {
    return null
  }
}

/**
 * A usable host is either a Clerk development instance
 * (`vast-bluejay-27.clerk.accounts.dev`) or a production instance served off a
 * `clerk.*` CNAME (`clerk.refzone.com.au`) — which is how this project's DNS is
 * set up. A host that carries no `clerk` label is a corrupted key.
 */
function isPlausibleFrontendApiHost(host: string): boolean {
  const labels = host.split(".")
  return labels.length >= 2 && labels.some((label) => label.startsWith("clerk"))
}

function resolvePublishableKey(): string {
  const fromEnv = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim()
  if (!fromEnv) return PRODUCTION_PUBLISHABLE_KEY

  const host = decodeFrontendApiHost(fromEnv)
  if (host && isPlausibleFrontendApiHost(host)) return fromEnv

  console.error(
    `[clerk] NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY decodes to an unusable Frontend API host (${
      host ?? "unparseable"
    }). Falling back to the production key — fix the env var in the hosting panel.`,
  )
  return PRODUCTION_PUBLISHABLE_KEY
}

export const CLERK_PUBLISHABLE_KEY = resolvePublishableKey()
