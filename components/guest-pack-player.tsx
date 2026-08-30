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
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Radio,
  Trophy,
  XCircle,
} from "lucide-react"

/** How often the room asks the coach's session which clip it is on. */
const LIVE_POLL_MS = 3000

interface Verdict {
  isCorrect: boolean
  verdict: string
  explanation: string
}

/**
 * A pack answered without an account.
 *
 * Two modes off the same code. On its own it is self-paced: work through the
 * clips in the coach's order and finish whenever. With `sessionCode` it is a
 * live session, and the coach decides which clip is on screen and when the
 * answer appears — the page polls for that rather than holding a socket open.
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

  // Live session state, only meaningful when sessionCode is set.
  const [liveReveal, setLiveReveal] = useState(false)
  const [liveClosed, setLiveClosed] = useState(false)

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

  // Live session: the coach drives, so the clip on screen and whether the
  // answer is showing both come from the server rather than from this page.
  useEffect(() => {
    if (!sessionCode || !token) return

    let cancelled = false

    const poll = async () => {
      try {
        const response = await fetch(`/api/public/live/${sessionCode}`, { cache: "no-store" })
        if (!response.ok) return
        const state = await response.json()
        if (cancelled) return

        setLiveReveal(!!state.reveal)
        setLiveClosed(!state.isOpen)
        setIndex((current) => {
          if (state.currentIndex === current) return current
          // A new clip: clear the previous answer out of the box so nobody
          // submits the last one again.
          setAnswer("")
          setVerdict(null)
          startedAt.current = Date.now()
          return state.currentIndex
        })
      } catch {
        // A dropped poll is not worth surfacing — the next one is 3s away.
      }
    }

    void poll()
    const timer = setInterval(poll, LIVE_POLL_MS)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [sessionCode, token])

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

  // ---- Name gate ---------------------------------------------------------

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
              placeholder="So your coach knows whose answers these are"
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
            Start
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            No account needed. Your answers go to the coach who sent you this link.
          </p>
        </CardContent>
      </Card>
    )
  }

  // ---- Finished ----------------------------------------------------------

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
            Your coach can see your answers. Nothing else to do.
          </p>
          <Button asChild variant="outline">
            <a href="/auth/sign-up">Create an account to keep training</a>
          </Button>
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

  // ---- Playing -----------------------------------------------------------

  // In a live session the coach's reveal is what shows the answer, so a phone
  // that has already submitted waits with everyone else.
  const showVerdict = verdict && (!sessionCode || liveReveal)
  const waitingForCoach = !!verdict && !!sessionCode && !liveReveal

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          <p className="text-xs text-muted-foreground">
            {sessionCode ? `Live · ${name || "you"}` : `Scenario ${index + 1} of ${scenarios.length}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {sessionCode && (
            <Badge variant="outline" className="gap-1 border-primary/40 text-primary">
              <Radio className="h-3 w-3" />
              {liveClosed ? "Session ended" : "Live"}
            </Badge>
          )}
          <Badge className={getDifficultyColor(current.difficulty)}>{current.difficulty}</Badge>
        </div>
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
          ) : waitingForCoach ? (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <p className="font-medium text-foreground">Answer locked in</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Waiting for your coach to reveal the call.
              </p>
            </div>
          ) : (
            showVerdict && (
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

                {/* In a live session the coach moves everyone on together. */}
                {!sessionCode && (
                  <Button onClick={next} className="w-full" size="lg">
                    {index + 1 < scenarios.length ? "Next scenario" : "Finish"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  )
}
