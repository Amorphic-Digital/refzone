import Link from "next/link"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { SubmissionsReview } from "./submissions-review"
import { ArrowLeft } from "lucide-react"

export const metadata = { title: "Coach Submissions — Admin" }

/** Footage coaches have sent in, waiting on a decision. */
export default async function ScenarioSubmissionsPage() {
  try {
    await requireAdmin()
  } catch {
    redirect("/auth/login")
  }

  const supabase = createServiceClient()

  const { data } = await supabase
    .from("scenario_submissions")
    .select("*")
    .order("created_at", { ascending: false })

  const submissions = data || []

  // Names in one query, so the queue reads as people rather than Clerk ids.
  const submitterIds = [...new Set(submissions.map((s) => s.submitted_by))]
  const { data: profiles } = submitterIds.length
    ? await supabase.from("profiles").select("id, display_name").in("id", submitterIds)
    : { data: [] }

  const nameById = new Map((profiles || []).map((p) => [p.id, p.display_name as string]))

  const withNames = submissions.map((submission) => ({
    ...submission,
    submitterName: nameById.get(submission.submitted_by) || "A coach",
  }))

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
          <h1 className="text-2xl font-bold">Coach Submissions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Clips coaches have sent in. Approving one creates the scenario and puts it in the
            library straight away — check the source says we can use the footage.
          </p>
        </div>
      </div>

      <SubmissionsReview
        pending={withNames.filter((s) => s.status === "pending")}
        decided={withNames.filter((s) => s.status !== "pending")}
      />
    </div>
  )
}
