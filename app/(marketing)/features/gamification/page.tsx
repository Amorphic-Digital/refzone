import type { Metadata } from 'next'
import Link from 'next/link'
import { ScrollAnimate } from '@/components/marketing/scroll-animate'
import { Breadcrumb } from '@/components/marketing/breadcrumb'
import { FeatureHero } from '@/components/marketing/feature-hero'
import { Flame, ArrowRight, Calendar, TrendingUp, Target } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Daily Training Streaks — Build Your Referee Training Habit',
  description:
    'Build consistent referee training habits with daily streaks and activity tracking. Watch your Laws of the Game knowledge improve over time.',
}

export default function GamificationPage() {
  return (
    <main>
      <FeatureHero
        headline="Daily Referee Training Streaks"
        subheadline="Daily streaks keep you consistent. Train every day, maintain your momentum, and watch your decision-making improve over time."
        cta={{ label: 'Start your streak', href: '/auth/sign-up' }}
        accentColour="emerald"
      />

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      {/* Stat badges */}
      <div className="border-b border-white/[0.06] px-9 py-6">
        <div className="mx-auto flex max-w-[1420px] flex-wrap items-center justify-center gap-6 text-sm text-white/45">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Daily streaks
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-purple-500" />
            Weekly tracking
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-pink-500" />
            Personal bests
          </span>
        </div>
      </div>

      {/* Section 1 — Daily streaks */}
      <section className="px-9 py-16 md:py-20">
        <div className="mx-auto max-w-[1420px]">
          <ScrollAnimate>
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-white/20">
                  Build the habit
                </span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Daily streaks
                </h2>
                <p className="mt-3 text-[14px] leading-relaxed text-white/45">
                  Complete at least one quiz or scenario each day to build your
                  streak. The longer your streak, the sharper your instincts become.
                  Miss a day and your streak resets — so keep the fire alive.
                </p>
              </div>
              <div className="glass-card rounded-2xl border border-white/10 bg-white/[0.05] p-6">
                {/* Mock streak display */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <svg viewBox="0 0 120 120" className="h-32 w-32" aria-hidden="true">
                      {/* Outer glow ring */}
                      <circle cx="60" cy="60" r="56" fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.2" />
                      <circle cx="60" cy="60" r="48" fill="#a855f7" opacity="0.08" />
                      {/* Flame shape */}
                      <path
                        d="M60 20 C60 20 42 45 42 65 C42 80 50 90 60 95 C70 90 78 80 78 65 C78 45 60 20 60 20Z"
                        fill="url(#flame-grad)"
                      />
                      <path
                        d="M60 50 C60 50 50 62 50 72 C50 80 55 85 60 87 C65 85 70 80 70 72 C70 62 60 50 60 50Z"
                        fill="#fbbf24"
                        opacity="0.8"
                      />
                      <defs>
                        <linearGradient id="flame-grad" x1="0.5" y1="0" x2="0.5" y2="1">
                          <stop offset="0%" stopColor="#ef4444" />
                          <stop offset="50%" stopColor="#f97316" />
                          <stop offset="100%" stopColor="#fbbf24" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="text-5xl font-extrabold text-white">27</div>
                  <div className="mt-1 text-sm text-white/20">day streak</div>
                  <div className="mt-4 flex gap-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-pink-400">87%</div>
                      <div className="text-xs text-white/20">accuracy</div>
                    </div>
                    <div className="h-8 w-px bg-white/[0.08]" />
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">42</div>
                      <div className="text-xs text-white/20">best streak</div>
                    </div>
                  </div>
                  {/* Week dots */}
                  <div className="mt-5 flex gap-2">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                            i < 5
                              ? 'bg-purple-500 text-white'
                              : i === 5
                                ? 'border-2 border-purple-500 bg-white/[0.05] text-pink-400'
                                : 'bg-white/[0.05] text-white/20'
                          }`}
                        >
                          {i < 5 ? <Flame className="h-3.5 w-3.5" /> : d}
                        </div>
                        <span className="text-[10px] text-white/20">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-[1420px] px-6">
        <div className="flex items-center justify-center py-4">
          <div className="h-px flex-1 bg-white/[0.05]" />
          <div className="mx-4 h-1.5 w-1.5 rotate-45 rounded-sm bg-white/10" />
          <div className="h-px flex-1 bg-white/[0.05]" />
        </div>
      </div>

      {/* Section 2 — Consistency tracking */}
      <section className="px-9 py-16 md:py-20">
        <div className="mx-auto max-w-[1420px]">
          <ScrollAnimate>
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/20">
                Track your consistency
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
                See your training at a glance
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-[14px] leading-relaxed text-white/45">
                Your activity calendar shows every day you trained. Watch the
                squares fill up as you build consistency week after week.
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: Flame,
                  title: 'Current streak',
                  desc: 'See how many consecutive days you have trained. Every day counts toward building stronger instincts.',
                },
                {
                  icon: Calendar,
                  title: 'Activity calendar',
                  desc: 'A visual overview of your training history. Identify patterns and stay accountable to your goals.',
                },
                {
                  icon: TrendingUp,
                  title: 'Personal bests',
                  desc: 'Track your longest streak and best accuracy. Challenge yourself to beat your own records.',
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="glass-card rounded-2xl border border-white/10 bg-white/[0.05] p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400/15">
                    <card.icon className="h-5 w-5 text-pink-400" />
                  </div>
                  <h3 className="text-base font-bold text-white">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/45">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* SEO content — why consistency matters */}
      <section className="px-9 py-16 md:py-24 border-t border-white/[0.06]">
        <div className="mx-auto max-w-[860px]">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Why daily training matters for football referees
          </h2>
          <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-white/50">
            <p>
              Research in sports education consistently shows that spaced repetition — practising
              a little each day rather than cramming — leads to significantly better long-term
              retention. For football referees in Australia, this means a daily 5-minute quiz on
              the <Link href="/web" className="text-purple-400 hover:text-purple-300 transition-colors">Laws of the Game</Link> is
              more effective than a single hour-long study session once a week.
            </p>
            <p>
              RefZone&apos;s streak system leverages this principle. By completing at least one
              quiz or <Link href="/features/scenarios" className="text-purple-400 hover:text-purple-300 transition-colors">scenario</Link> each
              day, you build a habit of continuous learning. Australian referees using RefZone
              report improved confidence on match day, particularly when making split-second
              decisions on <Link href="/web/fouls-and-misconduct" className="text-purple-400 hover:text-purple-300 transition-colors">fouls
              and misconduct</Link> and <Link href="/web/offside" className="text-purple-400 hover:text-purple-300 transition-colors">offside</Link> calls.
            </p>
            <p>
              Whether you are a new referee in New South Wales preparing for your first season
              with Football NSW, or an experienced official in Queensland maintaining your edge,
              daily training with RefZone helps bridge the gap between match weekends. Pair your
              streaks with <Link href="/features/analytics" className="text-purple-400 hover:text-purple-300 transition-colors">performance
              analytics</Link> to identify which laws need the most attention.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-9 py-16 md:py-20">
        <div className="mx-auto max-w-[1420px] text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Make training a daily habit
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-white/45">
            Consistency beats intensity. Start your streak today and watch your
            skills compound over time.
          </p>
          <div className="relative mt-6 inline-block">
            <div className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-xl" />
            <Link
              href="/auth/sign-up"
              className="relative inline-flex items-center gap-2 bg-white/85 text-black py-2.5 px-5 rounded-xl border border-white/20 hover:bg-white font-medium text-[15px] transition-colors"
            >
              Start your streak
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
