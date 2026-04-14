import { Suspense } from "react"
import { requireAuth, ensureProfile } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { StatsSkeleton } from "@/components/dashboard/dashboard-skeletons"

export default async function DashboardPage() {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    redirect("/auth/login")
  }

  // ensureProfile is fast for returning users (single SELECT)
  const profile = await ensureProfile(userId)

  return (
    <>
      {/* Shell renders immediately: greeting + CTA cards + pending quiz logic */}
      <DashboardContent profile={profile} />

      {/* Stats, charts, and law breakdown stream in as data resolves */}
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats userId={userId} />
      </Suspense>
    </>
  )
}
