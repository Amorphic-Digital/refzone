import Link from "next/link"
import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { isCoach } from "@/lib/coach"
import { createServiceClient } from "@/lib/supabase/service"
import { checkFeatureClosure } from "@/lib/feature-closures"
import { FeatureClosure } from "@/components/ui/feature-closure"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { CategoryIcon } from "@/components/scenario-category-icon"
import { SCENARIO_CATEGORIES } from "@/lib/scenario-categories"
import { ArrowRight, GraduationCap, Shuffle } from "lucide-react"

export const metadata = { title: "Scenario Topics — RefZone" }

/**
 * The scenario topic menu, reached from the bottom half of /scenarios.
 *
 * A referee picks a topic, not a clip: the session deals from that topic at
 * random, the way decisions arrive in a match. So nothing here counts either —
 * see the note on the chooser for why there is no per-topic tally.
 */
export default async function ScenarioCategoriesPage() {
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

  const [scenariosResult, coach] = await Promise.all([
    supabase.from("scenarios").select("category").eq("is_active", true),
    isCoach(userId),
  ])

  const scenarios = scenariosResult.data || []

  // Which topics actually have clips behind them. The count is used to decide
  // that and nothing else — it never reaches the page.
  const stocked = new Set(scenarios.map((s) => s.category).filter(Boolean))
  const hasUncategorised = scenarios.some((s) => !s.category)
  const availableCategories = SCENARIO_CATEGORIES.filter((c) => stocked.has(c.slug))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pick a topic"
        description="Choose what you want to train and the app deals you clips from it at random."
        back={{ href: "/scenarios", label: "Scenarios" }}
        actions={
          <Button asChild variant="outline">
            <Link href="/scenarios/play">
              <Shuffle className="h-4 w-4" />
              Random instead
            </Link>
          </Button>
        }
      />

      {availableCategories.length === 0 && !hasUncategorised ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No scenarios are available yet. Check back soon.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {availableCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/scenarios/play?category=${category.slug}`}
                className="group focus-visible:outline-none"
              >
                <Card className="h-full transition-colors group-hover:border-primary/50 group-focus-visible:border-primary">
                  <CardContent className="flex h-full flex-col gap-3 pt-6">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <CategoryIcon name={category.icon} className="h-5 w-5 text-primary" />
                    </div>

                    <div className="flex-1 space-y-1">
                      <h2 className="font-semibold leading-tight text-foreground">{category.label}</h2>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>

                    <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                      <span>{category.lawRef}</span>
                      <span className="flex items-center gap-1 font-medium text-primary">
                        Train
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Coaching is a different job from refereeing, and this is the only
              place in the app where the difference is worth explaining. */}
          {!coach && (
            <Card className="border-dashed">
              <CardContent className="flex flex-wrap items-center justify-between gap-4 py-5">
                <div className="flex items-start gap-3">
                  <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Do you coach referees?</p>
                    <p className="text-sm text-muted-foreground">
                      A Referee Coach account opens the whole library and lets you build training
                      packs for your group. Free for now.
                    </p>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/coach">Apply</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
