import type { Metadata } from 'next'
import Link from 'next/link'
import { ScrollAnimate } from '@/components/marketing/scroll-animate'
import { Breadcrumb } from '@/components/marketing/breadcrumb'
import { LawsGrid } from '@/components/marketing/laws-grid'
import { BookOpen, ArrowRight, ExternalLink } from 'lucide-react'
import { lawsOfTheGame } from '@/content/laws-of-the-game'

export const metadata: Metadata = {
  title: 'All 17 Laws of the Game Explained — IFAB Football Rules',
  description:
    'Comprehensive guide to all 17 IFAB Laws of the Game for football referees in Australia. Offside, fouls, penalties, free kicks, and more — explained clearly with examples.',
}

// Serialize only what the client components need
const lawsForSearch = lawsOfTheGame.map((law) => ({
  num: law.num,
  slug: law.slug,
  title: law.title,
  shortDesc: law.shortDesc,
  searchTerms: law.searchTerms ?? [],
  sections: law.sections.map((s) => ({ heading: s.heading })),
  commonQuestions: law.commonQuestions.map((q) => ({ q: q.q })),
}))

export default function LawsIndexPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden px-9 pt-40 pb-20 md:pt-48 md:pb-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-purple-600/10 to-transparent blur-3xl" />
        </div>
        <div className="mx-auto max-w-[1420px] text-center">
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'Laws of the Game' },
          ]} />
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.05]">
            <BookOpen className="h-8 w-8 text-pink-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Laws of the Game — All 17 Rules Explained
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-white/45">
            The IFAB Laws of the Game are the official rules governing football worldwide.
            Whether you are a new referee in Australia starting your first season or an
            experienced official preparing for promotion, understanding every law is essential.
            Search below or click any law to read a detailed explanation.
          </p>
          <div className="mt-8 flex items-center justify-center gap-1.5">
            <div className="h-0.5 w-8 rounded-full bg-white/20" />
            <div className="h-0.5 w-12 rounded-full bg-white/20" />
            <div className="h-0.5 w-8 rounded-full bg-white/20" />
          </div>

          {/* IFAB link */}
          <a
            href="https://www.theifab.com/laws-of-the-game/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 text-sm text-white/30 hover:text-white/60 transition-colors"
          >
            View official IFAB Laws of the Game
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>

      {/* Search + Law cards grid */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px]">
          <LawsGrid laws={lawsForSearch} />
        </div>
      </section>

      {/* SEO content section */}
      <section className="px-9 py-16 md:py-24 border-t border-white/[0.06]">
        <div className="mx-auto max-w-[860px]">
          <ScrollAnimate>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              What are the Laws of the Game?
            </h2>
            <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-white/50">
              <p>
                The Laws of the Game are the codified rules of football (soccer), maintained by the
                International Football Association Board (IFAB). There are 17 laws covering every
                aspect of how football is played — from the dimensions of the pitch (Law 1) to the
                procedures for a corner kick (Law 17).
              </p>
              <p>
                Every football referee in Australia, whether officiating junior community matches
                or A-League fixtures, must know these laws thoroughly. Football Australia, state
                federations including Football NSW, Capital Football, Football Queensland, and
                Football West all base their referee training programmes on the IFAB Laws of the
                Game.
              </p>
              <p>
                RefZone provides interactive training tools — including 500+ quiz questions and
                100+ match scenarios — to help Australian referees master every law. Our platform
                covers the latest IFAB amendments and provides detailed explanations, key points,
                and common questions for each law.
              </p>
            </div>
          </ScrollAnimate>
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
            Test your knowledge of the Laws
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-white/45">
            Put your understanding to the test with quizzes and scenarios covering every law.
          </p>
          <Link
            href="/auth/sign-up"
            className="mt-6 inline-flex items-center gap-2 bg-white/85 text-black py-2.5 px-5 rounded-xl border border-white/20 hover:bg-white font-medium text-[15px] transition-colors"
          >
            Start training free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
