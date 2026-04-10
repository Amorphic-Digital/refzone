import Link from 'next/link'
import { ArrowLeft, type LucideIcon } from 'lucide-react'

interface HelpArticleLayoutProps {
  icon: LucideIcon
  title: string
  description: string
  children: React.ReactNode
}

export function HelpArticleLayout({ icon: Icon, title, description, children }: HelpArticleLayoutProps) {
  return (
    <main>
      <section className="relative overflow-hidden px-4 sm:px-9 pt-40 pb-12 md:pt-48 md:pb-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-purple-600/10 to-transparent blur-3xl" />
        </div>
        <div className="mx-auto max-w-3xl">
          <Link
            href="/help"
            className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Help Center
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20">
              <Icon className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">{title}</h1>
              <p className="mt-1 text-white/45">{description}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />

      <section className="px-4 sm:px-9 py-16 md:py-24">
        <div className="mx-auto max-w-3xl prose-invert">
          {children}
        </div>
      </section>
    </main>
  )
}

export function HelpSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      {children}
    </div>
  )
}

export function HelpStep({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-sm font-bold text-purple-400">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <div className="mt-1 text-sm text-white/60 leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

export function HelpTip({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 mb-6">
      <p className="text-sm text-purple-300 leading-relaxed">{children}</p>
    </div>
  )
}

export function HelpList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 mb-6">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm text-white/60">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-400/60 shrink-0" />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  )
}
