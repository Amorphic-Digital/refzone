import { NextResponse } from 'next/server'

interface WebResult {
  title: string
  url: string
  snippet: string
  source: string
}

/**
 * Searches the web for referee-related content.
 * Supports multiple providers via env vars:
 *   - BRAVE_SEARCH_API_KEY: Brave Search API (recommended, 2000 free queries/month)
 *   - GOOGLE_SEARCH_API_KEY + GOOGLE_SEARCH_CX: Google Custom Search
 *   - Falls back to empty results if no API key is configured
 */
export async function POST(req: Request) {
  try {
    const { query } = await req.json()

    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return NextResponse.json({ results: [] })
    }

    // Always append referee context to ensure relevant results
    const searchQuery = `football referee ${query.trim()}`
    let results: WebResult[] = []

    // Try Brave Search first
    if (process.env.BRAVE_SEARCH_API_KEY) {
      results = await searchBrave(searchQuery)
    }
    // Then Google Custom Search
    else if (process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_CX) {
      results = await searchGoogle(searchQuery)
    }

    // Filter out irrelevant results — must be referee/football related
    const filtered = results.filter((r) => {
      const text = `${r.title} ${r.snippet}`.toLowerCase()
      return (
        text.includes('referee') ||
        text.includes('official') ||
        text.includes('law') ||
        text.includes('ifab') ||
        text.includes('football') ||
        text.includes('soccer') ||
        text.includes('foul') ||
        text.includes('offside') ||
        text.includes('penalty') ||
        text.includes('var') ||
        text.includes('card')
      )
    })

    return NextResponse.json({ results: filtered.slice(0, 6) })
  } catch {
    return NextResponse.json({ results: [] })
  }
}

async function searchBrave(query: string): Promise<WebResult[]> {
  const res = await fetch(
    `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=10`,
    {
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': process.env.BRAVE_SEARCH_API_KEY!,
      },
    }
  )
  if (!res.ok) return []
  const data = await res.json()
  return (data.web?.results || []).map((r: { title: string; url: string; description: string }) => ({
    title: r.title,
    url: r.url,
    snippet: r.description || '',
    source: new URL(r.url).hostname.replace('www.', ''),
  }))
}

async function searchGoogle(query: string): Promise<WebResult[]> {
  const res = await fetch(
    `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.GOOGLE_SEARCH_CX}&q=${encodeURIComponent(query)}&num=10`
  )
  if (!res.ok) return []
  const data = await res.json()
  return (data.items || []).map((r: { title: string; link: string; snippet: string }) => ({
    title: r.title,
    url: r.link,
    snippet: r.snippet || '',
    source: new URL(r.link).hostname.replace('www.', ''),
  }))
}
