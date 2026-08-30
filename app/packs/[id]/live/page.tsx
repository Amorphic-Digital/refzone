import { notFound, redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { isCoach } from "@/lib/coach"
import { createServiceClient } from "@/lib/supabase/service"
import { LiveSessionControl } from "@/components/live-session-control"

export const metadata = { title: "Live session — RefZone" }

/**
 * The coach's console for a training night: one clip on the projector, the
 * room answering on their phones, and the answer held back until everyone has
 * had a go.
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

  const [itemsResult, sessionResult] = await Promise.all([
    supabase
      .from("training_pack_items")
      .select("order_index, scenarios(id, title, video_url, video_credit, ai_answer)")
      .eq("pack_id", id)
      .order("order_index"),
    supabase
      .from("pack_live_sessions")
      .select("id, join_code, current_index, reveal, is_open")
      .eq("pack_id", id)
      .eq("is_open", true)
      .maybeSingle(),
  ])

  const scenarios = (itemsResult.data || [])
    .map((item) => (item as any).scenarios)
    .filter(Boolean)
    .map((scenario: any) => ({
      id: scenario.id,
      title: scenario.title,
      video_url: scenario.video_url,
      video_credit: scenario.video_credit,
      // The coach is the one person who is meant to have the answer in front
      // of them — that is the whole point of running the session.
      answer: scenario.ai_answer as string | null,
    }))

  return (
    <LiveSessionControl
      packId={pack.id}
      packTitle={pack.title}
      isPublic={pack.is_public}
      scenarios={scenarios}
      session={sessionResult.data ?? null}
    />
  )
}
