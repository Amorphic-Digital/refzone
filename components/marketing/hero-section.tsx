'use client'

export function HeroSectionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <section
      id="hero-section"
      className="hero-section relative overflow-hidden px-4 sm:px-9 pt-40 pb-20 md:pt-48 md:pb-28"
      style={{ background: 'var(--m-bg)' }}
    >
      {/* ── Layer 1: Gradient orbs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="hero-orb-primary animate-orb absolute -top-[200px] left-[5%] h-[700px] w-[700px] rounded-full bg-gradient-to-br from-purple-600/35 to-pink-500/20 blur-3xl" />
        <div className="hero-orb-secondary animate-orb-delayed absolute -bottom-[120px] right-[10%] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/15 blur-3xl" />
        <div className="hero-orb-tertiary animate-orb absolute -top-[60px] right-[5%] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-amber-500/15 to-orange-500/10 blur-3xl" />
        <div className="hero-orb-center animate-orb-delayed absolute top-[25%] left-[45%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-br from-pink-600/15 to-purple-600/10 blur-3xl" />
      </div>

      {/* ── Layer 2: Pitch SVG — dark mode (white lines) ── */}
      <svg
        className="pitch-lines-dark pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1440 860"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        fill="none"
      >
        <defs>
          <radialGradient id="pitchFadeDark" cx="50%" cy="48%" r="55%">
            <stop offset="0%" stopColor="white" stopOpacity="0.18" />
            <stop offset="55%" stopColor="white" stopOpacity="0.07" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="pitchMaskDark">
            <rect width="1440" height="860" fill="url(#pitchFadeDark)" />
          </mask>
          <filter id="lineGlowDark">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <g mask="url(#pitchMaskDark)" stroke="white" strokeLinecap="round" strokeLinejoin="round">
          <rect x="80" y="80" width="1280" height="700" strokeWidth="1.8" />
          <line x1="720" y1="80" x2="720" y2="780" strokeWidth="1.8" />
          <circle cx="720" cy="430" r="130" strokeWidth="1.8" filter="url(#lineGlowDark)" />
          <circle cx="720" cy="430" r="5" fill="white" opacity="0.5" strokeWidth="0" />
          <rect x="80" y="255" width="198" height="350" strokeWidth="1.8" />
          <rect x="80" y="330" width="88" height="200" strokeWidth="1.8" />
          <rect x="60" y="370" width="20" height="120" strokeWidth="1.4" opacity="0.5" />
          <path d="M 278 300 A 105 105 0 0 1 278 560" strokeWidth="1.8" />
          <circle cx="190" cy="430" r="3.5" fill="white" opacity="0.5" strokeWidth="0" />
          <rect x="1162" y="255" width="198" height="350" strokeWidth="1.8" />
          <rect x="1272" y="330" width="88" height="200" strokeWidth="1.8" />
          <rect x="1360" y="370" width="20" height="120" strokeWidth="1.4" opacity="0.5" />
          <path d="M 1162 300 A 105 105 0 0 0 1162 560" strokeWidth="1.8" />
          <circle cx="1250" cy="430" r="3.5" fill="white" opacity="0.5" strokeWidth="0" />
          <path d="M 80 112 A 32 32 0 0 0 112 80" strokeWidth="1.8" />
          <path d="M 1328 80 A 32 32 0 0 0 1360 112" strokeWidth="1.8" />
          <path d="M 80 748 A 32 32 0 0 1 112 780" strokeWidth="1.8" />
          <path d="M 1328 780 A 32 32 0 0 1 1360 748" strokeWidth="1.8" />
        </g>
      </svg>

      {/* ── Layer 2b: Pitch SVG — light mode (dark indigo lines) ── */}
      <svg
        className="pitch-lines-light pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1440 860"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        fill="none"
      >
        <defs>
          <radialGradient id="pitchFadeLight" cx="50%" cy="48%" r="55%">
            <stop offset="0%" stopColor="#7A3E8C" stopOpacity="0.13" />
            <stop offset="55%" stopColor="#7A3E8C" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#7A3E8C" stopOpacity="0" />
          </radialGradient>
          <mask id="pitchMaskLight">
            {/* Mask must use white/black — convert the gradient to greyscale by using white */}
            <radialGradient id="pitchMaskGradLight" cx="50%" cy="48%" r="55%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="55%" stopColor="white" stopOpacity="0.5" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <rect width="1440" height="860" fill="url(#pitchMaskGradLight)" />
          </mask>
          <filter id="lineGlowLight">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <g mask="url(#pitchMaskLight)" stroke="#7A3E8C" strokeLinecap="round" strokeLinejoin="round" opacity="0.45">
          <rect x="80" y="80" width="1280" height="700" strokeWidth="1.8" />
          <line x1="720" y1="80" x2="720" y2="780" strokeWidth="1.8" />
          <circle cx="720" cy="430" r="130" strokeWidth="1.8" filter="url(#lineGlowLight)" />
          <circle cx="720" cy="430" r="5" fill="#7A3E8C" opacity="0.3" strokeWidth="0" />
          <rect x="80" y="255" width="198" height="350" strokeWidth="1.8" />
          <rect x="80" y="330" width="88" height="200" strokeWidth="1.8" />
          <rect x="60" y="370" width="20" height="120" strokeWidth="1.4" opacity="0.5" />
          <path d="M 278 300 A 105 105 0 0 1 278 560" strokeWidth="1.8" />
          <circle cx="190" cy="430" r="3.5" fill="#7A3E8C" opacity="0.3" strokeWidth="0" />
          <rect x="1162" y="255" width="198" height="350" strokeWidth="1.8" />
          <rect x="1272" y="330" width="88" height="200" strokeWidth="1.8" />
          <rect x="1360" y="370" width="20" height="120" strokeWidth="1.4" opacity="0.5" />
          <path d="M 1162 300 A 105 105 0 0 0 1162 560" strokeWidth="1.8" />
          <circle cx="1250" cy="430" r="3.5" fill="#7A3E8C" opacity="0.3" strokeWidth="0" />
          <path d="M 80 112 A 32 32 0 0 0 112 80" strokeWidth="1.8" />
          <path d="M 1328 80 A 32 32 0 0 0 1360 112" strokeWidth="1.8" />
          <path d="M 80 748 A 32 32 0 0 1 112 780" strokeWidth="1.8" />
          <path d="M 1328 780 A 32 32 0 0 1 1360 748" strokeWidth="1.8" />
        </g>
      </svg>

      {/* ── Layer 3: Dot grid ── */}
      <div className="hero-dot-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* ── Content ── */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  )
}
