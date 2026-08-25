import Link from "next/link"
import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { checkFeatureClosure } from "@/lib/feature-closures"
import { FeatureClosure } from "@/components/ui/feature-closure"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CategoryIcon } from "@/components/scenario-category-icon"
import { SCENARIO_CATEGORIES } from "@/lib/scenario-categories"
import { CheckCircle2, Layers, Shuffle } from "lucide-react"

/**
 * The scenario category menu.
 *
 * Coaches asked to be able to train one topic at a time — "give the group ten
 * DOGSO clips" — so this is the landing page, and the session itself moved to
 * /scenarios/play.
 */
export default async function ScenariosPage() {
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

  const [scenariosResult, completedResult] = await Promise.all([
    supabase.from("scenarios").select("id, category").eq("is_active", true),
    supabase.from("scenario_responses").select("scenario_id").eq("user_id", userId),
  ])

  const scenarios = scenariosResult.data || []
  const completedIds = new Set((completedResult.data || []).map((r) => r.scenario_id))

  // Totals per category, plus how many the user has already worked through.
  const totals = new Map<string, { total: number; done: number }>()
  for (const scenario of scenarios) {
    const key = scenario.category || "__uncategorised"
    const entry = totals.get(key) || { total: 0, done: 0 }
    entry.total += 1
    if (completedIds.has(scenario.id)) entry.done += 1
    totals.set(key, entry)
  }

  const overallTotal = scenarios.length
  const overallDone = scenarios.filter((s) => completedIds.has(s.id)).length
  const remaining = overallTotal - overallDone

  // Categories with nothing in them yet are noise — a coach clicking one would
  // land on an empty session.
  const availableCategories = SCENARIO_CATEGORIES.filter((c) => (totals.get(c.slug)?.total ?? 0) > 0)
  const uncategorised = totals.get("__uncategorised")

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 text-3xl font-bold text-foreground">Match Scenarios</h1>
          <p className="text-sm text-muted-foreground">
            {overallTotal} scenarios · {overallDone} completed · {remaining} to go
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/packs">
              <Layers className="h-4 w-4" />
              Training packs
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-red-700"
          >
            <Link href="/scenarios/play">
              <Shuffle className="h-4 w-4" />
              Quick play
            </Link>
          </Button>
        </div>
      </div>

      {overallTotal === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No scenarios are available yet. Check back soon.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {availableCategories.map((category) => {
              const stats = totals.get(category.slug)!
              const complete = stats.done >= stats.total
              const percent = Math.round((stats.done / stats.total) * 100)

              return (
                <Link
                  key={category.slug}
                  href={`/scenarios/play?category=${category.slug}`}
                  className="group focus-visible:outline-none"
                >
                  <Card className="h-full transition-colors group-hover:border-primary/50 group-focus-visible:border-primary">
                    <CardContent className="flex h-full flex-col gap-3 pt-6">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <CategoryIcon name={category.icon} className="h-5 w-5 text-primary" />
                        </div>
                        {complete ? (
                          <Badge variant="secondary" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Done
                          </Badge>
                        ) : (
                          <Badge variant="outline">{stats.total - stats.done} left</Badge>
                        )}
                      </div>

                      <div className="flex-1 space-y-1">
                        <h2 className="font-semibold leading-tight text-foreground">{category.label}</h2>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>

                      <div className="space-y-1.5">
                        <Progress value={percent} className="h-1.5" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{category.lawRef}</span>
                          <span>
                            {stats.done}/{stats.total}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

          {uncategorised && (
            <Card className="border-dashed">
              <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
                <p className="text-sm text-muted-foreground">
                  {uncategorised.total} scenario{uncategorised.total === 1 ? "" : "s"} have not been
                  filed under a category yet.
                </p>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/scenarios/play">Play them anyway</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
