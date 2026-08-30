"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Award, ArrowLeft, ChevronDown, Flame, Loader2, Timer } from "lucide-react"

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

export interface FeedScenario {
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

interface ScenarioFeedProps {
  /** The first few scenarios, rendered on the server so the feed opens full. */
  initialScenarios: FeedScenario[]
  /** The whole running order, ids only. Rows are pulled in as you scroll. */
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
 * The scenario feed.
 *
 * One clip per screen, scrolled the way a phone feed is scrolled: the panel in
 * view plays, everything else is paused and rewound, and the next decision is
 * one flick away. That is the point of the rework — the old player put a "Next
 * Scenario" button at the bottom of a page you had to scroll back up from, so a
 * referee who wanted five reps had to decide to keep going five separate times.
 *
 * Answers live on the panel that asked the question, so scrolling back up to a
 * clip you have already judged shows your answer and the marking again rather
 * than an empty box.
 */
export function ScenarioFeed({
  initialScenarios,
  queueIds,
  initialStreak,
  longestStreak,
  categoryTitle = null,
}: ScenarioFeedProps) {
  const router = useRouter()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLElement | null)[]>([])

  const [scenarios, setScenarios] = useState<FeedScenario[]>(initialScenarios)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [streak, setStreak] = useState(initialStreak)
  const [bestStreak, setBestStreak] = useState(longestStreak)
  const [celebrate, setCelebrate] = useState(false)

  // Which ids already have rows. A ref rather than state because the top-up
  // effect both reads and claims from it inside one pass.
  const loadedIds = useRef(new Set(initialScenarios.map((s) => s.id)))
  const [exhausted, setExhausted] = useState(
    queueIds.every((id) => loadedIds.current.has(id)),
  )

  /** Which panel is on screen. The one that is decides what plays. */
  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const index = Number((entry.target as HTMLElement).dataset.index)
          if (Number.isFinite(index)) setActiveIndex(index)
        }
      },
      // 0.6 rather than 0.5 so a panel has to be properly settled before it
      // takes over; at half, a slow drag flips the active video back and forth.
      { root: scroller, threshold: 0.6 },
    )

    for (const panel of panelRefs.current) {
      if (panel) observer.observe(panel)
    }
    return () => observer.disconnect()
  }, [scenarios.length, exhausted])

  /** Top up the loaded rows before the referee reaches the end of them. */
  useEffect(() => {
    if (exhausted || isLoadingMore) return
    if (activeIndex < scenarios.length - 1 - PREFETCH_WITHIN) return

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
        const rows: FeedScenario[] = body.scenarios || []
        if (rows.length === 0) {
          setExhausted(true)
        } else {
          setScenarios((prev) => [...prev, ...rows])
        }
      } catch {
        // Give the ids back so a later scroll can try again rather than
        // stranding the feed on one flaky request.
        for (const id of next) loadedIds.current.delete(id)
      } finally {
        if (!cancelled) setIsLoadingMore(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [activeIndex, scenarios.length, exhausted, isLoadingMore, queueIds])

  const goToPanel = useCallback((index: number) => {
    panelRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  const handleAnswered = useCallback(
    (next: { scenarioStreak?: number; longestScenarioStreak?: number; isCorrect: boolean }) => {
      if (typeof next.scenarioStreak === "number") setStreak(next.scenarioStreak)
      if (typeof next.longestScenarioStreak === "number") setBestStreak(next.longestScenarioStreak)
      if (next.isCorrect) setCelebrate(true)
    },
    [],
  )

  // Nothing to judge at all — there is no feed to show, so this is the screen.
  if (scenarios.length === 0) {
    return <UpToDate categoryTitle={categoryTitle} bestStreak={bestStreak} />
  }

  return (
    <div className="relative h-full">
      <div
        ref={scrollerRef}
        onScroll={() => {
          if (!hasScrolled) setHasScrolled(true)
        }}
        className="h-full snap-y snap-mandatory overflow-y-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {scenarios.map((scenario, index) => (
          <section
            key={scenario.id}
            data-index={index}
            ref={(node) => {
              panelRefs.current[index] = node
            }}
            // h-full keeps one clip to a screen; the inner scroll is the escape
            // hatch for a panel whose marking runs longer than the viewport,
            // which mandatory snapping would otherwise put out of reach.
            className="h-full w-full snap-start snap-always overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <ScenarioPanel
              scenario={scenario}
              isActive={index === activeIndex}
              streak={streak}
              onAnswered={handleAnswered}
              onNext={() => goToPanel(index + 1)}
              hasNext={index < scenarios.length - 1 || !exhausted}
              isLast={index === scenarios.length - 1 && exhausted}
              categoryTitle={categoryTitle}
            />
          </section>
        ))}

        {/* The end of the road, as its own panel: reaching it by scrolling is
            the same gesture as everything else in the feed. */}
        {exhausted && (
          <section
            data-index={scenarios.length}
            ref={(node) => {
              panelRefs.current[scenarios.length] = node
            }}
            className="h-full w-full snap-start snap-always overflow-y-auto"
          >
            <UpToDate categoryTitle={categoryTitle} bestStreak={bestStreak} />
          </section>
        )}
      </div>

      {/* Streak floats over the feed rather than riding inside a panel — it
          belongs to the session, not to any one clip. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 p-3">
        <div className="pointer-events-auto flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="bg-background/70 backdrop-blur-sm"
            onClick={() => router.push(categoryTitle ? "/scenarios/categories" : "/scenarios")}
          >
            <ArrowLeft className="h-4 w-4" />
            {categoryTitle ? "Topics" : "Back"}
          </Button>
          {categoryTitle && (
            <Badge variant="secondary" className="bg-background/70 backdrop-blur-sm">
              {categoryTitle}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3 rounded-full bg-background/70 px-3 py-1.5 backdrop-blur-sm">
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

      {/* The one-time nudge that this page scrolls. Once it has, it never comes
          back — a permanent hint is just clutter. */}
      {!hasScrolled && scenarios.length > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center">
          <span className="flex animate-bounce items-center gap-1.5 rounded-full bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
            <ChevronDown className="h-3.5 w-3.5" />
            Scroll for the next clip
          </span>
        </div>
      )}

      {isLoadingMore && (
        <div className="pointer-events-none absolute bottom-4 right-4 z-20">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}

      {celebrate && <CustomCelebration show onComplete={() => setCelebrate(false)} />}
    </div>
  )
}

