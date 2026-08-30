"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScenarioVideoPlayer } from "@/components/scenario-video-player"
import { categoryLabel } from "@/lib/scenario-categories"
import { Check, Inbox, Loader2, X } from "lucide-react"

interface Submission {
  id: string
  submitterName: string
  video_url: string
  video_credit: string
  suggested_answer: string
  suggested_category: string | null
  note: string | null
  status: string
  review_note: string | null
  created_at: string
}

/**
 * The submission queue.
 *
 * The clip plays here because you cannot judge footage from a description, and
 * the source line is next to it because that is the thing being judged first:
 * whether we may use it at all.
 */
export function SubmissionsReview({
  pending,
  decided,
}: {
  pending: Submission[]
  decided: Submission[]
}) {
  const router = useRouter()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [difficulty, setDifficulty] = useState<Record<string, string>>({})
  const [scenarioType, setScenarioType] = useState<Record<string, string>>({})
  const [error, setError] = useState("")

  const review = async (id: string, action: "approve" | "reject") => {
    setBusyId(id)
    setError("")

    try {
      const response = await fetch("/api/admin/scenario-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: id,
          action,
          note: notes[id]?.trim() || null,
          difficulty: difficulty[id] || "medium",
          scenarioType: scenarioType[id] || "foul",
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Could not save that decision")

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save that decision")
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Card className="border-destructive">
          <CardContent className="py-4 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Pending ({pending.length})</h2>

        {pending.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-10 text-center">
              <Inbox className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Nothing waiting for review.</p>
            </CardContent>
          </Card>
        ) : (
          pending.map((submission) => (
            <Card key={submission.id}>
              <CardContent className="space-y-4 pt-6">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{submission.submitterName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Sent {new Date(submission.created_at).toLocaleDateString("en-AU")}
                    </p>
                  </div>
                  {submission.suggested_category && (
                    <Badge variant="secondary">{categoryLabel(submission.suggested_category)}</Badge>
                  )}
                </div>

                <div className="overflow-hidden rounded-lg border">
                  <ScenarioVideoPlayer url={submission.video_url} autoPlay={false} />
                </div>

                <div className="rounded-lg border bg-muted/40 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Source
                  </p>
                  <p className="text-sm text-foreground">{submission.video_credit}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Suggested answer
                  </p>
                  <p className="whitespace-pre-wrap text-sm text-foreground">
                    {submission.suggested_answer}
                  </p>
                </div>

                {submission.note && (
                  <p className="text-sm text-muted-foreground">&ldquo;{submission.note}&rdquo;</p>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Difficulty</Label>
                    <Select
                      value={difficulty[submission.id] || "medium"}
                      onValueChange={(value) =>
                        setDifficulty({ ...difficulty, [submission.id]: value })
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Type</Label>
                    <Select
                      value={scenarioType[submission.id] || "foul"}
                      onValueChange={(value) =>
                        setScenarioType({ ...scenarioType, [submission.id]: value })
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="foul">Foul</SelectItem>
                        <SelectItem value="offside">Offside</SelectItem>
                        <SelectItem value="handball">Handball</SelectItem>
                        <SelectItem value="misconduct">Misconduct</SelectItem>
                        <SelectItem value="advantage">Advantage</SelectItem>
                        <SelectItem value="penalty">Penalty</SelectItem>
                        <SelectItem value="var">VAR</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    value={notes[submission.id] || ""}
                    onChange={(e) => setNotes({ ...notes, [submission.id]: e.target.value })}
                    placeholder="Note back to the coach (required to reject)"
                    className="min-w-[240px] flex-1"
                    aria-label={`Note for ${submission.submitterName}`}
                  />
                  <Button
                    onClick={() => review(submission.id, "approve")}
                    disabled={busyId === submission.id}
                  >
                    {busyId === submission.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => review(submission.id, "reject")}
                    disabled={busyId === submission.id || !notes[submission.id]?.trim()}
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </section>

      {decided.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Decided ({decided.length})</h2>
          <div className="space-y-2">
            {decided.map((submission) => (
              <Card key={submission.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{submission.submitterName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {submission.review_note || submission.video_credit}
                    </p>
                  </div>
                  <Badge variant={submission.status === "approved" ? "default" : "outline"}>
                    {submission.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
