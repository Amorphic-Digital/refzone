import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { isCoach } from "@/lib/coach"
import { createServiceClient } from "@/lib/supabase/service"
import { checkFeatureClosure } from "@/lib/feature-closures"
import { FeatureClosure } from "@/components/ui/feature-closure"
import { ScenarioLibrary } from "@/components/scenario-library"

export const metadata = { title: "Scenario Library — RefZone" }

/**
 * The whole scenario library, coaches only.
 *
 * This is the view a referee deliberately does not get: everything listed, with
 * every clip openable by name. A coach needs it to plan a session and to pick
 * what goes in a pack.
 */
export default async function ScenarioBrowsePage() {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    redirect("/auth/login")
  }

  // Not a coach: there is nothing to explain here that /coach does not say
  // better, so send them there rather than showing a locked page.
  if (!(await isCoach(userId))) {
    redirect("/coach")
  }

  const closure = await checkFeatureClosure("scenarios")
  if (closure) {
    return <FeatureClosure closure={closure} />
  }

  // Titles and tags only — the answers stay on the server, the same way the
  // pack builder handles it.
  const { data: scenarios } = await createServiceClient()
    .from("scenarios")
    .select("id, title, category, difficulty, law_category, law_section, video_credit, created_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  return <ScenarioLibrary scenarios={scenarios || []} />
}
