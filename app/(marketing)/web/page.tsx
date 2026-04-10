import type { Metadata } from 'next'
import Link from 'next/link'
import { ScrollAnimate } from '@/components/marketing/scroll-animate'
import { Breadcrumb } from '@/components/marketing/breadcrumb'
import { LawsGrid } from '@/components/marketing/laws-grid'
import { BookOpen, ArrowRight, ExternalLink, Search, Mail } from 'lucide-react'
import { lawsOfTheGame } from '@/content/laws-of-the-game'

export const metadata: Metadata = {
  title: 'RefZone Web — The Encyclopedia for Football Referees',
  description:
    'RefZone Web: the encyclopedia for football referees. Laws of the Game, positioning guides, fitness standards, referee signals, and more — all in one place.',
}

const lawsForSearch = lawsOfTheGame.map((law) => ({
  num: law.num,
  slug: law.slug,
  title: law.title,
  shortDesc: law.shortDesc,
  searchTerms: law.searchTerms ?? [],
  sections: law.sections.map((s) => ({ heading: s.heading })),
  commonQuestions: law.commonQuestions.map((q) => ({ q: q.q })),
}))

export default function WebIndexPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden px-9 pt-40 pb-10 md:pt-48 md:pb-12">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-purple-600/10 to-transparent blur-3xl" />
        </div>
        <div className="mx-auto max-w-[1420px] text-center">
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'RefZone Web' },
          ]} />
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">RefZone</span> Web
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-white/45">
            The encyclopedia for football referees. Everything you need to know about the Laws of the
            Game, referee positioning, fitness standards, match management, and more — written by
            referees, for referees. Search below or browse by topic.
          </p>

          {/* Search bar — navigates to /search */}
          <div className="mt-8 mx-auto max-w-xl">
            <Link
              href="/search"
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3.5 text-[15px] text-white/30 hover:border-purple-400/30 hover:bg-white/[0.07] transition-colors"
            >
              <Search className="h-5 w-5 shrink-0" />
              Search RefZone Web...
            </Link>
          </div>

          {/* IFAB link */}
          <a
            href="https://www.theifab.com/laws-of-the-game/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-xs text-white/20 hover:text-white/40 transition-colors"
          >
            View official IFAB Laws of the Game
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </section>

      {/* Laws of the Game — grid directly, no separate heading */}
      <section className="px-9 py-8 md:py-10">
        <div className="mx-auto max-w-[1420px]">
          <LawsGrid laws={lawsForSearch} />
        </div>
      </section>

      {/* SEO content */}
      <section className="px-9 py-12 md:py-16 border-t border-white/[0.06]">
        <div className="mx-auto max-w-[860px]">
          <ScrollAnimate>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              What is RefZone Web?
            </h2>
            <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-white/50">
              <p>
                RefZone Web is the open knowledge base for football referees. It provides
                comprehensive, freely accessible articles covering the Laws of the Game,
                referee positioning, fitness standards, match-day procedures, and career
                development — all written specifically for Australian referees.
              </p>
              <p>
                Every article on RefZone Web is grounded in the official IFAB Laws of the Game
                and informed by the practical experience of referees across Football NSW, Football
                Victoria, Football Queensland, Capital Football, Football West, and other
                Australian state federations.
              </p>
              <p>
                Can&apos;t find what you&apos;re looking for? Email{' '}
                <a href="mailto:hello@refzone.com.au?subject=RefZone Web Page Request" className="text-purple-400 hover:text-purple-300 transition-colors">
                  hello@refzone.com.au
                </a>{' '}
                to request a new article. Tell us the topic and we&apos;ll build it.
              </p>
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* Request a page CTA */}
      <section className="px-9 py-12 md:py-16">
        <div className="mx-auto max-w-[1420px] text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Want a topic added?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[14px] text-white/45">
            RefZone Web is growing. Request a new article — provide as much or as little detail as
            you like, and we&apos;ll build it.
          </p>
          <a
            href="mailto:hello@refzone.com.au?subject=RefZone Web Page Request&body=I'd like to request a new article on RefZone Web about:%0A%0A"
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-2.5 text-sm font-medium text-white/60 hover:text-white hover:border-white/20 transition-colors"
          >
            <Mail className="h-4 w-4" />
            Request an article
          </a>
        </div>
      </section>
    </main>
  )
}
