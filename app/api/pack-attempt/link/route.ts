import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { findPublicPack, findGuestAttempt } from "@/lib/public-pack"
import { recordScenarioCredit, alreadyCredited } from "@/lib/scenario-credit"

/**
 * Claims a public-pack attempt for the signed-in referee.
 *
 * The pack routes themselves sit outside Clerk — a live session polls them
 * once a second from every phone in the room, and the whole point of a public
 * link is that it works without an account. So identity is attached here
 * instead, in one authenticated call the phone makes after joining.
 *
 * The attempt is proved by its session token, which is server-generated and
 * only ever held by the browser that started it. Without that, claiming
 * somebody else's answers would be a matter of guessing an id.
 */
export async function POST(request: Request) {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { code, token } = await request.json()

    if (typeof code !== "string" || typeof token !== "string") {
      return NextResponse.json({ error: "Missing attempt" }, { status: 400 })
    }

    const pack = await findPublicPack(code)
    if (!pack) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const attempt = await findGuestAttempt(pack.id, token)
    if (!attempt) return NextResponse.json({ error: "Unknown attempt" }, { status: 401 })

    // Already claimed by somebody else: leave it alone rather than moving
    // another referee's answers onto this account.
    if (attempt.user_id && attempt.user_id !== userId) {
      return NextResponse.json({ error: "That attempt belongs to someone else" }, { status: 409 })
    }

    const supabase = createServiceClient()

    if (!attempt.user_id) {
      await supabase
        .from("pack_guest_attempts")
        .update({ user_id: userId })
        .eq("id", attempt.id)
    }

    // Anything already answered before the link landed still counts. Without
    // this, joining a live session that is mid-clip would silently lose the
    // first answer from every signed-in referee in the room.
    const { data: answers } = await supabase
      .from("pack_guest_answers")
      .select("scenario_id, answer_text, is_correct, answered_in_seconds")
      .eq("attempt_id", attempt.id)

    let credited = 0
    for (const answer of answers || []) {
      if (await alreadyCredited(userId, answer.scenario_id)) continue

      const { data: scenario } = await supabase
        .from("scenarios")
        .select("points_value, law_category, law_section")
        .eq("id", answer.scenario_id)
        .single()

      try {
        await recordScenarioCredit({
          userId,
          scenarioId: answer.scenario_id,
          decision: answer.answer_text || "",
          isCorrect: answer.is_correct,
          timeTakenSeconds: answer.answered_in_seconds ?? 0,
          pointsEarned: answer.is_correct ? (scenario?.points_value ?? 10) : 0,
          lawCategory: scenario?.law_category,
          lawSection: scenario?.law_section,
        })
        credited += 1
      } catch (err) {
        console.error("Could not back-credit a pack answer:", err)
      }
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", userId)
      .single()

    return NextResponse.json({
      signedIn: true,
      displayName: profile?.display_name ?? null,
      credited,
    })
  } catch (err) {
    console.error("Link attempt error:", err)
    return NextResponse.json({ error: "Could not link that attempt" }, { status: 500 })
  }
}
