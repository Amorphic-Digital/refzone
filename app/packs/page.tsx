import Link from "next/link"
import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { isCoach } from "@/lib/coach"
import { listPacksForCoach } from "@/lib/training-packs"
import { createServiceClient } from "@/lib/supabase/service"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShareButton } from "@/components/share-button"
import { categoryLabel } from "@/lib/scenario-categories"
import { BarChart3, CalendarClock, GraduationCap, Layers, Play, Plus, Users } from "lucide-react"

function formatDue(value: string) {
  return new Date(value).toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
}

/**
 * A coach's training packs, plus any pack they have been sent and started.
 *
 * Referees see only the second half: a pack arrives from a coach as a link or
 * as an assignment to a group they are in. Building one means picking from the
 * whole library, which is a coach tool.
 */
export default async function PacksPage() {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    redirect("/auth/login")
  }

  const supabase = createServiceClient()

  const [myPacks, startedResult, coach, membershipsResult] = await Promise.all([
    listPacksForCoach(userId),
    supabase.from("training_pack_progress").select("pack_id").eq("user_id", userId),
    isCoach(userId),
    supabase.from("coach_group_members").select("group_id").eq("user_id", userId),
  ])

  // Packs set as homework to a group this referee is in. These matter more
  // than anything else on the page, so they go at the top with their due date.
  const groupIds = (membershipsResult.data || []).map((row) => row.group_id)
  const { data: assignments } = groupIds.length
    ? await supabase
        .from("pack_assignments")
        .select("pack_id, due_at, training_packs(id, title, description, is_active)")
        .in("group_id", groupIds)
        .order("due_at", { ascending: true, nullsFirst: false })
    : { data: [] }

  const myPackIds = new Set(myPacks.map((p) => p.id))
  const assigned = (assignments || [])
    .filter((row) => (row as any).training_packs?.is_active && !myPackIds.has(row.pack_id))
    // The same pack assigned to two of your groups is still one pack.
    .filter(
      (row, index, all) => all.findIndex((other) => other.pack_id === row.pack_id) === index,
    )

  const assignedIds = new Set(assigned.map((row) => row.pack_id))

  // Packs sent to this user by someone else, that they have started.
  const startedPackIds = [
    ...new Set(
      (startedResult.data || [])
        .map((r) => r.pack_id)
        .filter((id) => !myPackIds.has(id) && !assignedIds.has(id)),
    ),
  ]

  const { data: sharedPacks } = startedPackIds.length
    ? await supabase
        .from("training_packs")
        .select("id, title, description, category, training_pack_items(id)")
        .in("id", startedPackIds)
        .eq("is_active", true)
    : { data: [] }

  const nothingAtAll =
    myPacks.length === 0 && assigned.length === 0 && (sharedPacks || []).length === 0

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 text-3xl font-bold text-foreground">Training Packs</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            {coach
              ? "Group scenarios into a set and send your referees one link. Everything they answer comes back to you in the results view."
              : "Packs your coach has sent you. Each one is a set of clips picked out for your group to work through together."}
          </p>
        </div>
        {coach ? (
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="lg">
              <Link href="/coach/groups">
                <Users className="h-4 w-4" />
                Groups
              </Link>
            </Button>
            <Button asChild size="lg" className="gap-2">
              <Link href="/packs/new">
                <Plus className="h-4 w-4" />
                New pack
              </Link>
            </Button>
          </div>
        ) : (
          /* The only route to the join page for a referee who already has
             packs — the empty state below is gone by then. */
          <Button asChild variant="outline">
            <Link href="/coach/join">
              <Users className="h-4 w-4" />
              Join a group
            </Link>
          </Button>
        )}
      </div>

      {/* ---- Set for you ------------------------------------------------- */}
      {assigned.length > 0 && (
        <div className="space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <CalendarClock className="h-4 w-4" />
            Set for you
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {assigned.map((row) => {
              const pack = (row as any).training_packs
              const overdue = row.due_at && new Date(row.due_at).getTime() < Date.now()

              return (
                <Card key={row.pack_id} className={overdue ? "border-amber-500/50" : undefined}>
                  <CardContent className="flex h-full flex-col gap-3 pt-6">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold leading-tight text-foreground">{pack.title}</h3>
                      {row.due_at && (
                        <Badge variant={overdue ? "destructive" : "outline"} className="shrink-0">
                          {overdue ? "Overdue" : formatDue(row.due_at)}
                        </Badge>
                      )}
                    </div>
                    {pack.description && (
                      <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">
                        {pack.description}
                      </p>
                    )}
                    <Button asChild size="sm" className="mt-auto">
                      <Link href={`/packs/${row.pack_id}`}>
                        <Play className="h-4 w-4" />
                        Start
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {nothingAtAll ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            {coach ? (
              <>
                <Layers className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                <h2 className="mb-1 font-semibold text-foreground">No packs yet</h2>
                <p className="mx-auto mb-5 max-w-md text-sm text-muted-foreground">
                  Build one for your next training night — pick a category like DOGSO, choose the
                  clips, and share the link or QR code with the group.
                </p>
                <Button asChild>
                  <Link href="/packs/new">
                    <Plus className="h-4 w-4" />
                    Build your first pack
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <GraduationCap className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                <h2 className="mb-1 font-semibold text-foreground">Nothing here yet</h2>
                <p className="mx-auto mb-5 max-w-md text-sm text-muted-foreground">
                  Packs arrive as a link from whoever runs your training, or land here once you join
                  their group. If you are the one running it, a Referee Coach account lets you build
                  and send them — free for now.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button asChild variant="outline">
                    <Link href="/coach/join">Join a group</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/coach">Apply for a coach account</Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        myPacks.length > 0 && (
          <div className="space-y-3">
            {assigned.length > 0 && (
              <h2 className="text-lg font-semibold text-foreground">Your packs</h2>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myPacks.map((pack) => (
                <Card key={pack.id} className="flex h-full flex-col">
                  <CardContent className="flex flex-1 flex-col gap-3 pt-6">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-semibold leading-tight text-foreground">{pack.title}</h2>
                      <Badge variant="outline" className="shrink-0">
                        {pack.itemCount}
                      </Badge>
                    </div>

                    {pack.category && (
                      <Badge variant="secondary" className="w-fit">
                        {categoryLabel(pack.category)}
                      </Badge>
                    )}

                    {pack.description && (
                      <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">
                        {pack.description}
                      </p>
                    )}

                    <div className="mt-auto flex flex-wrap gap-2 pt-1">
                      <Button asChild size="sm" className="flex-1">
                        <Link href={`/packs/${pack.id}`}>
                          <Play className="h-4 w-4" />
                          Open
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/packs/${pack.id}/results`} title="Results and settings">
                          <BarChart3 className="h-4 w-4" />
                        </Link>
                      </Button>
                      <ShareButton
                        url={`/share/pack/${pack.share_code}`}
                        title={pack.title}
                        variant="outline"
                        size="sm"
                        iconOnly
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      )}

      {(sharedPacks || []).length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Sent to you</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(sharedPacks || []).map((pack) => (
              <Card key={pack.id} className="flex h-full flex-col">
                <CardContent className="flex flex-1 flex-col gap-3 pt-6">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight text-foreground">{pack.title}</h3>
                    <Badge variant="outline" className="shrink-0">
                      {((pack as any).training_pack_items || []).length}
                    </Badge>
                  </div>
                  {pack.description && (
                    <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">
                      {pack.description}
                    </p>
                  )}
                  <Button asChild size="sm" className="mt-auto">
                    <Link href={`/packs/${pack.id}`}>
                      <Play className="h-4 w-4" />
                      Continue
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
