import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type AccentColour = 'purple' | 'pink' | 'emerald' | 'amber' | 'cyan'

interface FeatureHeroProps {
  headline: string
  subheadline: string
  cta?: { label: string; href: string }
  accentColour?: AccentColour
}

const accentOrb: Record<AccentColour, string> = {
  purple: 'from-purple-600/30 to-pink-500/15',
  pink:   'from-pink-600/30 to-purple-500/15',
  emerald:'from-emerald-500/25 to-cyan-500/15',
  amber:  'from-amber-500/25 to-orange-500/15',
  cyan:   'from-cyan-500/25 to-blue-500/15',
}

// Pitch line colours per accent for the light-mode SVG
const accentPitchColour: Record<AccentColour, string> = {
  purple: '#3b0764',
  pink:   '#500724',
  emerald:'#052e16',
  amber:  '#451a03',
  cyan:   '#083344',
}

function PitchSvg({ stroke, gradientId, maskId, filterId }: {
  stroke: string
  gradientId: string
  maskId: string
  filterId: string
}) {
  return (
    <svg
      viewBox="0 0 1440 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      fill="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="45%">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.1" />
          <stop offset="40%" stopColor={stroke} stopOpacity="0.04" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </radialGradient>
        <mask id={maskId}>
          <radialGradient id={`${maskId}-g`} cx="50%" cy="50%" r="45%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="40%" stopColor="white" stopOpacity="0.35" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <rect width="1440" height="600" fill={`url(#${maskId}-g)`} />
        </mask>
        <filter id={filterId}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g mask={`url(#${maskId})`} stroke={stroke} strokeLinecap="round">
        <rect x="80" y="50" width="1280" height="500" strokeWidth="1.8" />
        <line x1="720" y1="50" x2="720" y2="550" strokeWidth="1.8" />
        <circle cx="720" cy="300" r="105" strokeWidth="1.8" filter={`url(#${filterId})`} />
        <circle cx="720" cy="300" r="4" fill={stroke} opacity="0.5" strokeWidth="0" />
        <rect x="80" y="170" width="180" height="260" strokeWidth="1.8" />
        <rect x="80" y="220" width="78" height="160" strokeWidth="1.8" />
        <rect x="65" y="245" width="15" height="110" strokeWidth="1.4" opacity="0.5" />
        <path d="M 260 195 A 90 90 0 0 1 260 405" strokeWidth="1.8" />
        <circle cx="172" cy="300" r="3.5" fill={stroke} opacity="0.5" strokeWidth="0" />
        <rect x="1180" y="170" width="180" height="260" strokeWidth="1.8" />
        <rect x="1282" y="220" width="78" height="160" strokeWidth="1.8" />
        <rect x="1360" y="245" width="15" height="110" strokeWidth="1.4" opacity="0.5" />
        <path d="M 1180 195 A 90 90 0 0 0 1180 405" strokeWidth="1.8" />
        <circle cx="1268" cy="300" r="3.5" fill={stroke} opacity="0.5" strokeWidth="0" />
        <path d="M 80 78 A 28 28 0 0 0 108 50" strokeWidth="1.8" />
        <path d="M 1332 50 A 28 28 0 0 0 1360 78" strokeWidth="1.8" />
        <path d="M 80 522 A 28 28 0 0 1 108 550" strokeWidth="1.8" />
        <path d="M 1332 550 A 28 28 0 0 1 1360 522" strokeWidth="1.8" />
      </g>
    </svg>
  )
}

export function FeatureHero({
  headline,
  subheadline,
  cta,
  accentColour = 'purple',
}: FeatureHeroProps) {
  const orb = accentOrb[accentColour]
  const lightStroke = accentPitchColour[accentColour]

  return (
    <section
      className="relative overflow-hidden px-4 sm:px-9 pt-40 pb-20 md:pt-48 md:pb-24"
      style={{ background: 'var(--m-bg)' }}
    >
      {/* ── Orbs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className={`animate-orb absolute -top-[120px] left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b ${orb} blur-3xl`} />
        <div className="animate-orb-delayed absolute -bottom-[80px] left-[15%] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-purple-600/15 to-pink-500/8 blur-3xl" />
        <div className="animate-orb absolute -bottom-[60px] right-[10%] h-[350px] w-[350px] rounded-full bg-gradient-to-br from-emerald-500/12 to-cyan-500/8 blur-3xl" />
      </div>

      {/* ── Pitch SVG — dark ── */}
      <div className="pitch-lines-dark pointer-events-none absolute inset-0">
        <PitchSvg stroke="white" gradientId="fpd-grad" maskId="fpd-mask" filterId="fpd-glow" />
      </div>

      {/* ── Pitch SVG — light ── */}
      <div className="pitch-lines-light pointer-events-none absolute inset-0">
        <PitchSvg stroke={lightStroke} gradientId="fpl-grad" maskId="fpl-mask" filterId="fpl-glow" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-[3.5rem]">
          {headline}
        </h1>

        <p className="mx-auto mt-5 max-w-lg text-[16px] leading-relaxed text-white/50">
          {subheadline}
        </p>

        {cta && (
          <Link
            href={cta.href}
            className="mt-8 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/85 px-5 py-2.5 text-[15px] font-medium text-black transition-colors hover:bg-white"
          >
            {cta.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </section>
  )
}
