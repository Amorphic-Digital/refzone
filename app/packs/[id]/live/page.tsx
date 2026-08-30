import { notFound, redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { isCoach } from "@/lib/coach"
import { createServiceClient } from "@/lib/supabase/service"
import { findOpenSessionForPack } from "@/lib/live-session"
import { LiveSessionControl } from "@/components/live-session-control"

export const metadata = { title: "Live session — RefZone" }

/**
 * The coach's console for a training night: the room answers on their phones,
 * the clip goes on the projector at /present/<id>, and the call goes up when
 * the coach says so.
 */
export default async function PackLivePage({ params }: { params: Promise<{ id: string }> }) {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    redirect("/auth/login")
  }
  if (!(await isCoach(userId))) redirect("/coach")

  const { id } = await params
  const supabase = createServiceClient()

  const { data: pack } = await supabase
    .from("training_packs")
    .select("id, title, share_code, created_by, is_active, is_public")
    .eq("id", id)
    .maybeSingle()

  // Someone else's pack behaves as if it does not exist rather than confirming
  // it belongs to another coach.
  if (!pack || !pack.is_active || pack.created_by !== userId) notFound()

  const [itemsResult, session] = await Promise.all([
    supabase
      .from("training_pack_items")
      .select("order_index, scenarios(id, title, video_url, video_credit, ai_answer)")
      .eq("pack_id", id)
      .order("order_index"),
    findOpenSessionForPack(id),
  ])

  const scenarios = (itemsResult.data || [])
    .map((item) => (item as any).scenarios)
    .filter(Boolean)
    .map((scenario: any) => ({
      id: scenario.id,
      title: scenario.title,
      video_url: scenario.video_url,
      video_credit: scenario.video_credit,
      // The coach is the one person meant to have the answer in front of them
      // — that is the whole point of running the session. It is behind a peek
      // toggle on the page, and never on the projector.
      answer: scenario.ai_answer as string | null,
    }))

  return (
    <LiveSessionControl
      packId={pack.id}
      packTitle={pack.title}
      isPublic={pack.is_public}
      scenarios={scenarios}
      session={
        session
          ? {
              id: session.id,
              join_code: session.join_code,
              current_index: session.current_index,
              phase: session.phase,
              is_open: session.is_open,
              question_seconds: session.question_seconds,
              timer_enabled: session.timer_enabled,
              scoring_enabled: session.scoring_enabled,
              leaderboard_enabled: session.leaderboard_enabled,
            }
          : null
      }
    />
  )
}
