import type React from "react"
import { AppShell } from "@/components/app-shell"

export default function CoachLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
