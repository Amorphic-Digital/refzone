import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { getBranchMembership, transferOwnership } from "@/lib/referee-branches"

/**
 * Hands the branch to another coach in it.
 *
 * Deliberately one-sided — the new owner does not have to accept. Ownership is
 * a duty rather than a prize, both parties are coaches in the same branch, and
 * an invitation that can sit unanswered is exactly what a coach leaving the
 * association cannot wait for.
 */
export async function POST(request: Request) {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const membership = await getBranchMembership(userId)
  if (!membership) {
    return NextResponse.json({ error: "You are not in a branch" }, { status: 400 })
  }

  const body = await request.json().catch(() => ({}))
  const newOwnerId = typeof body.userId === "string" ? body.userId : ""
  if (!newOwnerId) {
    return NextResponse.json({ error: "Pick who is taking it on" }, { status: 400 })
  }

  try {
    await transferOwnership(membership.branch.id, userId, newOwnerId)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not transfer the branch" },
      { status: 400 },
    )
  }
}
