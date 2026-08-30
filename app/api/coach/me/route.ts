import { NextResponse } from "next/server"
import { getAuthUserId } from "@/lib/auth"
import { getCoachState } from "@/lib/coach"

export const dynamic = "force-dynamic"

/**
 * Whether the caller is a coach, for the navigation.
 *
 * The navs are client components rendered in a dozen layouts, so threading
 * this down as a prop would mean touching every one of them. One cached fetch
 * is the cheaper shape — see lib/use-coach.ts, which calls this once per page
 * load no matter how many navs mount.
 *
 * Signed out is a normal answer here, not an error: the nav renders for
 * logged-out visitors too.
 */
export async function GET() {
  const userId = await getAuthUserId()

  if (!userId) {
    return NextResponse.json({ isCoach: false, expiresAt: null, pending: false })
  }

  const { isCoach, grant, application } = await getCoachState(userId)

  return NextResponse.json({
    isCoach,
    expiresAt: grant.expiresAt,
    expired: grant.expired,
    pending: application?.status === "pending",
  })
}
