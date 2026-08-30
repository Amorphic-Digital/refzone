import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { listGroupsForCoach } from "@/lib/coach-groups"
import { getPackResults } from "@/lib/pack-results"
import { loadOwnedPack } from "@/lib/pack-ownership"
import { createServiceClient } from "@/lib/supabase/service"
import { Button } from "@/components/ui/button"
import { ShareButton } from "@/components/share-button"
import { PackResultsView } from "@/components/pack-results-view"
import { ArrowLeft } from "lucide-react"

export const metadata = { title: "Pack results — RefZone" }

/**
 * What the squad did with a pack, plus everything a coach does from here:
 * settings, assignment, review, export and running it live.
 *
 * Coach-only, and specifically the pack owner: these are other people's
 * answers.
 */
export default async function PackResultsPage({ params }: { params: Promise<{ id: string }> }) {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    redirect("/auth/login")
  }

  const { id } = await params
  const pack = await loadOwnedPack(id, userId)

  // Not the coach? Behave as if the results page does not exist rather than
  // confirming the pack belongs to someone else.
  if (!pack) notFound()

  const supabase = createServiceClient()

  const [results, groups, assignmentsResult, sessionResult] = await Promise.all([
    getPackResults(id),
    listGroupsForCoach(userId),
    supabase.from("pack_assignments").select("group_id, due_at").eq("pack_id", id),
    supabase
      .from("pack_live_sessions")
      .select("join_code")
      .eq("pack_id", id)
      .eq("is_open", true)
      .maybeSingle(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Button asChild variant="ghost" size="sm" className="-ml-2 mb-1">
            <Link href="/packs">
              <ArrowLeft className="h-4 w-4" />
              All packs
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground">{pack.title}</h1>
          <p className="text-sm text-muted-foreground">
            {results.participants.length} participant
            {results.participants.length === 1 ? "" : "s"} · {results.items.length} scenarios
            {results.guestCount > 0 && ` · ${results.guestCount} without an account`}
          </p>
        </div>
        <ShareButton url={`/share/pack/${pack.share_code}`} title={pack.title} variant="outline" />
      </div>

      <PackResultsView
        packId={pack.id}
        shareCode={pack.share_code}
        isPublic={pack.is_public}
        collectName={pack.collect_name}
        results={{
          items: results.items,
          participants: results.participants.map((participant) => ({
            key: participant.key,
            name: participant.name,
            isGuest: participant.isGuest,
            answered: participant.answered,
            correct: participant.correct,
            accuracy: participant.accuracy,
            answers: [...participant.byScenario.values()],
          })),
          lawStats: results.lawStats,
          hardest: results.hardest,
        }}
        groups={groups.map((group) => ({ id: group.id, name: group.name }))}
        assignments={(assignmentsResult.data || []).map((row) => ({
          groupId: row.group_id,
          dueAt: row.due_at,
        }))}
        liveCode={sessionResult.data?.join_code ?? null}
      />
    </div>
  )
}
