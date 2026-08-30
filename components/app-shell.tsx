import type React from "react"
import { NavBar } from "@/components/nav-bar"

/**
 * The frame every signed-in page sits in.
 *
 * There were five slightly different versions of this before — some
 * `h-screen overflow-hidden`, some `min-h-screen`; mobile offsets of pt-20,
 * pt-5 mt-14 and mt-16; and several layouts rendering a second MobileTopBar on
 * top of the one NavBar already draws. The result was content tucked under the
 * mobile header on some pages and floating below it on others.
 *
 * One shell, one offset. NavBar owns the mobile top bar and the bottom nav, so
 * nothing else should render either.
 */
export function AppShell({
  children,
  width = "wide",
}: {
  children: React.ReactNode
  /** `narrow` for reading and forms, `wide` for grids and tables. */
  width?: "narrow" | "wide"
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <NavBar />
      <main className="flex-1 overflow-y-auto bg-background">
        {/* pt-20 clears the fixed 56px mobile header with room to breathe;
            pb-24 clears the fixed bottom nav, which used to crop the last
            control on every long page. */}
        <div
          className={`container mx-auto px-4 pb-24 pt-20 md:px-8 md:pb-12 md:pt-8 ${
            width === "narrow" ? "max-w-3xl" : "max-w-7xl"
          }`}
        >
          {children}
        </div>
      </main>
    </div>
  )
}
