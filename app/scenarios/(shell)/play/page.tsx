import { requireAuth } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { redirect } from "next/navigation"
import { ScenarioSession, type SessionScenario } from "@/components/scenario-session"
import { checkFeatureClosure } from "@/lib/feature-closures"
import { FeatureClosure } from "@/components/ui/feature-closure"
import { getCategory } from "@/lib/scenario-categories"

/** Rows sent with the page. Enough to work through before the first top-up. */
const INITIAL_ROWS = 4

/**
 * The scenario training session.
 *
 * `?category=<slug>` restricts the session to one training topic; without it
 * the session deals from everything the referee has not judged yet.
 *
 * The running order is shuffled once, here, and sent down as a list of ids.
 * Only the first few rows travel with the page — the session pulls the rest a
 * handful at a time through /api/scenarios/batch as the referee works through
 * them. Sending every row would mean shipping the entire library, answers and
 * all, to open one clip; re-shuffling on each top-up instead would repeat
 * clips and skip others.
 */
export default async function ScenarioPlayPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    redirect("/auth/login")
  }
  const supabase = createServiceClient()

  const closure = await checkFeatureClosure("scenarios")
  if (closure) {
    return <FeatureClosure closure={closure} />
  }

  const { category: requestedCategory } = await searchParams
  // An unknown slug would silently return zero scenarios, which reads as "you
  // finished them all". Treat it as no filter instead.
  const category = getCategory(requestedCategory)

  let scenarioQuery = supabase.from("scenarios").select("id").eq("is_active", true)
  if (category) {
    scenarioQuery = scenarioQuery.eq("category", category.slug)
  }

  const [profileResult, scenariosResult, completedResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("scenario_streak, longest_scenario_streak")
      .eq("id", userId)
      .single(),
    scenarioQuery,
    supabase.from("scenario_responses").select("scenario_id").eq("user_id", userId),
  ])

  const profile = profileResult.data
  const completedIds = new Set(completedResult.data?.map((s) => s.scenario_id) || [])
  const queueIds = (scenariosResult.data || [])
    .map((s) => s.id as string)
    .filter((id) => !completedIds.has(id))

  // Shuffle the running order using Fisher-Yates.
  for (let i = queueIds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[queueIds[i], queueIds[j]] = [queueIds[j], queueIds[i]]
  }

  const firstIds = queueIds.slice(0, INITIAL_ROWS)
  const { data: firstRows } = firstIds.length
    ? await supabase.from("scenarios").select("*").in("id", firstIds)
    : { data: [] }

  // `in()` does not preserve the order it was given, and the order is the
  // shuffle, so put the rows back into it.
  const rowsById = new Map((firstRows || []).map((row) => [row.id as string, row]))
  const initialScenarios = firstIds
    .map((id) => rowsById.get(id))
    .filter(Boolean) as SessionScenario[]

  return (
    <ScenarioSession
      initialScenarios={initialScenarios}
      queueIds={queueIds}
      initialStreak={profile?.scenario_streak || 0}
      longestStreak={profile?.longest_scenario_streak || 0}
      categoryTitle={category?.label ?? null}
    />
  )
}
