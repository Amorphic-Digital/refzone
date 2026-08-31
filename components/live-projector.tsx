"use client"

import { useCallback, useEffect, useState } from "react"
import { ScenarioVideoPlayer } from "@/components/scenario-video-player"
import { Loader2, Radio, Trophy, Users } from "lucide-react"

/** Fast enough that the countdown on the wall does not visibly stutter. */
const POLL_MS = 1000

interface ProjectorScenario {
  id: string
  title: string
  video_url: string | null
  video_credit: string | null
}

interface GameState {
  phase: "lobby" | "question" | "reveal" | "leaderboard" | "ended"
  currentIndex: number
  total: number
  players: number
  answered: number
  secondsLeft: number | null
  questionSeconds: number
  timer: boolean
  scoring: boolean
  leaderboardOn: boolean
  playerNames?: string[]
  officialAnswer?: string | null
  spread?: { correct: number; incorrect: number }
  leaderboard?: { position: number; name: string; score: number }[]
}

const MEDAL = ["bg-yellow-400 text-black", "bg-slate-300 text-black", "bg-amber-600 text-white"]

/**
 * The screen at the front of the room.
 *
 * Everything here is sized to be read from the back of a hall, which is the
 * only real constraint: one idea per phase, nothing that needs a second look.
 * It polls the same public endpoint the phones do, which is also how the
 * official call stays off it until the coach reveals — the answer is not in
 * the response before then.
 */
