"use client"

import { useEffect } from "react"

import "./globals.css"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[RefZone] Global error:", error)
  }, [error])

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="w-full max-w-md space-y-5 text-center">
            <h1 className="text-xl font-semibold">RefZone is temporarily unavailable</h1>
            <p className="text-sm text-muted-foreground">
              We&apos;re having trouble loading the site. Please try again in a moment.
            </p>
            <button
              onClick={reset}
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Try again
            </button>
            {error.digest && (
              <p className="text-xs text-muted-foreground">
                Reference: <span className="font-mono">{error.digest}</span>
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}
