// ============================================================
// SEARCH INDEX — All searchable content across the site
// Powers the referee search engine at /search
// ============================================================

import { lawsOfTheGame } from '@/content/laws-of-the-game'
import { faqPage } from '@/content/marketing'

export interface SearchResult {
  type: 'law' | 'law-faq' | 'faq' | 'feature' | 'page'
  title: string
  description: string
  href: string
  /** Label shown as a badge (e.g. "Law 12", "FAQ", "Feature") */
  badge: string
  /** All searchable text for matching */
  searchText: string
}

// Build the full search index from all site content
export function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = []

  // Law pages
  for (const law of lawsOfTheGame) {
    // Main law page
    results.push({
      type: 'law',
      title: `Law ${law.num}: ${law.title}`,
      description: law.shortDesc,
      href: `/web/${law.slug}`,
      badge: `Law ${law.num}`,
      searchText: [
        law.title,
        law.shortDesc,
        law.intro,
        ...law.sections.map((s) => `${s.heading} ${s.body}`),
        ...law.keyPoints,
        ...(law.searchTerms ?? []),
      ]
        .join(' ')
        .toLowerCase(),
    })

    // FAQ items from each law
    for (const faq of law.commonQuestions) {
      results.push({
        type: 'law-faq',
        title: faq.q,
        description: faq.a.slice(0, 160) + (faq.a.length > 160 ? '...' : ''),
        href: `/web/${law.slug}`,
        badge: `Law ${law.num}`,
        searchText: `${faq.q} ${faq.a}`.toLowerCase(),
      })
    }
  }

  // Homepage FAQ items
  for (const item of faqPage.items) {
    results.push({
      type: 'faq',
      title: item.question,
      description: item.answer.slice(0, 160) + (item.answer.length > 160 ? '...' : ''),
      href: '/#faq',
      badge: 'FAQ',
      searchText: `${item.question} ${item.answer}`.toLowerCase(),
    })
  }

  // Feature pages
  const features = [
    {
      title: 'Match Scenarios — Real Decision Training',
      description: 'Practice 100+ real-game referee scenarios with instant expert analysis. Train your decision-making for offside, fouls, penalties, and advantage.',
      href: '/features/scenarios',
      badge: 'Feature',
      extra: 'scenarios match decisions referee training practice game situations expert analysis feedback law 12 offside penalty advantage',
    },
    {
      title: 'Laws of the Game Quiz — 500+ Questions',
      description: 'Test your knowledge with 500+ quiz questions covering all 17 Laws of the Game. Three difficulty levels with instant explanations.',
      href: '/features/quizzes',
      badge: 'Feature',
      extra: 'quiz questions laws of the game test knowledge difficulty levels easy medium hard referee assessment preparation',
    },
    {
      title: 'Decision Lab — AI Referee Mentor',
      description: 'Ask any football referee question and get instant expert analysis with law references. Your 24/7 Laws of the Game mentor.',
      href: '/features/decision-lab',
      badge: 'Feature',
      extra: 'AI analysis mentor referee question law reference instant answer decision lab chat assistant',
    },
    {
      title: 'Performance Analytics — Track Your Progress',
      description: 'Track your referee training with accuracy dashboards, law-by-law breakdowns, and 7-day activity charts.',
      href: '/features/analytics',
      badge: 'Feature',
      extra: 'analytics dashboard accuracy performance tracking law breakdown activity chart progress stats',
    },
    {
      title: 'Daily Training Streaks',
      description: 'Build consistent referee training habits with daily streaks and activity tracking.',
      href: '/features/gamification',
      badge: 'Feature',
      extra: 'streaks daily training consistency habit activity calendar personal bests',
    },
  ]
  for (const f of features) {
    results.push({
      type: 'feature',
      title: f.title,
      description: f.description,
      href: f.href,
      badge: f.badge,
      searchText: `${f.title} ${f.description} ${f.extra}`.toLowerCase(),
    })
  }

  // Static pages
  const pages = [
    {
      title: 'How to Become a Football Referee in Australia',
      description: 'Complete guide: courses, costs, age requirements, career pathway, and how to get your first match appointment.',
      href: '/become-a-referee',
      extra: 'become referee australia course cost age requirements career pathway first match football NSW Victoria Queensland',
    },
    {
      title: 'Football Referee Resources Australia',
      description: 'State football associations, referee training pathways, and resources for every Australian state.',
      href: '/referees/resources-australia',
      extra: 'Football NSW Capital Football Football Queensland Football West Football Victoria Football SA associations state training',
    },
    {
      title: 'Referee Career Pathway — Community to FIFA',
      description: 'The Australian referee career pathway: community, district, state, national, and FIFA levels.',
      href: '/referees/career',
      extra: 'career pathway promotion assessment community district state national FIFA referee levels progression',
    },
    {
      title: 'Free Weekly Referee Quiz',
      description: '15 new Laws of the Game questions every week. Instant results, no sign-up required.',
      href: '/weekly-quiz',
      extra: 'weekly quiz free laws of the game 15 questions no signup instant results',
    },
    {
      title: 'Referee Match Preparation Guide',
      description: 'Pre-match checklist, mental warm-up, scenario practice, and positioning review.',
      href: '/referees/match-preparation',
      extra: 'match preparation pre-match checklist warm up positioning review game ready referee kit',
    },
  ]
  for (const p of pages) {
    results.push({
      type: 'page',
      title: p.title,
      description: p.description,
      href: p.href,
      badge: 'Page',
      searchText: `${p.title} ${p.description} ${p.extra}`.toLowerCase(),
    })
  }

  return results
}

