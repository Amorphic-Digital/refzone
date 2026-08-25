import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SCENARIO_CATEGORIES } from '@/lib/scenario-categories'
import { CategoryIcon } from '@/components/scenario-category-icon'

export const metadata: Metadata = {
  title: 'Referee Training Topics — Laws of the Game Explained',
  description:
    'Every decision a football referee has to make, broken down by topic: DOGSO, reckless tackles, handball, offside, penalty area incidents and more. Free training for Australian referees.',
  alternates: { canonical: 'https://www.refzone.com.au/topics' },
}

export default function TopicsIndexPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
          Training topics
        </p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
          Every decision, broken down
        </h1>
        <p className="text-lg text-muted-foreground">
          Referee training grouped the way coaches actually run a session. Each topic explains what
          the Laws of the Game say, what to watch for, and gives you real match clips to judge.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SCENARIO_CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            href={`/topics/${category.slug}`}
            className="group rounded-xl border bg-card p-5 transition-colors hover:border-primary/50"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <CategoryIcon name={category.icon} className="h-5 w-5 text-primary" />
            </div>
            <h2 className="mb-1 font-semibold">{category.label}</h2>
            <p className="mb-3 text-sm text-muted-foreground">{category.description}</p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              Learn more
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </main>
  )
}
