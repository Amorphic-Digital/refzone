"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { ScenarioVideoPlayer } from "@/components/scenario-video-player"
import { ScenarioVideoCredit } from "@/components/scenario-video-credit"
import type { LivePhase } from "@/lib/live-session"
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  MonitorPlay,
  Play,
  Radio,
  RotateCcw,
  Square,
  Trophy,
  Users,
} from "lucide-react"

/** How often the presenter asks how the room is going. */
const POLL_MS = 2000

interface LiveScenario {
  id: string
  title: string
  video_url: string | null
  video_credit: string | null
  answer: string | null
}

export interface LiveSessionView {
  id: string
  join_code: string
  current_index: number
  phase: LivePhase
  is_open: boolean
  question_seconds: number
  timer_enabled: boolean
  scoring_enabled: boolean
  leaderboard_enabled: boolean
}

interface Counts {
  players: number
  answered: number
  correct: number
  incorrect: number
}

/**
 * The coach's console.
 *
 * Deliberately not the thing you project. An earlier version of this page put
 * the official call permanently on screen under the words "yours only, until
 * you reveal it" — on the one screen in the room everybody can see. The answer
 * now sits behind a peek toggle that is off by default, and the wall gets
 * /present/<packId> instead, which has no controls and no answer on it.
 *
 * The game-show parts are all switches. A Thursday night with juniors wants
 * the timer and the leaderboard; a panel assessment wants the clips and none
 * of the theatre.
 */
