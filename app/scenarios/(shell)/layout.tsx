import type React from "react"
import { AppShell } from "@/components/app-shell"

/**
 * The ordinary scenario pages — the training session, the category menu, the
 * coach library and a single scenario by id. The chooser lives in the sibling
 * (chooser) group instead, because it wants the panel edge to edge.
 */
export default function ScenariosShellLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
