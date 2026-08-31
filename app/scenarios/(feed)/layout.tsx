import type React from "react"
import { AppShell } from "@/components/app-shell"

/**
 * The two full-height scenario screens: the chooser at /scenarios and the
 * session at /scenarios/play. Both fill the panel and do their own
 * scrolling, so they get the shell without its container.
 */
export default function ScenariosFeedLayout({ children }: { children: React.ReactNode }) {
  return <AppShell width="full">{children}</AppShell>
}
