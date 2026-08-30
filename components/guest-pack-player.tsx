"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScenarioVideoPlayer } from "@/components/scenario-video-player"
import { ScenarioVideoCredit } from "@/components/scenario-video-credit"
import { getDifficultyColor } from "@/lib/shared-utils"
import type { PublicScenario } from "@/lib/public-pack"
import { LivePlayer } from "@/components/live-player"
import { ArrowRight, CheckCircle2, Loader2, Radio, Trophy, XCircle } from "lucide-react"

interface Verdict {
  isCorrect: boolean
  verdict: string
  explanation: string
}

/**
 * A pack answered without an account.
 *
 * Handles joining — the name, the attempt, the token — and then splits. On its
 * own this is self-paced: work through the clips in the coach's order and
 * finish whenever. With `sessionCode` the coach is running the room, and that
 * is a genuinely different screen rather than this one with buttons hidden, so
 * it hands over to LivePlayer.
 *
 * The token in localStorage is what makes a refresh continue the same attempt
 * rather than starting a second one under the same name.
 */
export function GuestPackPlayer({
  code,
  title,
  description,
  collectName,
  sessionCode,
}: {
  code: string
  title: string
  description: string | null
  collectName: boolean
  sessionCode: string | null
}) {
  const storageKey = `refzone.pack.${code}`

  const [token, setToken] = useState<string | null>(null)
  const [attemptId, setAttemptId] = useState("")
  // Whether the person answering has an account. Only known after starting —
  // /p is outside Clerk so the page itself cannot tell.
  const [signedIn, setSignedIn] = useState(false)
  const [name, setName] = useState("")
  const [scenarios, setScenarios] = useState<PublicScenario[]>([])
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState("")
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [results, setResults] = useState<Record<string, boolean>>({})
  const [isStarting, setIsStarting] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [finished, setFinished] = useState(false)
  const [error, setError] = useState("")

  const startedAt = useRef(Date.now())

  const start = useCallback(
    async (displayName: string | null, existing: string | null) => {
      setIsStarting(true)
      setError("")

      try {
        const response = await fetch(`/api/public/pack/${code}/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ displayName, token: existing, sessionCode }),
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error || "Could not start")

        setToken(data.token)
        setAttemptId(data.attemptId || "")
        setSignedIn(!!data.signedIn)
        setScenarios(data.scenarios || [])
        if (data.displayName) setName(data.displayName)
        setResults(
          Object.fromEntries(
            (data.answered || []).map((row: { scenarioId: string; isCorrect: boolean }) => [
              row.scenarioId,
              row.isCorrect,
            ]),
          ),
        )

        try {
          localStorage.setItem(storageKey, data.token)
        } catch {
          // Private browsing. The attempt still works, it just will not resume.
        }

        // Claim it for this account if there is one. The pack routes run
        // outside Clerk, so this is the only place that can tell — and a 401
        // simply means a genuine guest, which is most of the room.
        void fetch("/api/pack-attempt/link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, token: data.token }),
        })
          .then((res) => (res.ok ? res.json() : null))
          .then((linked) => {
            if (!linked?.signedIn) return
            setSignedIn(true)
            if (linked.displayName && !displayName) setName(linked.displayName)
          })
          .catch(() => {
            // No account, or Clerk is unreachable. Either way they answer as a
            // guest and the coach still sees everything.
          })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not start")
      } finally {
        setIsStarting(false)
      }
    },
    [code, sessionCode, storageKey],
  )

  // A token from a previous visit resumes silently — being asked for your name
  // again after a dropped connection mid-session is the annoying case.
  useEffect(() => {
    let saved: string | null = null
    try {
      saved = localStorage.getItem(storageKey)
    } catch {
      saved = null
    }
    if (saved) void start(null, saved)
    else if (!collectName) void start(null, null)
  }, [collectName, start, storageKey])

  const current = scenarios[index]

  const submit = async () => {
    if (!current || !answer.trim() || !token) return

    setIsChecking(true)
    setError("")

    try {
      const response = await fetch(`/api/public/pack/${code}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          scenarioId: current.id,
          answerText: answer,
          timeTakenSeconds: Math.round((Date.now() - startedAt.current) / 1000),
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Could not check your answer")

      setVerdict(data)
      setResults((previous) => ({ ...previous, [current.id]: data.isCorrect }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not check your answer")
    } finally {
      setIsChecking(false)
    }
  }

  const next = async () => {
    setAnswer("")
    setVerdict(null)
    startedAt.current = Date.now()

    if (index + 1 < scenarios.length) {
      setIndex(index + 1)
      return
    }

    setFinished(true)
    try {
      await fetch(`/api/public/pack/${code}/finish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
    } catch {
      // Finishing is bookkeeping for the coach's view; the answers are already in.
    }
  }

  // ---- Name gate -----------------------------------------------------------

  if (!token) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="space-y-4 pt-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          </div>

          {sessionCode && (
            <Badge variant="outline" className="gap-1 border-primary/40 text-primary">
              <Radio className="h-3 w-3" />
              Live session
            </Badge>
          )}

          <div className="space-y-2">
            <Label htmlFor="guest-name">Your name</Label>
            <Input
              id="guest-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && name.trim() && start(name, null)}
              placeholder={
                sessionCode ? "This is what the room sees" : "So your coach knows whose these are"
              }
              autoFocus
            />
          </div>

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          <Button
            onClick={() => start(name, null)}
            disabled={isStarting || (collectName && !name.trim())}
            className="w-full"
            size="lg"
          >
            {isStarting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {sessionCode ? "Join" : "Start"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            No account needed. Your answers go to the coach who sent you this link.
          </p>
        </CardContent>
      </Card>
    )
  }

  // ---- In a room -----------------------------------------------------------

  // The coach sets the pace from here on, so nothing below this applies.
  if (sessionCode) {
    return (
      <LivePlayer
        code={code}
        sessionCode={sessionCode}
        token={token}
        attemptId={attemptId}
        name={name}
        signedIn={signedIn}
        scenarios={scenarios}
      />
    )
  }

  // ---- Self-paced ----------------------------------------------------------

  const answered = Object.keys(results).length
  const correct = Object.values(results).filter(Boolean).length

  if (finished || (!current && scenarios.length > 0)) {
    return (
      <Card className="mx-auto max-w-md text-center">
        <CardContent className="space-y-4 py-12">
          <Trophy className="mx-auto h-12 w-12 text-yellow-500" />
          <h1 className="text-2xl font-bold text-foreground">That is the lot</h1>
          <p className="text-muted-foreground">
            {correct} of {answered} decisions matched the official call.
          </p>
          <p className="text-sm text-muted-foreground">
            {signedIn
              ? "These count towards your training — points, streak and all."
              : "Your coach can see your answers. Nothing else to do."}
          </p>
          {signedIn ? (
            <Button asChild variant="outline">
              <a href="/dashboard">Back to your dashboard</a>
            </Button>
          ) : (
            <Button asChild variant="outline">
              <a href="/auth/sign-up">Create an account to keep training</a>
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  if (scenarios.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          {isStarting ? "Loading…" : "This pack has no scenarios in it yet."}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          <p className="text-xs text-muted-foreground">
            Scenario {index + 1} of {scenarios.length}
          </p>
        </div>
        <Badge className={getDifficultyColor(current.difficulty)}>{current.difficulty}</Badge>
      </div>

      <Card>
        <CardContent className="space-y-5 pt-6">
          <h2 className="text-lg font-semibold text-foreground">{current.title}</h2>

          {current.video_credit && <ScenarioVideoCredit credit={current.video_credit} />}

          {current.video_url && (
            <div className="overflow-hidden rounded-lg border-2 border-border">
              <ScenarioVideoPlayer url={current.video_url} key={current.id} />
            </div>
          )}

          {!verdict ? (
            <div className="space-y-3">
              <Label htmlFor="guest-answer">Your decision</Label>
              <Textarea
                id="guest-answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={4}
                placeholder="What would you call? Explain your decision and any cards you would show…"
                className="resize-none"
              />
              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
              <Button
                onClick={submit}
                disabled={!answer.trim() || isChecking}
                className="w-full"
                size="lg"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking…
                  </>
                ) : (
                  "Submit decision"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                className={`flex items-start gap-3 rounded-lg border p-4 ${
                  verdict.isCorrect
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : "border-red-500/40 bg-red-500/5"
                }`}
              >
                {verdict.isCorrect ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                ) : (
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                )}
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">
                    {verdict.isCorrect ? "That matches the official call" : "Not the official call"}
                  </p>
                  {verdict.verdict && (
                    <p className="text-sm font-medium text-foreground">{verdict.verdict}</p>
                  )}
                  {verdict.explanation && (
                    <p className="text-sm text-muted-foreground">{verdict.explanation}</p>
                  )}
                </div>
              </div>

              <Button onClick={next} className="w-full" size="lg">
                {index + 1 < scenarios.length ? "Next scenario" : "Finish"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
