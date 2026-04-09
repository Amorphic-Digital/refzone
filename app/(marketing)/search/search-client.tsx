'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, X, ArrowRight, Sparkles, BookOpen, HelpCircle, Zap, FileText, Loader2, Mail } from 'lucide-react'
import { type SearchResult, type ScoredResult, searchContentScored } from '@/content/search-index'

interface Props {
  searchIndex: SearchResult[]
}

const typeIcons: Record<string, typeof BookOpen> = {
  law: BookOpen,
  'law-faq': HelpCircle,
  faq: HelpCircle,
  feature: Zap,
  page: FileText,
}

const badgeColors: Record<string, string> = {
  law: 'bg-purple-400/10 text-purple-400',
  'law-faq': 'bg-blue-400/10 text-blue-400',
  faq: 'bg-green-400/10 text-green-400',
  feature: 'bg-pink-400/10 text-pink-400',
  page: 'bg-amber-400/10 text-amber-400',
}

/** Build a URL with a highlight hash so the target page can scroll + highlight */
function buildHighlightHref(href: string, query: string): string {
  return `${href}?highlight=${encodeURIComponent(query)}`
}

export function SearchPageClient({ searchIndex }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery)
  const [completion, setCompletion] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiFailed, setAiFailed] = useState(false)
  const hasSearched = submittedQuery.length >= 2

  // Fetch AI answer (non-streaming JSON)
  const fetchAiAnswer = useCallback(async (q: string) => {
    setCompletion('')
    setAiLoading(true)
    setAiFailed(false)
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      })
      if (!res.ok) {
        setAiFailed(true)
        setAiLoading(false)
        return
      }
      const data = await res.json()
      if (data.text) {
        setCompletion(data.text)
      } else {
        setAiFailed(true)
      }
    } catch {
      setAiFailed(true)
    }
    setAiLoading(false)
  }, [])

  // Scored search results split into relevance tiers
  const scoredResults = useMemo(
    () => searchContentScored(submittedQuery, searchIndex),
    [submittedQuery, searchIndex]
  )

  const highRelevance = useMemo(() => scoredResults.filter((r) => r.relevance === 'high'), [scoredResults])
  const otherRelevance = useMemo(() => scoredResults.filter((r) => r.relevance !== 'high'), [scoredResults])
  const totalResults = scoredResults.length

  // Group a set of scored results by type
  function groupByType(items: ScoredResult[]): Record<string, SearchResult[]> {
    const groups: Record<string, SearchResult[]> = {}
    for (const r of items) {
      const key = r.item.type === 'law-faq' ? 'law' : r.item.type
      if (!groups[key]) groups[key] = []
      groups[key].push(r.item)
    }
    return groups
  }

  const highGrouped = useMemo(() => groupByType(highRelevance), [highRelevance])
  const otherGrouped = useMemo(() => groupByType(otherRelevance), [otherRelevance])

  const groupLabels: Record<string, string> = {
    law: 'Laws of the Game',
    faq: 'Frequently Asked Questions',
    feature: 'Features & Tools',
    page: 'Pages & Resources',
  }

  // Trigger search
  const executeSearch = useCallback(
    (q: string) => {
      if (q.trim().length < 2) return
      const trimmed = q.trim()
      setSubmittedQuery(trimmed)
      router.replace(`/search?q=${encodeURIComponent(trimmed)}`, { scroll: false })
      fetchAiAnswer(trimmed)
    },
    [router, fetchAiAnswer]
  )

  // Auto-search on page load if query param exists
  useEffect(() => {
    if (initialQuery.length >= 2) {
      executeSearch(initialQuery)
    }
    inputRef.current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    executeSearch(query)
  }

  // Format AI text with bold markdown
  function formatAIText(text: string) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="text-white font-semibold">
            {part.slice(2, -2)}
          </strong>
        )
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <main className="min-h-screen">
      {/* Search header */}
      <section className="relative px-9 pt-32 pb-8 md:pt-40 md:pb-12">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-purple-600/8 to-transparent blur-3xl" />
        </div>
        <div className="mx-auto max-w-3xl">
          {/* Branding */}
          <Link href="/web" className="mb-6 inline-flex items-center gap-2 text-[var(--m-text-4)] hover:text-white/60 transition-colors text-sm">
            <BookOpen className="h-4 w-4" />
            <span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">RefZone</span>
              {' '}Web
            </span>
          </Link>

          {/* Search form */}
          <form onSubmit={handleSubmit} className="relative">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--m-text-4)] pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anything... offside, red card, penalty kick, handball..."
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] py-4 pl-14 pr-24 text-[16px] text-white placeholder:text-white/25 focus:border-purple-400/50 focus:outline-none focus:ring-1 focus:ring-purple-400/30 transition-colors"
              aria-label="Search the Laws of the Game"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); inputRef.current?.focus() }}
                className="absolute right-20 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-purple-500/20 px-4 py-2 text-sm font-medium text-purple-300 hover:bg-purple-500/30 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Quick suggestions */}
          {!hasSearched && (
            <div className="mt-4 flex flex-wrap gap-2">
              {['offside rule', 'red card', 'penalty kick', 'handball', 'throw-in', 'advantage', 'DOGSO', 'back pass rule'].map((term) => (
                <button
                  key={term}
                  onClick={() => { setQuery(term); executeSearch(term) }}
                  className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs text-[var(--m-text-4)] hover:text-white/70 hover:border-white/15 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      {hasSearched && (
        <section className="px-9 pb-24">
          <div className="mx-auto max-w-3xl">
            {/* AI Summary */}
            <div className="mb-8 rounded-2xl border border-purple-400/15 bg-purple-400/[0.03] p-6">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-400/10">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                </div>
                <span className="text-sm font-medium text-purple-300">AI Summary</span>
                {aiLoading && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-purple-400/50 ml-1" />
                )}
              </div>
              <div className="text-[15px] leading-relaxed text-white/60 space-y-3">
                {completion ? (
                  completion.split('\n\n').map((para, i) => (
                    <p key={i}>{formatAIText(para)}</p>
                  ))
                ) : aiFailed ? (
                  <p className="text-[var(--m-text-4)]">
                    AI Summary is currently unavailable. Browse the results below for answers, or ask your question in{' '}
                    <Link href="/decision-lab" className="text-purple-400 hover:text-purple-300 transition-colors">Decision Lab</Link>.
                  </p>
                ) : aiLoading ? (
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-white/[0.04] animate-pulse" />
                    <div className="h-4 w-4/5 rounded bg-white/[0.04] animate-pulse" />
                    <div className="h-4 w-3/5 rounded bg-white/[0.04] animate-pulse" />
                  </div>
                ) : null}
              </div>
              {completion && (
                <div className="mt-4 pt-3 border-t border-white/[0.06]">
                  <Link
                    href="/decision-lab"
                    className="inline-flex items-center gap-1.5 text-xs text-purple-400/60 hover:text-purple-300 transition-colors"
                  >
                    Ask a follow-up question in Decision Lab
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>

            {/* Result count */}
            <p className="mb-4 text-sm" style={{ color: 'var(--m-text-4)' }}>
              {totalResults} result{totalResults !== 1 ? 's' : ''} for &quot;{submittedQuery}&quot;
            </p>

            {totalResults === 0 && !webLoading && webResults.length === 0 ? (
              <div className="rounded-xl border p-8 text-center" style={{ borderColor: 'var(--m-border)', background: 'var(--m-bg-card)' }}>
                <p style={{ color: 'var(--m-text-3)' }}>No results found. Try a different search term.</p>
                <p className="mt-2 text-sm" style={{ color: 'var(--m-text-5)' }}>
                  Tip: Search for specific terms like &quot;offside&quot;, &quot;penalty&quot;, or &quot;red card&quot;
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Best matches — high relevance internal results */}
                {highRelevance.length > 0 && (
                  <div>
                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--m-text-5)' }}>
                      Best matches
                    </h2>
                    <div className="space-y-2">
                      {Object.entries(highGrouped).map(([type, items]) => (
                        items.map((item, i) => {
                          const Icon = typeIcons[item.type] || FileText
                          return (
                            <Link
                              key={`high-${item.href}-${i}`}
                              href={buildHighlightHref(item.href, submittedQuery)}
                              className="group flex gap-4 rounded-xl border p-4 transition-colors hover:border-purple-400/30"
                              style={{ borderColor: 'var(--m-border)', background: 'var(--m-bg-card)' }}
                            >
                              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: 'var(--m-bg-card-hover)' }}>
                                <Icon className="h-4 w-4 group-hover:text-purple-400 transition-colors" style={{ color: 'var(--m-text-4)' }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium group-hover:text-purple-300 transition-colors truncate" style={{ color: 'var(--m-text)' }}>
                                    {item.title}
                                  </h3>
                                  <span className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-medium ${badgeColors[item.type] || 'bg-white/10 text-white/50'}`}>
                                    {item.badge}
                                  </span>
                                </div>
                                <p className="mt-1 text-sm line-clamp-2" style={{ color: 'var(--m-text-3)' }}>
                                  {item.description}
                                </p>
                              </div>
                              <ArrowRight className="mt-2 h-4 w-4 shrink-0 group-hover:text-purple-400/50 transition-colors" style={{ color: 'var(--m-text-5)' }} />
                            </Link>
                          )
                        })
                      ))}
                    </div>
                  </div>
                )}

                {/* Related — lower relevance internal results */}
                {otherRelevance.length > 0 && (
                  <div>
                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--m-text-5)' }}>
                      Related
                    </h2>
                    <div className="space-y-2">
                      {Object.entries(otherGrouped).map(([type, items]) => (
                        items.map((item, i) => {
                          const Icon = typeIcons[item.type] || FileText
                          return (
                            <Link
                              key={`other-${item.href}-${i}`}
                              href={buildHighlightHref(item.href, submittedQuery)}
                              className="group flex gap-4 rounded-xl border p-3 transition-colors hover:border-purple-400/30"
                              style={{ borderColor: 'var(--m-border)', background: 'var(--m-bg-card)' }}
                            >
                              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md" style={{ background: 'var(--m-bg-card-hover)' }}>
                                <Icon className="h-3.5 w-3.5 group-hover:text-purple-400 transition-colors" style={{ color: 'var(--m-text-5)' }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium group-hover:text-purple-300 transition-colors truncate" style={{ color: 'var(--m-text-2)' }}>
                                  {item.title}
                                </h3>
                                <p className="mt-0.5 text-xs line-clamp-1" style={{ color: 'var(--m-text-4)' }}>
                                  {item.description}
                                </p>
                              </div>
                              <span className={`mt-1 shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-medium ${badgeColors[item.type] || 'bg-white/10 text-white/50'}`}>
                                {item.badge}
                              </span>
                            </Link>
                          )
                        })
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Request a page CTA */}
            <div className="mt-10 rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 text-center">
              <Mail className="mx-auto h-6 w-6 mb-3" style={{ color: 'var(--m-text-5)' }} />
              <h3 className="text-sm font-medium text-white/50">Can&apos;t find what you&apos;re looking for?</h3>
              <p className="mt-1.5 text-xs text-[var(--m-text-4)] max-w-md mx-auto">
                Request a new page on RefZone Web. Tell us what topic you need covered — provide
                as much or as little detail as you like, and we&apos;ll build it.
              </p>
              <a
                href={`mailto:hello@refzone.com.au?subject=RefZone Web Page Request&body=I'd like to request a new page on RefZone Web about:%0A%0A${encodeURIComponent(submittedQuery)}%0A%0ADetails:%0A`}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-medium text-white/60 hover:text-white hover:border-white/20 transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                Request a page
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Empty state — before searching */}
      {!hasSearched && (
        <section className="px-9 pb-24">
          <div className="mx-auto max-w-3xl">
            <div className="mt-8 rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
              <Search className="mx-auto h-10 w-10 text-white/10 mb-4" />
              <h2 className="text-lg font-semibold text-white/50">RefZone Web</h2>
              <p className="mt-2 text-sm text-[var(--m-text-4)] max-w-md mx-auto">
                Search across all 17 IFAB Laws of the Game, FAQs, training resources, and more.
                Get an AI-powered summary alongside relevant pages.
              </p>
              <div className="mt-6 pt-4 border-t border-white/[0.04]">
                <p className="text-xs text-white/20">
                  Want a topic added?{' '}
                  <a href="mailto:hello@refzone.com.au?subject=RefZone Web Page Request" className="text-purple-400/60 hover:text-purple-300 transition-colors">
                    Email hello@refzone.com.au
                  </a>
                  {' '}to request a page.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