interface PanelResult {
  isCorrect: boolean
  correctAnswer: string
  explanation: string
  pointsEarned: number
}

/** One clip, one decision, one screen. */
function ScenarioPanel({
  scenario,
  isActive,
  streak,
  onAnswered,
  onNext,
  hasNext,
  isLast,
  categoryTitle,
}: {
  scenario: FeedScenario
  isActive: boolean
  streak: number
  onAnswered: (next: {
    scenarioStreak?: number
    longestScenarioStreak?: number
    isCorrect: boolean
  }) => void
  onNext: () => void
  hasNext: boolean
  isLast: boolean
  categoryTitle: string | null
}) {
  const [decision, setDecision] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<PanelResult | null>(null)
  const [timeElapsed, setTimeElapsed] = useState(0)

  // The clock runs while this is the clip you are looking at and you have not
  // answered it. Scrolling past a question you have not answered stops it,
  // which is the honest reading of "how long did that decision take".
  useEffect(() => {
    if (!isActive || result) return
    const interval = setInterval(() => setTimeElapsed((prev) => prev + 1), 1000)
    return () => clearInterval(interval)
  }, [isActive, result])

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
      // Leave the panel answerable rather than eating what the referee typed.
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-full max-w-2xl flex-col justify-center gap-4 px-4 pb-6 pt-16">
      {/* Video first: the decision is in the footage, not in the metadata. */}
      {scenario.video_url && (
        <div className="overflow-hidden rounded-xl border-2 border-border">
          <ScenarioVideoPlayer url={scenario.video_url} active={isActive} loop />
        </div>
      )}

      <ScenarioVideoCredit credit={scenario.video_credit} />

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

          {hasNext ? (
            <Button onClick={onNext} size="lg" className="w-full cursor-pointer">
              Next scenario
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          ) : isLast ? (
            <p className="text-center text-sm text-muted-foreground">
              That was the last one — keep scrolling.
            </p>
          ) : null}
        </div>
      )}
    </div>
  )
}

/** The end of the feed, and the end of the topic. */
function UpToDate({
  categoryTitle,
  bestStreak,
}: {
  categoryTitle: string | null
  bestStreak: number
}) {
  const router = useRouter()
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 px-6 text-center">
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
