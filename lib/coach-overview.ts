import { createServiceClient } from "@/lib/supabase/service"
import { listGroupsForCoach, type CoachGroup } from "@/lib/coach-groups"
import { listPacksForCoach, type PackSummary } from "@/lib/training-packs"

/**
 * What a coach needs to see when they open the app.
 *
 * The number that earns its place here is `unreviewed`: answers people have
 * written that the coach has not read yet. Everything else on a coach's home
 * is navigation, but that one is work waiting — and without it, reading
 * answers is a thing you have to remember to go and do.
 */

export interface CoachOverview {
  groups: CoachGroup[]
  packs: PackSummary[]
  memberCount: number
  /** Answers across all their packs with no coach verdict on them yet. */
  unreviewed: number
  /** Clips they have sent in that an admin has not decided on. */
  pendingSubmissions: number
  /** Join code of a session they left running, if any. */
  liveSession: { packId: string; joinCode: string } | null
}

export async function getCoachOverview(userId: string): Promise<CoachOverview> {
  const supabase = createServiceClient()

  const [groups, packs] = await Promise.all([
    listGroupsForCoach(userId),
    listPacksForCoach(userId),
  ])

  const packIds = packs.map((pack) => pack.id)

  const [memberAnswers, guestAttempts, submissions, session] = await Promise.all([
    packIds.length
      ? supabase
          .from("training_pack_progress")
          .select("id", { count: "exact", head: true })
          .in("pack_id", packIds)
          .is("coach_reviewed_at", null)
      : Promise.resolve({ count: 0 }),
    packIds.length
      ? supabase.from("pack_guest_attempts").select("id").in("pack_id", packIds)
      : Promise.resolve({ data: [] }),
    supabase
      .from("scenario_submissions")
      .select("id", { count: "exact", head: true })
      .eq("submitted_by", userId)
      .eq("status", "pending"),
    packIds.length
      ? supabase
          .from("pack_live_sessions")
          .select("pack_id, join_code")
          .eq("coach_id", userId)
          .eq("is_open", true)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ])

  const attemptIds = ((guestAttempts as any).data || []).map((row: { id: string }) => row.id)
  const guestUnreviewed = attemptIds.length
    ? ((
        await supabase
          .from("pack_guest_answers")
          .select("id", { count: "exact", head: true })
          .in("attempt_id", attemptIds)
          .is("coach_reviewed_at", null)
      ).count ?? 0)
    : 0

  return {
    groups,
    packs,
    memberCount: groups.reduce((total, group) => total + group.memberCount, 0),
    unreviewed: ((memberAnswers as any).count ?? 0) + guestUnreviewed,
    pendingSubmissions: (submissions as any).count ?? 0,
    liveSession: (session as any).data
      ? { packId: (session as any).data.pack_id, joinCode: (session as any).data.join_code }
      : null,
  }
}
