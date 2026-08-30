import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { isCoach } from "@/lib/coach"
import { createServiceClient } from "@/lib/supabase/service"
import { isScenarioVideoKey } from "@/lib/r2"
import { isValidCategory } from "@/lib/scenario-categories"

const MAX_TEXT = 2000
const MAX_FIELD = 300

/**
 * A coach sends the library a clip.
 *
 * It goes to an admin, never straight to the library: rights and quality are
 * not things to take on trust. video_credit is required — an admin cannot
 * judge whether footage is usable without being told where it came from — and
 * the suggested answer is required because a clip nobody can grade is not a
 * scenario.
 */
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
    const text = (value: unknown, max: number) =>
      typeof value === "string" && value.trim() ? value.trim().slice(0, max) : null

    const videoUrl = text(body.video_url, MAX_FIELD * 4)
    const videoCredit = text(body.video_credit, MAX_FIELD)
    const answer = text(body.suggested_answer, MAX_TEXT)

    if (!videoUrl) return NextResponse.json({ error: "Upload the clip first" }, { status: 400 })
    if (!videoCredit) {
      return NextResponse.json({ error: "Say where the footage is from" }, { status: 400 })
    }
    if (!answer) {
      return NextResponse.json({ error: "Give the correct decision for this clip" }, { status: 400 })
    }

    const videoKey = text(body.video_key, MAX_FIELD)
    if (videoKey && !isScenarioVideoKey(videoKey)) {
      return NextResponse.json({ error: "Not a scenario video key" }, { status: 400 })
    }

    const category = text(body.suggested_category, MAX_FIELD)
    if (category && !isValidCategory(category)) {
      return NextResponse.json({ error: `Unknown category: ${category}` }, { status: 400 })
    }

    const { error } = await createServiceClient().from("scenario_submissions").insert({
      submitted_by: userId,
      video_url: videoUrl,
      video_key: videoKey,
      video_credit: videoCredit,
      suggested_answer: answer,
      suggested_category: category,
      note: text(body.note, MAX_TEXT),
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Scenario submission error:", err)
    return NextResponse.json({ error: "Could not send that clip" }, { status: 500 })
  }
}