export function LiveProjector({
  packTitle,
  joinCode,
  scenarios,
}: {
  packTitle: string
  joinCode: string | null
  scenarios: ProjectorScenario[]
}) {
  const [state, setState] = useState<GameState | null>(null)

  const poll = useCallback(async () => {
    if (!joinCode) return
    try {
      const response = await fetch(`/api/public/live/${joinCode}`, { cache: "no-store" })
      if (response.ok) setState(await response.json())
    } catch {
      // Dropped poll; the next one is a second away.
    }
  }, [joinCode])

  useEffect(() => {
    void poll()
    const timer = setInterval(poll, POLL_MS)
    return () => clearInterval(timer)
  }, [poll])

  if (!joinCode) {
    return (
      <Shell>
        <p className="text-3xl text-white/70">No session running.</p>
        <p className="mt-3 text-xl text-white/40">Start one from the presenter view.</p>
      </Shell>
    )
  }

  if (!state) {
    return (
      <Shell>
        <Loader2 className="h-16 w-16 animate-spin text-white/40" />
      </Shell>
    )
  }

  const current = scenarios[state.currentIndex]

  // ---- Lobby -------------------------------------------------------------
  if (state.phase === "lobby") {
    const joinHost = typeof window !== "undefined" ? window.location.host : "refzone"

    return (
      <Shell align="start">
        <div className="grid w-full max-w-6xl gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-2xl font-medium text-white/60">Go to</p>
            <p className="mb-8 text-4xl font-bold text-white sm:text-5xl">{joinHost}/live</p>

            <p className="text-2xl font-medium text-white/60">Game PIN</p>
            <p className="font-mono text-[7rem] font-black leading-none tracking-[0.1em] text-transparent sm:text-[9rem] bg-gradient-to-r from-[#c084fc] to-[#ff5eb8] bg-clip-text">
              {joinCode.toUpperCase()}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-4">
            <img
              src={`/api/qr?url=${encodeURIComponent(
                typeof window !== "undefined" ? `${window.location.origin}/live/${joinCode}` : "",
              )}`}
              alt="Scan to join"
              className="h-56 w-56 rounded-2xl bg-white p-3"
            />
            <p className="text-xl text-white/60">Scan to join</p>
          </div>
        </div>

        <div className="mt-12 w-full max-w-6xl">
          <p className="mb-4 flex items-center gap-3 text-3xl font-bold text-white">
            <Users className="h-8 w-8" />
            {state.players} {state.players === 1 ? "referee" : "referees"} in
          </p>
          <div className="flex flex-wrap gap-3">
            {(state.playerNames || []).map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="rounded-xl bg-white/10 px-5 py-2.5 text-2xl font-semibold text-white"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </Shell>
    )
  }

  // ---- Question ----------------------------------------------------------
  if (state.phase === "question") {
    const left = state.secondsLeft ?? 0
    const fraction = state.questionSeconds > 0 ? left / state.questionSeconds : 0
    const urgent = left <= 10

    return (
      <Shell align="start">
        <div className="mb-4 flex w-full max-w-6xl items-center justify-between gap-6">
          <p className="text-2xl font-medium text-white/60">
            Clip {state.currentIndex + 1} of {state.total}
          </p>
          <p className="text-2xl font-medium text-white/60">
            {state.answered} of {state.players} answered
          </p>
        </div>

        <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1fr_auto]">
          <div className="space-y-3">
            {current?.video_credit && (
              <p className="text-xl text-white/60">
                <span className="font-medium text-white/80">Footage:</span> {current.video_credit}
              </p>
            )}
            <div className="overflow-hidden rounded-2xl border-4 border-white/10">
              {current?.video_url ? (
                <ScenarioVideoPlayer url={current.video_url} key={current.id} />
              ) : (
                <div className="flex aspect-video items-center justify-center bg-black text-white/40">
                  No video
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4">
            <div
              className={`flex h-44 w-44 items-center justify-center rounded-full border-8 transition-colors ${
                urgent ? "border-red-500 bg-red-500/10" : "border-[#ff5eb8] bg-white/5"
              }`}
            >
              <span
                className={`font-mono text-6xl font-black tabular-nums ${
                  urgent ? "text-red-400" : "text-white"
                }`}
              >
                {state.timer ? left : state.answered}
              </span>
            </div>
            <p className="text-xl text-white/50">
              {state.timer ? "seconds left" : "answers in"}
            </p>
          </div>
        </div>

        {state.timer && (
          <div className="mt-8 h-3 w-full max-w-6xl overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full transition-all duration-1000 ease-linear ${
                urgent ? "bg-red-500" : "bg-gradient-to-r from-[#9114af] to-[#ff5eb8]"
              }`}
              style={{ width: `${Math.round(fraction * 100)}%` }}
            />
          </div>
        )}
      </Shell>
    )
  }

  // ---- Reveal ------------------------------------------------------------
  if (state.phase === "reveal") {
    const correct = state.spread?.correct ?? 0
    const incorrect = state.spread?.incorrect ?? 0
    const total = correct + incorrect

    return (
      <Shell align="start">
        <div className="w-full max-w-5xl">
          <p className="mb-2 text-2xl font-medium text-white/60">The correct call</p>
          <p className="mb-10 text-4xl font-bold leading-snug text-white sm:text-5xl">
            {state.officialAnswer || "No answer recorded for this clip."}
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            <Tally
              label="Got it right"
              value={correct}
              total={total}
              className="bg-emerald-500"
            />
            <Tally label="Did not" value={incorrect} total={total} className="bg-red-500" />
          </div>
        </div>
      </Shell>
    )
  }

  // ---- Leaderboard and podium --------------------------------------------
  const rows = state.leaderboard || []
  const finished = state.phase === "ended"

  if (!state.leaderboardOn) {
    return (
      <Shell>
        <p className="text-5xl font-black text-white">
          {finished ? "That is the session" : "Next clip coming up"}
        </p>
        <p className="mt-4 text-2xl text-white/50">{packTitle}</p>
      </Shell>
    )
  }

  return (
    <Shell align="start">
      <div className="w-full max-w-4xl">
        <p className="mb-8 flex items-center gap-4 text-5xl font-black text-white">
          <Trophy className="h-12 w-12 text-yellow-400" />
          {finished ? "Final scores" : "Leaderboard"}
        </p>

        {rows.length === 0 ? (
          <p className="text-3xl text-white/50">No scores yet.</p>
        ) : (
          <div className="space-y-4">
            {rows.map((row) => (
              <div
                key={`${row.position}-${row.name}`}
                className="flex items-center gap-6 rounded-2xl bg-white/10 px-8 py-5"
              >
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl font-black ${
                    MEDAL[row.position - 1] || "bg-white/20 text-white"
                  }`}
                >
                  {row.position}
                </span>
                <span className="min-w-0 flex-1 truncate text-4xl font-bold text-white">
                  {row.name}
                </span>
                <span className="font-mono text-4xl font-black tabular-nums text-[#ff5eb8]">
                  {row.score}
                  {!state.scoring && (
                    <span className="ml-2 text-2xl font-semibold text-white/40">right</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}

        {finished && (
          <p className="mt-10 text-2xl text-white/50">
            Thanks for playing — {packTitle}.
          </p>
        )}
      </div>
    </Shell>
  )
}

function Shell({
  children,
  align = "center",
}: {
  children: React.ReactNode
  align?: "center" | "start"
}) {
  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center gap-4 px-8 py-10 ${
        align === "center" ? "justify-center" : "justify-start"
      }`}
    >
      <div className="pointer-events-none absolute left-8 top-6 flex items-center gap-2 text-white/30">
        <Radio className="h-5 w-5" />
        <span className="text-lg font-semibold">RefZone Live</span>
      </div>
      {children}
    </div>
  )
}

function Tally({
  label,
  value,
  total,
  className,
}: {
  label: string
  value: number
  total: number
  className: string
}) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0

  return (
    <div className="rounded-2xl bg-white/5 p-6">
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-2xl font-semibold text-white/70">{label}</span>
        <span className="font-mono text-4xl font-black text-white">{value}</span>
      </div>
      <div className="h-5 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full transition-all duration-500 ${className}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
