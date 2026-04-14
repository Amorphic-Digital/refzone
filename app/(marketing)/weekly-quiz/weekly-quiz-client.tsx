'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Loader2,
  BookOpen,
  Clock,
  Trophy,
} from 'lucide-react'

interface Question {
  id: string
  question_text: string
  question_type: string
  options: string[]
  order_index: number
  law_category?: string
  law_section?: string
  points_value: number
}

interface Quiz {
  id: string
  title: string
  description: string
  difficulty: string
  time_limit_minutes: number | null
  created_at: string
}

interface QuestionResult {
  questionId: string
  questionText: string
  options: string[]
  userAnswer: string[]
  correctAnswer: string[]
  isCorrect: boolean
  explanation: string
  lawCategory?: string
  lawSection?: string
}

interface QuizResults {
  score: number
  totalPossible: number
  percentage: number
  correctCount: number
  totalQuestions: number
  results: QuestionResult[]
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f]">
      {/* Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="animate-orb absolute -top-[200px] left-[5%] h-[700px] w-[700px] rounded-full bg-gradient-to-br from-purple-600/30 to-pink-500/15 blur-3xl" />
        <div className="animate-orb-delayed absolute -bottom-[120px] right-[10%] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-emerald-500/15 to-cyan-500/10 blur-3xl" />
        <div className="animate-orb absolute -top-[60px] right-[5%] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-amber-500/10 to-orange-500/8 blur-3xl" />
      </div>

      {/* Pitch SVG — full page fixed */}
      <svg
        className="pointer-events-none fixed inset-0 h-full w-full"
        viewBox="0 0 1440 860"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        fill="none"
      >
        <defs>
          <radialGradient id="wqPitchFade" cx="50%" cy="48%" r="55%">
            <stop offset="0%" stopColor="white" stopOpacity="0.16" />
            <stop offset="55%" stopColor="white" stopOpacity="0.06" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="wqPitchMask">
            <rect width="1440" height="860" fill="url(#wqPitchFade)" />
          </mask>
          <filter id="wqLineGlow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <g mask="url(#wqPitchMask)" stroke="white" strokeLinecap="round" strokeLinejoin="round">
          <rect x="80" y="80" width="1280" height="700" strokeWidth="1.8" />
          <line x1="720" y1="80" x2="720" y2="780" strokeWidth="1.8" />
          <circle cx="720" cy="430" r="130" strokeWidth="1.8" filter="url(#wqLineGlow)" />
          <circle cx="720" cy="430" r="5" fill="white" opacity="0.5" strokeWidth="0" />
          <rect x="80" y="255" width="198" height="350" strokeWidth="1.8" />
          <rect x="80" y="330" width="88" height="200" strokeWidth="1.8" />
          <rect x="60" y="370" width="20" height="120" strokeWidth="1.4" opacity="0.5" />
          <path d="M 278 300 A 105 105 0 0 1 278 560" strokeWidth="1.8" />
          <circle cx="190" cy="430" r="3.5" fill="white" opacity="0.5" strokeWidth="0" />
          <rect x="1162" y="255" width="198" height="350" strokeWidth="1.8" />
          <rect x="1272" y="330" width="88" height="200" strokeWidth="1.8" />
          <rect x="1360" y="370" width="20" height="120" strokeWidth="1.4" opacity="0.5" />
          <path d="M 1162 300 A 105 105 0 0 0 1162 560" strokeWidth="1.8" />
          <circle cx="1250" cy="430" r="3.5" fill="white" opacity="0.5" strokeWidth="0" />
          <path d="M 80 112 A 32 32 0 0 0 112 80" strokeWidth="1.8" />
          <path d="M 1328 80 A 32 32 0 0 0 1360 112" strokeWidth="1.8" />
          <path d="M 80 748 A 32 32 0 0 1 112 780" strokeWidth="1.8" />
          <path d="M 1328 780 A 32 32 0 0 1 1360 748" strokeWidth="1.8" />
        </g>
      </svg>

      {/* Dot grid */}
      <div
        className="pointer-events-none fixed inset-0"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Page content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export function WeeklyQuizClient() {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [submitting, setSubmitting] = useState(false)
  const [results, setResults] = useState<QuizResults | null>(null)
  const [started, setStarted] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    fetch('/api/weekly-quiz')
      .then((res) => {
        if (!res.ok) throw new Error('No quiz available')
        return res.json()
      })
      .then((data) => {
        setQuiz(data.quiz)
        setQuestions(data.questions)
      })
      .catch(() => setError('No weekly quiz available right now. Check back soon!'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!started || results) return
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(interval)
  }, [started, results])

  const handleSelect = (questionId: string, option: string, isMulti: boolean) => {
    setAnswers((prev) => {
      const current = prev[questionId] || []
      if (isMulti) {
        const next = current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option]
        return { ...prev, [questionId]: next }
      }
      return { ...prev, [questionId]: [option] }
    })
  }

  const handleSubmit = async () => {
    if (!quiz) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/weekly-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId: quiz.id, answers }),
      })
      const data = await res.json()
      setResults(data)
      try {
        localStorage.setItem('pendingQuizResult', JSON.stringify({
          quizId: quiz.id, answers, timeElapsed: elapsed,
          savedAt: new Date().toISOString(),
        }))
      } catch {}
    } catch {
      setError('Failed to submit quiz. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  const answeredCount = Object.keys(answers).length
  const q = questions[currentQuestion]
  const isMulti = q?.question_type === 'multi_select'

  // ── Loading ──
  if (loading) {
    return (
      <PageShell>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-purple-400" />
            <p className="mt-4 text-white/45">Loading this week&apos;s quiz...</p>
          </div>
        </div>
      </PageShell>
    )
  }

  // ── Error / no quiz ──
  if (error || !quiz || questions.length === 0) {
    return (
      <PageShell>
        <div className="flex min-h-screen items-center justify-center px-4 text-center">
          <div>
            <BookOpen className="mx-auto h-10 w-10 text-white/20" />
            <h1 className="mt-4 text-3xl font-bold text-white">Weekly Quiz</h1>
            <p className="mt-3 max-w-sm text-white/45">{error || 'No quiz available right now. Check back soon!'}</p>
            <Link
              href="/auth/sign-up"
              className="mt-8 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/85 px-5 py-2.5 text-[15px] font-medium text-black transition-colors hover:bg-white"
            >
              Sign up for RefZone <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </PageShell>
    )
  }

  // ── Results ──
  if (results) {
    const resultLabel =
      results.percentage >= 80 ? 'Outstanding!' :
      results.percentage >= 60 ? 'Well done!' : 'Keep practising!'

    return (
      <PageShell>
        <div className="px-4 sm:px-9 pt-36 pb-20 md:pt-44">
          <div className="mx-auto max-w-2xl">
            {/* Result heading */}
            <div className="mb-8 text-center">
              <Trophy className="mx-auto h-12 w-12 text-pink-400 mb-4" />
              <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">{resultLabel}</h1>
              <p className="mt-3 text-white/45">
                You scored {results.correctCount} of {results.totalQuestions} ({results.percentage}%) in {formatTime(elapsed)}
              </p>

              {/* Score ring */}
              <div className="mx-auto mt-6 relative w-32 h-32">
                <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="52" fill="none"
                    stroke="url(#result-grad)"
                    strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${(results.percentage / 100) * 2 * Math.PI * 52} ${2 * Math.PI * 52}`}
                    transform="rotate(-90 60 60)"
                  />
                  <defs>
                    <linearGradient id="result-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-3xl font-extrabold text-transparent">
                    {results.percentage}%
                  </span>
                </div>
              </div>
            </div>

            {/* Sign-up CTA */}
            <div className="glass-card rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 text-center">
              <h2 className="text-xl font-bold text-white">Want to save your progress?</h2>
              <p className="mt-2 text-sm text-white/45">
                Create a free RefZone account to track your accuracy over time,
                get personalised recommendations, and access 500+ more questions.
              </p>
              <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/auth/sign-up"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/85 px-5 py-2.5 text-[15px] font-medium text-black transition-colors hover:bg-white"
                >
                  Create free account <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/auth/login" className="text-sm text-white/45 hover:text-white transition-colors">
                  Already have an account? Log in
                </Link>
              </div>
            </div>

            {/* Question review */}
            <div className="mt-8">
              <h3 className="mb-4 text-base font-semibold text-white">Question review</h3>
              <div className="space-y-3">
                {results.results.map((r, i) => (
                  <div
                    key={r.questionId}
                    className={`rounded-xl border p-5 ${
                      r.isCorrect ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                        r.isCorrect ? 'bg-emerald-500/20' : 'bg-red-500/20'
                      }`}>
                        {r.isCorrect
                          ? <Check className="h-3.5 w-3.5 text-emerald-400" />
                          : <X className="h-3.5 w-3.5 text-red-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{i + 1}. {r.questionText}</p>
                        {!r.isCorrect && (
                          <p className="mt-1 text-xs text-red-400">Your answer: {r.userAnswer.join(', ') || 'No answer'}</p>
                        )}
                        <p className="mt-1 text-xs text-emerald-400">Correct: {r.correctAnswer.join(', ')}</p>
                        <p className="mt-2 text-xs text-white/45 leading-relaxed">{r.explanation}</p>
                        {r.lawCategory && (
                          <span className="mt-2 inline-block rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-medium text-purple-400">
                            {r.lawCategory}{r.lawSection ? ` — ${r.lawSection}` : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageShell>
    )
  }

  // ── Start screen ──
  if (!started) {
    const weekOf = new Date(quiz.created_at).toLocaleDateString('en-AU', {
      day: 'numeric', month: 'long', year: 'numeric',
    })

    return (
      <PageShell>
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
            Weekly Quiz
          </h1>
          <p className="mx-auto mt-5 max-w-md text-[16px] leading-relaxed text-white/45">
            Test your Laws of the Game knowledge with this week&apos;s challenge.
            No sign-up required — just jump in.
          </p>

          <div className="mt-10 w-full max-w-sm">
            <div className="glass-card rounded-2xl p-8 text-left">
              <h2 className="text-lg font-bold text-white">{quiz.title}</h2>
              {quiz.description && (
                <p className="mt-2 text-sm text-white/45 leading-relaxed">{quiz.description}</p>
              )}

              <div className="mt-5 flex items-center gap-5 text-sm text-white/40">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-purple-400" />
                  {questions.length} questions
                </span>
                {quiz.time_limit_minutes && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-pink-400" />
                    ~{quiz.time_limit_minutes} min
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs text-white/20">Week of {weekOf}</p>

              <button
                onClick={() => setStarted(true)}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/85 py-3 px-5 text-[15px] font-medium text-black transition-colors hover:bg-white"
              >
                Start quiz <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </PageShell>
    )
  }

  // ── Quiz in progress ──
  return (
    <PageShell>
      <div className="px-4 sm:px-9 pt-32 pb-20 md:pt-40">
        <div className="mx-auto max-w-2xl">

          {/* Progress header */}
          <div className="mb-5 flex items-center justify-between text-sm text-white/40">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> {formatTime(elapsed)}
              </span>
              {q?.law_category && (
                <span className="text-pink-400 text-xs font-medium">{q.law_category}</span>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-8 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question card */}
          <div className="glass-card rounded-2xl p-6 md:p-8">
            <h2 className="text-[17px] font-semibold text-white leading-relaxed">
              {q?.question_text}
            </h2>
            {isMulti && (
              <p className="mt-1.5 text-xs text-white/30">Select all that apply</p>
            )}

            <div className="mt-6 space-y-2.5">
              {q?.options.map((option, i) => {
                const selected = (answers[q.id] || []).includes(option)
                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(q.id, option, isMulti)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                      selected
                        ? 'border-purple-500/50 bg-purple-500/10 text-white'
                        : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:bg-white/[0.04] hover:text-white/80'
                    }`}
                  >
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-medium transition-colors ${
                      selected ? 'bg-purple-500/30 text-purple-300' : 'bg-white/[0.06] text-white/30'
                    }`}>
                      {selected ? <Check className="h-3 w-3" /> : String.fromCharCode(65 + i)}
                    </span>
                    <span>{option}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-5 flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestion((c) => Math.max(0, c - 1))}
              disabled={currentQuestion === 0}
              className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors disabled:opacity-0 disabled:pointer-events-none"
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </button>

            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion((c) => c + 1)}
                className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting || answeredCount < questions.length}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/85 px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : 'Submit quiz'}
              </button>
            )}
          </div>

          {/* Question dots */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-1.5">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQuestion(i)}
                className={`h-2 w-2 rounded-full transition-all ${
                  i === currentQuestion
                    ? 'bg-purple-500 scale-125'
                    : answers[questions[i].id]
                      ? 'bg-purple-500/40'
                      : 'bg-white/10'
                }`}
              />
            ))}
          </div>

          {answeredCount < questions.length && currentQuestion === questions.length - 1 && (
            <p className="mt-4 text-center text-xs text-white/30">
              Answer all {questions.length} questions to submit ({answeredCount}/{questions.length} answered)
            </p>
          )}
        </div>
      </div>
    </PageShell>
  )
}
