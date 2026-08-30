"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { RefZoneLogo } from "@/components/refzone-logo"
import { NotificationsDropdown } from "@/components/notifications-dropdown"

interface MobileTopBarProps {
  showBackButton?: boolean
  backHref?: string
  backLabel?: string
}

/**
 * The fixed header on mobile: logo, and the bell.
 *
 * Notifications sit here because the bottom bar is for navigation — four
 * places you go — and a dropdown is not one of them. On desktop the bell is in
 * the sidebar header, so this is the same idea in the only place a phone has
 * for it.
 *
 * Rendered once, by MobileBottomNav. Several layouts used to draw a second one
 * directly on top of this.
 */
export function MobileTopBar({
  showBackButton = false,
  backHref = "/dashboard",
  backLabel = "Back",
}: MobileTopBarProps) {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b h-14">
      <div className="relative flex h-full items-center justify-center px-4">
        {showBackButton && (
          <Link
            href={backHref}
            className="absolute left-4 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">{backLabel}</span>
          </Link>
        )}

        <RefZoneLogo href="/dashboard" size="md" />

        <div className="absolute right-2">
          <NotificationsDropdown align="end" />
        </div>
      </div>
    </div>
  )
}
