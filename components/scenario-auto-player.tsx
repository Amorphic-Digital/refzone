"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { getDifficultyColor, formatTime, updateLawPerformance, updateDailyStreak, updateDailyActivityLog } from "@/lib/shared-utils"
import { splitDecision } from "@/lib/answer-summary"
import { useRouter } from "next/navigation"
import { Timer, Award, ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from "lucide-react"

import { StreakCelebration } from "@/components/streak-celebration"
import { CustomCelebration } from "@/components/custom-celebration"
import { FeedbackCard } from "@/components/feedback-card"
import { UserFeedbackButton } from "@/components/user-feedback-button"
import { ScenarioVideoPlayer } from "@/components/scenario-video-player"
import { ScenarioVideoCredit } from "@/components/scenario-video-credit"
import { ShareButton } from "@/components/share-button"

interface Scenario {
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

interface ScenarioAutoPlayerProps {
  initialScenario: Scenario | null
  userId: string
  initialStreak: number
  longestStreak: number
  totalUnseen: number
  /** When set, only scenarios in this training category are served. */
  category?: string | null
  /** Human label for the active category, shown in the header. */
  categoryTitle?: string | null
}

export function ScenarioAutoPlayer({
  initialScenario,
  userId,
  initialStreak,
  longestStreak,
  totalUnseen,
  category = null,
  categoryTitle = null,
}: ScenarioAutoPlayerProps) {
  const router = useRouter()
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(initialScenario)
  const [userDecision, setUserDecision] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [result, setResult] = useState<{
    isCorrect: boolean
    correctAnswer: string
    explanation: string
    pointsEarned: number
    accuracy: number
  } | null>(null)
  const [isLoadingNext, setIsLoadingNext] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [streak, setStreak] = useState(initialStreak)
  const [bestStreak, setBestStreak] = useState(longestStreak)
  const [remainingCount, setRemainingCount] = useState(totalUnseen)
  const [showCustomCelebration, setShowCustomCelebration] = useState(false)
  const [celebratingStreak, setCelebratingStreak] = useState(0)

  useEffect(() => {
    if (!isSubmitted && currentScenario) {
      const interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isSubmitted, currentScenario])

  const fetchNextScenario = useCallback(async () => {
    setIsLoadingNext(true)
    const supabase = createClient()

    let query = supabase.from("scenarios").select("*").eq("is_active", true)
    if (category) {
      query = query.eq("category", category)
    }
    const { data: scenarios } = await query

    const { data: completedScenarios } = await supabase
      .from("scenario_responses")
      .select("scenario_id")
      .eq("user_id", userId)

    const completedIds = new Set(completedScenarios?.map((s) => s.scenario_id) || [])

    const unseenScenarios = scenarios?.filter((s) => !completedIds.has(s.id)) || []

    // Shuffle array using Fisher-Yates algorithm
    for (let i = unseenScenarios.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[unseenScenarios[i], unseenScenarios[j]] = [unseenScenarios[j], unseenScenarios[i]]
    }

    setRemainingCount(unseenScenarios.length)

    if (unseenScenarios.length > 0) {
      setCurrentScenario(unseenScenarios[0])
      setUserDecision("")
      setTimeElapsed(0)
      setIsSubmitted(false)
      setResult(null)
    } else {
      setCurrentScenario(null)
    }

    setIsLoadingNext(false)
  }, [userId, category])

  const handleSubmit = async () => {
    if (!userDecision.trim() || !currentScenario) return

    setIsLoadingNext(true)

    try {
      const aiCheckResponse = await fetch("/api/check-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAnswer: userDecision,
          correctAnswer: currentScenario.ai_answer || "",
          questionContext: `${currentScenario.title}: ${currentScenario.ai_description || ""}`,
        }),
      })

      const aiResult = await aiCheckResponse.json()
      const isCorrect = aiResult.isCorrect && aiResult.confidence >= 70

      const pointsEarned = isCorrect ? currentScenario.points_value : 0

      // Submit through API (uses service client to bypass RLS)
      try {
        const submitResponse = await fetch("/api/scenario-submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scenarioId: currentScenario.id,
            userDecision,
            isCorrect,
            timeElapsed,
            pointsEarned,
            lawCategory: currentScenario.law_category,
            lawSection: currentScenario.law_section,
          }),
        })

        const submitResult = await submitResponse.json()
        if (submitResult.success) {
          setStreak(submitResult.scenarioStreak)
          setBestStreak(submitResult.longestScenarioStreak)
        }
      } catch (submitErr) {
        console.error("Failed to save scenario response:", submitErr)
      }

      // The card shows the call on its own line and the reasoning under it. The
      // checker writes both against the referee's actual answer; if it could
      // not, fall back to splitting the stored answer at its first sentence.
      const stored = splitDecision(currentScenario.ai_answer)

      setResult({
        // Was aiResult.isCorrect, which skipped the confidence gate below —
        // so the card could say "Correct Decision!" while the same answer was
        // recorded as wrong and earned nothing.
        isCorrect,
        correctAnswer: aiResult.verdict?.trim() || stored.verdict,
        explanation: aiResult.explanation?.trim() || stored.detail,
        pointsEarned: pointsEarned,
        accuracy: aiResult.confidence,
      })
      setIsSubmitted(true)

      if (isCorrect) {
        setShowCustomCelebration(true)
      }

      setRemainingCount((prev) => Math.max(0, prev - 1))
    } catch {
    } finally {
      setIsLoadingNext(false)
    }
  }

  // No scenarios available state
  if (!currentScenario && !isLoadingNext) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-2 text-center">
          <CardContent className="py-16">
            <Award className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-3">
              {categoryTitle ? `You're up to date on ${categoryTitle}` : "You're up to date"}
            </h2>
            <p className="text-muted-foreground mb-2">
              {categoryTitle
                ? "Nothing new in this topic right now. Try another one, or come back after the next upload."
                : "Nothing new to judge right now. New clips go up regularly — check back soon."}
            </p>
            <div className="flex items-center justify-center gap-2 text-lg font-semibold mb-6">
              <Award className="h-5 w-5 text-orange-500" />
              <span>Best Streak: {bestStreak} correct in a row</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {categoryTitle && (
                <Button onClick={() => router.push("/scenarios")} size="lg">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Pick another category
                </Button>
              )}
              <Button
                onClick={() => router.push("/dashboard")}
                size="lg"
                variant={categoryTitle ? "outline" : "default"}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Active category — makes it obvious you are in a filtered session and
          gives a one-click way back to the category menu. */}
      {categoryTitle && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Training category</p>
            <h1 className="text-2xl font-bold text-foreground">{categoryTitle}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.push("/scenarios")}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              All categories
            </Button>
          </div>
        </div>
      )}

      {/* Scenario Streak Header */}
      <Card className="border-2 bg-gradient-to-r from-orange-500/10 to-red-500/10">
        <CardContent className="py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Award className="h-6 w-6 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Scenario Streak</p>
                  <p className="text-2xl font-bold text-foreground">{streak}</p>
                </div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Best</p>
                  <p className="text-xl font-bold text-foreground">{bestStreak}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Header */}
      {currentScenario && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <Badge className={getDifficultyColor(currentScenario.difficulty)} variant="outline">
              {currentScenario.difficulty}
            </Badge>
            <Badge>{currentScenario.scenario_type}</Badge>
            {currentScenario.law_category && (
              <Badge variant="outline" className="text-xs">
                {currentScenario.law_category}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <ShareButton
              url={`/share/scenario/${currentScenario.id}`}
              title={currentScenario.title}
              variant="outline"
              size="sm"
            />
            <UserFeedbackButton
              contentType="scenario"
              contentId={currentScenario.id}
              contentTitle={currentScenario.title}
            />
            <div className="flex items-center gap-2 text-sm font-medium text-foreground whitespace-nowrap">
              <Timer className="h-4 w-4" />
              {formatTime(timeElapsed)}
            </div>
          </div>
        </div>
      )}

      {/* Scenario Card */}
      {currentScenario && (
        <Card className="border-2 bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">{currentScenario.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ScenarioVideoCredit credit={currentScenario.video_credit} />

            {/* Video Player */}
            {currentScenario.video_url && (
              <div className="rounded-lg overflow-hidden border-2 border-border">
                <ScenarioVideoPlayer url={currentScenario.video_url} key={currentScenario.id} />
              </div>
            )}

            {!isSubmitted ? (
              <>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Your Decision</label>
                  <Textarea
                    placeholder="What would you call? Explain your decision and any cards you would show..."
                    value={userDecision}
                    onChange={(e) => setUserDecision(e.target.value)}
                    rows={5}
                    className="resize-none bg-background text-foreground border-input"
                  />
                  <p className="text-xs text-muted-foreground">
                    Be specific about your call and any disciplinary action required
                  </p>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!userDecision.trim() || isLoadingNext}
                  className="w-full cursor-pointer"
                  size="lg"
                >
                  {isLoadingNext ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Checking your answer...
                    </>
                  ) : (
                    "Submit Decision"
                  )}
                </Button>
              </>
            ) : (
              <>
                <FeedbackCard isCorrect={result?.isCorrect || false}>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {result?.isCorrect ? "Correct Decision!" : "Incorrect Decision"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {result?.isCorrect
                          ? `You earned ${result.pointsEarned} points • Streak: ${streak}`
                          : "Streak reset. Review the explanation below to learn"}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Your Decision:</p>
                        <p className="text-foreground">{userDecision}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Correct Decision:</p>
                        <p className="font-semibold text-foreground">{result?.correctAnswer}</p>
                      </div>
                      {/* Only rendered when there is reasoning to show — an
                          empty "Explanation:" heading reads as a broken page. */}
                      {result?.explanation && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Explanation:</p>
                          <p className="text-foreground">{result.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </FeedbackCard>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-card">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <Timer className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Time Taken</p>
                          <p className="text-xl font-bold text-foreground">{formatTime(timeElapsed)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <Award className="h-5 w-5 text-yellow-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Points</p>
                          <p className="text-xl font-bold text-foreground">{result?.pointsEarned || 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => router.push("/dashboard")} className="flex-1 cursor-pointer">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                  {remainingCount > 0 ? (
                    <Button onClick={fetchNextScenario} disabled={isLoadingNext} className="flex-1 cursor-pointer">
                      {isLoadingNext ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          Next Scenario
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => router.push("/scenarios")}
                      className="flex-1 cursor-pointer"
                      variant="secondary"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      You're up to date
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Celebrations */}
      {showCustomCelebration && <CustomCelebration show={showCustomCelebration} onComplete={() => setShowCustomCelebration(false)} />}
      {celebratingStreak > 0 && (
        <StreakCelebration streakDays={celebratingStreak} onClose={() => setCelebratingStreak(0)} />
      )}

    </div>
  )
}
