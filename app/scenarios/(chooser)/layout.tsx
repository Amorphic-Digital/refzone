import type React from "react"
import { AppShell } from "@/components/app-shell"

/**
 * The scenario chooser at /scenarios. It is two full-height halves, so it
 * takes the shell without its container and fills the panel edge to edge.
 */
export default function ScenariosChooserLayout({ children }: { children: React.ReactNode }) {
  return <AppShell width="full">{children}</AppShell>
}
