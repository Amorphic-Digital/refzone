import { notFound, redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { isCoach } from "@/lib/coach"
import { createServiceClient } from "@/lib/supabase/service"
import { LiveProjector } from "@/components/live-projector"

export const metadata = { title: "Live — RefZone" }

/**
 * The screen at the front of the room.
 *
 * No app shell, no sidebar, no controls: this gets dragged onto a projector
 * and fullscreened, and anything on it is something forty referees are
 * reading. The coach drives from /packs/<id>/live on their own device.
 *
 * The official call is never sent to this page ahead of the reveal — the
 * projector reads the same public endpoint the phones do, for exactly that
 * reason.
 */
export default async function PackPresentPage({ params }: { params: Promise<{ id: string }> }) {
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
    .select("id, title, created_by, is_active")
    .eq("id", id)
    .maybeSingle()

  if (!pack || !pack.is_active || pack.created_by !== userId) notFound()

  const { data: items } = await supabase
    .from("training_pack_items")
    .select("order_index, scenarios(id, title, video_url, video_credit)")
    .eq("pack_id", id)
    .order("order_index")

  const { data: session } = await supabase
    .from("pack_live_sessions")
    .select("join_code")
    .eq("pack_id", id)
    .eq("is_open", true)
    .maybeSingle()

  return (
    <LiveProjector
      packTitle={pack.title}
      joinCode={session?.join_code ?? null}
      scenarios={(items || [])
        .map((item) => (item as any).scenarios)
        .filter(Boolean)
        .map((scenario: any) => ({
          id: scenario.id,
          title: scenario.title,
          video_url: scenario.video_url,
          video_credit: scenario.video_credit,
        }))}
    />
  )
}
