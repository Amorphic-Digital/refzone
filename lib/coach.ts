import { createServiceClient } from "@/lib/supabase/service"

/**
 * Referee Coach accounts.
 *
 * A referee is dealt scenarios at random from a topic they picked. A coach
 * prepares the training instead, so they get what a referee deliberately does
 * not: the whole library, direct access to a single scenario, groups, packs
 * and the results those produce.
 *
 * The flag lives on profiles.is_coach and is granted by an admin from a written
 * application — see scripts/039_referee_coach_accounts.sql. The grant can also
 * carry an expiry (040), because coach accounts are free now and may not always
 * be.
 */

export type CoachApplicationStatus = "pending" | "approved" | "rejected"

export interface CoachApplication {
  id: string
  user_id: string
  display_name: string | null
  email: string | null
  association: string | null
  level: string | null
  reason: string
  status: CoachApplicationStatus
  review_note: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
}

export interface CoachGrant {
  isCoach: boolean
  /** null when the grant is open-ended, which is the default while it is free. */
  expiresAt: string | null
  since: string | null
  /** True when the flag is still set but the grant has run out. */
  expired: boolean
}

/**
 * The full grant, expiry included.
 *
 * Fails closed: if the profile cannot be read, the answer is no, so a database
 * hiccup shows a referee the referee experience rather than opening the
 * library to everyone.
 */
export async function getCoachGrant(userId: string): Promise<CoachGrant> {
  const supabase = createServiceClient()

  const { data } = await supabase
    .from("profiles")
    .select("is_coach, is_admin, coach_since, coach_expires_at")
    .eq("id", userId)
    .single()

  if (!data) return { isCoach: false, expiresAt: null, since: null, expired: false }

  // Admins are coaches by definition — they built the library — and their
  // access never lapses.
  if (data.is_admin) {
    return { isCoach: true, expiresAt: null, since: data.coach_since ?? null, expired: false }
  }

  const expiresAt = (data.coach_expires_at as string | null) ?? null
  const expired = !!expiresAt && new Date(expiresAt).getTime() <= Date.now()

  return {
    isCoach: !!data.is_coach && !expired,
    expiresAt,
    since: (data.coach_since as string | null) ?? null,
    expired: !!data.is_coach && expired,
  }
}

/** Is this user a coach right now? */
export async function isCoach(userId: string): Promise<boolean> {
  return (await getCoachGrant(userId)).isCoach
}

/** Throws unless the caller is a coach. For API routes. */
export async function requireCoach(userId: string): Promise<void> {
  if (!(await isCoach(userId))) {
    throw new Error("Not a coach")
  }
}

/** The user's application, or null if they have never applied. */
export async function getCoachApplication(userId: string): Promise<CoachApplication | null> {
  const supabase = createServiceClient()

  const { data } = await supabase
    .from("coach_applications")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle()

  return (data as CoachApplication | null) ?? null
}

/** Grant, application and both dates in one place — what /coach renders from. */
export async function getCoachState(userId: string): Promise<{
  isCoach: boolean
  grant: CoachGrant
  application: CoachApplication | null
}> {
  const [grant, application] = await Promise.all([
    getCoachGrant(userId),
    getCoachApplication(userId),
  ])
  return { isCoach: grant.isCoach, grant, application }
}
