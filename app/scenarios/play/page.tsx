import { requireAuth } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { redirect } from "next/navigation"
import { ScenarioAutoPlayer } from "@/components/scenario-auto-player"
import { checkFeatureClosure } from "@/lib/feature-closures"
import { FeatureClosure } from "@/components/ui/feature-closure"
import { getCategory } from "@/lib/scenario-categories"

/**
 * The scenario training session.
 *
 * Was /scenarios before the category menu was added; /scenarios is now the
 * category hub and this is where a session actually runs. `?category=<slug>`
 * restricts the session to one training topic.
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

  let scenarioQuery = supabase.from("scenarios").select("*").eq("is_active", true)
  if (category) {
    scenarioQuery = scenarioQuery.eq("category", category.slug)
  }

  const [profileResult, scenariosResult, completedResult] = await Promise.all([
    supabase.from("profiles").select("scenario_streak, longest_scenario_streak").eq("id", userId).single(),
    scenarioQuery,
    supabase.from("scenario_responses").select("scenario_id").eq("user_id", userId),
  ])

  const profile = profileResult.data
  const scenarios = scenariosResult.data
  const completedScenarios = completedResult.data

  const completedIds = new Set(completedScenarios?.map((s) => s.scenario_id) || [])
  const unseenScenarios = scenarios?.filter((s) => !completedIds.has(s.id)) || []

  // Shuffle array using Fisher-Yates algorithm
  for (let i = unseenScenarios.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[unseenScenarios[i], unseenScenarios[j]] = [unseenScenarios[j], unseenScenarios[i]]
  }

  const firstScenario = unseenScenarios[0] || null

  return (
    <ScenarioAutoPlayer
      initialScenario={firstScenario}
      userId={userId}
      initialStreak={profile?.scenario_streak || 0}
      longestStreak={profile?.longest_scenario_streak || 0}
      totalUnseen={unseenScenarios.length}
      category={category?.slug ?? null}
      categoryTitle={category?.label ?? null}
    />
  )
}
