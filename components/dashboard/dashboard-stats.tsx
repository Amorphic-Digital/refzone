import { createServiceClient } from "@/lib/supabase/service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, BarChart3, TrendingUp, TrendingDown, Target, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PerformanceChart, LawBreakdownChart } from "./performance-chart"

const LAW_NAMES: Record<string, string> = {
  "Law 1": "The Field of Play", "Law 2": "The Ball", "Law 3": "The Players",
  "Law 4": "The Players' Equipment", "Law 5": "The Referee", "Law 6": "The Other Match Officials",
  "Law 7": "The Duration of the Match", "Law 8": "The Start and Restart of Play",
  "Law 9": "The Ball In and Out of Play", "Law 10": "Determining the Outcome",
  "Law 11": "Offside", "Law 12": "Fouls and Misconduct", "Law 13": "Free Kicks",
  "Law 14": "The Penalty Kick", "Law 15": "The Throw-In", "Law 16": "The Goal Kick",
  "Law 17": "The Corner Kick",
}

function getLawDisplayName(lawCategory: string, lawSection?: string): string {
  if (lawSection && lawSection !== "") return lawSection
  return LAW_NAMES[lawCategory] || lawCategory
}

export async function DashboardStats({ userId }: { userId: string }) {
  const supabase = createServiceClient()

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const thirtyFiveDaysAgo = new Date()
  thirtyFiveDaysAgo.setDate(thirtyFiveDaysAgo.getDate() - 35)

  const [scenarioResult, quizAttemptsResult, recentScenariosResult, activityLogResult, profileResult] = await Promise.all([
    supabase.from("scenario_responses").select("is_correct, scenario_id").eq("user_id", userId),
    supabase.from("quiz_attempts").select("*").eq("user_id", userId),
    supabase
      .from("scenario_responses")
      .select("is_correct, created_at")
      .eq("user_id", userId)
      .gte("created_at", sevenDaysAgo.toISOString())
      .order("created_at", { ascending: true }),
    supabase
      .from("daily_activity_log")
      .select("activity_date, quizzes_completed, scenarios_completed")
      .eq("user_id", userId)
      .gte("activity_date", thirtyFiveDaysAgo.toISOString().split("T")[0]),
    supabase.from("profiles").select("current_streak, longest_streak").eq("id", userId).single(),
  ])

  const scenarioResponses = scenarioResult.data || []
  const allQuizAttempts = quizAttemptsResult.data || []
  const quizAttempts = allQuizAttempts
  const recentScenarios = recentScenariosResult.data || []
  const activeDays = (activityLogResult.data || []).map((d: any) => d.activity_date)
  const currentStreak = profileResult.data?.current_streak || 0
  const longestStreak = profileResult.data?.longest_streak || 0

  // Build recent quiz chart entries (7-day)
  const recentQuizEntries: Array<{ is_correct: boolean; created_at: string }> = []
  for (const attempt of allQuizAttempts) {
    const timestamp = (attempt as any).completed_at || (attempt as any).created_at || new Date().toISOString()
    const attemptDate = new Date(timestamp)
    if (attemptDate < sevenDaysAgo) continue
    const totalQ = Math.max(1, Math.round((attempt as any).total_possible / 5))
    const correctQ = Math.round((attempt as any).score / 5)
    for (let i = 0; i < correctQ; i++) recentQuizEntries.push({ is_correct: true, created_at: timestamp })
    for (let i = 0; i < Math.max(0, totalQ - correctQ); i++) recentQuizEntries.push({ is_correct: false, created_at: timestamp })
  }

  const recentResponses = [...recentScenarios, ...recentQuizEntries].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  const scenarioAccuracy =
    scenarioResponses.length > 0
      ? Math.round((scenarioResponses.filter((r) => r.is_correct).length / scenarioResponses.length) * 100)
      : 0

  const totalQuizScore = quizAttempts.reduce((acc, q) => acc + (q.score || 0), 0)
  const totalQuizPossible = quizAttempts.reduce((acc, q) => acc + (q.total_possible || 0), 0)
  const quizAccuracy = totalQuizPossible > 0 ? Math.round((totalQuizScore / totalQuizPossible) * 100) : 0

  // Law performance from quiz_answers
  const lawMap: Record<string, { correct: number; total: number; section: string }> = {}

  if (allQuizAttempts.length > 0) {
    const attemptIds = allQuizAttempts.map((a: any) => a.id)
    const quizIds = [...new Set(allQuizAttempts.map((a: any) => a.quiz_id))]

    const [answersRes, questionsRes] = await Promise.all([
      supabase.from("quiz_answers").select("attempt_id, question_id, is_correct").in("attempt_id", attemptIds),
      supabase.from("quiz_questions").select("id, quiz_id, law_category, law_section").in("quiz_id", quizIds),
    ])

    const answers = answersRes.data || []
    const questions = questionsRes.data || []
    const qMap = new Map(questions.map((q) => [q.id, q]))
    const attemptIdsWithAnswers = new Set(answers.map((a) => a.attempt_id))

    for (const a of answers) {
      const q = qMap.get(a.question_id)
      if (!q?.law_category) continue
      if (!lawMap[q.law_category]) lawMap[q.law_category] = { correct: 0, total: 0, section: q.law_section || "" }
      lawMap[q.law_category].total += 1
      if (a.is_correct) lawMap[q.law_category].correct += 1
    }

    for (const attempt of allQuizAttempts) {
      if (attemptIdsWithAnswers.has((attempt as any).id)) continue
      const quizQuestions = questions.filter((q) => q.quiz_id === (attempt as any).quiz_id && q.law_category)
      if (quizQuestions.length === 0) continue
      const score = (attempt as any).score || 0
      const totalPossible = (attempt as any).total_possible || 0
      if (totalPossible === 0) continue
      const lawCounts: Record<string, { count: number; section: string }> = {}
      for (const q of quizQuestions) {
        if (!lawCounts[q.law_category]) lawCounts[q.law_category] = { count: 0, section: q.law_section || "" }
        lawCounts[q.law_category].count += 1
      }
      const correctRatio = score / totalPossible
      for (const [law, info] of Object.entries(lawCounts)) {
        if (!lawMap[law]) lawMap[law] = { correct: 0, total: 0, section: info.section }
        lawMap[law].total += info.count
        lawMap[law].correct += info.count * correctRatio
      }
    }
  }

  if (scenarioResponses.length > 0) {
    const scenarioIds = [...new Set(scenarioResponses.map((r: any) => r.scenario_id))]
    const { data: scenariosData } = await supabase
      .from("scenarios")
      .select("id, law_category, law_section")
      .in("id", scenarioIds)
    const scenarioMap = new Map((scenariosData || []).map((s: any) => [s.id, s]))
    for (const response of scenarioResponses) {
      const scenario = scenarioMap.get((response as any).scenario_id)
      if (!scenario?.law_category) continue
      const law = scenario.law_category
      if (!lawMap[law]) lawMap[law] = { correct: 0, total: 0, section: scenario.law_section || "" }
      lawMap[law].total += 1
      if (response.is_correct) lawMap[law].correct += 1
    }
  }

  const lawPerformance = Object.entries(lawMap)
    .filter(([_, s]) => s.total > 0)
    .map(([law, s]) => ({
      law_category: law,
      law_section: s.section,
      accuracy: Math.round((s.correct / s.total) * 100),
      total_attempts: s.total,
    }))
    .sort((a, b) => a.accuracy - b.accuracy)

  // Available quizzes for the law breakdown chart
  const { data: availableQuizzes } = await supabase
    .from("quizzes")
    .select("id, title, difficulty, quiz_questions(law_category, law_section)")
    .eq("is_active", true)

  const weakAreas = lawPerformance.filter((l) => l.accuracy < 70).slice(0, 3)
  const strongAreas = lawPerformance.filter((l) => l.accuracy >= 70).sort((a, b) => b.accuracy - a.accuracy).slice(0, 3)

  const todayStr = new Date().toISOString().split("T")[0]
  const activeDaysSet = new Set(activeDays)

  return (
    <div className="space-y-6">
      {/* Streak Bar */}
      <Card className="border">
        <CardContent className="py-3 px-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5 shrink-0">
              <div className="flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-lg font-bold">{currentStreak}</span>
                <span className="text-xs text-muted-foreground">day streak</span>
              </div>
              <span className="text-xs text-muted-foreground ml-6">Best: <span className="font-semibold text-foreground">{longestStreak}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 7 }, (_, i) => {
                const d = new Date()
                d.setDate(d.getDate() - (6 - i))
                const dateStr = d.toISOString().split("T")[0]
                const isActive = activeDaysSet.has(dateStr)
                const isToday = dateStr === todayStr
                const dayLabel = d.toLocaleDateString("en-US", { weekday: "narrow" })
                return (
                  <div key={i} className="flex flex-col items-center gap-0.5">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-medium ${
                      isToday ? "bg-purple-500 text-white" : isActive ? "bg-purple-500/30 text-purple-400" : "bg-muted/50 text-muted-foreground/50"
                    }`}>
                      {isActive && !isToday ? <Flame className="h-2.5 w-2.5" /> : dayLabel}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats + Insights Grid */}
      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Insights */}
        <Card className="border-2" data-tutorial="insights-section">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <CardTitle className="text-lg">Insights & Recommendations</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {weakAreas.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  Areas to improve
                </p>
                {weakAreas.map((area, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded bg-red-500/10">
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium">{getLawDisplayName(area.law_category, area.law_section)}</span>
                      <span className="text-xs text-muted-foreground">{area.law_category}</span>
                    </div>
                    <Badge variant="outline" className="text-red-500 border-red-500/50 w-fit text-xs">
                      {Math.round(area.accuracy)}%
                    </Badge>
                  </div>
                ))}
              </div>
            )}
            {strongAreas.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Your strengths
                </p>
                {strongAreas.map((area, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 rounded bg-green-500/10 gap-1 sm:gap-2">
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium">{getLawDisplayName(area.law_category, area.law_section)}</span>
                      <span className="text-xs text-muted-foreground">{area.law_category}</span>
                    </div>
                    <Badge variant="outline" className="text-green-500 border-green-500/50 w-fit text-xs">
                      {Math.round(area.accuracy)}%
                    </Badge>
                  </div>
                ))}
              </div>
            )}
            {weakAreas.length === 0 && strongAreas.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                Complete a quiz or scenario to get personalised recommendations.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Performance Stats */}
        <Card className="border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-lg">Performance Stats</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-primary/10">
                <p className="text-2xl font-bold text-foreground">{scenarioAccuracy}%</p>
                <p className="text-xs text-muted-foreground">Scenario Accuracy</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-blue-500/10">
                <p className="text-2xl font-bold text-foreground">{quizAccuracy}%</p>
                <p className="text-xs text-muted-foreground">Quiz Accuracy</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-lg font-semibold text-foreground">{scenarioResponses.length}</p>
                <p className="text-xs text-muted-foreground">Total Scenarios</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">{quizAttempts.length}</p>
                <p className="text-xs text-muted-foreground">Total Quizzes</p>
              </div>
            </div>
            <PerformanceChart data={recentResponses} />
          </CardContent>
        </Card>
      </div>

      {/* Law Breakdown */}
      <Card className="border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5 text-pink-500" />
            <CardTitle className="text-lg">Law-by-Law Breakdown</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <LawBreakdownChart
            data={lawPerformance}
            availableQuizzes={availableQuizzes || []}
            userQuizAttempts={[]}
          />
        </CardContent>
      </Card>
    </div>
  )
}