export interface ScoredResult {
  item: SearchResult
  score: number
  relevance: 'high' | 'medium' | 'low'
}

// Stop words that add noise to search matching
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'can', 'shall', 'to', 'of', 'in', 'for',
  'on', 'with', 'at', 'by', 'from', 'as', 'into', 'about', 'between',
  'through', 'during', 'before', 'after', 'it', 'its', 'this', 'that',
  'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they', 'me', 'him',
  'her', 'us', 'them', 'my', 'your', 'his', 'our', 'their', 'what',
  'which', 'who', 'whom', 'when', 'where', 'why', 'how', 'not', 'no',
  'nor', 'and', 'but', 'or', 'if', 'then', 'so', 'than', 'too', 'very',
  'just', 'also', 'only', 'need', 'needs', 'get', 'got',
])

/** Score and rank search results for a query, returning scored results with relevance tiers */
export function searchContentScored(query: string, index: SearchResult[]): ScoredResult[] {
  if (!query || query.length < 2) return []
  const q = query.toLowerCase().trim()
  // Filter out stop words for individual term matching
  const allTerms = q.split(/\s+/).filter(Boolean)
  const meaningfulTerms = allTerms.filter((t) => !STOP_WORDS.has(t) && t.length > 2)
  // If all terms are stop words, use the full query as a phrase
  const terms = meaningfulTerms.length > 0 ? meaningfulTerms : allTerms

  const scored = index
    .map((item) => {
      let score = 0
      const titleLower = item.title.toLowerCase()
      const descLower = item.description.toLowerCase()

      // Full phrase match (highest value)
      if (item.searchText.includes(q)) score += 15
      if (titleLower.includes(q)) score += 30
      if (descLower.includes(q)) score += 20

      // Multi-word phrase segments (2+ word combos from the meaningful terms)
      if (terms.length >= 2) {
        for (let i = 0; i < terms.length - 1; i++) {
          const bigram = `${terms[i]} ${terms[i + 1]}`
          if (titleLower.includes(bigram)) score += 15
          if (descLower.includes(bigram)) score += 10
          if (item.searchText.includes(bigram)) score += 5
        }
      }

      // Individual meaningful term matches
      for (const term of terms) {
        if (titleLower.includes(term)) score += 6
        if (descLower.includes(term)) score += 4
        if (item.searchText.includes(term)) score += 1
      }

      // Boost law pages and law FAQs
      if (item.type === 'law') score *= 1.4
      if (item.type === 'law-faq') score *= 1.3
      return { item, score }
    })
    .filter((r) => {
      if (r.score <= 0) return false
      // At least one meaningful term must appear in title, description, or badge
      // This prevents showing pages where the term only exists deep in body text
      // that the user won't see on the search result card
      const visible = `${r.item.title} ${r.item.description} ${r.item.badge}`.toLowerCase()
      return terms.some((t) => visible.includes(t))
    })
    .sort((a, b) => b.score - a.score)
    // Deduplicate by href — keep only the highest-scoring result per page
    .filter((r, i, arr) => {
      const firstIdx = arr.findIndex((other) => other.item.href === r.item.href)
      return firstIdx === i
    })
    .slice(0, 15)

  // Determine relevance tiers based on top score
  const topScore = scored[0]?.score || 0
  return scored.map((r) => ({
    ...r,
    relevance: r.score >= topScore * 0.6 ? 'high' : r.score >= topScore * 0.3 ? 'medium' : 'low',
  }))
}

/** Simple wrapper returning just items (backward compat) */
export function searchContent(query: string, index: SearchResult[]): SearchResult[] {
  return searchContentScored(query, index).map((r) => r.item)
}
