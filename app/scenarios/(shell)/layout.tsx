import type React from "react"
import { AppShell } from "@/components/app-shell"

/**
 * The ordinary scenario pages — the category menu, the coach library and a
 * single scenario by id. The chooser and the feed live in the sibling (feed)
 * group instead, because those two want the panel edge to edge.
 */
export default function ScenariosShellLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
