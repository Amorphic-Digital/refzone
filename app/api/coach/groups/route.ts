import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { isCoach } from "@/lib/coach"
import { createGroup } from "@/lib/coach-groups"

const MAX_NAME = 100
const MAX_DESCRIPTION = 500

/** Creates a group and allocates its join code. */
export async function POST(request: Request) {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!(await isCoach(userId))) {
    return NextResponse.json({ error: "Referee Coach accounts only" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const name = typeof body.name === "string" ? body.name.trim() : ""

    if (!name) return NextResponse.json({ error: "Give the group a name" }, { status: 400 })

    const group = await createGroup(
      userId,
      name.slice(0, MAX_NAME),
      typeof body.description === "string" && body.description.trim()
        ? body.description.trim().slice(0, MAX_DESCRIPTION)
        : null,
    )

    return NextResponse.json({ group })
  } catch (err) {
    console.error("Create group error:", err)
    return NextResponse.json({ error: "Could not create the group" }, { status: 500 })
  }
}
