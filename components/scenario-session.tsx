"use client"

import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Award, ArrowLeft, ArrowRight, Flame, Loader2, RotateCw, Timer } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { getDifficultyColor, formatTime } from "@/lib/shared-utils"
import { splitDecision } from "@/lib/answer-summary"
import { CustomCelebration } from "@/components/custom-celebration"
import { FeedbackCard } from "@/components/feedback-card"
import { UserFeedbackButton } from "@/components/user-feedback-button"
import { ScenarioVideoPlayer } from "@/components/scenario-video-player"
import { ScenarioVideoCredit } from "@/components/scenario-video-credit"
import { ShareButton } from "@/components/share-button"

export interface SessionScenario {
  id: string
  title: string
  ai_description: string | null
  difficulty: string
  scenario_type: string
  video_url: string | null
  /** Where the footage came from, written by the admin at upload time. */
  video_credit?: string | null
  ai_answer: string | null
  points_value: number
  law_category?: string
  law_section?: string
  category?: string | null
}

interface ScenarioSessionProps {
  /** The first few scenarios, rendered on the server so the session opens full. */
  initialScenarios: SessionScenario[]
  /** The whole running order, ids only. Rows are pulled in as you advance. */
  queueIds: string[]
  initialStreak: number
  longestStreak: number
  /** Human label for the active category, shown in the header. */
  categoryTitle?: string | null
}

/** How close to the end of the loaded rows before pulling the next few. */
const PREFETCH_WITHIN = 2
/** How many rows to pull per top-up. */
const BATCH_SIZE = 5

/**
 * The scenario training session.
 *
 * One clip at a time, on an ordinary page. Answer it, read the marking, press
 * Next — the session replaces the clip with the following one and the page
 * starts again at the top. Nothing is stacked below the clip you are looking
 * at, so there is no running order to scroll through and no question of which
 * clip the page thinks you are on: the button is the only way forward.
 *
 * Rows are still pulled in a handful at a time rather than all at once, so
 * opening the session does not ship the whole library, answers included.
 */
