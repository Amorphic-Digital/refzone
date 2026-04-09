import { NextResponse } from 'next/server'

interface WebResult {
  title: string
  url: string
  snippet: string
  source: string
}

const GOOGLE_CSE_CX = '074d6b7677ec54b59'

/**
 * Searches the web for referee-related content using Google Custom Search.
 * Uses the Google CSE JSON API with the RefZone search engine.
 */
export async function POST(req: Request) {
  try {
    const { query } = await req.json()

    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return NextResponse.json({ results: [] })
    }

    const searchQuery = `football referee ${query.trim()}`
    let results: WebResult[] = []

    const apiKey = process.env.GOOGLE_SEARCH_API_KEY
    if (apiKey) {
      // Use Google Custom Search JSON API
      const res = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${GOOGLE_CSE_CX}&q=${encodeURIComponent(searchQuery)}&num=6`
      )
      if (res.ok) {
        const data = await res.json()
        results = (data.items || []).map((r: { title: string; link: string; snippet: string }) => ({
          title: r.title || '',
          url: r.link || '',
          snippet: (r.snippet || '').replace(/\n/g, ' '),
          source: (() => { try { return new URL(r.link).hostname.replace('www.', '') } catch { return '' } })(),
        }))
      }
    }

    return NextResponse.json({ results })
  } catch {
    return NextResponse.json({ results: [] })
  }
}
