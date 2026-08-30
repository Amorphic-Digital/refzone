"use client"

import { useEffect, useState } from "react"

/**
 * Coach status for the navigation.
 *
 * Both navs mount on every page, and on mobile the desktop nav and the bottom
 * nav mount together — so the request is shared at module scope rather than
 * fired per component. One fetch per page load, whoever asks first.
 *
 * Starts as "not a coach" and fills in. That order matters: the coaching
 * section appearing a moment late is unremarkable, whereas assuming coach and
 * then removing four links would flicker on every page for every referee.
 */

export interface CoachStatus {
  isCoach: boolean
  expiresAt: string | null
  expired: boolean
  pending: boolean
}

const UNKNOWN: CoachStatus = { isCoach: false, expiresAt: null, expired: false, pending: false }

let cached: CoachStatus | null = null
let inFlight: Promise<CoachStatus> | null = null

function load(): Promise<CoachStatus> {
  if (cached) return Promise.resolve(cached)

  inFlight ??= fetch("/api/coach/me")
    .then((response) => (response.ok ? response.json() : UNKNOWN))
    .then((data: CoachStatus) => {
      cached = { ...UNKNOWN, ...data }
      return cached
    })
    .catch(() => UNKNOWN)
    // A failed lookup should not poison the cache — the next page can retry.
    .finally(() => {
      inFlight = null
    })

  return inFlight
}

/** Clears the cache, for when a grant changes mid-session. */
export function refreshCoachStatus() {
  cached = null
}

/**
 * @param enabled pass false while there is no session — a signed-out visitor is
 *   never a coach, so the request is pure waste on every page they load.
 */
export function useCoachStatus(enabled = true): CoachStatus {
  const [status, setStatus] = useState<CoachStatus>(cached ?? UNKNOWN)

  useEffect(() => {
    if (!enabled) return

    let active = true
    void load().then((next) => {
      if (active) setStatus(next)
    })
    return () => {
      active = false
    }
  }, [enabled])

  return status
}