export function ScenarioSession({
  initialScenarios,
  queueIds,
  initialStreak,
  longestStreak,
  categoryTitle = null,
}: ScenarioSessionProps) {
  const router = useRouter()
  const rootRef = useRef<HTMLDivElement>(null)

  const [scenarios, setScenarios] = useState<SessionScenario[]>(initialScenarios)
  const [index, setIndex] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)
  const [streak, setStreak] = useState(initialStreak)
  const [bestStreak, setBestStreak] = useState(longestStreak)
  const [celebrate, setCelebrate] = useState(false)

  // Which ids already have rows. A ref rather than state because the top-up
  // effect both reads and claims from it inside one pass.
  const loadedIds = useRef(new Set(initialScenarios.map((s) => s.id)))
  const [exhausted, setExhausted] = useState(
    queueIds.every((id) => loadedIds.current.has(id)),
  )

  /** Top up the loaded rows before the referee reaches the end of them. */
  useEffect(() => {
    if (exhausted || isLoadingMore || loadFailed) return
    if (index < scenarios.length - 1 - PREFETCH_WITHIN) return

    const next = queueIds.filter((id) => !loadedIds.current.has(id)).slice(0, BATCH_SIZE)
    if (next.length === 0) {
      setExhausted(true)
      return
    }

    let cancelled = false
    setIsLoadingMore(true)
    // Claim the ids now: a second pass of this effect before the fetch lands
    // would otherwise ask for the same rows again and double them up.
    for (const id of next) loadedIds.current.add(id)

    void (async () => {
      try {
        const response = await fetch("/api/scenarios/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: next }),
        })
        const body = await response.json()
        if (cancelled) return
        const rows: SessionScenario[] = body.scenarios || []
        if (rows.length === 0) {
          setExhausted(true)
        } else {
          setScenarios((prev) => [...prev, ...rows])
        }
      } catch {
        // Give the ids back, and stop asking until the referee says to try
        // again: retrying on every render would hammer a failing endpoint.
        for (const id of next) loadedIds.current.delete(id)
        if (!cancelled) setLoadFailed(true)
      } finally {
        if (!cancelled) setIsLoadingMore(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [index, scenarios.length, exhausted, isLoadingMore, loadFailed, queueIds])

  const goNext = useCallback(() => {
    setIndex((prev) => prev + 1)
    // A fresh clip belongs at the top of the page, not wherever the marking on
    // the last one left the view. The app shell scrolls its <main>, not the
    // window, so that is the box to send back to the top.
    const scroller = rootRef.current?.closest("main")
    if (scroller) scroller.scrollTo({ top: 0 })
    else window.scrollTo({ top: 0 })
  }, [])

  const handleAnswered = useCallback(
    (next: { scenarioStreak?: number; longestScenarioStreak?: number; isCorrect: boolean }) => {
      if (typeof next.scenarioStreak === "number") setStreak(next.scenarioStreak)
      if (typeof next.longestScenarioStreak === "number") setBestStreak(next.longestScenarioStreak)
      if (next.isCorrect) setCelebrate(true)
    },
    [],
  )

  const current = scenarios[index]

  // Past the end of the running order — which on the first clip means there
  // was nothing to judge at all.
  if (!current && exhausted) {
    return <UpToDate categoryTitle={categoryTitle} bestStreak={bestStreak} />
  }

  return (
    <div ref={rootRef} className="mx-auto max-w-2xl">
      <SessionHeader
        categoryTitle={categoryTitle}
        streak={streak}
        bestStreak={bestStreak}
        onBack={() => router.push(categoryTitle ? "/scenarios/categories" : "/scenarios")}
      />

      {current ? (
        <ScenarioCard
          // Keyed so the next clip starts clean: no carried-over answer, no
          // marking from the one before it, and a video that reloads.
          key={current.id}
          scenario={current}
          streak={streak}
          onAnswered={handleAnswered}
          onNext={goNext}
          hasNext={index < scenarios.length - 1 || !exhausted}
          categoryTitle={categoryTitle}
        />
      ) : loadFailed ? (
        <WaitingForNext
          message={
            index === 0
              ? "The scenarios could not be loaded."
              : "The next clip could not be loaded."
          }
          action={
            <Button onClick={() => setLoadFailed(false)} variant="outline">
              <RotateCw className="h-4 w-4" />
              Try again
            </Button>
          }
        />
      ) : (
        <WaitingForNext
          message={index === 0 ? "Loading..." : "Loading the next clip..."}
          spinner
        />
      )}

      {celebrate && <CustomCelebration show onComplete={() => setCelebrate(false)} />}
    </div>
  )
}

/** Where you are, how you are doing, and the way back out. */
function SessionHeader({
  categoryTitle,
  streak,
  bestStreak,
  onBack,
}: {
  categoryTitle: string | null
  streak: number
  bestStreak: number
  onBack: () => void
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          {categoryTitle ? "Topics" : "Back"}
        </Button>
        {categoryTitle && <Badge variant="secondary">{categoryTitle}</Badge>}
      </div>

      <div className="flex items-center gap-3 rounded-full border border-border px-3 py-1.5">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Flame className="h-4 w-4 text-orange-500" />
          {streak}
        </span>
        <span className="h-4 w-px bg-border" />
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Award className="h-4 w-4 text-yellow-500" />
          {bestStreak}
        </span>
      </div>
    </div>
  )
}

/** The gap between clips, when the next row has not landed yet. */
function WaitingForNext({
  message,
  spinner = false,
  action,
}: {
  message: string
  spinner?: boolean
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      {spinner && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
      <p className="text-sm text-muted-foreground">{message}</p>
      {action}
    </div>
  )
}

interface CardResult {
  isCorrect: boolean
  correctAnswer: string
  explanation: string
  pointsEarned: number
}

/** One clip, one decision. */
function ScenarioCard({
  scenario,
  streak,
  onAnswered,
  onNext,
  hasNext,
  categoryTitle,
}: {
  scenario: SessionScenario
  streak: number
  onAnswered: (next: {
    scenarioStreak?: number
    longestScenarioStreak?: number
    isCorrect: boolean
  }) => void
  onNext: () => void
  hasNext: boolean
  categoryTitle: string | null
}) {
  const [decision, setDecision] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<CardResult | null>(null)
  const [timeElapsed, setTimeElapsed] = useState(0)

  // The clock runs until the decision is in, which is the honest reading of
  // "how long did that decision take".
  useEffect(() => {
    if (result) return
    const interval = setInterval(() => setTimeElapsed((prev) => prev + 1), 1000)
    return () => clearInterval(interval)
  }, [result])

  const handleSubmit = async () => {
    if (!decision.trim() || result) return
    setIsSubmitting(true)

    try {
      const checkResponse = await fetch("/api/check-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAnswer: decision,
          correctAnswer: scenario.ai_answer || "",
          questionContext: `${scenario.title}: ${scenario.ai_description || ""}`,
        }),
      })
      const check = await checkResponse.json()
      // The confidence gate is what decides the mark, so it has to be the same
      // value the card reads — showing "correct" for an answer recorded as
      // wrong was exactly the old bug here.
      const isCorrect = Boolean(check.isCorrect) && check.confidence >= 70
      const pointsEarned = isCorrect ? scenario.points_value : 0

      let streakUpdate: { scenarioStreak?: number; longestScenarioStreak?: number } = {}
      try {
        const submitResponse = await fetch("/api/scenario-submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scenarioId: scenario.id,
            userDecision: decision,
            isCorrect,
            timeElapsed,
            pointsEarned,
            lawCategory: scenario.law_category,
            lawSection: scenario.law_section,
          }),
        })
        const submitResult = await submitResponse.json()
        if (submitResult.success) {
          streakUpdate = {
            scenarioStreak: submitResult.scenarioStreak,
            longestScenarioStreak: submitResult.longestScenarioStreak,
          }
        }
      } catch (error) {
        console.error("Failed to save scenario response:", error)
      }

      // The card shows the call on its own line and the reasoning under it. The
      // checker writes both against the referee's actual answer; if it could
      // not, fall back to splitting the stored answer at its first sentence.
      const stored = splitDecision(scenario.ai_answer)

      setResult({
        isCorrect,
        correctAnswer: check.verdict?.trim() || stored.verdict,
        explanation: check.explanation?.trim() || stored.detail,
        pointsEarned,
      })
      onAnswered({ ...streakUpdate, isCorrect })
    } catch {
      // Leave the card answerable rather than eating what the referee typed.
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Whose footage this is, before the footage itself. */}
      <ScenarioVideoCredit credit={scenario.video_credit} />

      {scenario.video_url && (
        <div className="overflow-hidden rounded-xl border-2 border-border">
          <ScenarioVideoPlayer url={scenario.video_url} loop />
        </div>
      )}

      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={getDifficultyColor(scenario.difficulty)} variant="outline">
            {scenario.difficulty}
          </Badge>
          <Badge>{scenario.scenario_type}</Badge>
          {scenario.law_category && !categoryTitle && (
            <Badge variant="outline" className="text-xs">
              {scenario.law_category}
            </Badge>
          )}
          <span className="ml-auto flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <Timer className="h-4 w-4" />
            {formatTime(timeElapsed)}
          </span>
        </div>
        <h2 className="text-xl font-bold leading-tight text-foreground md:text-2xl">
          {scenario.title}
        </h2>
      </div>

      {!result ? (
        <div className="space-y-3">
          <Textarea
            placeholder="What would you call? Explain your decision and any cards you would show..."
            value={decision}
            onChange={(event) => setDecision(event.target.value)}
            rows={3}
            className="resize-none border-input bg-background text-foreground"
          />
          <Button
            onClick={handleSubmit}
            disabled={!decision.trim() || isSubmitting}
            className="w-full cursor-pointer"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking your answer...
              </>
            ) : (
              "Submit decision"
            )}
          </Button>
          {hasNext && (
            <button
              type="button"
              onClick={onNext}
              className="w-full cursor-pointer py-1 text-center text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Skip this one
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <FeedbackCard isCorrect={result.isCorrect}>
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {result.isCorrect ? "Correct decision" : "Incorrect decision"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {result.isCorrect
                    ? `+${result.pointsEarned} points · streak ${streak}`
                    : "Streak reset — the reasoning is below"}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Your decision</p>
                  <p className="text-foreground">{decision}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Correct decision</p>
                  <p className="font-semibold text-foreground">{result.correctAnswer}</p>
                </div>
                {/* Only rendered when there is reasoning to show — an empty
                    "Explanation" heading reads as a broken page. */}
                {result.explanation && (
                  <div>
                    <p className="font-medium text-muted-foreground">Explanation</p>
                    <p className="text-foreground">{result.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          </FeedbackCard>

          <div className="flex items-center gap-2">
            <ShareButton
              url={`/share/scenario/${scenario.id}`}
              title={scenario.title}
              variant="outline"
              size="sm"
            />
            <UserFeedbackButton
              contentType="scenario"
              contentId={scenario.id}
              contentTitle={scenario.title}
            />
          </div>

          {/* Always a button, even on the last clip: there it steps on to the
              end-of-session screen rather than leaving the referee on a page
              whose only remaining move is the back arrow. */}
          <Button onClick={onNext} size="lg" className="w-full cursor-pointer">
            {hasNext ? "Next scenario" : "Finish session"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

/** The end of the running order, and the end of the topic. */
function UpToDate({
  categoryTitle,
  bestStreak,
}: {
  categoryTitle: string | null
  bestStreak: number
}) {
  const router = useRouter()
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <Award className="h-14 w-14 text-yellow-500" />
      <h2 className="text-2xl font-bold text-foreground md:text-3xl">
        {categoryTitle ? `You're up to date on ${categoryTitle}` : "You're up to date"}
      </h2>
      <p className="max-w-md text-muted-foreground">
        {categoryTitle
          ? "Nothing new in this topic right now. Try another one, or come back after the next upload."
          : "Nothing new to judge right now. New clips go up regularly — check back soon."}
      </p>
      <p className="flex items-center gap-2 font-semibold text-foreground">
        <Award className="h-5 w-5 text-orange-500" />
        Best streak: {bestStreak} in a row
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button onClick={() => router.push("/scenarios/categories")} size="lg">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {categoryTitle ? "Pick another topic" : "Browse topics"}
        </Button>
        <Button onClick={() => router.push("/dashboard")} size="lg" variant="outline">
          Dashboard
        </Button>
      </div>
    </div>
  )
}
