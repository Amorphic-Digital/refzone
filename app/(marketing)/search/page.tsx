import type { Metadata } from 'next'
import { SearchPageClient } from './search-client'
import { buildSearchIndex } from '@/content/search-index'

export const metadata: Metadata = {
  title: 'Search the Laws of the Game — Referee Knowledge Engine',
  description:
    'Search across all 17 IFAB Laws of the Game, FAQs, and referee training resources. AI-powered answers for football referees in Australia.',
}

// Serialize the search index at build time
const searchIndex = buildSearchIndex().map((item) => ({
  type: item.type,
  title: item.title,
  description: item.description,
  href: item.href,
  badge: item.badge,
  searchText: item.searchText,
}))

export default function SearchPage() {
  return <SearchPageClient searchIndex={searchIndex} />
}
