import type React from "react"
import Link from "next/link"
import { NodumFreeBadge } from "@/components/guest-shell-badge"

/**
 * The shell for no-account pages.
 *
 * Deliberately not the app shell: there is no signed-in user here, so a
 * sidebar full of links that all bounce to a login screen would be worse than
 * no sidebar at all.
 */
export default function PublicPackLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#9114af] to-[#ff5eb8]">
              <span className="text-lg font-bold text-white">R</span>
            </div>
            <span className="text-xl font-bold">
              <span className="bg-gradient-to-r from-[#9114af] to-[#ff5eb8] bg-clip-text text-transparent">
                R
              </span>
              <span className="text-foreground">efZone</span>
            </span>
          </Link>
          <NodumFreeBadge />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
    </div>
  )
}
