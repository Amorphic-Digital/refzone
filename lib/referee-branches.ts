import { createServiceClient } from "@/lib/supabase/service"
import { generateUniqueCode } from "@/lib/share-codes"

/**
 * Referee branches: the association you actually referee for.
 *
 * One branch per person — see scripts/043_referee_branches.sql for why that is
 * a database constraint and not a convention. The two roles inside a branch do
 * different things:
 *
 *   referee — ranked on the branch ladder.
 *   coach   — not ranked, and can read the branch's referees' answers. A
 *             leaderboard is between people doing the same job, and a coach
 *             sitting above the squad they are marking is neither fair nor
 *             informative.
 *
 * Ownership is one coach at a time and can be handed to another coach in the
 * branch. Nothing else about a branch depends on who owns it, so a transfer is
 * a single column write.
 */

const JOIN_CODE_LENGTH = 6

export type BranchRole = "referee" | "coach"

export interface RefereeBranch {
  id: string
  name: string
  description: string | null
  region: string | null
  owner_id: string
  join_code: string
  created_at: string
}

export interface BranchMembership {
  branch: RefereeBranch
  role: BranchRole
  joinedAt: string
  /** Whether this member is the coach who owns the branch. */
  isOwner: boolean
}

export interface BranchMember {
  userId: string
  role: BranchRole
  joinedAt: string
  isOwner: boolean
  name: string
  totalPoints: number
  currentStreak: number
  longestStreak: number
}

/**
 * The branch this user is in, or null.
 *
 * Fails closed the way lib/coach.ts does: a read that does not come back means
 * "not in a branch", which shows the join screen rather than someone else's
 * roster.
 */
export async function getBranchMembership(userId: string): Promise<BranchMembership | null> {
  const supabase = createServiceClient()

  const { data } = await supabase
    .from("referee_branch_members")
    .select(
      "role, joined_at, referee_branches(id, name, description, region, owner_id, join_code, is_active, created_at)",
    )
    .eq("user_id", userId)
    .maybeSingle()

  const branch = (data as any)?.referee_branches
  if (!data || !branch || !branch.is_active) return null

  return {
    branch: {
      id: branch.id,
      name: branch.name,
      description: branch.description,
      region: branch.region,
      owner_id: branch.owner_id,
      join_code: branch.join_code,
      created_at: branch.created_at,
    },
    role: data.role as BranchRole,
    joinedAt: data.joined_at as string,
    isOwner: branch.owner_id === userId,
  }
}

/** Everyone in a branch, coaches last, referees ordered by streak. */
export async function listBranchMembers(branchId: string): Promise<BranchMember[]> {
  const supabase = createServiceClient()

  const [membersResult, branchResult] = await Promise.all([
    supabase
      .from("referee_branch_members")
      .select("user_id, role, joined_at")
      .eq("branch_id", branchId),
    supabase.from("referee_branches").select("owner_id").eq("id", branchId).maybeSingle(),
  ])

  const rows = membersResult.data || []
  if (rows.length === 0) return []

  const ownerId = (branchResult.data as any)?.owner_id ?? null

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name, total_points, current_streak, longest_streak")
    .in(
      "id",
      rows.map((row) => row.user_id),
    )

  const byId = new Map((profiles || []).map((profile) => [profile.id, profile as any]))

  return rows
    .map((row) => {
      const profile = byId.get(row.user_id)
      return {
        userId: row.user_id as string,
        role: row.role as BranchRole,
        joinedAt: row.joined_at as string,
        isOwner: row.user_id === ownerId,
        name: profile?.display_name || "Referee",
        totalPoints: profile?.total_points ?? 0,
        currentStreak: profile?.current_streak ?? 0,
        longestStreak: profile?.longest_streak ?? 0,
      }
    })
    .sort((a, b) => {
      if (a.role !== b.role) return a.role === "referee" ? -1 : 1
      if (a.role === "referee") return b.currentStreak - a.currentStreak
      // Coaches read as a short list of names, so the owner goes first.
      if (a.isOwner !== b.isOwner) return a.isOwner ? -1 : 1
      return a.name.localeCompare(b.name)
    })
}

/** Just the ids of the branch's ranked members — what the ladder is built from. */
export async function listBranchRefereeIds(branchId: string): Promise<string[]> {
  const { data } = await createServiceClient()
    .from("referee_branch_members")
    .select("user_id")
    .eq("branch_id", branchId)
    .eq("role", "referee")

  return (data || []).map((row) => row.user_id as string)
}

/** The branch a join code points at, or null. Codes match case-insensitively. */
export async function findBranchByCode(code: string) {
  const { data } = await createServiceClient()
    .from("referee_branches")
    .select("id, name, region, owner_id, is_active")
    .eq("join_code", code.trim().toLowerCase())
    .maybeSingle()

  return data && data.is_active ? data : null
}

