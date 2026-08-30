import type React from "react"
import type { Metadata } from "next"
import { AppShell } from "@/components/app-shell"

export const metadata: Metadata = {
  title: "RefZone",
  description: "Your referee training dashboard",
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
