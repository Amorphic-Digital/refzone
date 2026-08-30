import type React from "react"
import { AppShell } from "@/components/app-shell"

export default function QuizzesLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
