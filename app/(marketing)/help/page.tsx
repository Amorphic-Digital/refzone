import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, HelpCircle, Mail, Shield, Zap, Users, BarChart3, FlaskConical, Target, Trophy, ArrowRight } from 'lucide-react'
import { faqPage } from '@/content/marketing'
import { FaqAccordion } from '@/components/marketing/faq-accordion'
import { ScrollAnimate } from '@/components/marketing/scroll-animate'

export const metadata: Metadata = {
  title: 'Help Center — How to Use RefZone Referee Training Platform',
  description:
    'Find answers to common questions about RefZone. Guides for quizzes, scenarios, Decision Lab, analytics, streaks, and account settings for football referees.',
}

const categories = [
  {
    icon: Zap,
    title: 'Getting Started',
    description: 'Create your account, take your first quiz, and understand your dashboard.',
    href: '/help/getting-started',
    articles: ['Account setup', 'Your first scenario', 'Your first quiz', 'Understanding the dashboard'],
  },
  {
    icon: Target,
    title: 'Scenarios',
    description: 'How video scenarios work, submitting decisions, and scenario streaks.',
    href: '/help/scenarios',
    articles: ['How scenarios work', 'Submitting decisions', 'Scenario streaks', 'Points and scoring'],
  },
  {
    icon: BookOpen,
    title: 'Quizzes',
    description: 'Quiz formats, finding quizzes, taking quizzes, and generating practice quizzes.',
    href: '/help/quizzes',
    articles: ['Quiz formats', 'Finding quizzes', 'Taking a quiz', 'Generating practice quizzes'],
  },
  {
    icon: FlaskConical,
    title: 'Decision Lab',
    description: 'How to use the AI scenario analyzer, example prompts, and tips.',
    href: '/help/decision-lab',
    articles: ['What is Decision Lab', 'How to use it', 'Example prompts', 'Tips for better results'],
  },
  {
    icon: BarChart3,
    title: 'Performance Analytics',
    description: 'Activity charts, law-by-law breakdown, recommendations, and how data is calculated.',
    href: '/help/analytics',
    articles: ['Dashboard overview', 'Activity chart', 'Law breakdown', 'Recommendations'],
  },
  {
    icon: Trophy,
    title: 'Streaks & Points',
    description: 'Daily streaks, scenario streaks, points system, and the leaderboard.',
    href: '/help/streaks-and-points',
    articles: ['Daily streaks', 'Scenario streaks', 'Points system', 'Leaderboard'],
  },
  {
    icon: Users,
    title: 'Weekly Quiz',
    description: 'The free public weekly quiz, saving results, and how it differs from regular quizzes.',
    href: '/help/weekly-quiz',
    articles: ['What is the Weekly Quiz', 'Saving your results', 'Weekly vs regular quizzes'],
  },
  {
    icon: Users,
    title: 'Account & Settings',
    description: 'Display name, email, password, multiple devices, and deleting your account.',
    href: '/help/account',
    articles: ['Your profile', 'Display name', 'Multiple devices', 'Deleting your account'],
  },
  {
    icon: Shield,
    title: 'Troubleshooting',
    description: 'Login issues, missing results, video problems, streak resets, and error pages.',
    href: '/help/troubleshooting',
    articles: ['Can\'t log in', 'Results not saving', 'Video not playing', 'Streak reset', 'Error pages'],
  },
]

export default function HelpPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 sm:px-9 pt-40 pb-20 md:pt-48 md:pb-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-purple-600/10 to-transparent blur-3xl" />
        </div>
        <div className="mx-auto max-w-[1420px] text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20">
            <HelpCircle className="h-8 w-8 text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Help Center
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/45">
            Guides, troubleshooting, and answers to common questions about RefZone.
          </p>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />

      {/* Category cards */}
      <section className="px-4 sm:px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <ScrollAnimate key={cat.title}>
                <Link
                  href={cat.href}
                  className="block rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden h-full transition-colors hover:border-purple-500/30 hover:bg-white/[0.05] group"
                >
                  <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-400/10">
                        <cat.icon className="h-5 w-5 text-purple-400" />
                      </div>
                      <h3 className="font-semibold text-white">{cat.title}</h3>
                    </div>
                    <p className="text-sm text-white/45 leading-relaxed mb-4">{cat.description}</p>
                    <ul className="space-y-1.5">
                      {cat.articles.map((article) => (
                        <li key={article} className="flex items-center gap-2 text-xs text-white/30">
                          <span className="h-1 w-1 rounded-full bg-white/20 shrink-0" />
                          {article}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex items-center gap-1 text-sm text-purple-400 group-hover:text-purple-300 transition-colors">
                      Read guide <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              </ScrollAnimate>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 sm:px-9 py-24 md:py-32">
        <div className="mx-auto max-w-2xl">
          <ScrollAnimate>
            <h2 className="text-3xl font-bold text-white text-center md:text-4xl">
              {faqPage.headline}
            </h2>
            <p className="mt-3 text-center text-white/45">
              Quick answers to the most common questions.
            </p>
          </ScrollAnimate>

          <div className="mt-12">
            <FaqAccordion items={faqPage.items} />
          </div>
        </div>
      </section>

      {/* Still need help? */}
      <section className="px-4 sm:px-9 py-24 md:py-32">
        <div className="mx-auto max-w-xl">
          <div className="glass-card rounded-2xl border border-white/10 bg-white/[0.05] p-8 text-center">
            <Mail className="mx-auto h-8 w-8 text-purple-400 mb-4" />
            <h2 className="text-2xl font-bold text-white">Still need help?</h2>
            <p className="mt-2 text-sm text-white/45">
              Can&apos;t find what you&apos;re looking for? Get in touch and we&apos;ll help you out.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white/85 text-black py-2.5 px-5 rounded-xl border border-white/20 hover:bg-white font-medium text-[15px] transition-colors"
              >
                Contact us
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="mailto:support@refzone.com.au"
                className="text-sm text-white/45 hover:text-white transition-colors"
              >
                support@refzone.com.au
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
