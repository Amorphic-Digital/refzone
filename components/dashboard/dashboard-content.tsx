"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Flame } from "lucide-react"
import Link from "next/link"
import { DashboardWrapper } from "./dashboard-wrapper"

interface DashboardContentProps {
  profile: any
}

export function DashboardContent({ profile }: DashboardContentProps) {
  const liveProfile = profile

  // Submit pending weekly quiz results from before login
  useEffect(() => {
    async function submitPending() {
      try {
        const pending = localStorage.getItem("pendingQuizResult")
        if (!pending) return
        const data = JSON.parse(pending)
        const savedAt = new Date(data.savedAt).getTime()
        if (Date.now() - savedAt > 24 * 60 * 60 * 1000) {
          localStorage.removeItem("pendingQuizResult")
          return
        }
        const res = await fetch("/api/quiz-submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizId: data.quizId,
            answers: data.answers,
            timeElapsed: data.timeElapsed,
          }),
        })
        localStorage.removeItem("pendingQuizResult")
        if (res.ok) {
          // Result submitted — page will reflect on next load
        }
      } catch {
        localStorage.removeItem("pendingQuizResult")
      }
    }
    submitPending()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent("dashboard-ready"))
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <DashboardWrapper>
      <div className="space-y-6 pb-2">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">
            Welcome back, {liveProfile.display_name || "Referee"}!
          </h1>
          <p className="text-muted-foreground">Ready to sharpen your skills today?</p>
        </div>

        {/* Row 1: 3 CTA Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Scenario CTA */}
          <Link href="/scenarios" data-tutorial="scenarios" className="block">
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg group cursor-pointer overflow-hidden relative">
              <CardContent className="p-0">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/80 to-emerald-900/40">
                  <svg viewBox="0 0 400 200" className="absolute inset-0 w-full h-full" fill="none" preserveAspectRatio="xMidYMid slice">
                    <style>{`
                      @keyframes pulse-ring{0%,100%{r:20;opacity:0.3}50%{r:28;opacity:0.08}}
                      @keyframes drift1{0%,100%{transform:translate(0,0)}50%{transform:translate(6px,-4px)}}
                      @keyframes drift2{0%,100%{transform:translate(0,0)}50%{transform:translate(-4px,5px)}}
                      @keyframes drift3{0%,100%{transform:translate(0,0)}50%{transform:translate(5px,2px)}}
                      @keyframes ball-roll{0%,100%{transform:translate(0,0)}33%{transform:translate(4px,-2px)}66%{transform:translate(-2px,2px)}}
                      .p1{animation:drift1 4s ease-in-out infinite}
                      .p2{animation:drift2 3.5s ease-in-out infinite}
                      .p3{animation:drift3 5s ease-in-out infinite}
                      .ball{animation:ball-roll 3s ease-in-out infinite}
                      .zone{animation:pulse-ring 2.5s ease-in-out infinite}
                    `}</style>
                    <rect x="20" y="15" width="360" height="170" rx="3" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                    <line x1="200" y1="15" x2="200" y2="185" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
                    <circle cx="200" cy="100" r="30" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
                    <circle cx="200" cy="100" r="2" fill="rgba(255,255,255,0.06)" />
                    <rect x="20" y="50" width="50" height="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <rect x="330" y="50" width="50" height="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <circle cx="140" cy="65" r="6" fill="#a855f7" opacity="0.6" className="p1" />
                    <circle cx="150" cy="120" r="6" fill="#a855f7" opacity="0.5" className="p3" />
                    <circle cx="240" cy="90" r="6" fill="#a855f7" opacity="0.4" className="p2" />
                    <circle cx="280" cy="70" r="6" fill="#ec4899" opacity="0.5" className="p1" />
                    <circle cx="170" cy="90" r="6" fill="#ec4899" opacity="0.6" className="p2" />
                    <circle cx="160" cy="85" r="4" fill="white" opacity="0.8" className="ball" />
                    <circle cx="160" cy="85" r="20" stroke="#a855f7" strokeWidth="1" strokeDasharray="4 3" opacity="0.25" className="zone" />
                    <circle cx="190" cy="115" r="5" fill="#fbbf24" opacity="0.5" className="p3" />
                  </svg>
                </div>
                <div className="relative z-10 p-5 flex items-end justify-between min-h-[120px]">
                  <div>
                    <h3 className="font-bold text-white text-lg drop-shadow-sm">Scenarios</h3>
                    <p className="text-xs text-white/50 mt-0.5">Practice match decisions</p>
                  </div>
                  <div className="flex items-center gap-1 text-orange-400 shrink-0" data-tutorial="scenario-streak">
                    <Flame className="h-5 w-5" />
                    <span className="font-bold">{liveProfile.scenario_streak || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Quiz CTA */}
          <Link href="/quizzes" data-tutorial="quizzes" className="block">
            <Card className="border-2 hover:border-blue-500/50 transition-all hover:shadow-lg group cursor-pointer overflow-hidden relative">
              <CardContent className="p-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950/80 to-indigo-900/50">
                  <style>{`
                    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
                    .q-shimmer{background:linear-gradient(90deg,rgba(255,255,255,0.02) 25%,rgba(255,255,255,0.06) 50%,rgba(255,255,255,0.02) 75%);background-size:200% 100%;animation:shimmer 3s ease-in-out infinite}
                  `}</style>
                  <div className="absolute inset-0 flex items-center justify-center p-6 opacity-60">
                    <div className="w-full max-w-[280px] space-y-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-400/40" />
                        <div className="h-3 flex-1 rounded-full q-shimmer" />
                      </div>
                      {[
                        { correct: false, delay: '0s' },
                        { correct: false, delay: '0.2s' },
                        { correct: true, delay: '0.4s' },
                        { correct: false, delay: '0.6s' },
                      ].map((opt, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                            opt.correct
                              ? 'bg-emerald-500/15 border border-emerald-500/25'
                              : 'bg-white/[0.03]'
                          }`}
                        >
                          <div
                            className={`h-5 w-5 rounded-full text-[9px] flex items-center justify-center font-semibold shrink-0 ${
                              opt.correct
                                ? 'bg-emerald-500/30 text-emerald-400'
                                : 'bg-white/[0.06] text-white/20'
                            }`}
                          >
                            {String.fromCharCode(65 + i)}
                          </div>
                          <div
                            className={`h-2 rounded-full flex-1 ${opt.correct ? 'bg-emerald-500/25' : 'q-shimmer'}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="relative z-10 p-5 flex items-end min-h-[120px]">
                  <div>
                    <h3 className="font-bold text-white text-lg drop-shadow-sm">Quizzes</h3>
                    <p className="text-xs text-white/50 mt-0.5">Test your knowledge</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Weekly Quiz CTA */}
          <Link href="/weekly-quiz" className="block sm:col-span-2 lg:col-span-1">
            <Card className="border-2 hover:border-amber-500/50 transition-all hover:shadow-lg group cursor-pointer overflow-hidden relative">
              <CardContent className="p-0">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-950/80 to-orange-900/50">
                  <svg viewBox="0 0 400 200" className="absolute inset-0 w-full h-full" fill="none" preserveAspectRatio="xMidYMid slice">
                    <style>{`
                      @keyframes wq-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
                      @keyframes wq-tick{0%,45%{opacity:0.15}50%,95%{opacity:0.5}100%{opacity:0.15}}
                      @keyframes wq-hand{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
                      @keyframes wq-trophy{0%,100%{transform:translateY(0);opacity:0.5}50%{transform:translateY(-3px);opacity:0.7}}
                      @keyframes wq-star1{0%,100%{opacity:0;transform:scale(0.5)}50%{opacity:0.6;transform:scale(1)}}
                      @keyframes wq-star2{0%,100%{opacity:0;transform:scale(0.5)}60%{opacity:0.5;transform:scale(1)}}
                      @keyframes wq-check{0%,100%{opacity:0.1}50%{opacity:0.4}}
                      .wq-tick1{animation:wq-tick 7s ease-in-out infinite}
                      .wq-tick2{animation:wq-tick 7s ease-in-out 1s infinite}
                      .wq-tick3{animation:wq-tick 7s ease-in-out 2s infinite}
                      .wq-tick4{animation:wq-tick 7s ease-in-out 3s infinite}
                      .wq-tick5{animation:wq-tick 7s ease-in-out 4s infinite}
                      .wq-tick6{animation:wq-tick 7s ease-in-out 5s infinite}
                      .wq-tick7{animation:wq-tick 7s ease-in-out 6s infinite}
                      .wq-hand-g{animation:wq-hand 7s linear infinite;transform-origin:200px 95px}
                      .wq-trophy-g{animation:wq-trophy 3s ease-in-out infinite}
                      .wq-s1{animation:wq-star1 4s ease-in-out infinite}
                      .wq-s2{animation:wq-star2 4s ease-in-out 1.5s infinite}
                      .wq-check1{animation:wq-check 3s ease-in-out infinite}
                      .wq-check2{animation:wq-check 3s ease-in-out 0.5s infinite}
                      .wq-check3{animation:wq-check 3s ease-in-out 1s infinite}
                    `}</style>
                    <circle cx="200" cy="95" r="55" stroke="rgba(251,191,36,0.12)" strokeWidth="2" />
                    <circle cx="200" cy="95" r="50" stroke="rgba(251,191,36,0.08)" strokeWidth="1" />
                    <circle cx="200" cy="95" r="3" fill="rgba(251,191,36,0.3)" />
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
                      const rad = (angle - 90) * Math.PI / 180
                      const x1 = 200 + 44 * Math.cos(rad)
                      const y1 = 95 + 44 * Math.sin(rad)
                      const x2 = 200 + 50 * Math.cos(rad)
                      const y2 = 95 + 50 * Math.sin(rad)
                      return (
                        <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2}
                          stroke="rgba(251,191,36,0.25)" strokeWidth="1.5" strokeLinecap="round"
                          className={`wq-tick${(i % 7) + 1}`}
                        />
                      )
                    })}
                    <g className="wq-hand-g">
                      <line x1="200" y1="95" x2="200" y2="55" stroke="rgba(251,191,36,0.4)" strokeWidth="2" strokeLinecap="round" />
                    </g>
                    <g className="wq-trophy-g">
                      <path d="M320 80 L320 95 Q320 105 310 105 L305 105 Q303 110 298 110 L332 110 Q327 110 325 105 L320 105 Q310 105 310 95 L310 80 Z"
                        fill="rgba(251,191,36,0.2)" stroke="rgba(251,191,36,0.3)" strokeWidth="1" />
                      <path d="M310 80 Q300 80 300 88 Q300 95 310 95" stroke="rgba(251,191,36,0.2)" strokeWidth="1" fill="none" />
                      <path d="M320 80 Q330 80 330 88 Q330 95 320 95" stroke="rgba(251,191,36,0.2)" strokeWidth="1" fill="none" />
                      <rect x="305" y="110" width="20" height="3" rx="1" fill="rgba(251,191,36,0.15)" />
                    </g>
                    <path d="M340 70 L342 66 L344 70 L348 72 L344 74 L342 78 L340 74 L336 72 Z" fill="rgba(251,191,36,0.4)" className="wq-s1" />
                    <path d="M295 65 L296 62 L297 65 L300 66 L297 67 L296 70 L295 67 L292 66 Z" fill="rgba(251,191,36,0.3)" className="wq-s2" />
                    <rect x="60" y="70" width="60" height="60" rx="4" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="rgba(255,255,255,0.02)" />
                    <line x1="80" y1="82" x2="110" y2="82" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeLinecap="round" />
                    <line x1="80" y1="95" x2="105" y2="95" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeLinecap="round" />
                    <line x1="80" y1="108" x2="112" y2="108" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeLinecap="round" />
                    <path d="M67 80 L70 83 L75 78" stroke="rgba(251,191,36,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" className="wq-check1" />
                    <path d="M67 93 L70 96 L75 91" stroke="rgba(251,191,36,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" className="wq-check2" />
                    <path d="M67 106 L70 109 L75 104" stroke="rgba(251,191,36,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" className="wq-check3" />
                  </svg>
                </div>
                <div className="relative z-10 p-5 flex items-end justify-between min-h-[120px]">
                  <div>
                    <h3 className="font-bold text-white text-lg drop-shadow-sm">Weekly Quiz</h3>
                    <p className="text-xs text-white/50 mt-0.5">New challenge every week</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardWrapper>
  )
}
