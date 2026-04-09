'use client'

import { useState } from 'react'
import { FlaskConical, X, Loader2, Check } from 'lucide-react'

export function WebBetaBanner() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !email.includes('@')) return
    setStatus('loading')
    try {
      const res = await fetch('/api/web-beta-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="relative border-b" style={{ background: 'var(--m-accent-bg)', borderColor: 'var(--m-border)' }}>
      <div className="mx-auto max-w-[1420px] px-4 sm:px-9 py-4">
        <div className="flex items-start gap-3">
          <FlaskConical className="h-5 w-5 shrink-0 mt-0.5 text-purple-400" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium" style={{ color: 'var(--m-text)' }}>
              RefZone Web is in development
            </p>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--m-text-3)' }}>
              We&apos;re sharing this feature early while we build it. Content may be incomplete or change
              without notice. Feel free to explore, but don&apos;t rely on it yet.
            </p>

            {status === 'success' ? (
              <div className="mt-3 flex items-center gap-2 text-xs text-green-500">
                <Check className="h-3.5 w-3.5" />
                Thanks! We&apos;ll email you when RefZone Web is ready.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-3 flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email to get notified when it's ready"
                  className="rounded-lg border px-3 py-1.5 text-xs w-full max-w-xs focus:outline-none focus:ring-1 focus:ring-purple-400/30"
                  style={{ background: 'var(--m-bg-card)', borderColor: 'var(--m-border)', color: 'var(--m-text)' }}
                  required
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="shrink-0 rounded-lg bg-purple-500/20 px-3 py-1.5 text-xs font-medium text-purple-300 hover:bg-purple-500/30 transition-colors disabled:opacity-50"
                >
                  {status === 'loading' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Notify me'}
                </button>
                {status === 'error' && (
                  <span className="text-xs text-red-400">Something went wrong. Try again.</span>
                )}
              </form>
            )}
          </div>

          <button
            onClick={() => setDismissed(true)}
            className="shrink-0 p-1 rounded transition-colors"
            style={{ color: 'var(--m-text-4)' }}
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
