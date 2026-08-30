import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/service"
import { randomToken } from "@/lib/share-codes"
import { findPublicPack, findGuestAttempt, listPublicScenarios } from "@/lib/public-pack"

const MAX_NAME = 60

/**
 * Starts — or resumes — a guest attempt at a public pack.
 *
 * No account, by design: a coach sending a pack to a whole branch cannot make
 * three hundred people sign up first. The response carries the scenarios with
 * their answers stripped out, and a token the browser keeps so a refresh
 * continues the same attempt instead of starting a second one.
 */
export async function POST(request: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params
    const pack = await findPublicPack(code)

    if (!pack) {
      return NextResponse.json({ error: "That link is not open for answers" }, { status: 404 })
    }

    const body = await request.json().catch(() => ({}))
    const existingToken = typeof body.token === "string" ? body.token : ""
    const displayName =
      typeof body.displayName === "string" && body.displayName.trim()
        ? body.displayName.trim().slice(0, MAX_NAME)
        : null

    if (pack.collect_name && !displayName && !existingToken) {
      return NextResponse.json({ error: "Please enter your name" }, { status: 400 })
    }

    const supabase = createServiceClient()


    // Resuming: the token is proof this browser already started, so nothing
    // new is created and any answers already given stay where they are.
    let attempt = existingToken ? await findGuestAttempt(pack.id, existingToken) : null
    let token = existingToken

    if (!attempt) {
      token = randomToken()

      // A live session deals the same pack to a room; tagging the attempt with
      // it lets the coach tell the room apart from people doing it at home.
      let sessionId: string | null = null
      if (typeof body.sessionCode === "string" && body.sessionCode.trim()) {
        const { data: session } = await supabase
          .from("pack_live_sessions")
          .select("id, pack_id, is_open")
          .eq("join_code", body.sessionCode.trim().toLowerCase())
          .maybeSingle()

        if (session && session.is_open && session.pack_id === pack.id) sessionId = session.id
      }

      const { data, error } = await supabase
        .from("pack_guest_attempts")
        .insert({
          pack_id: pack.id,
          display_name: displayName,
          session_token: token,
          session_id: sessionId,
        })
        .select("id, pack_id, display_name, session_id, completed_at, user_id")
        .single()

      if (error) {
        console.error("Guest attempt error:", error)
        return NextResponse.json({ error: "Could not start" }, { status: 500 })
      }
      attempt = data
    } else if (displayName && !attempt.display_name) {
      await supabase
        .from("pack_guest_attempts")
        .update({ display_name: displayName })
        .eq("id", attempt.id)
      attempt.display_name = displayName
    }

    // Answers already given, so a resumed attempt does not ask them twice.
    const { data: answered } = await supabase
      .from("pack_guest_answers")
      .select("scenario_id, is_correct")
      .eq("attempt_id", attempt.id)

    return NextResponse.json({
      token,
      // The phone passes this back to /api/public/live so the leaderboard can
      // tell it its own rank. It is not a credential — the token is.
      attemptId: attempt.id,
      // Whether this attempt belongs to an account is settled separately by
      // /api/pack-attempt/link — this route runs outside Clerk and cannot know.
      signedIn: !!attempt.user_id,
      displayName: attempt.display_name,
      sessionId: attempt.session_id,
      pack: { title: pack.title, description: pack.description },
      scenarios: await listPublicScenarios(pack.id),
      answered: (answered || []).map((row) => ({
        scenarioId: row.scenario_id,
        isCorrect: row.is_correct,
      })),
    })
  } catch (err) {
    console.error("Public pack start error:", err)
    return NextResponse.json({ error: "Could not start" }, { status: 500 })
  }
}
