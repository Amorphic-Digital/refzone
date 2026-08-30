import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { isCoach } from "@/lib/coach"
import { listGroupMembers } from "@/lib/coach-groups"
import { createServiceClient } from "@/lib/supabase/service"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GroupRoster } from "@/components/group-roster"
import { ArrowLeft, CalendarClock, Users } from "lucide-react"

export const metadata = { title: "Group — RefZone" }

function formatDue(value: string | null) {
  if (!value) return null
  return new Date(value).toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
}

/** One group: who is in it, and what they have been given. */
export default async function CoachGroupPage({ params }: { params: Promise<{ id: string }> }) {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    redirect("/auth/login")
  }
  if (!(await isCoach(userId))) redirect("/coach")

  const { id } = await params
  const supabase = createServiceClient()

  const { data: group } = await supabase
    .from("coach_groups")
    .select("id, name, description, join_code, coach_id, is_active")
    .eq("id", id)
    .maybeSingle()

  // Someone else's group behaves as if it does not exist.
  if (!group || !group.is_active || group.coach_id !== userId) notFound()

  const [members, assignmentsResult] = await Promise.all([
    listGroupMembers(id),
    supabase
      .from("pack_assignments")
      .select("pack_id, due_at, created_at, training_packs(id, title, is_active)")
      .eq("group_id", id)
      .order("created_at", { ascending: false }),
  ])

  const assignments = (assignmentsResult.data || []).filter(
    (row) => (row as any).training_packs?.is_active,
  )

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-1">
          <Link href="/coach/groups">
            <ArrowLeft className="h-4 w-4" />
            All groups
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-foreground">{group.name}</h1>
        {group.description && (
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{group.description}</p>
        )}
      </div>

      <Card className="border-primary/40">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Join code</p>
            <p className="font-mono text-3xl font-bold tracking-[0.2em] text-foreground">
              {group.join_code}
            </p>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            Referees enter this at <span className="font-medium text-foreground">/coach/join</span>.
            They keep their own account — joining just puts them on your roster.
          </p>
        </CardContent>
      </Card>

      {assignments.length > 0 && (
        <Card>
          <CardContent className="space-y-3 pt-6">
            <h2 className="flex items-center gap-2 font-semibold text-foreground">
              <CalendarClock className="h-4 w-4" />
              Assigned packs
            </h2>
            <div className="space-y-2">
              {assignments.map((assignment) => (
                <div
                  key={assignment.pack_id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3"
                >
                  <Link
                    href={`/packs/${assignment.pack_id}/results`}
                    className="text-sm font-medium text-foreground hover:underline"
                  >
                    {(assignment as any).training_packs.title}
                  </Link>
                  {assignment.due_at ? (
                    <Badge variant="outline">Due {formatDue(assignment.due_at)}</Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">No due date</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Users className="h-4 w-4" />
          Roster ({members.length})
        </h2>
        <GroupRoster groupId={id} members={members} />
      </div>
    </div>
  )
}
