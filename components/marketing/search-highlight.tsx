'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

/**
 * Reads ?highlight= query param, finds matching text on the page,
 * scrolls to the first match, and highlights all matches with a
 * temporary yellow glow animation.
 */
export function SearchHighlight() {
  const searchParams = useSearchParams()
  const highlight = searchParams.get('highlight')

  useEffect(() => {
    if (!highlight || highlight.length < 2) return

    // Small delay to ensure page content is rendered
    const timer = setTimeout(() => {
      const query = highlight.toLowerCase()

      // Find all text-containing elements in main content
      const walker = document.createTreeWalker(
        document.querySelector('main') || document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const text = node.textContent?.toLowerCase() || ''
            if (text.includes(query)) return NodeFilter.FILTER_ACCEPT
            return NodeFilter.FILTER_SKIP
          },
        }
      )

      let firstMatch: Element | null = null
      const highlights: HTMLElement[] = []

      // Walk through matching text nodes and wrap matches in highlight spans
      const nodesToProcess: Text[] = []
      while (walker.nextNode()) {
        nodesToProcess.push(walker.currentNode as Text)
      }

      for (const textNode of nodesToProcess) {
        const parent = textNode.parentElement
        if (!parent || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') continue

        const text = textNode.textContent || ''
        const lowerText = text.toLowerCase()
        const idx = lowerText.indexOf(query)
        if (idx === -1) continue

        // Find the nearest section/heading ancestor to scroll to
        const section = parent.closest('section, [class*="rounded"]')
        if (!firstMatch && section) {
          firstMatch = section as Element
        }

        // Create highlight wrapper
        const before = text.slice(0, idx)
        const match = text.slice(idx, idx + highlight.length)
        const after = text.slice(idx + highlight.length)

        const span = document.createElement('span')
        span.className = 'search-highlight'
        span.textContent = match
        highlights.push(span)

        const fragment = document.createDocumentFragment()
        if (before) fragment.appendChild(document.createTextNode(before))
        fragment.appendChild(span)
        if (after) fragment.appendChild(document.createTextNode(after))

        parent.replaceChild(fragment, textNode)
      }

      // Scroll to first match
      if (firstMatch) {
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }

      // Add highlight styles
      const style = document.createElement('style')
      style.textContent = `
        .search-highlight {
          background: rgba(168, 85, 247, 0.25);
          border-radius: 2px;
          padding: 1px 2px;
          animation: highlight-fade 3s ease-out forwards;
        }
        @keyframes highlight-fade {
          0% { background: rgba(168, 85, 247, 0.4); }
          70% { background: rgba(168, 85, 247, 0.25); }
          100% { background: transparent; }
        }
      `
      document.head.appendChild(style)

      // Clean up highlights after animation
      const cleanup = setTimeout(() => {
        for (const el of highlights) {
          const text = el.textContent || ''
          el.replaceWith(document.createTextNode(text))
        }
        style.remove()
      }, 4000)

      return () => clearTimeout(cleanup)
    }, 300)

    return () => clearTimeout(timer)
  }, [highlight])

  return null
}
