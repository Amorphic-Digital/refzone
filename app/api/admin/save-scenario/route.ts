import { requireAdmin } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { NextResponse } from "next/server"
import { isValidCategory } from "@/lib/scenario-categories"
import { isScenarioVideoKey } from "@/lib/r2"

export async function POST(request: Request) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, video_url, video_key, video_credit, ai_answer, ai_description, law_category, law_section, scenario_type, category, difficulty, points_value } = body

    if (!video_url || !ai_answer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // video_key is the R2 object key behind video_url. Stored alongside the
    // URL so deleting a scenario can also delete its video, and so the bucket
    // can move to a different public domain without orphaning every object.
    if (video_key && !isScenarioVideoKey(video_key)) {
      return NextResponse.json({ error: "Not a scenario video key" }, { status: 400 })
    }

    // A category outside the taxonomy would be invisible in the category menu
    // and break the /topics pages, so reject it rather than storing it.
    if (category && !isValidCategory(category)) {
      return NextResponse.json({ error: `Unknown category: ${category}` }, { status: 400 })
    }

    const supabase = createServiceClient()

    const { data, error } = await supabase.from("scenarios").insert({
      title,
      video_url,
      video_key: video_key || null,
      // Acknowledgement of where the footage came from, typed in at upload
      // time and shown above the video — see scripts/038_scenario_video_credit.sql.
      video_credit: typeof video_credit === "string" && video_credit.trim() ? video_credit.trim() : null,
      ai_answer,
      ai_description,
      law_category: law_category || null,
      law_section: law_section || null,
      scenario_type,
      category: category || null,
      difficulty,
      is_active: true,
      points_value: points_value || 10,
    }).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, scenario: data })
  } catch (err) {
    console.error("Save scenario error:", err)
    return NextResponse.json({ error: "Failed to save scenario" }, { status: 500 })
  }
}
