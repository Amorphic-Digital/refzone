import type React from "react"
import { NavBar } from "@/components/nav-bar"
import { BackButton } from "@/components/back-button"
import { MobileTopBar } from "@/components/mobile-top-bar"

/**
 * Back goes to the dashboard, not to Scenarios. Packs used to be reachable
 * only through the scenario pages; they are a nav item in their own right now,
 * and a referee opening a pack their coach set them has not come via
 * Scenarios at all.
 */
export default function PacksLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <NavBar />
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="hidden md:block sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b p-4">
          <BackButton href="/dashboard" label="Back to Dashboard" />
        </div>
        <MobileTopBar showBackButton backHref="/dashboard" backLabel="Back to Dashboard" />
        <div className="container mx-auto md:p-8 p-4 md:pt-8 max-w-7xl pt-5 md:mt-0 mt-14">{children}</div>
      </main>
    </div>
  )
}