/**
 * Creates a branch and puts its coach in it as owner.
 *
 * The owner's membership row is written in the same call rather than left to
 * the coach to join afterwards: a branch with an owner who is not a member is
 * a state nothing else in here knows how to read.
 */
export async function createBranch(
  coachId: string,
  name: string,
  description: string | null,
  region: string | null,
): Promise<RefereeBranch> {
  const supabase = createServiceClient()
  const joinCode = await generateUniqueCode("referee_branches", "join_code", JOIN_CODE_LENGTH)

  const { data, error } = await supabase
    .from("referee_branches")
    .insert({
      name,
      description,
      region,
      owner_id: coachId,
      created_by: coachId,
      join_code: joinCode,
    })
    .select("id, name, description, region, owner_id, join_code, created_at")
    .single()

  if (error) throw new Error(error.message)

  const branch = data as RefereeBranch

  const { error: memberError } = await supabase
    .from("referee_branch_members")
    .insert({ branch_id: branch.id, user_id: coachId, role: "coach" })

  if (memberError) {
    // Roll the branch back rather than leave an ownerless one holding a join
    // code that would let referees into somewhere with nobody running it.
    await supabase.from("referee_branches").delete().eq("id", branch.id)
    throw new Error(memberError.message)
  }

  return branch
}

/** Adds someone to a branch. Throws if they are already in one. */
export async function joinBranch(userId: string, branchId: string, role: BranchRole) {
  const supabase = createServiceClient()

  const existing = await getBranchMembership(userId)
  if (existing) {
    throw new Error(
      existing.branch.id === branchId
        ? "You are already in this branch"
        : `You are already in ${existing.branch.name}. Leave it first.`,
    )
  }

  const { error } = await supabase
    .from("referee_branch_members")
    .insert({ branch_id: branchId, user_id: userId, role })

  if (error) throw new Error(error.message)
}

/**
 * Leaves a branch.
 *
 * The owner cannot walk out: a branch with no owner has nobody who can add a
 * coach, rename it or hand it on, and there is no admin screen for adopting an
 * orphan. Transfer first, then leave.
 */
export async function leaveBranch(userId: string) {
  const membership = await getBranchMembership(userId)
  if (!membership) throw new Error("You are not in a branch")

  if (membership.isOwner) {
    throw new Error(
      "You own this branch. Transfer it to another coach in the branch before you leave.",
    )
  }

  const { error } = await createServiceClient()
    .from("referee_branch_members")
    .delete()
    .eq("user_id", userId)

  if (error) throw new Error(error.message)
}

/**
 * Hands a branch to another coach in it.
 *
 * The new owner has to already be a member with the coach role. Handing a
 * branch to a referee would make someone responsible for a roster they cannot
 * read, and handing it to an outsider would make it disappear from the list of
 * the person who accepted it.
 */
export async function transferOwnership(
  branchId: string,
  currentOwnerId: string,
  newOwnerId: string,
) {
  const supabase = createServiceClient()

  const { data: branch } = await supabase
    .from("referee_branches")
    .select("id, owner_id, is_active")
    .eq("id", branchId)
    .maybeSingle()

  if (!branch || !branch.is_active) throw new Error("Branch not found")
  if (branch.owner_id !== currentOwnerId) throw new Error("Only the owner can transfer a branch")
  if (newOwnerId === currentOwnerId) throw new Error("That is already the owner")

  const { data: member } = await supabase
    .from("referee_branch_members")
    .select("role")
    .eq("branch_id", branchId)
    .eq("user_id", newOwnerId)
    .maybeSingle()

  if (!member) throw new Error("That person is not in this branch")
  if (member.role !== "coach") {
    throw new Error("A branch can only be owned by a coach in it")
  }

  const { error } = await supabase
    .from("referee_branches")
    .update({ owner_id: newOwnerId })
    .eq("id", branchId)

  if (error) throw new Error(error.message)
}

/**
 * "Can this coach read that referee's answers?"
 *
 * True only for a coach reading a referee in their own branch. Being a coach
 * is not on its own permission to read anyone: the referee joined a branch, and
 * that is the act that opened their results to the coaches in it.
 */
export async function canCoachSeeReferee(
  coachId: string,
  refereeId: string,
): Promise<boolean> {
  const [coach, referee] = await Promise.all([
    getBranchMembership(coachId),
    getBranchMembership(refereeId),
  ])

  if (!coach || !referee) return false
  if (coach.role !== "coach") return false
  return coach.branch.id === referee.branch.id
}
