import type { Metadata } from 'next'
import Link from 'next/link'
import { ScrollAnimate } from '@/components/marketing/scroll-animate'
import { MapPin, ArrowRight, ExternalLink, BookOpen, Users, Award } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Football Referee Resources Australia — State Associations & Training',
  description:
    'Football referee resources for every Australian state. Find your local association, training pathways, and how to become a football referee in Australia with RefZone.',
}

const associations = [
  {
    name: 'Football NSW',
    state: 'New South Wales',
    description:
      'Football NSW oversees referee development across New South Wales, from community-level Saturday morning matches to the NPL NSW competition. Their referee department runs introductory courses, ongoing development workshops, and assessment pathways for referees at every level.',
    trainingInfo:
      'New referees in NSW start with the Football NSW Introductory Referee Course, which covers all 17 Laws of the Game and basic match management. Referees who complete the course can begin officiating junior and community matches immediately. RefZone supplements this pathway with interactive quizzes and scenarios aligned to the IFAB Laws.',
    url: 'https://footballnsw.com.au',
  },
  {
    name: 'Capital Football',
    state: 'Australian Capital Territory',
    description:
      'Capital Football manages referee education and appointment in the ACT region. With a smaller but tightly knit referee community, Capital Football provides personalised development pathways and regular in-person training sessions.',
    trainingInfo:
      'ACT referees benefit from close mentoring relationships and frequent match appointments. Capital Football runs referee courses throughout the year, with an emphasis on practical match experience alongside theoretical knowledge. RefZone helps ACT referees maintain their Laws of the Game knowledge between training sessions.',
    url: 'https://capitalfootball.com.au',
  },
  {
    name: 'Football Queensland',
    state: 'Queensland',
    description:
      'Football Queensland supports one of Australia\'s largest referee communities, spanning from the Gold Coast to Cairns. Their referee development programme covers metropolitan and regional areas, ensuring referees across the state have access to training and assessment opportunities.',
    trainingInfo:
      'Queensland referees face unique challenges including vast distances between grounds, tropical conditions, and a long season. Football Queensland\'s referee courses are available in multiple locations throughout the state. RefZone provides 24/7 on-demand training that bridges the gap between in-person workshops.',
    url: 'https://footballqueensland.com.au',
  },
  {
    name: 'Football West',
    state: 'Western Australia',
    description:
      'Football West manages referee development in Western Australia, supporting referees from Perth\'s metropolitan leagues to regional communities across the state. Their referee programme emphasises accessibility and continuous improvement.',
    trainingInfo:
      'Western Australian referees can begin their journey with Football West\'s introductory courses and progress through the ranks with ongoing assessment and mentoring. Given WA\'s geographical spread, online and self-directed training tools like RefZone are particularly valuable for regional referees who may have limited access to in-person workshops.',
    url: 'https://footballwest.com.au',
  },
  {
    name: 'Football Victoria',
    state: 'Victoria',
    description:
      'Football Victoria oversees one of Australia\'s most active football communities. Their referee department manages development from grassroots to the NPL Victoria competition, with a strong emphasis on structured career pathways and regular assessment.',
    trainingInfo:
      'Victorian referees benefit from a well-established development framework, with regular in-person workshops, match assessments, and mentoring programmes. RefZone complements this framework by providing on-demand Laws of the Game training between official sessions.',
    url: 'https://footballvictoria.com.au',
  },
  {
    name: 'Football South Australia',
    state: 'South Australia',
    description:
      'Football South Australia supports referee education across SA, from Adelaide\'s metropolitan competitions to regional football. Their referee development programme focuses on building competence and confidence at every level.',
    trainingInfo:
      'SA referees follow a structured pathway from community to state-level officiating. Football SA\'s courses cover the Laws of the Game, match management, and positioning. RefZone provides a complementary training tool for SA referees looking to sharpen their knowledge outside of formal sessions.',
    url: 'https://footballsa.com.au',
  },
  {
    name: 'Football Tasmania',
    state: 'Tasmania',
    description:
      'Football Tasmania manages referee development across the island state. With a passionate but smaller football community, Tasmanian referees often benefit from close-knit support networks and regular match experience.',
    trainingInfo:
      'Tasmanian referees can access introductory and advanced courses through Football Tasmania. The state\'s compact geography means referees often officiate frequently, building practical experience quickly. RefZone helps Tasmanian referees stay sharp on the theoretical side between matches.',
    url: 'https://footballtasmania.com.au',
  },
  {
    name: 'Football Northern Territory',
    state: 'Northern Territory',
    description:
      'Football NT supports referee development in the Territory, where football is played year-round in tropical conditions. Referees in the NT face unique challenges including heat management, small panel sizes, and limited access to formal training opportunities.',
    trainingInfo:
      'NT referees often take on matches at multiple levels due to smaller panel sizes. Football NT provides introductory courses and ongoing support. RefZone is especially valuable for NT referees who may have fewer opportunities for in-person training and assessment.',
    url: 'https://footballnt.com.au',
  },
]

