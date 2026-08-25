import { notFound, redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { PackPlayer } from "@/components/pack-player"

export default async function PackPage({ params }: { params: Promise<{ id: string }> }) {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    redirect("/auth/login")
  }

  const { id } = await params
  const supabase = createServiceClient()

  const { data: pack } = await supabase
    .from("training_packs")
    .select("id, title, description, category, share_code, created_by, is_active")
    .eq("id", id)
    .single()

  if (!pack || !pack.is_active) notFound()

  const [itemsResult, progressResult] = await Promise.all([
    supabase
      .from("training_pack_items")
      .select("order_index, scenarios(*)")
      .eq("pack_id", id)
      .order("order_index"),
    supabase
      .from("training_pack_progress")
      .select("scenario_id, is_correct")
      .eq("pack_id", id)
      .eq("user_id", userId),
  ])

  // Flatten the join and drop any scenario that has since been deactivated.
  const scenarios = (itemsResult.data || [])
    .map((item) => (item as any).scenarios)
    .filter((scenario) => scenario && scenario.is_active)

  const completed = Object.fromEntries(
    (progressResult.data || []).map((row) => [row.scenario_id, row.is_correct]),
  )

  return (
    <PackPlayer
      pack={{
        id: pack.id,
        title: pack.title,
        description: pack.description,
        category: pack.category,
        shareCode: pack.share_code,
      }}
      scenarios={scenarios}
      completed={completed}
      isCoach={pack.created_by === userId}
    />
  )
}
