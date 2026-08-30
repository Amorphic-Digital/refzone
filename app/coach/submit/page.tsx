import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { isCoach } from "@/lib/coach"
import { createServiceClient } from "@/lib/supabase/service"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { SubmitScenarioForm } from "@/components/submit-scenario-form"

export const metadata = { title: "Send a clip — RefZone" }

/** A coach sends footage the library does not have. */
export default async function CoachSubmitPage() {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    redirect("/auth/login")
  }
  if (!(await isCoach(userId))) redirect("/coach")

  const { data: submissions } = await createServiceClient()
    .from("scenario_submissions")
    .select("id, video_credit, status, review_note, created_at")
    .eq("submitted_by", userId)
    .order("created_at", { ascending: false })
    .limit(20)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Send us a clip"
        description="Got footage the library does not have? Send it over. An admin checks every clip before it goes in — mainly that we are allowed to use it, which is why the source is required."
        back={{ href: "/coach", label: "Coaching" }}
      />

      <SubmitScenarioForm />

      {(submissions || []).length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">What you have sent</h2>
          {(submissions || []).map((submission) => (
            <Card key={submission.id}>
              <CardContent className="flex flex-wrap items-start justify-between gap-3 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {submission.video_credit}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Sent {new Date(submission.created_at).toLocaleDateString("en-AU")}
                    {submission.review_note ? ` · ${submission.review_note}` : ""}
                  </p>
                </div>
                <Badge
                  variant={
                    submission.status === "approved"
                      ? "default"
                      : submission.status === "rejected"
                        ? "outline"
                        : "secondary"
                  }
                >
                  {submission.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
