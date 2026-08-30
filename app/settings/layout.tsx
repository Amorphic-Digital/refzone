import type React from "react"
import { AppShell } from "@/components/app-shell"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <AppShell width="narrow">{children}</AppShell>
}
