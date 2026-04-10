'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'

interface LawSearchItem {
  num: number
  slug: string
  title: string
  shortDesc: string
  searchTerms: string[]
  sections: { heading: string }[]
  commonQuestions: { q: string }[]
}

interface LawsSearchProps {
  laws: LawSearchItem[]
  onQueryChange: (query: string) => void
}

function buildSuggestions(laws: LawSearchItem[]): string[] {
  const terms = new Set<string>()
  for (const law of laws) {
    terms.add(law.title.toLowerCase())
    for (const t of law.searchTerms) terms.add(t.toLowerCase())
    for (const s of law.sections) terms.add(s.heading.toLowerCase())
    for (const q of law.commonQuestions) {
      terms.add(q.q.toLowerCase().replace(/[?]/g, ''))
    }
  }
  return Array.from(terms).sort()
}

export function LawsSearch({ laws, onQueryChange }: LawsSearchProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const suggestions = useMemo(() => buildSuggestions(laws), [laws])

  const matchedSuggestions = useMemo(() => {
    if (query.length < 2) return []
    const q = query.toLowerCase()
    return suggestions
      .filter((s) => s.includes(q) && s !== q)
      .slice(0, 8)
  }, [query, suggestions])

  useEffect(() => {
    setSelectedIdx(-1)
  }, [matchedSuggestions])

  useEffect(() => {
    onQueryChange(query)
  }, [query, onQueryChange])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function navigateToSearch(searchQuery: string) {
    if (searchQuery.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIdx((prev) => Math.min(prev + 1, matchedSuggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIdx((prev) => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIdx >= 0) {
        const selected = matchedSuggestions[selectedIdx]
        setQuery(selected)
        setFocused(false)
        navigateToSearch(selected)
      } else {
        navigateToSearch(query)
      }
    } else if (e.key === 'Escape') {
      setFocused(false)
      inputRef.current?.blur()
    }
  }

  const showSuggestions = focused && matchedSuggestions.length > 0

  return (
    <div className="relative mx-auto max-w-2xl">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search laws... e.g. offside, penalty kick, handball, red card"
        className="w-full rounded-xl border border-white/10 bg-white/[0.05] py-3.5 pl-12 pr-10 text-[15px] text-white placeholder:text-white/30 focus:border-purple-400/50 focus:outline-none focus:ring-1 focus:ring-purple-400/30 transition-colors"
        aria-label="Search the Laws of the Game"
        aria-expanded={showSuggestions}
        aria-autocomplete="list"
        role="combobox"
      />
      {query && (
        <button
          onClick={() => { setQuery(''); inputRef.current?.focus() }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {showSuggestions && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-white/10 bg-[#0f0f17] shadow-2xl overflow-hidden"
          role="listbox"
        >
          {matchedSuggestions.map((suggestion, i) => (
            <button
              key={suggestion}
              role="option"
              aria-selected={i === selectedIdx}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                i === selectedIdx
                  ? 'bg-purple-400/10 text-white'
                  : 'text-white/50 hover:bg-white/[0.05] hover:text-white/70'
              }`}
              onMouseDown={(e) => {
                e.preventDefault()
                setQuery(suggestion)
                setFocused(false)
                navigateToSearch(suggestion)
              }}
            >
              <Search className="h-3.5 w-3.5 shrink-0 text-white/20" />
              <span>
                {(() => {
                  const idx = suggestion.toLowerCase().indexOf(query.toLowerCase())
                  if (idx === -1) return suggestion
                  return (
                    <>
                      {suggestion.slice(0, idx)}
                      <span className="text-purple-400 font-medium">
                        {suggestion.slice(idx, idx + query.length)}
                      </span>
                      {suggestion.slice(idx + query.length)}
                    </>
                  )
                })()}
              </span>
            </button>
          ))}
          {/* Search button at bottom of suggestions */}
          <button
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm border-t border-white/[0.06] text-purple-400/70 hover:bg-purple-400/[0.05] transition-colors"
            onMouseDown={(e) => {
              e.preventDefault()
              navigateToSearch(query)
            }}
          >
            <Search className="h-3.5 w-3.5 shrink-0" />
            Search &quot;{query}&quot; with AI
          </button>
        </div>
      )}
    </div>
  )
}