export function LiveSessionControl({
  packId,
  packTitle,
  isPublic,
  scenarios,
  session: initialSession,
}: {
  packId: string
  packTitle: string
  isPublic: boolean
  scenarios: LiveScenario[]
  session: LiveSessionView | null
}) {
  const router = useRouter()
  const [isBusy, setIsBusy] = useState(false)
  const [error, setError] = useState("")
  const [peek, setPeek] = useState(false)
  const [counts, setCounts] = useState<Counts | null>(null)
  const [session, setSession] = useState(initialSession)
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)

  const index = session?.current_index ?? 0
  const phase = session?.phase ?? "lobby"
  const current = scenarios[index]
  const isLast = index + 1 >= scenarios.length

  const poll = useCallback(async () => {
    try {
      const response = await fetch(`/api/packs/${packId}/live/state`, { cache: "no-store" })
      if (!response.ok) return
      const data = await response.json()
      if (!data.session) return
      setSession((previous) => (previous ? { ...previous, ...data.session } : previous))
      setCounts(data.counts)
      setSecondsLeft(data.secondsLeft ?? null)
    } catch {
      // A dropped poll is not worth surfacing — the next one is 2s away.
    }
  }, [packId])

  useEffect(() => {
    if (!session) return
    void poll()
    const timer = setInterval(poll, POLL_MS)
    return () => clearInterval(timer)
  }, [session?.id, poll])

  const call = async (method: "POST" | "PATCH", body?: Record<string, unknown>) => {
    setIsBusy(true)
    setError("")
    try {
      const response = await fetch(`/api/packs/${packId}/live`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "That did not work")
      // Moving on hides the last answer again, so stop peeking too — otherwise
      // the next clip opens with the coach already looking at its solution.
      if (body && "currentIndex" in body) setPeek(false)
      router.refresh()
      await poll()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "That did not work")
      return null
    } finally {
      setIsBusy(false)
    }
  }

  /** Optimistic so a switch does not lag a poll behind the finger that flipped it. */
  const setSetting = (patch: Partial<LiveSessionView>, body: Record<string, unknown>) => {
    setSession((previous) => (previous ? { ...previous, ...patch } : previous))
    void call("PATCH", body)
  }

  if (!isPublic) {
    return (
      <Card className="border-dashed">
        <CardContent className="space-y-3 py-12 text-center">
          <Radio className="mx-auto h-10 w-10 text-muted-foreground" />
          <h1 className="font-semibold text-foreground">Turn on the public link first</h1>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            A live session works by having the room answer on their phones without signing in, so
            this pack needs its public link switched on before you can run one.
          </p>
          <Button asChild variant="outline">
            <Link href={`/packs/${packId}/results`}>Pack settings</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!session || !session.is_open) {
    return (
      <Card>
        <CardContent className="space-y-4 py-12 text-center">
          <Radio className="mx-auto h-10 w-10 text-muted-foreground" />
          <div>
            <h1 className="text-xl font-semibold text-foreground">Run {packTitle} live</h1>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              The room joins with a five-character code, answers on their phones, and you decide
              when the call goes up. Put the projector view on the screen and keep this page on
              your own device.
            </p>
          </div>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <Button
            onClick={async () => {
              await call("POST")
              router.refresh()
            }}
            disabled={isBusy}
            size="lg"
          >
            {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Radio className="h-4 w-4" />}
            Open the lobby
          </Button>
        </CardContent>
      </Card>
    )
  }

  const answeredPercent =
    counts && counts.players > 0 ? Math.round((counts.answered / counts.players) * 100) : 0

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Button asChild variant="ghost" size="sm" className="-ml-2 mb-1">
            <Link href={`/packs/${packId}/results`}>
              <ArrowLeft className="h-4 w-4" />
              Results
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-foreground">{packTitle}</h1>
          <p className="text-sm text-muted-foreground">
            Presenter view — this screen is for you, not the wall.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            {/* Its own tab, so it can be dragged to the projector and
                fullscreened while these controls stay put. */}
            <a href={`/present/${packId}`} target="_blank" rel="noopener noreferrer">
              <MonitorPlay className="h-4 w-4" />
              Projector view
            </a>
          </Button>
          <Button variant="outline" onClick={() => call("PATCH", { end: true })} disabled={isBusy}>
            <Square className="h-4 w-4" />
            End session
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="py-3 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      {/* ---- Code and room --------------------------------------------------- */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="border-primary/40">
          <CardContent className="py-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Game PIN</p>
            <p className="font-mono text-3xl font-bold tracking-[0.2em] text-foreground">
              {session.join_code}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2 py-5">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Users className="h-4 w-4" />
                {phase === "lobby" ? "In the lobby" : "Answers in"}
              </p>
              <p className="text-sm tabular-nums text-muted-foreground">
                {counts
                  ? phase === "lobby"
                    ? counts.players
                    : `${counts.answered} of ${counts.players}`
                  : "—"}
                {session.timer_enabled && phase === "question" && secondsLeft !== null && (
                  <span className="ml-3 font-mono font-semibold text-foreground">{secondsLeft}s</span>
                )}
              </p>
            </div>
            {phase !== "lobby" && <Progress value={answeredPercent} className="h-2" />}
            <p className="text-xs text-muted-foreground">
              {counts && counts.players === 0
                ? "Nobody has joined yet."
                : phase === "lobby"
                  ? "Start when the room has settled."
                  : counts && counts.answered >= counts.players
                    ? "Everyone has had a go — safe to reveal."
                    : "Waiting on the room."}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ---- Settings -------------------------------------------------------- */}
      <Card>
        <CardContent className="grid gap-4 pt-6 sm:grid-cols-3">
          <Setting
            label="Timer"
            hint={
              session.timer_enabled
                ? "Counts down on the wall and closes answers."
                : "Answers stay open until you reveal."
            }
            checked={session.timer_enabled}
            onChange={(next) => setSetting({ timer_enabled: next }, { timerEnabled: next })}
          >
            {session.timer_enabled && (
              <div className="flex items-center gap-2 pt-1">
                <Label htmlFor="question-seconds" className="text-xs text-muted-foreground">
                  Seconds
                </Label>
                <Input
                  id="question-seconds"
                  type="number"
                  min={15}
                  max={600}
                  defaultValue={session.question_seconds}
                  onBlur={(e) => {
                    const value = Number(e.target.value)
                    if (value && value !== session.question_seconds) {
                      setSetting({ question_seconds: value }, { questionSeconds: value })
                    }
                  }}
                  className="h-7 w-20 text-xs"
                />
              </div>
            )}
          </Setting>

          <Setting
            label="Points"
            hint={
              session.scoring_enabled
                ? "Right answers score, faster scores more."
                : "Right or wrong only, no score."
            }
            checked={session.scoring_enabled}
            onChange={(next) => setSetting({ scoring_enabled: next }, { scoringEnabled: next })}
          />

          <Setting
            label="Leaderboard"
            hint={
              session.leaderboard_enabled
                ? "Standings between clips and at the end."
                : "Nobody is ranked in front of the room."
            }
            checked={session.leaderboard_enabled}
            onChange={(next) =>
              setSetting({ leaderboard_enabled: next }, { leaderboardEnabled: next })
            }
          />
        </CardContent>
      </Card>

      {/* ---- The clip and the controls --------------------------------------- */}
      {current ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-foreground">{current.title}</h2>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="capitalize">
                  {phase}
                </Badge>
                <Badge variant="outline">
                  {index + 1} of {scenarios.length}
                </Badge>
              </div>
            </div>

            {current.video_credit && <ScenarioVideoCredit credit={current.video_credit} />}

            {current.video_url && (
              <div className="overflow-hidden rounded-lg border-2 border-border">
                <ScenarioVideoPlayer url={current.video_url} key={current.id} autoPlay={false} />
              </div>
            )}

            {/* Off by default. A coach who has this page mirrored to the wall by
                accident should not have given the answer away by opening it. */}
            <div className="rounded-lg border bg-muted/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  The official call
                </p>
                <Button variant="ghost" size="sm" onClick={() => setPeek(!peek)}>
                  {peek ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {peek ? "Hide" : "Show me"}
                </Button>
              </div>
              {peek ? (
                <p className="mt-2 text-sm text-foreground">
                  {current.answer || "No answer recorded."}
                </p>
              ) : (
                <p className="mt-2 text-sm italic text-muted-foreground">
                  Hidden. This only shows it to you — the room sees it when you reveal.
                </p>
              )}
            </div>

            {phase === "reveal" && counts && (
              <div className="flex flex-wrap items-center gap-4 rounded-lg border border-primary/40 bg-primary/5 p-4 text-sm">
                <span className="font-medium text-foreground">The room can see the answer</span>
                <span className="text-muted-foreground">
                  {counts.correct} right · {counts.incorrect} wrong
                </span>
              </div>
            )}

            <PhaseControls
              phase={phase}
              index={index}
              isLast={isLast}
              isBusy={isBusy}
              leaderboardOn={session.leaderboard_enabled}
              onPhase={(next) => call("PATCH", { phase: next })}
              onIndex={(next) => call("PATCH", { currentIndex: next, phase: "question" })}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="space-y-3 py-12 text-center">
            <Trophy className="mx-auto h-10 w-10 text-yellow-500" />
            <p className="text-sm text-muted-foreground">
              That is every clip in this pack.{" "}
              {session.leaderboard_enabled
                ? "Show the final scores, then end the session."
                : "End the session when you are done."}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {session.leaderboard_enabled && (
                <Button onClick={() => call("PATCH", { phase: "leaderboard" })} disabled={isBusy}>
                  <Trophy className="h-4 w-4" />
                  Final scores
                </Button>
              )}
              <Button variant="outline" onClick={() => call("PATCH", { end: true })} disabled={isBusy}>
                <Square className="h-4 w-4" />
                End session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

/** One switch plus the sentence that says what turning it off actually does. */
function Setting({
  label,
  hint,
  checked,
  onChange,
  children,
}: {
  label: string
  hint: string
  checked: boolean
  onChange: (next: boolean) => void
  children?: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
      </div>
      <p className="text-xs text-muted-foreground">{hint}</p>
      {children}
    </div>
  )
}

/**
 * One primary button per phase, because in front of a room the coach should
 * never have to work out which of five controls comes next.
 */
function PhaseControls({
  phase,
  index,
  isLast,
  isBusy,
  leaderboardOn,
  onPhase,
  onIndex,
}: {
  phase: LivePhase
  index: number
  isLast: boolean
  isBusy: boolean
  leaderboardOn: boolean
  onPhase: (phase: LivePhase) => void
  onIndex: (index: number) => void
}) {
  const spinner = isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : null

  if (phase === "lobby") {
    return (
      <Button onClick={() => onPhase("question")} disabled={isBusy} size="lg" className="w-full">
        {spinner ?? <Play className="h-4 w-4" />}
        Start the first clip
      </Button>
    )
  }

  if (phase === "question") {
    return (
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => onPhase("reveal")} disabled={isBusy} size="lg" className="flex-1">
          {spinner ?? <Eye className="h-4 w-4" />}
          Reveal the call
        </Button>
        <Button variant="outline" onClick={() => onPhase("question")} disabled={isBusy}>
          <RotateCcw className="h-4 w-4" />
          Restart clock
        </Button>
      </div>
    )
  }

  if (phase === "reveal") {
    return (
      <div className="flex flex-wrap gap-2">
        {leaderboardOn && (
          <Button variant="outline" onClick={() => onPhase("leaderboard")} disabled={isBusy}>
            <Trophy className="h-4 w-4" />
            Scores
          </Button>
        )}
        {index > 0 && (
          <Button variant="outline" onClick={() => onIndex(index - 1)} disabled={isBusy}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        )}
        {isLast ? (
          <Button onClick={() => onPhase("ended")} disabled={isBusy} className="flex-1">
            {spinner ?? <Square className="h-4 w-4" />}
            Finish
          </Button>
        ) : (
          <Button onClick={() => onIndex(index + 1)} disabled={isBusy} size="lg" className="flex-1">
            {spinner ?? <ArrowRight className="h-4 w-4" />}
            Next clip
          </Button>
        )}
      </div>
    )
  }

  // leaderboard, or a session already ended
  return (
    <div className="flex flex-wrap gap-2">
      {!isLast && (
        <Button onClick={() => onIndex(index + 1)} disabled={isBusy} size="lg" className="flex-1">
          {spinner ?? <ArrowRight className="h-4 w-4" />}
          Next clip
        </Button>
      )}
      <Button variant="outline" onClick={() => onPhase("ended")} disabled={isBusy}>
        <Square className="h-4 w-4" />
        Finish
      </Button>
    </div>
  )
}
