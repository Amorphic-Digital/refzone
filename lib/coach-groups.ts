import { createServiceClient } from "@/lib/supabase/service"
import { generateUniqueCode } from "@/lib/share-codes"

/**
 * Coach groups: a named roster of referees.
 *
 * Before this, a coach's only tie to their referees was "whoever happened to
 * open my link". A group is what lets progress be read per person across
 * everything they have been sent, and what an assignment is assigned to.
 *
 * Referees join with a code. A coach never adds someone without them acting —
 * being enrolled in a group means your answers are visible to that coach, and
 * that should never happen behind your back.
 */

const JOIN_CODE_LENGTH = 6

export interface CoachGroup {
  id: string
  coach_id: string
  name: string
  description: string | null
  join_code: string
  created_at: string
  memberCount: number
}

/** Groups this coach runs, newest first. */
export async function listGroupsForCoach(coachId: string): Promise<CoachGroup[]> {
  const supabase = createServiceClient()

  const { data } = await supabase
    .from("coach_groups")
    .select("id, coach_id, name, description, join_code, created_at, coach_group_members(id)")
    .eq("coach_id", coachId)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  return (data || []).map((group) => ({
    id: group.id,
    coach_id: group.coach_id,
    name: group.name,
    description: group.description,
    join_code: group.join_code,
    created_at: group.created_at,
    memberCount: ((group as any).coach_group_members || []).length,
  }))
}

/** Groups this referee belongs to, with the coach's name. */
export async function listGroupsForMember(userId: string): Promise<
  { id: string; name: string; coachName: string; joinedAt: string }[]
> {
  const supabase = createServiceClient()

  const { data: memberships } = await supabase
    .from("coach_group_members")
    .select("joined_at, coach_groups(id, name, coach_id, is_active)")
    .eq("user_id", userId)

  const rows = (memberships || []).filter((m) => (m as any).coach_groups?.is_active)
  if (rows.length === 0) return []

  const coachIds = [...new Set(rows.map((m) => (m as any).coach_groups.coach_id as string))]
  const { data: coaches } = await supabase
    .from("profiles")
    .select("id, display_name")
    .in("id", coachIds)

  const nameById = new Map((coaches || []).map((c) => [c.id, c.display_name as string]))

  return rows.map((m) => ({
    id: (m as any).coach_groups.id,
    name: (m as any).coach_groups.name,
    coachName: nameById.get((m as any).coach_groups.coach_id) || "Your coach",
    joinedAt: m.joined_at,
  }))
}

/** Creates a group and allocates its join code. */
export async function createGroup(
  coachId: string,
  name: string,
  description: string | null,
): Promise<{ id: string; join_code: string }> {
  const supabase = createServiceClient()
  const joinCode = await generateUniqueCode("coach_groups", "join_code", JOIN_CODE_LENGTH)

  const { data, error } = await supabase
    .from("coach_groups")
    .insert({ coach_id: coachId, name, description, join_code: joinCode })
    .select("id, join_code")
    .single()

  if (error) throw new Error(error.message)
  return data as { id: string; join_code: string }
}

/** The group a join code points at, or null. Codes are matched case-insensitively. */
export async function findGroupByCode(code: string) {
  const supabase = createServiceClient()

  const { data } = await supabase
    .from("coach_groups")
    .select("id, name, coach_id, is_active")
    .eq("join_code", code.trim().toLowerCase())
    .maybeSingle()

  return data && data.is_active ? data : null
}

/** Members of a group, with names and when they joined. */
export async function listGroupMembers(groupId: string) {
  const supabase = createServiceClient()

  const { data: members } = await supabase
    .from("coach_group_members")
    .select("user_id, joined_at")
    .eq("group_id", groupId)
    .order("joined_at")

  const rows = members || []
  if (rows.length === 0) return []

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name, total_points")
    .in(
      "id",
      rows.map((m) => m.user_id),
    )

  const byId = new Map((profiles || []).map((p) => [p.id, p]))

  return rows.map((m) => ({
    userId: m.user_id,
    joinedAt: m.joined_at,
    name: (byId.get(m.user_id) as any)?.display_name || "Referee",
    totalPoints: (byId.get(m.user_id) as any)?.total_points ?? 0,
  }))
}
