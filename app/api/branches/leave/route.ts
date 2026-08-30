import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { leaveBranch } from "@/lib/referee-branches"

/** Leaves the branch. The owner has to hand it on first — see the lib. */
export async function POST() {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await leaveBranch(userId)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not leave the branch" },
      { status: 400 },
    )
  }
}
