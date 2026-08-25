import { auth, currentUser } from "@clerk/nextjs/server"
import { createServiceClient } from "@/lib/supabase/service"

/**
 * Get the authenticated Clerk user ID with a timeout.
 * If Clerk is unresponsive, throws instead of hanging forever.
 */
async function authWithTimeout(timeoutMs = 5000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const result = await Promise.race([
      auth(),
      new Promise<never>((_, reject) => {
        controller.signal.addEventListener('abort', () =>
          reject(new Error('Clerk auth timed out'))
        )
      }),
    ])
    return result
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Get the authenticated Clerk user ID. Throws if not authenticated.
 */
export async function requireAuth(): Promise<string> {
  try {
    const { userId } = await authWithTimeout()
    if (!userId) {
      throw new Error("Unauthorized")
    }
    return userId
  } catch {
    throw new Error("Unauthorized")
  }
}

/**
 * Get the authenticated Clerk user ID, or null if not signed in.
 */
export async function getAuthUserId(): Promise<string | null> {
  try {
    const { userId } = await authWithTimeout()
    return userId
  } catch {
    return null
  }
}

/**
 * Sync display name from Clerk in the background (fire-and-forget).
 * Only runs for users who haven't manually set their username.
 */
async function syncDisplayName(userId: string, currentDisplayName: string) {
  try {
    const user = await currentUser()
    const preferredName = user?.firstName
    if (preferredName && currentDisplayName !== preferredName) {
      const supabase = createServiceClient()
      await supabase
        .from("profiles")
        .update({ display_name: preferredName })
        .eq("id", userId)
    }
  } catch {
    // Silently ignore — name will sync on next load
  }
}

/**
 * Ensure a profile exists in Supabase for the given Clerk user.
 * Creates one if it doesn't exist. Returns the profile.
 */
export async function ensureProfile(userId: string) {
  const supabase = createServiceClient()

  const { data: profile, error: lookupError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  // PGRST116 = "no rows returned", which is expected for a first-time user.
  // Anything else (Supabase unreachable, RLS, outage) has to surface here rather
  // than falling through to an INSERT that is guaranteed to fail the same way.
  if (lookupError && lookupError.code !== "PGRST116") {
    throw new Error(`Could not reach the RefZone database: ${lookupError.message}`)
  }

  if (profile) {
    // Sync display name from Clerk in the background — don't block rendering
    if (!profile.has_set_username) {
      syncDisplayName(userId, profile.display_name).catch(() => {})
    }
    return profile
  }

  // Get user details from Clerk to populate the profile
  const user = await currentUser()
  const displayName = user?.firstName || user?.username || `User_${userId.slice(-6)}`

  const { data: newProfile, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      display_name: displayName,
      total_points: 0,
      current_streak: 0,
      experience_level: "beginner",
    })
    .select()
    .single()

  if (error) throw new Error(`Could not create your RefZone profile: ${error.message}`)
  return newProfile
}

const ADMIN_EMAILS = ["henrytowen@googlemail.com", "refzone.office@gmail.com"]

/**
 * Check if the current user is an admin. Returns userId if admin, throws otherwise.
 */
export async function requireAdmin(): Promise<string> {
  const userId = await requireAuth()

  const user = await currentUser()
  const email = user?.emailAddresses?.[0]?.emailAddress

  if (!email || !ADMIN_EMAILS.includes(email)) {
    throw new Error("Not authorized")
  }

  return userId
}
