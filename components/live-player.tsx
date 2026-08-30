"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScenarioVideoPlayer } from "@/components/scenario-video-player"
import { ScenarioVideoCredit } from "@/components/scenario-video-credit"
import type { PublicScenario } from "@/lib/public-pack"
import { CheckCircle2, Loader2, Radio, Trophy, XCircle } from "lucide-react"

/** Fast enough that the countdown does not visibly stutter on a phone. */
const POLL_MS = 1500

interface GameState {
  phase: "lobby" | "question" | "reveal" | "leaderboard" | "ended"
  isOpen: boolean
  currentIndex: number
  total: number
  players: number
  answered: number
  secondsLeft: number | null
  questionSeconds: number
  timer: boolean
  scoring: boolean
  leaderboardOn: boolean
  officialAnswer?: string | null
  spread?: { correct: number; incorrect: number }
  leaderboard?: { position: number; name: string; score: number }[]
  you?: { position: number; of: number; score: number; name: string } | null
  yourAnswer?: { isCorrect: boolean; points: number } | null
}

/**
 * The phone, during a live session.
 *
 * The coach drives; this follows. One thing on screen at a time, thumb-sized
 * targets, and nothing to read while a clip is playing — everybody here is
 * looking at the projector, not at this.
 *
 * The self-paced version of a public pack is a different component
 * (guest-pack-player): there the referee is alone and in charge of the pace,
 * which is a genuinely different screen rather than this one with the buttons
 * hidden.
 */
