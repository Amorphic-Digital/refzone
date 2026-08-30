import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { isCoach } from "@/lib/coach"
import { createBranch, getBranchMembership } from "@/lib/referee-branches"

/**
 * Sets up a branch. Coaches only.
 *
 * A referee joining a branch that does not exist yet is the coach's job to
 * fix, not the referee's — someone has to be answerable for the roster, and
 * that is what the owner is.
 */
export async function POST(request: Request) {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!(await isCoach(userId))) {
    return NextResponse.json(
      { error: "Only Referee Coach accounts can set up a branch" },
      { status: 403 },
    )
  }

  if (await getBranchMembership(userId)) {
    return NextResponse.json(
      { error: "You are already in a branch. Leave it before setting up another." },
      { status: 400 },
    )
  }

  const body = await request.json().catch(() => ({}))
  const name = typeof body.name === "string" ? body.name.trim() : ""
  if (!name) {
    return NextResponse.json({ error: "Give the branch a name" }, { status: 400 })
  }

  const description =
    typeof body.description === "string" && body.description.trim()
      ? body.description.trim().slice(0, 500)
      : null
  const region =
    typeof body.region === "string" && body.region.trim()
      ? body.region.trim().slice(0, 100)
      : null

  try {
    const branch = await createBranch(userId, name.slice(0, 120), description, region)
    return NextResponse.json({ success: true, branch })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not create the branch" },
      { status: 500 },
    )
  }
}
