"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatTime } from "@/lib/shared-utils"
import {
  CalendarClock,
  CheckCircle2,
  Copy,
  Download,
  Gavel,
  Loader2,
  Radio,
  Scale,
  Users,
  XCircle,
} from "lucide-react"

interface Answer {
  scenarioId: string
  answerText: string | null
  isCorrect: boolean
  modelCorrect: boolean
  overridden: boolean
  coachNote: string | null
  timeTakenSeconds: number
  source: "member" | "guest"
  rowId: string
}

interface ResultsData {
  items: { scenarioId: string; title: string; lawCategory: string | null }[]
  participants: {
    key: string
    name: string
    isGuest: boolean
    answered: number
    correct: number
    accuracy: number
    answers: Answer[]
  }[]
  lawStats: { law: string; attempts: number; correct: number; accuracy: number }[]
  hardest: { scenarioId: string; title: string; attempts: number; accuracy: number | null }[]
}

/**
 * Everything a coach does with a pack once people have answered it.
 *
 * The three things this exists to make possible, in order of how often they
 * matter: read what people actually wrote and correct the machine where it got
 * it wrong; see the group's weakness by law rather than by clip, which is what
 * plans next week; and get the whole lot out as a spreadsheet, because
 * associations ask for one.
 */
export function PackResultsView({
  packId,
  shareCode,
  isPublic,
  collectName,
  results,
  groups,
  assignments,
  liveCode,
}: {
  packId: string
  shareCode: string
  isPublic: boolean
  collectName: boolean
  results: ResultsData
  groups: { id: string; name: string }[]
  assignments: { groupId: string; dueAt: string | null }[]
  liveCode: string | null
}) {
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)

  const [assignGroup, setAssignGroup] = useState("")
  const [dueAt, setDueAt] = useState("")

  const publicUrl =
    typeof window !== "undefined" ? `${window.location.origin}/p/${shareCode}` : `/p/${shareCode}`

  const call = async (key: string, url: string, init: RequestInit) => {
    setBusy(key)
    setError("")
    try {
      const response = await fetch(url, init)
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || "That did not work")
      router.refresh()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "That did not work")
      return null
    } finally {
      setBusy(null)
    }
  }

  const setPublic = (next: boolean) =>
    call("public", `/api/packs/${packId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic: next }),
    })

  const setCollectName = (next: boolean) =>
    call("collect", `/api/packs/${packId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collectName: next }),
    })

  const assign = () =>
    call("assign", `/api/packs/${packId}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId: assignGroup, dueAt: dueAt || null }),
    })

  const duplicate = async () => {
    const data = await call("duplicate", `/api/packs/${packId}/duplicate`, { method: "POST" })
    if (data?.id) router.push(`/packs/${data.id}/results`)
  }

  const review = (answer: Answer, isCorrect: boolean | null) =>
    call(answer.rowId, `/api/packs/${packId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rowId: answer.rowId,
        source: answer.source,
        isCorrect,
        note: notes[answer.rowId] ?? answer.coachNote ?? "",
      }),
    })

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError("Could not copy — select the link and copy it by hand.")
    }
  }

  const titleById = new Map(results.items.map((item) => [item.scenarioId, item.title]))

  return (
    <div className="space-y-6">
      {error && (
        <Card className="border-destructive">
          <CardContent className="py-3 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      {/* ---- Sharing and settings ---------------------------------------- */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-foreground">Share with anyone</h2>
              <p className="max-w-lg text-sm text-muted-foreground">
                Turn this on and the pack becomes a quiz anybody can answer from the link — no
                account, no sign-in. This is the one to send a whole branch.
              </p>
            </div>
            <Switch
              checked={isPublic}
              onCheckedChange={setPublic}
              disabled={busy === "public"}
              aria-label="Allow anyone with the link to answer"
            />
          </div>

          {isPublic && (
            <>
              <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 p-3">
                <code className="min-w-0 flex-1 truncate text-sm text-foreground">{publicUrl}</code>
                <Button variant="outline" size="sm" onClick={copyLink}>
                  {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Ask for a name</p>
                  <p className="text-sm text-muted-foreground">
                    Off, everyone shows up here as &ldquo;Guest&rdquo;.
                  </p>
                </div>
                <Switch
                  checked={collectName}
                  onCheckedChange={setCollectName}
                  disabled={busy === "collect"}
                  aria-label="Ask guests for their name"
                />
              </div>

              <div className="flex flex-wrap gap-2 border-t pt-4">
                <Button asChild variant={liveCode ? "default" : "outline"}>
                  <Link href={`/packs/${packId}/live`}>
                    <Radio className="h-4 w-4" />
                    {liveCode ? `Live session · ${liveCode}` : "Run it live"}
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <a href={`/api/packs/${packId}/export`}>
                    <Download className="h-4 w-4" />
                    Export CSV
                  </a>
                </Button>
                <Button variant="outline" onClick={duplicate} disabled={busy === "duplicate"}>
                  {busy === "duplicate" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />}
                  Duplicate pack
                </Button>
              </div>
            </>
          )}

          {!isPublic && (
            <div className="flex flex-wrap gap-2 border-t pt-4">
              <Button asChild variant="outline">
                <a href={`/api/packs/${packId}/export`}>
                  <Download className="h-4 w-4" />
                  Export CSV
                </a>
              </Button>
              <Button variant="outline" onClick={duplicate} disabled={busy === "duplicate"}>
                {busy === "duplicate" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />}
                Duplicate pack
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ---- Assignment --------------------------------------------------- */}
      {groups.length > 0 && (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div>
              <h2 className="flex items-center gap-2 font-semibold text-foreground">
                <CalendarClock className="h-4 w-4" />
                Set it as homework
              </h2>
              <p className="text-sm text-muted-foreground">
                Everyone in the group gets a notification now, and anyone who has not finished gets
                one more the day before it is due.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={assignGroup} onValueChange={setAssignGroup}>
                <SelectTrigger className="w-[220px]" aria-label="Group">
                  <SelectValue placeholder="Pick a group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Label htmlFor="due-at" className="text-sm text-muted-foreground">
                  Due
                </Label>
                <Input
                  id="due-at"
                  type="date"
                  value={dueAt}
                  onChange={(e) => setDueAt(e.target.value)}
                  className="w-[160px]"
                />
              </div>

              <Button onClick={assign} disabled={!assignGroup || busy === "assign"}>
                {busy === "assign" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Assign
              </Button>
            </div>

            {assignments.length > 0 && (
              <div className="flex flex-wrap gap-2 border-t pt-3">
                {assignments.map((assignment) => {
                  const group = groups.find((g) => g.id === assignment.groupId)
                  return (
                    <Badge key={assignment.groupId} variant="secondary">
                      {group?.name || "Group"}
                      {assignment.dueAt
                        ? ` · due ${new Date(assignment.dueAt).toLocaleDateString("en-AU")}`
                        : ""}
                    </Badge>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {results.participants.length === 0 ? (
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
          {/* ---- By law: what to run next week --------------------------- */}
          {results.lawStats.length > 0 && (
            <Card>
              <CardContent className="space-y-3 pt-6">
                <h2 className="flex items-center gap-2 font-semibold text-foreground">
                  <Scale className="h-4 w-4" />
                  Where the group is weakest
                </h2>
                <p className="text-sm text-muted-foreground">
                  The same answers, rolled up by law rather than by clip. Worst first.
                </p>
                <div className="space-y-2 pt-1">
                  {results.lawStats.map((stat) => (
                    <div key={stat.law} className="flex items-center gap-3">
                      <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                        {stat.law}
                      </span>
                      <Progress value={stat.accuracy} className="h-1.5 w-24 shrink-0" />
                      <span className="w-24 shrink-0 text-right text-xs text-muted-foreground">
                        {stat.accuracy}% of {stat.attempts}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {results.hardest.length > 0 && (
            <Card>
              <CardContent className="space-y-3 pt-6">
                <h2 className="font-semibold text-foreground">Worth reviewing together</h2>
                <div className="space-y-2">
                  {results.hardest.map((scenario) => (
                    <div key={scenario.scenarioId} className="flex items-center gap-3">
                      <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                        {scenario.title}
                      </span>
                      <Progress value={scenario.accuracy ?? 0} className="h-1.5 w-24 shrink-0" />
                      <span className="w-24 shrink-0 text-right text-xs text-muted-foreground">
                        {scenario.accuracy}% of {scenario.attempts}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ---- Per person, with the answers readable ------------------- */}
          <div className="space-y-4">
            {results.participants.map((participant) => (
              <Card key={participant.key}>
                <CardContent className="space-y-3 pt-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{participant.name}</h3>
                      {participant.isGuest && (
                        <Badge variant="outline" className="text-xs">
                          no account
                        </Badge>
                      )}
                      <Badge variant={participant.accuracy >= 70 ? "secondary" : "outline"}>
                        {participant.accuracy}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {participant.answered} of {results.items.length} answered ·{" "}
                      {participant.correct} correct
                    </p>
                  </div>

                  <div className="space-y-2">
                    {participant.answers.map((answer) => (
                      <div key={answer.rowId} className="rounded-md border p-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 shrink-0">
                            {answer.isCorrect ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-medium text-foreground">
                                {titleById.get(answer.scenarioId) || "Scenario"}
                              </p>
                              {answer.overridden && (
                                <Badge variant="outline" className="gap-1 text-xs">
                                  <Gavel className="h-3 w-3" />
                                  your call, not the AI&rsquo;s
                                </Badge>
                              )}
                            </div>
                            <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                              &ldquo;{answer.answerText}&rdquo;
                              {answer.timeTakenSeconds > 0 &&
                                ` · ${formatTime(answer.timeTakenSeconds)}`}
                            </p>
                            {answer.coachNote && (
                              <p className="mt-1 text-sm text-foreground">
                                <span className="font-medium">Your note:</span> {answer.coachNote}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* The point of a coach reading these: correcting the
                            machine, and saying why. */}
                        <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
                          <Input
                            value={notes[answer.rowId] ?? answer.coachNote ?? ""}
                            onChange={(e) =>
                              setNotes({ ...notes, [answer.rowId]: e.target.value })
                            }
                            placeholder="Note back to them (optional)"
                            className="h-8 min-w-[200px] flex-1 text-xs"
                            aria-label="Note back to the referee"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8"
                            onClick={() => review(answer, true)}
                            disabled={busy === answer.rowId}
                          >
                            Mark correct
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8"
                            onClick={() => review(answer, false)}
                            disabled={busy === answer.rowId}
                          >
                            Mark wrong
                          </Button>
                          {answer.overridden && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8"
                              onClick={() => review(answer, null)}
                              disabled={busy === answer.rowId}
                            >
                              Undo
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
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