export function LivePlayer({
  code,
  sessionCode,
  token,
  attemptId,
  name,
  signedIn,
  scenarios,
}: {
  code: string
  sessionCode: string
  token: string
  attemptId: string
  name: string
  /** Answers also credit their profile, and they should know that. */
  signedIn: boolean
  scenarios: PublicScenario[]
}) {
  const [state, setState] = useState<GameState | null>(null)
  const [answer, setAnswer] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState("")

  // Which clip the answer box currently belongs to, so moving on clears it.
  const answeringIndex = useRef<number | null>(null)

  const poll = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/public/live/${sessionCode}?attempt=${encodeURIComponent(attemptId)}`,
        { cache: "no-store" },
      )
      if (!response.ok) return
      const next: GameState = await response.json()

      setState(next)
      if (next.phase === "question" && answeringIndex.current !== next.currentIndex) {
        answeringIndex.current = next.currentIndex
        setAnswer("")
        setSubmitted(false)
        setError("")
      }
    } catch {
      // Dropped poll; the next one is a moment away.
    }
  }, [sessionCode, attemptId])

  useEffect(() => {
    void poll()
    const timer = setInterval(poll, POLL_MS)
    return () => clearInterval(timer)
  }, [poll])

  const submit = async () => {
    const current = state && scenarios[state.currentIndex]
    if (!current || !answer.trim()) return

    setIsSending(true)
    setError("")

    try {
      const response = await fetch(`/api/public/pack/${code}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, scenarioId: current.id, answerText: answer }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Could not send your answer")

      setSubmitted(true)
      void poll()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your answer")
    } finally {
      setIsSending(false)
    }
  }

  if (!state) {
    return (
      <Card>
        <CardContent className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  const current = scenarios[state.currentIndex]

  const Header = (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <Badge variant="outline" className="gap-1 border-primary/40 text-primary">
        <Radio className="h-3 w-3" />
        Live
      </Badge>
      <span className="text-sm text-muted-foreground">
        {name}
        {signedIn && <span className="ml-2 text-xs text-primary">counting towards your training</span>}
      </span>
    </div>
  )

  // ---- Lobby ---------------------------------------------------------------
  if (state.phase === "lobby") {
    return (
      <div>
        {Header}
        <Card>
          <CardContent className="space-y-3 py-16 text-center">
            <h1 className="text-2xl font-bold text-foreground">You are in</h1>
            <p className="text-muted-foreground">
              Look up at the screen. It starts when your coach says so.
            </p>
            <p className="text-sm text-muted-foreground">
              {state.players} {state.players === 1 ? "referee" : "referees"} here
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ---- Ended ---------------------------------------------------------------
  if (state.phase === "ended" || !state.isOpen) {
    return (
      <div>
        {Header}
        <Card>
          <CardContent className="space-y-4 py-16 text-center">
            <Trophy className="mx-auto h-12 w-12 text-yellow-500" />
            <h1 className="text-2xl font-bold text-foreground">That is the session</h1>
            {state.you && state.leaderboardOn && (
              <p className="text-muted-foreground">
                You finished {ordinal(state.you.position)} of {state.you.of}
                {state.scoring ? ` on ${state.you.score} points` : ""}.
              </p>
            )}
            {signedIn ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Every clip you judged tonight is on your record.
                </p>
                <Button asChild variant="outline">
                  <a href="/dashboard">Back to your dashboard</a>
                </Button>
              </>
            ) : (
              <Button asChild variant="outline">
                <a href="/auth/sign-up">Create an account to keep training</a>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // ---- Leaderboard ---------------------------------------------------------
  if (state.phase === "leaderboard") {
    return (
      <div>
        {Header}
        <Card>
          <CardContent className="space-y-4 pt-6">
            <h1 className="flex items-center gap-2 text-xl font-bold text-foreground">
              <Trophy className="h-5 w-5 text-yellow-500" />
              {state.leaderboardOn ? "Standings" : "Next clip coming up"}
            </h1>

            {state.leaderboardOn && state.you && (
              <div className="rounded-lg border border-primary/40 bg-primary/5 p-4 text-center">
                <p className="text-3xl font-black text-foreground">
                  {ordinal(state.you.position)}
                </p>
                <p className="text-sm text-muted-foreground">
                  of {state.you.of}
                  {state.scoring ? ` · ${state.you.score} points` : ""}
                </p>
              </div>
            )}

            {state.leaderboardOn && (
              <div className="space-y-2">
                {(state.leaderboard || []).map((row) => (
                  <div
                    key={`${row.position}-${row.name}`}
                    className="flex items-center gap-3 rounded-md border p-2.5"
                  >
                    <span className="w-6 shrink-0 text-sm font-bold text-muted-foreground">
                      {row.position}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                      {row.name}
                    </span>
                    <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
                      {row.score}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // ---- Reveal --------------------------------------------------------------
  if (state.phase === "reveal") {
    const mine = state.yourAnswer

    return (
      <div>
        {Header}
        <Card>
          <CardContent className="space-y-4 pt-6">
            {mine ? (
              <div
                className={`flex items-start gap-3 rounded-lg border p-4 ${
                  mine.isCorrect
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : "border-red-500/40 bg-red-500/5"
                }`}
              >
                {mine.isCorrect ? (
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-500" />
                ) : (
                  <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-red-500" />
                )}
                <div>
                  <p className="text-lg font-bold text-foreground">
                    {mine.isCorrect ? "That is the call" : "Not this time"}
                  </p>
                  {state.scoring && mine.points > 0 && (
                    <p className="text-sm text-muted-foreground">+{mine.points} points</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-4 text-center">
                <p className="text-sm text-muted-foreground">You did not answer this one.</p>
              </div>
            )}

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                The correct call
              </p>
              <p className="mt-1 text-base text-foreground">
                {state.officialAnswer || "No answer recorded for this clip."}
              </p>
            </div>

            {state.spread && (
              <p className="text-sm text-muted-foreground">
                {state.spread.correct} got it right, {state.spread.incorrect} did not.
              </p>
            )}

            {state.leaderboardOn && state.you && (
              <p className="text-sm text-muted-foreground">
                You are {ordinal(state.you.position)} of {state.you.of}
                {state.scoring ? ` on ${state.you.score}` : ""}.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // ---- Question ------------------------------------------------------------
  const left = state.secondsLeft ?? 0
  const urgent = state.timer && left <= 10

  return (
    <div>
      {Header}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">
              Clip {state.currentIndex + 1} of {state.total}
            </span>
            {state.timer && (
              <span
                className={`font-mono text-2xl font-black tabular-nums ${
                  urgent ? "text-red-500" : "text-foreground"
                }`}
              >
                {left}s
              </span>
            )}
          </div>

          {current?.video_credit && <ScenarioVideoCredit credit={current.video_credit} />}

          {current?.video_url && (
            <div className="overflow-hidden rounded-lg border-2 border-border">
              <ScenarioVideoPlayer url={current.video_url} key={current.id} autoPlay={false} />
            </div>
          )}

          {submitted ? (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <CheckCircle2 className="mx-auto mb-2 h-7 w-7 text-emerald-500" />
              <p className="font-medium text-foreground">Answer locked in</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {state.answered} of {state.players} in. Eyes up.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={4}
                placeholder="What would you call? Any card?"
                className="resize-none text-base"
                autoFocus
              />
              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
              <Button
                onClick={submit}
                disabled={!answer.trim() || isSending}
                className="w-full"
                size="lg"
              >
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Lock it in
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function ordinal(n: number): string {
  const rest = n % 100
  if (rest >= 11 && rest <= 13) return `${n}th`
  return `${n}${["th", "st", "nd", "rd"][n % 10] || "th"}`
}
