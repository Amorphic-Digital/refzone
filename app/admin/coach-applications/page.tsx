import Link from "next/link"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import type { CoachApplication } from "@/lib/coach"
import { CoachApplicationsTable } from "./applications-table"
import { ArrowLeft } from "lucide-react"

export const metadata = { title: "Coach Applications — Admin" }

/** The Referee Coach review queue: pending first, then whatever was decided. */
export default async function CoachApplicationsPage() {
  try {
    await requireAdmin()
  } catch {
    redirect("/auth/login")
  }

  const { data } = await createServiceClient()
    .from("coach_applications")
    .select("*")
    .order("created_at", { ascending: false })

  const applications = (data || []) as CoachApplication[]
  const pending = applications.filter((a) => a.status === "pending")
  const decided = applications.filter((a) => a.status !== "pending")

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin"
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Admin
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Coach Applications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Approving one opens the whole scenario library and the pack builder to that account.
          </p>
        </div>
      </div>

      <CoachApplicationsTable pending={pending} decided={decided} />
    </div>
  )
}
