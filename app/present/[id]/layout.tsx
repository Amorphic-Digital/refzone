import type React from "react"

/**
 * No shell.
 *
 * Every other page under /packs gets the sidebar and the back bar from
 * app/packs/layout.tsx. This one is going on a wall, so it takes the whole
 * screen and nothing else — a nav rail on a projector is forty people reading
 * links they cannot click.
 */
export default function PresentLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#0b0713] text-white">{children}</div>
}
