import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ShareButton } from "@/components/share-button"
import { formatTime } from "@/lib/shared-utils"
import { ArrowLeft, CheckCircle2, Users, XCircle } from "lucide-react"

/**
 * What the squad did with a pack.
 *
 * Coach-only: results are other people's answers, so the pack owner is the
 * only one who can see them.
 */
export default async function PackResultsPage({ params }: { params: Promise<{ id: string }> }) {
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
    .select("id, title, description, share_code, created_by, is_active")
    .eq("id", id)
    .single()

  if (!pack || !pack.is_active) notFound()

  // Not the coach? Behave as if the results page does not exist rather than
  // confirming the pack belongs to someone else.
  if (pack.created_by !== userId) notFound()

  const [itemsResult, progressResult] = await Promise.all([
    supabase
      .from("training_pack_items")
      .select("scenario_id, order_index, scenarios(id, title)")
      .eq("pack_id", id)
      .order("order_index"),
    supabase
      .from("training_pack_progress")
      .select("user_id, scenario_id, is_correct, answer_text, time_taken_seconds, created_at")
      .eq("pack_id", id),
  ])

  const items = (itemsResult.data || []).map((item) => ({
    scenarioId: item.scenario_id,
    title: (item as any).scenarios?.title || "Scenario",
  }))
  const progress = progressResult.data || []

  // Resolve trainee names in one query rather than per row.
  const traineeIds = [...new Set(progress.map((row) => row.user_id))]
  const { data: profiles } = traineeIds.length
    ? await supabase.from("profiles").select("id, display_name").in("id", traineeIds)
    : { data: [] }

  const nameById = new Map((profiles || []).map((p) => [p.id, p.display_name as string]))

  // One row per trainee, with their answer to each scenario.
  const trainees = traineeIds
    .map((traineeId) => {
      const rows = progress.filter((row) => row.user_id === traineeId)
      const correct = rows.filter((row) => row.is_correct).length
      return {
        id: traineeId,
        name: nameById.get(traineeId) || "Referee",
        answered: rows.length,
        correct,
        accuracy: rows.length ? Math.round((correct / rows.length) * 100) : 0,
        byScenario: new Map(rows.map((row) => [row.scenario_id, row])),
        lastActive: rows
          .map((row) => row.created_at)
          .sort()
          .at(-1),
      }
    })
    .sort((a, b) => b.accuracy - a.accuracy || b.answered - a.answered)

  // Per-scenario accuracy tells the coach what to spend the next session on.
  const scenarioStats = items.map((item) => {
    const rows = progress.filter((row) => row.scenario_id === item.scenarioId)
    const correct = rows.filter((row) => row.is_correct).length
    return {
      ...item,
      attempts: rows.length,
      correct,
      accuracy: rows.length ? Math.round((correct / rows.length) * 100) : null,
    }
  })

  const hardest = [...scenarioStats]
    .filter((s) => s.attempts > 0)
    .sort((a, b) => (a.accuracy ?? 100) - (b.accuracy ?? 100))
    .slice(0, 3)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Button asChild variant="ghost" size="sm" className="-ml-2 mb-1">
            <Link href="/packs">
              <ArrowLeft className="h-4 w-4" />
              All packs
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground">{pack.title}</h1>
          <p className="text-sm text-muted-foreground">
            {trainees.length} referee{trainees.length === 1 ? "" : "s"} · {items.length} scenarios
          </p>
        </div>
        <ShareButton url={`/share/pack/${pack.share_code}`} title={pack.title} variant="outline" />
      </div>

      {trainees.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Users className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
            <h2 className="mb-1 font-semibold text-foreground">No one has started yet</h2>
            <p className="mx-auto max-w-md text-sm text-muted-foreground">
              Share the link or QR code with your referees. Their answers appear here as they work
              through the pack.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {hardest.length > 0 && (
            <Card>
              <CardContent className="space-y-3 pt-6">
                <h2 className="font-semibold text-foreground">Worth reviewing together</h2>
                <div className="space-y-2">
                  {hardest.map((scenario) => (
                    <div key={scenario.scenarioId} className="flex items-center gap-3">
                      <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                        {scenario.title}
                      </span>
                      <Progress value={scenario.accuracy ?? 0} className="h-1.5 w-24 shrink-0" />
                      <span className="w-20 shrink-0 text-right text-xs text-muted-foreground">
                        {scenario.accuracy}% of {scenario.attempts}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {trainees.map((trainee) => (
              <Card key={trainee.id}>
                <CardContent className="space-y-3 pt-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-foreground">{trainee.name}</h3>
                      <Badge variant={trainee.accuracy >= 70 ? "secondary" : "outline"}>
                        {trainee.accuracy}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {trainee.answered} of {items.length} answered · {trainee.correct} correct
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    {items.map((item) => {
                      const row = trainee.byScenario.get(item.scenarioId)

                      return (
                        <div
                          key={item.scenarioId}
                          className="flex items-start gap-3 rounded-md border p-2.5"
                        >
                          <div className="mt-0.5 shrink-0">
                            {!row ? (
                              <span className="block h-4 w-4 rounded-full border border-dashed border-muted-foreground/50" />
                            ) : row.is_correct ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                            {row ? (
                              <p className="text-xs text-muted-foreground">
                                &ldquo;{row.answer_text}&rdquo;
                                {row.time_taken_seconds > 0 && ` · ${formatTime(row.time_taken_seconds)}`}
                              </p>
                            ) : (
                              <p className="text-xs italic text-muted-foreground">Not attempted</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
