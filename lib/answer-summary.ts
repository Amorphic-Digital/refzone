/**
 * Splitting a stored scenario answer into a call and its reasoning.
 *
 * A scenario's answer is one block of prose an admin typed in. The result card
 * wants two different things out of it: the decision itself, short enough to
 * take in at a glance, and the reasoning behind it underneath.
 *
 * Referees write these answers verdict-first — "Direct free kick + red card.
 * The location of the push (outside the penalty area) changes the restart..."
 * — so the split is almost always the first sentence. That makes a
 * deterministic split good enough to stand as the fallback for when the model
 * does not hand back its own summary, or when the answer check fails outright.
 */

/** Longest a verdict can run before it stops being glanceable. */
const MAX_VERDICT_CHARS = 160

export interface SplitDecision {
  /** The call itself — restart and card. Never empty if the answer was not. */
  verdict: string
  /** The reasoning behind it. Empty when the answer was a single sentence. */
  detail: string
}

export function splitDecision(answer: string | null | undefined): SplitDecision {
  const text = (answer ?? "").trim()
  if (!text) return { verdict: "", detail: "" }

  // A sentence ends at .!? followed by whitespace. Requiring the whitespace is
  // what keeps "Law 12.3" and "0.5x" from being read as sentence endings.
  const match = text.match(/^([\s\S]*?[.!?])\s+([\s\S]*)$/)

  let verdict = (match ? match[1] : text).trim()
  let detail = (match ? match[2] : "").trim()

  // An answer written as one long unbroken sentence would otherwise put the
  // whole essay in the bold line. Cut it at a word boundary and let the rest
  // carry on as the reasoning.
  if (verdict.length > MAX_VERDICT_CHARS) {
    const cut = verdict.lastIndexOf(" ", MAX_VERDICT_CHARS)
    const at = cut > 0 ? cut : MAX_VERDICT_CHARS
    detail = `${verdict.slice(at).trim()} ${detail}`.trim()
    verdict = `${verdict.slice(0, at).trim()}…`
  }

  return { verdict, detail }
}
