import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ScrollAnimate } from '@/components/marketing/scroll-animate'
import { Breadcrumb } from '@/components/marketing/breadcrumb'
import { BookOpen, ArrowRight, ArrowLeft, ExternalLink } from 'lucide-react'
import { lawsOfTheGame } from '@/content/laws-of-the-game'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return lawsOfTheGame.map((law) => ({ slug: law.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const law = lawsOfTheGame.find((l) => l.slug === slug)
  if (!law) return {}
  return {
    title: law.metaTitle,
    description: law.metaDescription,
  }
}

export default async function LawPage({ params }: Props) {
  const { slug } = await params
  const law = lawsOfTheGame.find((l) => l.slug === slug)
  if (!law) notFound()

  const relatedLaws = law.relatedLaws
    .map((num) => lawsOfTheGame.find((l) => l.num === num))
    .filter(Boolean)

  const prevLaw = lawsOfTheGame.find((l) => l.num === law.num - 1)
  const nextLaw = lawsOfTheGame.find((l) => l.num === law.num + 1)

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden px-9 pt-40 pb-20 md:pt-48 md:pb-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-purple-600/10 to-transparent blur-3xl" />
        </div>
        <div className="absolute top-24 left-16 h-1 w-1 rounded-full bg-purple-500/30 animate-pulse-glow" />
        <div className="absolute top-36 right-20 h-1.5 w-1.5 rounded-full bg-pink-500/20 animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="mx-auto max-w-[1420px]">
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'Laws of the Game', href: '/laws' },
            { label: `Law ${law.num}: ${law.title}` },
          ]} />
          <div className="flex items-start gap-5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-purple-400/10 text-lg font-bold text-purple-400">
              {law.num}
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
                {law.h1}
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/50">
                {law.intro}
              </p>
            </div>
          </div>
          {/* IFAB link */}
          <a
            href={law.ifabUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 text-sm text-purple-400/70 hover:text-purple-300 transition-colors"
          >
            View official IFAB text for Law {law.num}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>

      {/* Content sections */}
      <section className="px-9 py-8 md:py-12">
        <div className="mx-auto max-w-[860px] space-y-8">
          {law.sections.map((section, i) => (
            <ScrollAnimate key={i} delay={i * 60}>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  {section.heading}
                </h2>
                <p className="mt-3 leading-relaxed text-white/50">
                  {section.body}
                </p>
              </div>
            </ScrollAnimate>
          ))}
        </div>
      </section>

      {/* Key points */}
      <section className="px-9 py-10 md:py-14 border-t border-white/[0.06]">
        <div className="mx-auto max-w-[860px]">
          <ScrollAnimate>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Key points for referees
            </h2>
            <ul className="mt-6 space-y-3">
              {law.keyPoints.map((point, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-white/50">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-400/10 text-xs font-bold text-purple-400">
                    {i + 1}
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </ScrollAnimate>
        </div>
      </section>

      {/* Referee tips */}
      <section className="px-9 py-10 md:py-14 border-t border-white/[0.06]">
        <div className="mx-auto max-w-[860px]">
          <ScrollAnimate>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Practical referee tips for {law.title}
            </h2>
            <div className="mt-6 space-y-3">
              {law.refereeTips.map((tip, i) => (
                <div key={i} className="flex gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                  <span className="mt-0.5 text-purple-400 text-sm font-bold shrink-0">TIP</span>
                  <p className="text-[15px] leading-relaxed text-white/50">{tip}</p>
                </div>
              ))}
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* Australia context */}
      <section className="px-9 py-10 md:py-14 border-t border-white/[0.06]">
        <div className="mx-auto max-w-[860px]">
          <ScrollAnimate>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {law.title} in Australian football
            </h2>
            <p className="mt-4 leading-relaxed text-white/50">
              {law.australiaContext}
            </p>
          </ScrollAnimate>
        </div>
      </section>

      {/* Common questions — also provides FAQ-style content for SEO */}
      <section className="px-9 py-10 md:py-14 border-t border-white/[0.06]">
        <div className="mx-auto max-w-[860px]">
          <ScrollAnimate>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Common questions about {law.title}
            </h2>
            <div className="mt-6 space-y-6">
              {law.commonQuestions.map((faq, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="font-semibold text-white">{faq.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">{faq.a}</p>
                </div>
              ))}
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* Related laws */}
      {relatedLaws.length > 0 && (
        <section className="px-9 py-10 md:py-14 border-t border-white/[0.06]">
          <div className="mx-auto max-w-[860px]">
            <ScrollAnimate>
              <h2 className="text-2xl font-bold tracking-tight text-white">Related laws</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {relatedLaws.map((related) => (
                  <Link
                    key={related!.num}
                    href={`/laws/${related!.slug}`}
                    className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.05] p-4 transition hover:border-purple-400/40"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-400/10 text-sm font-bold text-purple-400">
                      {related!.num}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{related!.title}</p>
                      <p className="mt-0.5 text-xs text-white/40">{related!.shortDesc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </ScrollAnimate>
          </div>
        </section>
      )}

      {/* Prev / Next navigation */}
      <section className="px-9 py-12 border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-[860px] items-center justify-between">
          {prevLaw ? (
            <Link
              href={`/laws/${prevLaw.slug}`}
              className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Law {prevLaw.num}: {prevLaw.title}
            </Link>
          ) : <span />}
          {nextLaw ? (
            <Link
              href={`/laws/${nextLaw.slug}`}
              className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              Law {nextLaw.num}: {nextLaw.title}
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : <span />}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px] text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Test your knowledge of {law.title}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-white/45">
            Put Law {law.num} to the test with quizzes and scenarios on RefZone.
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

      {/* Structured data — FAQPage schema for each law's common questions */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: law.commonQuestions.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a,
              },
            })),
          }),
        }}
      />

      {/* Structured data — Article schema for law page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: law.h1,
            description: law.metaDescription,
            author: { '@type': 'Organization', name: 'RefZone', url: 'https://www.refzone.com.au' },
            publisher: { '@type': 'Organization', name: 'RefZone', url: 'https://www.refzone.com.au' },
            mainEntityOfPage: `https://www.refzone.com.au/laws/${law.slug}`,
            about: {
              '@type': 'Thing',
              name: `Law ${law.num}: ${law.title}`,
              description: law.shortDesc,
            },
          }),
        }}
      />
    </main>
  )
}
