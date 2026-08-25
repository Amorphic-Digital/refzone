"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { YouTubePlayer } from "@/components/youtube-player"
import { FeedbackCard } from "@/components/feedback-card"
import { ShareButton } from "@/components/share-button"
import { UserFeedbackButton } from "@/components/user-feedback-button"
import { categoryLabel } from "@/lib/scenario-categories"
import { formatTime, getDifficultyColor } from "@/lib/shared-utils"
import { ArrowLeft, ArrowRight, BarChart3, CheckCircle2, Loader2, Timer, Trophy } from "lucide-react"

interface PackScenario {
  id: string
  title: string
  ai_answer: string | null
  ai_description: string | null
  difficulty: string
  scenario_type: string
  video_url: string | null
  points_value: number
  law_category?: string | null
  law_section?: string | null
  category?: string | null
}

interface PackPlayerProps {
  pack: {
    id: string
    title: string
    description: string | null
    category: string | null
    shareCode: string
  }
  scenarios: PackScenario[]
  /** scenario id -> whether the trainee got it right, for work already done. */
  completed: Record<string, boolean>
  isCoach: boolean
}

export function PackPlayer({ pack, scenarios, completed, isCoach }: PackPlayerProps) {
  const router = useRouter()

  // Resume where they left off rather than restarting the pack each visit.
  const firstUnanswered = scenarios.findIndex((s) => !(s.id in completed))
  const [index, setIndex] = useState(firstUnanswered === -1 ? 0 : firstUnanswered)
  const [answer, setAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [result, setResult] = useState<{ isCorrect: boolean; confidence: number } | null>(null)
  const [answered, setAnswered] = useState<Record<string, boolean>>(completed)

  const current = scenarios[index]
  const doneCount = Object.keys(answered).length
  const allDone = doneCount >= scenarios.length && scenarios.length > 0

  useEffect(() => {
    if (result || !current) return
    const timer = setInterval(() => setTimeElapsed((t) => t + 1), 1000)
    return () => clearInterval(timer)
  }, [result, current])

  const submit = async () => {
    if (!answer.trim() || !current) return
    setIsSubmitting(true)

    try {
      const checkResponse = await fetch("/api/check-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAnswer: answer,
          correctAnswer: current.ai_answer || "",
          questionContext: `${current.title}: ${current.ai_description || ""}`,
        }),
      })

      const check = await checkResponse.json()
      const isCorrect = check.isCorrect && check.confidence >= 70
      const pointsEarned = isCorrect ? current.points_value : 0

      // Two writes, deliberately: the normal scenario response so pack work
      // still earns points and streaks, and the pack row so the coach sees it.
      await Promise.allSettled([
        fetch("/api/scenario-submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scenarioId: current.id,
            userDecision: answer,
            isCorrect,
            timeElapsed,
            pointsEarned,
            lawCategory: current.law_category,
            lawSection: current.law_section,
          }),
        }),
        fetch(`/api/packs/${pack.id}/progress`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scenarioId: current.id,
            answerText: answer,
            isCorrect,
            timeTakenSeconds: timeElapsed,
          }),
        }),
      ])

      setResult({ isCorrect, confidence: check.confidence ?? 0 })
      setAnswered((prev) => ({ ...prev, [current.id]: isCorrect }))
      router.refresh()
    } catch {
      setResult({ isCorrect: false, confidence: 0 })
    } finally {
      setIsSubmitting(false)
    }
  }

  const next = () => {
    setResult(null)
    setAnswer("")
    setTimeElapsed(0)
    setIndex((i) => Math.min(i + 1, scenarios.length - 1))
  }

  if (scenarios.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <h1 className="mb-2 text-xl font-semibold text-foreground">{pack.title}</h1>
          <p className="mb-6 text-muted-foreground">This pack has no available scenarios.</p>
          <Button asChild variant="outline">
            <Link href="/packs">Back to packs</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const correctCount = Object.values(answered).filter(Boolean).length
  const isLast = index >= scenarios.length - 1

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Pack header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Training pack</p>
          <h1 className="text-2xl font-bold text-foreground">{pack.title}</h1>
          {pack.description && <p className="mt-1 text-sm text-muted-foreground">{pack.description}</p>}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {pack.category && <Badge variant="secondary">{categoryLabel(pack.category)}</Badge>}
          <ShareButton
            url={`/share/pack/${pack.shareCode}`}
            title={pack.title}
            variant="outline"
            size="sm"
          />
          {isCoach && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/packs/${pack.id}/results`}>
                <BarChart3 className="h-4 w-4" />
                Results
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">
            {doneCount} of {scenarios.length} answered
          </span>
          <span className="text-muted-foreground">{correctCount} correct</span>
        </div>
        <Progress value={(doneCount / scenarios.length) * 100} className="h-2" />
      </div>

      {allDone && !result && (
        <Card className="border-2 border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="py-8 text-center">
            <Trophy className="mx-auto mb-4 h-12 w-12 text-yellow-500" />
            <h2 className="mb-1 text-2xl font-bold text-foreground">Pack complete</h2>
            <p className="mb-6 text-muted-foreground">
              {correctCount} of {scenarios.length} correct.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href="/packs">Back to packs</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/scenarios">More scenarios</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!allDone && current && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">
                {index + 1} / {scenarios.length}
              </Badge>
              <Badge className={getDifficultyColor(current.difficulty)} variant="outline">
                {current.difficulty}
              </Badge>
              {answered[current.id] !== undefined && (
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Answered
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3">
              <UserFeedbackButton
                contentType="scenario"
                contentId={current.id}
                contentTitle={current.title}
              />
              <div className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-foreground">
                <Timer className="h-4 w-4" />
                {formatTime(timeElapsed)}
              </div>
            </div>
          </div>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">{current.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {current.video_url && (
                <div className="overflow-hidden rounded-lg border-2 border-border">
                  <YouTubePlayer url={current.video_url} />
                </div>
              )}

              {!result ? (
                <div className="space-y-3">
                  <Textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="What is your decision? Include the restart and any card."
                    rows={4}
                  />
                  <Button onClick={submit} disabled={isSubmitting || !answer.trim()} className="w-full" size="lg">
                    {isSubmitting ? (
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
                  <FeedbackCard isCorrect={result.isCorrect}>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">
                          {result.isCorrect ? "Correct Decision!" : "Incorrect Decision"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {result.isCorrect
                            ? `You earned ${current.points_value} points`
                            : "Review the correct answer below"}
                        </p>
                      </div>

                      <div className="space-y-3 pt-2">
                        <div>
                          <p className="mb-1 text-sm font-medium text-muted-foreground">Your Decision:</p>
                          <p className="text-foreground">{answer}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-sm font-medium text-muted-foreground">Correct Answer:</p>
                          <p className="font-semibold text-foreground">{current.ai_answer}</p>
                        </div>
                      </div>
                    </div>
                  </FeedbackCard>
                  {/* Never disabled: on the last scenario this is the only way
                      to dismiss the feedback and reach the summary card. */}
                  <Button onClick={next} className="w-full" size="lg">
                    {isLast ? "Finish pack" : "Next scenario"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              variant="ghost"
              onClick={() => {
                setResult(null)
                setAnswer("")
                setTimeElapsed(0)
                setIndex((i) => Math.max(0, i - 1))
              }}
              disabled={index === 0}
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button variant="ghost" onClick={next} disabled={isLast}>
              Skip
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
