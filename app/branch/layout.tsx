import type React from "react"
import { AppShell } from "@/components/app-shell"

export default function BranchLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
