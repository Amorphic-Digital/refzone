import type { Metadata } from 'next'
import Link from 'next/link'
import { ScrollAnimate } from '@/components/marketing/scroll-animate'
import { Breadcrumb } from '@/components/marketing/breadcrumb'
import { GraduationCap, ArrowRight, CheckCircle, BookOpen, Target, Brain, BarChart3, Flame } from 'lucide-react'

export const metadata: Metadata = {
  title: 'How to Become a Football Referee in Australia — Complete Guide',
  description:
    'Complete guide to becoming a football referee in Australia. Courses, costs, age requirements, career pathway, and how to get your first match appointment.',
  openGraph: {
    title: 'How to Become a Football Referee in Australia — Complete Guide',
    description: 'Everything you need to know about becoming a football referee in Australia: courses, requirements, career pathway, and training resources.',
  },
}

const requirements = [
  { label: 'Minimum age', value: '14 years (varies by state)', detail: 'Most Australian states allow referees from age 14. Some junior referee programmes start at 12.' },
  { label: 'Fitness level', value: 'Basic fitness required', detail: 'You will need to pass a fitness test for higher levels. At community level, general fitness is sufficient to start.' },
  { label: 'Course cost', value: '$50–$150 (varies by state)', detail: 'Introductory referee courses in Australia typically cost between $50 and $150. Some associations offer subsidised or free courses for juniors.' },
  { label: 'Course duration', value: '1–2 days', detail: 'Most introductory courses run over a single weekend. Online components may extend the learning over a few weeks.' },
  { label: 'Equipment needed', value: 'Whistle, cards, notebook, watch', detail: 'Basic referee equipment is often provided in the course fee. You will eventually need your own whistle, yellow/red cards, notebook, and a reliable watch.' },
]

const steps = [
  {
    num: 1,
    title: 'Find your state football association',
    body: 'Each Australian state and territory has a football association that manages referee training and registration. Contact your local association to find the next available introductory referee course. The main associations are Football NSW, Football Victoria, Football Queensland, Capital Football (ACT), Football West (WA), Football South Australia, Football Tasmania, and Football Northern Territory.',
    cta: { label: 'View all state associations', href: '/referees/resources-australia' },
  },
  {
    num: 2,
    title: 'Complete an introductory referee course',
    body: 'The introductory referee course covers all 17 Laws of the Game as defined by the International Football Association Board (IFAB). You will learn the fundamentals of match management, on-field positioning, and communication with players and coaches. Most courses include a practical component where you officiate supervised matches. The course is designed for complete beginners — no prior refereeing experience is required.',
    cta: { label: 'Preview the Laws of the Game', href: '/web' },
  },
  {
    num: 3,
    title: 'Register with your local referees branch',
    body: 'After completing your course, register with your local referees branch or association. This connects you with a match appointment system, a mentor, and a community of fellow referees in your area. You will receive a referee number and be eligible for match appointments. In most Australian states, registration is managed through your state football association.',
    cta: null,
  },
  {
    num: 4,
    title: 'Get your first match appointment',
    body: 'New referees in Australia typically start with junior community matches — Under 9s, Under 10s, and Under 11s. These lower-pressure matches let you build confidence and develop your skills in a supportive environment. Expect to officiate 1–3 matches per week during the football season (typically March to September in most states). You will be paid a match fee for every game you officiate.',
    cta: null,
  },
  {
    num: 5,
    title: 'Develop your skills and progress',
    body: 'As you gain experience, you will be assessed by senior referees and mentors. Strong assessments lead to appointments at higher levels — from junior community to senior community, then district, state, and eventually national or international panels. Continuous training is essential at every level. RefZone provides on-demand Laws of the Game quizzes, match scenarios, and AI-powered analysis to supplement your in-person training.',
    cta: { label: 'Start training with RefZone', href: '/auth/sign-up' },
  },
]

const benefits = [
  { title: 'Get paid', desc: 'Referees in Australia earn a match fee for every game. Fees increase as you progress to higher levels.' },
  { title: 'Stay fit', desc: 'Officiating matches keeps you physically active. A typical match involves 8–12 km of running.' },
  { title: 'Build confidence', desc: 'Making decisions under pressure develops leadership skills that transfer to school, work, and life.' },
  { title: 'Stay connected to football', desc: 'Refereeing keeps you involved in the game you love, even if your playing days are behind you.' },
  { title: 'Progress your career', desc: 'Talented referees can progress from community matches to state, national, and even FIFA-level appointments.' },
  { title: 'Join a community', desc: 'Referees form close-knit communities. You will train, travel, and develop alongside fellow officials.' },
]

