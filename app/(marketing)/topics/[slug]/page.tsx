import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, BookOpen, Check, PlayCircle } from 'lucide-react'
import { SCENARIO_CATEGORIES, getCategory } from '@/lib/scenario-categories'
import { CategoryIcon } from '@/components/scenario-category-icon'
import { createServiceClient } from '@/lib/supabase/service'

const SITE_URL = 'https://www.refzone.com.au'

export function generateStaticParams() {
  return SCENARIO_CATEGORIES.map((category) => ({ slug: category.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = getCategory(slug)
  if (!category) return { title: 'Topic not found' }

  return {
    title: `${category.label} Explained — Referee Training | Laws of the Game`,
    description: `${category.description} Learn what the Laws of the Game say about ${category.label.toLowerCase()}, what to watch for, and practise on real match clips. Free for Australian referees.`,
    keywords: category.keywords,
    alternates: { canonical: `${SITE_URL}/topics/${category.slug}` },
    openGraph: {
      title: `${category.label} — Referee Training`,
      description: category.intro,
      url: `${SITE_URL}/topics/${category.slug}`,
      type: 'article',
    },
  }
}

/**
 * How many live scenarios sit behind this topic.
 *
 * Marketing copy should never hard-fail on a database problem, so a failed
 * lookup just hides the count rather than taking the page down.
 */
async function countScenarios(slug: string): Promise<number | null> {
  try {
    const supabase = createServiceClient()
    const { count, error } = await supabase
      .from('scenarios')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('category', slug)

    if (error) return null
    return count ?? null
  } catch {
    return null
  }
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = getCategory(slug)

  if (!category) notFound()

  const scenarioCount = await countScenarios(category.slug)
  const related = SCENARIO_CATEGORIES.filter((c) => c.slug !== category.slug).slice(0, 4)

  return (
    <main className="mx-auto max-w-4xl px-4 py-16 md:py-24">
      {/* Search engines get an explicit description of what this page teaches. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: `${category.label} — Referee Training`,
            description: category.intro,
            about: category.lawRef,
            url: `${SITE_URL}/topics/${category.slug}`,
            publisher: { '@type': 'Organization', name: 'RefZone', url: SITE_URL },
          }),
        }}
      />

      <nav className="mb-8 text-sm text-muted-foreground">
        <Link href="/topics" className="hover:text-foreground">
          Training topics
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{category.label}</span>
      </nav>

      <header className="mb-10">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <CategoryIcon name={category.icon} className="h-6 w-6 text-primary" />
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl">{category.label}</h1>
        <p className="mb-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm text-muted-foreground">
          <BookOpen className="h-3.5 w-3.5" />
          {category.lawRef}
        </p>
        <p className="text-lg leading-relaxed text-muted-foreground">{category.intro}</p>
      </header>

      <section className="mb-10 rounded-xl border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">What to watch for</h2>
        <ul className="space-y-3">
          {category.keyPoints.map((point) => (
            <li key={point} className="flex gap-3">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span className="text-muted-foreground">{point}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-12 rounded-xl border bg-gradient-to-br from-primary/10 to-primary/5 p-6 md:p-8">
        <h2 className="mb-2 text-2xl font-bold">Practise it on real clips</h2>
        <p className="mb-5 text-muted-foreground">
          {scenarioCount
            ? `RefZone has ${scenarioCount} ${category.label.toLowerCase()} scenario${scenarioCount === 1 ? '' : 's'} — watch the incident, give your decision, and get instant feedback against the Laws of the Game.`
            : `Watch real match incidents, give your decision, and get instant feedback against the Laws of the Game.`}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/auth/sign-up"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <PlayCircle className="h-4 w-4" />
            Start training free
          </Link>
          <Link
            href="/weekly-quiz"
            className="inline-flex h-11 items-center gap-2 rounded-lg border px-6 font-medium transition-colors hover:bg-accent"
          >
            Try the weekly quiz
          </Link>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Free account · Coaches can group these clips into a training pack and share one link.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Other topics</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {related.map((other) => (
            <Link
              key={other.slug}
              href={`/topics/${other.slug}`}
              className="group flex items-center gap-3 rounded-lg border p-4 transition-colors hover:border-primary/50"
            >
              <CategoryIcon name={other.icon} className="h-5 w-5 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{other.label}</p>
                <p className="truncate text-sm text-muted-foreground">{other.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
