import { notFound, redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { canCoachSeeReferee } from "@/lib/referee-branches"
import { createServiceClient } from "@/lib/supabase/service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, FileQuestion, Flame, PlayCircle, Timer, XCircle } from "lucide-react"

export const metadata = { title: "Referee — RefZone" }

/** How much history is worth reading. Older than this is a report, not a page. */
const RECENT_LIMIT = 40

function formatWhen(value: string | null) {
  if (!value) return ""
  return new Date(value).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatDuration(seconds: number | null) {
  if (!seconds && seconds !== 0) return "—"
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
}

/**
 * What one referee in your branch has been answering.
 *
 * The point of a branch coach seeing this is the wrong answers: which clips a
 * referee is getting wrong, and what they actually wrote, is the whole content
 * of a coaching conversation. So the decision text is here in full rather than
 * a tally of right and wrong.
 *
 * Access is checked against branch membership on every load — being a coach is
 * not on its own permission to read anyone. The referee opened this by joining
 * the branch, and it closes again the moment either of them leaves.
 */
export default async function BranchRefereePage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  let coachId: string
  try {
    coachId = await requireAuth()
  } catch {
    redirect("/auth/login")
  }

  const { userId: refereeId } = await params

  if (!(await canCoachSeeReferee(coachId, refereeId))) notFound()

  const supabase = createServiceClient()

  const [profileResult, scenariosResult, quizzesResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name, total_points, current_streak, longest_streak, scenario_streak")
      .eq("id", refereeId)
      .maybeSingle(),
    supabase
      .from("scenario_responses")
      .select("id, user_decision, is_correct, time_taken_seconds, points_earned, created_at, scenarios(title, difficulty, category)")
      .eq("user_id", refereeId)
      .order("created_at", { ascending: false })
      .limit(RECENT_LIMIT),
    supabase
      .from("quiz_attempts")
      .select("id, score, total_possible, percentage, time_taken_seconds, completed_at, quizzes(title, difficulty)")
      .eq("user_id", refereeId)
      .order("completed_at", { ascending: false })
      .limit(RECENT_LIMIT),
  ])

  const profile = profileResult.data as any
  if (!profile) notFound()

  const scenarios = (scenariosResult.data || []) as any[]
  const quizzes = (quizzesResult.data || []) as any[]

  const correct = scenarios.filter((row) => row.is_correct).length
  const accuracy = scenarios.length ? Math.round((correct / scenarios.length) * 100) : null

  return (
    <div className="space-y-6">
      <PageHeader
        title={profile.display_name || "Referee"}
        description="Recent answers, most recent first."
        back={{ href: "/branch", label: "Branch" }}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Points" value={(profile.total_points ?? 0).toLocaleString()} />
        <Stat
          label="Daily streak"
          value={String(profile.current_streak ?? 0)}
          icon={<Flame className="h-4 w-4 text-orange-500" />}
        />
        <Stat label="Scenario streak" value={String(profile.scenario_streak ?? 0)} />
        <Stat
          label="Recent accuracy"
          value={accuracy === null ? "—" : `${accuracy}%`}
          hint={accuracy === null ? undefined : `${correct} of ${scenarios.length}`}
        />
      </div>

      <Tabs defaultValue="scenarios">
        <TabsList>
          <TabsTrigger value="scenarios" className="gap-1.5">
            <PlayCircle className="h-4 w-4" />
            Scenarios
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="gap-1.5">
            <FileQuestion className="h-4 w-4" />
            Quizzes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="mt-4">
          {scenarios.length === 0 ? (
            <Empty>This referee has not judged a scenario yet.</Empty>
          ) : (
            <div className="space-y-3">
              {scenarios.map((row) => (
                <Card key={row.id}>
                  <CardContent className="space-y-3 pt-6">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold leading-tight text-foreground">
                          {row.scenarios?.title || "Scenario"}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {formatWhen(row.created_at)}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          row.is_correct
                            ? "border-green-500/50 text-green-600 dark:text-green-400"
                            : "border-red-500/50 text-red-600 dark:text-red-400"
                        }
                      >
                        {row.is_correct ? (
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                        ) : (
                          <XCircle className="mr-1 h-3 w-3" />
                        )}
                        {row.is_correct ? "Correct" : "Incorrect"}
                      </Badge>
                    </div>

                    <div>
                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Their decision
                      </p>
                      <p className="text-sm text-foreground">{row.user_decision}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 border-t pt-3 text-xs text-muted-foreground">
                      {row.scenarios?.difficulty && (
                        <Badge variant="secondary" className="text-xs">
                          {row.scenarios.difficulty}
                        </Badge>
                      )}
                      <span className="flex items-center gap-1">
                        <Timer className="h-3 w-3" />
                        {formatDuration(row.time_taken_seconds)}
                      </span>
                      <span>{row.points_earned ?? 0} pts</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="quizzes" className="mt-4">
          {quizzes.length === 0 ? (
            <Empty>This referee has not finished a quiz yet.</Empty>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <ul className="divide-y">
                  {quizzes.map((row) => {
                    const percentage = Number(row.percentage ?? 0)
                    return (
                      <li key={row.id} className="flex flex-wrap items-center gap-3 py-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-foreground">
                            {row.quizzes?.title || "Quiz"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatWhen(row.completed_at)} · {formatDuration(row.time_taken_seconds)}
                          </p>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {row.score}/{row.total_possible}
                        </span>
                        <Badge
                          variant="outline"
                          className={
                            percentage >= 70
                              ? "border-green-500/50 text-green-600 dark:text-green-400"
                              : "border-amber-500/50 text-amber-600 dark:text-amber-400"
                          }
                        >
                          {Math.round(percentage)}%
                        </Badge>
                      </li>
                    )
                  })}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Stat({
  label,
  value,
  hint,
  icon,
}: {
  label: string
  value: string
  hint?: string
  icon?: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="flex items-center gap-2 text-2xl font-bold text-foreground">
          {icon}
          {value}
        </p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  )
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <Card className="border-dashed">
      <CardContent className="py-12 text-center">
        <p className="text-sm text-muted-foreground">{children}</p>
      </CardContent>
    </Card>
  )
}