export default function BecomeARefereePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden px-9 pt-40 pb-12 md:pt-48 md:pb-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-purple-600/10 to-transparent blur-3xl" />
          <div className="absolute -bottom-20 right-[20%] h-[300px] w-[300px] rounded-full bg-pink-600/5 blur-3xl" />
        </div>
        <div className="absolute top-24 left-16 h-1 w-1 rounded-full bg-purple-500/30 animate-pulse-glow" />
        <div className="absolute top-36 right-20 h-1.5 w-1.5 rounded-full bg-pink-500/20 animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="mx-auto max-w-[1420px] text-center">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Become a Referee' }]} />
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.05]">
            <GraduationCap className="h-8 w-8 text-pink-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            How to Become a Football Referee in Australia
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-white/45">
            Everything you need to know about starting your referee journey in Australia.
            From finding your first course to getting your first match appointment — this
            complete guide covers requirements, costs, age limits, and the career pathway
            from grassroots to professional football.
          </p>
          <div className="mt-8 flex items-center justify-center gap-1.5">
            <div className="h-0.5 w-8 rounded-full bg-white/20" />
            <div className="h-0.5 w-12 rounded-full bg-white/20" />
            <div className="h-0.5 w-8 rounded-full bg-white/20" />
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="px-9 py-16 md:py-20 border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1420px]">
          <ScrollAnimate>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Requirements to become a referee
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-[15px] text-white/45">
                The barrier to entry is low — anyone with an interest in football and a willingness to learn can become a referee.
              </p>
            </div>
          </ScrollAnimate>

          <div className="mt-12 mx-auto max-w-3xl space-y-4">
            {requirements.map((req, i) => (
              <ScrollAnimate key={i} delay={i * 40}>
                <div className="flex gap-5 rounded-xl border border-white/10 bg-white/[0.05] p-5">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="font-semibold text-white">{req.label}:</span>
                      <span className="text-sm text-purple-400">{req.value}</span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-white/45">{req.detail}</p>
                  </div>
                </div>
              </ScrollAnimate>
            ))}
          </div>
        </div>
      </section>

      {/* Step-by-step guide */}
      <section className="px-9 py-16 md:py-20 border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1420px]">
          <ScrollAnimate>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Step-by-step guide
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-[15px] text-white/45">
                From your first course to your first match — here is the complete pathway to becoming a football referee in Australia.
              </p>
            </div>
          </ScrollAnimate>

          <div className="mt-12 mx-auto max-w-3xl space-y-6">
            {steps.map((step, i) => (
              <ScrollAnimate key={i} delay={i * 60}>
                <div className="rounded-xl border border-white/10 bg-white/[0.05] p-6">
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-400/10 text-sm font-bold text-purple-400">
                      {step.num}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/45">{step.body}</p>
                      {step.cta && (
                        <Link
                          href={step.cta.href}
                          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          {step.cta.label}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollAnimate>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-9 py-16 md:py-20 border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1420px]">
          <ScrollAnimate>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Why become a football referee?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-[15px] text-white/45">
                Refereeing is one of the most rewarding ways to stay involved in football.
              </p>
            </div>
          </ScrollAnimate>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mx-auto max-w-4xl">
            {benefits.map((b, i) => (
              <ScrollAnimate key={i} delay={i * 50}>
                <div className="rounded-xl border border-white/10 bg-white/[0.05] p-5">
                  <h3 className="font-semibold text-white">{b.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/45">{b.desc}</p>
                </div>
              </ScrollAnimate>
            ))}
          </div>
        </div>
      </section>

      {/* How RefZone helps */}
      <section className="px-9 py-16 md:py-20 border-t border-white/[0.06]">
        <div className="mx-auto max-w-[860px]">
          <ScrollAnimate>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              How RefZone supports new referees in Australia
            </h2>
            <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-white/50">
              <p>
                Your introductory referee course gives you the foundation, but becoming a confident
                referee takes ongoing practice. RefZone bridges the gap between formal training
                sessions with on-demand tools designed specifically for Australian football referees:
              </p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { icon: BookOpen, title: '500+ quiz questions', desc: 'Covering all 17 Laws of the Game at three difficulty levels.', href: '/features/quizzes' },
                { icon: Target, title: '100+ match scenarios', desc: 'Real-game situations with instant expert analysis.', href: '/features/scenarios' },
                { icon: Brain, title: 'AI Decision Lab', desc: 'Ask any Laws of the Game question and get instant answers.', href: '/features/decision-lab' },
                { icon: BarChart3, title: 'Performance analytics', desc: 'Track your accuracy by law and identify weak areas.', href: '/features/analytics' },
              ].map((tool) => (
                <Link key={tool.title} href={tool.href} className="group flex gap-3 rounded-xl border border-white/10 bg-white/[0.05] p-4 transition hover:border-purple-400/40">
                  <tool.icon className="h-5 w-5 shrink-0 text-purple-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white group-hover:text-purple-300 transition-colors">{tool.title}</p>
                    <p className="mt-0.5 text-xs text-white/45">{tool.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-9 py-16 md:py-20">
        <div className="mx-auto max-w-[1420px] text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Ready to start your referee journey?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-white/45">
            Create your free RefZone account and start training today. No credit card required.
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

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Become a Football Referee in Australia',
            description: 'Complete guide to becoming a football referee in Australia — from introductory course to first match appointment.',
            totalTime: 'P14D',
            estimatedCost: { '@type': 'MonetaryAmount', currency: 'AUD', value: '100' },
            step: steps.map((s) => ({
              '@type': 'HowToStep',
              position: s.num,
              name: s.title,
              text: s.body,
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: 'How old do you need to be to referee football in Australia?', acceptedAnswer: { '@type': 'Answer', text: 'Most Australian states allow referees from age 14. Some junior referee programmes start at age 12. Contact your state football association for specific age requirements.' } },
              { '@type': 'Question', name: 'How much does it cost to become a football referee in Australia?', acceptedAnswer: { '@type': 'Answer', text: 'Introductory referee courses in Australia typically cost between $50 and $150. Some associations offer subsidised or free courses for junior referees.' } },
              { '@type': 'Question', name: 'Do football referees get paid in Australia?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Referees in Australia earn a match fee for every game they officiate. Fees vary by level and state, increasing as you progress to higher-level competitions.' } },
              { '@type': 'Question', name: 'How long does it take to become a football referee?', acceptedAnswer: { '@type': 'Answer', text: 'The introductory course takes 1-2 days. After completing the course, you can start officiating matches immediately. Progressing to higher levels takes ongoing training and assessment over months and years.' } },
            ],
          }),
        }}
      />
    </main>
  )
}
