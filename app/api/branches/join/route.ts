import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { isCoach } from "@/lib/coach"
import { findBranchByCode, joinBranch } from "@/lib/referee-branches"

/**
 * Joins a branch with its code.
 *
 * The role is not the joiner's to pick: a coach account joins as a coach, an
 * ordinary account as a referee. Letting someone choose would let a coach put
 * themselves on the ladder they are meant to be marking, or a referee opt out
 * of it — and the ladder is the point of the branch.
 */
export async function POST(request: Request) {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const code = typeof body.code === "string" ? body.code.trim() : ""
  if (!code) {
    return NextResponse.json({ error: "Enter your branch code" }, { status: 400 })
  }

  const branch = await findBranchByCode(code)
  if (!branch) {
    return NextResponse.json({ error: "No branch has that code" }, { status: 404 })
  }

  try {
    await joinBranch(userId, branch.id, (await isCoach(userId)) ? "coach" : "referee")
    return NextResponse.json({ success: true, branch: { id: branch.id, name: branch.name } })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not join that branch" },
      { status: 400 },
    )
  }
}
