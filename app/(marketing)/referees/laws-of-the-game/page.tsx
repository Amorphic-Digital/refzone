import type { Metadata } from 'next'
import Link from 'next/link'
import { ScrollAnimate } from '@/components/marketing/scroll-animate'
import { BookOpen, ArrowRight } from 'lucide-react'
import { lawsOfTheGame } from '@/content/laws-of-the-game'

export const metadata: Metadata = {
  title: 'Laws of the Game for Football Referees — All 17 IFAB Rules',
  description:
    'All 17 IFAB Laws of the Game explained for Australian football referees. Quizzes, scenarios, and detailed breakdowns from offside to fouls and misconduct.',
}

export default function LawsOfTheGamePage() {
  return (
    <main>
      {/* Hero */}
      <section
        className="relative overflow-hidden px-9 pt-40 pb-20 md:pt-48 md:pb-28"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-purple-600/10 to-transparent blur-3xl" />
        </div>
        <div className="mx-auto max-w-[1420px] text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.05]">
            <BookOpen className="h-8 w-8 text-pink-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            All 17 Laws. Covered.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-white/45">
            RefZone provides quizzes, scenarios, and detailed explanations for
            every Law of the Game so you can master the full rulebook with
            confidence.
          </p>
          <div className="mt-8 flex items-center justify-center gap-1.5">
            <div className="h-0.5 w-8 rounded-full bg-white/20" />
            <div className="h-0.5 w-12 rounded-full bg-white/20" />
            <div className="h-0.5 w-8 rounded-full bg-white/20" />
          </div>
        </div>
      </section>

      {/* Law cards grid */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lawsOfTheGame.map((law, i) => (
              <ScrollAnimate key={law.num} delay={i * 40}>
                <Link
                  href={`/laws/${law.slug}`}
                  className={`group flex gap-4 rounded-xl border border-white/10 bg-white/[0.05] p-5 transition hover:border-purple-400/40 hover:bg-white/[0.07] ${law.num <= 4 ? 'border-l-2 border-l-green-400' : law.num <= 8 ? 'border-l-2 border-l-blue-400' : law.num <= 12 ? 'border-l-2 border-l-purple-500' : 'border-l-2 border-l-amber-400'}`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-400/10 text-sm font-bold text-purple-400">
                    {law.num}
                  </span>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">{law.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/45">{law.shortDesc}</p>
                  </div>
                </Link>
              </ScrollAnimate>
            ))}
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="mx-auto max-w-[1420px] px-6">
        <div className="flex items-center justify-center py-4">
          <div className="h-px flex-1 bg-white/[0.05]" />
          <div className="mx-4 h-1.5 w-1.5 rotate-45 rounded-sm bg-white/10" />
          <div className="h-px flex-1 bg-white/[0.05]" />
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px] text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Think you know the Laws?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-white/45">
            Put your knowledge to the test with quizzes covering every law.
          </p>
          <Link
            href="/auth/sign-up"
            className="mt-6 inline-flex items-center gap-2 bg-white/85 text-black py-2.5 px-5 rounded-xl border border-white/20 hover:bg-white font-medium text-[15px] transition-colors"
          >
            Test your knowledge
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
