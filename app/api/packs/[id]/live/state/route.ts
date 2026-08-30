import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { loadOwnedPack } from "@/lib/pack-ownership"
import {
  findOpenSessionForPack,
  scenarioAtIndex,
  getLiveCounts,
  secondsRemaining,
} from "@/lib/live-session"

export const dynamic = "force-dynamic"

/**
 * The coach's read on a running session, polled by the presenter view.
 *
 * The number that matters is `answered` against `players` — that is what turns
 * "reveal once everyone has had a go" from a guess made from the front of a
 * dark hall into something the coach can see.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  if (!(await loadOwnedPack(id, userId))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const session = await findOpenSessionForPack(id)
  if (!session) return NextResponse.json({ session: null })

  const scenario = await scenarioAtIndex(id, session.current_index)

  return NextResponse.json({
    session: {
      id: session.id,
      join_code: session.join_code,
      current_index: session.current_index,
      phase: session.phase,
      is_open: session.is_open,
      question_seconds: session.question_seconds,
      timer_enabled: session.timer_enabled,
      scoring_enabled: session.scoring_enabled,
      leaderboard_enabled: session.leaderboard_enabled,
    },
    counts: await getLiveCounts(session.id, scenario?.id ?? null),
    secondsLeft: secondsRemaining(session),
  })
}
