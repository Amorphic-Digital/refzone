import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/service"
import {
  findSessionByCode,
  scenarioAtIndex,
  getLiveCounts,
  getLeaderboard,
  listPlayers,
  secondsRemaining,
} from "@/lib/live-session"

export const dynamic = "force-dynamic"

/** Top N on the projector; a phone gets its own rank whatever it is. */
const PODIUM = 5

/**
 * The game state, polled by every phone in the room and by the projector.
 *
 * What comes back depends on the phase, and that is an access rule rather than
 * a tidiness one: anyone can open this URL with the code that is written on
 * the wall, so the official call is not in the response at all until the coach
 * has moved to reveal. Withholding it in the UI would not be enough.
 *
 * `attempt` is optional. Pass it and the response also carries that player's
 * own result and rank, which is what their phone shows them.
 */
export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params
    const session = await findSessionByCode(code)

    if (!session) {
      return NextResponse.json({ error: "No session with that code" }, { status: 404 })
    }

    const { data: pack } = await createServiceClient()
      .from("training_packs")
      .select("share_code, title")
      .eq("id", session.pack_id)
      .single()

    const { data: items } = await createServiceClient()
      .from("training_pack_items")
      .select("id", { count: "exact" })
      .eq("pack_id", session.pack_id)

    const attemptId = new URL(request.url).searchParams.get("attempt")
    const scenario = await scenarioAtIndex(session.pack_id, session.current_index)
    const counts = await getLiveCounts(session.id, scenario?.id ?? null)

    const base: Record<string, unknown> = {
      phase: session.phase,
      currentIndex: session.current_index,
      // Kept for anything still reading the 040 flag.
      reveal: session.phase === "reveal",
      isOpen: session.is_open,
      packCode: pack?.share_code ?? null,
      packTitle: pack?.title ?? null,
      total: (items || []).length,
      players: counts.players,
      answered: counts.answered,
      secondsLeft: secondsRemaining(session),
      questionSeconds: session.question_seconds,
      // The room needs these to know which parts of the screen exist at all.
      timer: session.timer_enabled,
      scoring: session.scoring_enabled,
      leaderboardOn: session.leaderboard_enabled,
    }

    if (session.phase === "lobby") {
      base.playerNames = (await listPlayers(session.id)).map((player) => player.name)
    }

    if (
      session.leaderboard_enabled &&
      (session.phase === "reveal" || session.phase === "leaderboard" || session.phase === "ended")
    ) {
      // With scoring off there are no points to rank on, so the order is who
      // got the most right.
      const leaderboard = await getLeaderboard(session.id, { byScore: session.scoring_enabled })

      base.leaderboard = leaderboard.slice(0, PODIUM).map((row, position) => ({
        position: position + 1,
        name: row.name,
        score: row.score,
      }))

      if (attemptId) {
        const at = leaderboard.findIndex((row) => row.attemptId === attemptId)
        if (at !== -1) {
          base.you = {
            position: at + 1,
            of: leaderboard.length,
            score: session.scoring_enabled ? leaderboard[at].score : leaderboard[at].correct,
            name: leaderboard[at].name,
          }
        }
      }
    }

    if (session.phase === "reveal") {
      base.officialAnswer = scenario?.answer ?? null
      base.spread = { correct: counts.correct, incorrect: counts.incorrect }

      if (attemptId && scenario) {
        const { data: mine } = await createServiceClient()
          .from("pack_guest_answers")
          .select("is_correct, coach_override_correct, points")
          .eq("attempt_id", attemptId)
          .eq("scenario_id", scenario.id)
          .maybeSingle()

        base.yourAnswer = mine
          ? {
              isCorrect: mine.coach_override_correct ?? mine.is_correct,
              points: session.scoring_enabled ? (mine.points ?? 0) : 0,
            }
          : null
      }
    }

    return NextResponse.json(base)
  } catch {
    return NextResponse.json({ error: "Could not read the session" }, { status: 500 })
  }
}