const pathwaySteps = [
  {
    title: 'Complete an introductory referee course',
    description:
      'Contact your state football association (listed above) to enrol in a referee introductory course. These typically cover the 17 Laws of the Game, basic match management, and practical on-field positioning. Courses are available for adults and juniors.',
  },
  {
    title: 'Register with your local association',
    description:
      'After completing your course, register with your local referees branch or association. This connects you with a mentor, a match appointment system, and a community of fellow referees in your area.',
  },
  {
    title: 'Start officiating matches',
    description:
      'New referees in Australia typically begin with junior community matches and progress to senior football as their skills develop. Expect to officiate 1–3 matches per week during the season, building practical experience quickly.',
  },
  {
    title: 'Develop your skills with RefZone',
    description:
      'Supplement your on-field experience with RefZone\'s 500+ quiz questions, 100+ match scenarios, and AI-powered Decision Lab. Train anytime, anywhere — whether you\'re preparing for your next match or studying for a promotion assessment.',
  },
]

export default function ResourcesAustraliaPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden px-9 pt-40 pb-20 md:pt-48 md:pb-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-purple-600/10 to-transparent blur-3xl" />
          <div className="absolute -bottom-20 right-[20%] h-[300px] w-[300px] rounded-full bg-pink-600/5 blur-3xl" />
        </div>
        <div className="absolute top-24 left-16 h-1 w-1 rounded-full bg-purple-500/30 animate-pulse-glow" />
        <div className="absolute top-36 right-20 h-1.5 w-1.5 rounded-full bg-pink-500/20 animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="mx-auto max-w-[1420px] text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.05]">
            <MapPin className="h-8 w-8 text-pink-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Football Referee Resources Australia
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-white/45">
            Find your state football association, learn how to become a referee in Australia,
            and discover training resources for every level. RefZone supports referees across
            all Australian states and territories with on-demand Laws of the Game training.
          </p>
          <div className="mt-8 flex items-center justify-center gap-1.5">
            <div className="h-0.5 w-8 rounded-full bg-white/20" />
            <div className="h-0.5 w-12 rounded-full bg-white/20" />
            <div className="h-0.5 w-8 rounded-full bg-white/20" />
          </div>
        </div>
      </section>

      {/* How to become a referee */}
      <section className="px-9 py-24 md:py-32 border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1420px]">
          <ScrollAnimate>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                How to become a football referee in Australia
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-[15px] text-white/45">
                Becoming a football referee in Australia starts with your local state association.
                Here is the typical pathway from course to pitch.
              </p>
            </div>
          </ScrollAnimate>

          <div className="mt-12 mx-auto max-w-3xl space-y-6">
            {pathwaySteps.map((step, i) => (
              <ScrollAnimate key={i} delay={i * 60}>
                <div className="flex gap-5 rounded-xl border border-white/10 bg-white/[0.05] p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-400/10 text-sm font-bold text-purple-400">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/45">{step.description}</p>
                  </div>
                </div>
              </ScrollAnimate>
            ))}
          </div>
        </div>
      </section>

      {/* State associations */}
      <section className="px-9 py-24 md:py-32 border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1420px]">
          <ScrollAnimate>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                State football associations
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-[15px] text-white/45">
                Each Australian state and territory has a football association that manages
                referee training, registration, and development. Find yours below.
              </p>
            </div>
          </ScrollAnimate>

          <div className="mt-12 space-y-6">
            {associations.map((assoc, i) => (
              <ScrollAnimate key={assoc.name} delay={i * 40}>
                <div className="rounded-xl border border-white/10 bg-white/[0.05] p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{assoc.name}</h3>
                      <p className="mt-0.5 text-sm text-purple-400">{assoc.state}</p>
                    </div>
                    <a
                      href={assoc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-white/60 hover:text-white hover:border-white/20 transition-colors"
                      aria-label={`Visit ${assoc.name} website`}
                    >
                      Visit website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-white/45">{assoc.description}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/45">{assoc.trainingInfo}</p>
                </div>
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
            Start your referee training journey
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-white/45">
            Train with 500+ quiz questions and 100+ scenarios covering every Law of the Game.
            Free for all Australian referees.
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
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'How do I become a football referee in Australia?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Contact your state football association to enrol in an introductory referee course. After completing the course, register with your local referees branch and start officiating junior community matches. Use RefZone to supplement your training with quizzes and scenarios.',
                },
              },
              {
                '@type': 'Question',
                name: 'Which state football associations manage referee training in Australia?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Football NSW, Capital Football (ACT), Football Queensland, Football West (WA), Football Victoria, Football South Australia, Football Tasmania, and Football Northern Territory each manage referee training and development in their respective states.',
                },
              },
            ],
          }),
        }}
      />
    </main>
  )
}
