import Link from "next/link"
import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { listPacksForCoach } from "@/lib/training-packs"
import { createServiceClient } from "@/lib/supabase/service"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShareButton } from "@/components/share-button"
import { categoryLabel } from "@/lib/scenario-categories"
import { BarChart3, Layers, Play, Plus } from "lucide-react"

/**
 * A coach's training packs, plus any pack they have been sent and started.
 */
export default async function PacksPage() {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    redirect("/auth/login")
  }

  const supabase = createServiceClient()

  const [myPacks, startedResult] = await Promise.all([
    listPacksForCoach(userId),
    supabase.from("training_pack_progress").select("pack_id").eq("user_id", userId),
  ])

  // Packs sent to this user by someone else, that they have started.
  const myPackIds = new Set(myPacks.map((p) => p.id))
  const startedPackIds = [
    ...new Set((startedResult.data || []).map((r) => r.pack_id).filter((id) => !myPackIds.has(id))),
  ]

  const { data: sharedPacks } = startedPackIds.length
    ? await supabase
        .from("training_packs")
        .select("id, title, description, category, training_pack_items(id)")
        .in("id", startedPackIds)
        .eq("is_active", true)
    : { data: [] }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 text-3xl font-bold text-foreground">Training Packs</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Group scenarios into a set and send your referees one link. Everything they answer comes
            back to you in the results view.
          </p>
        </div>
        <Button asChild size="lg" className="gap-2">
          <Link href="/packs/new">
            <Plus className="h-4 w-4" />
            New pack
          </Link>
        </Button>
      </div>

      {myPacks.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Layers className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
            <h2 className="mb-1 font-semibold text-foreground">No packs yet</h2>
            <p className="mx-auto mb-5 max-w-md text-sm text-muted-foreground">
              Build one for your next training night — pick a category like DOGSO, choose the clips,
              and share the link or QR code with the group.
            </p>
            <Button asChild>
              <Link href="/packs/new">
                <Plus className="h-4 w-4" />
                Build your first pack
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
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
                  <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">{pack.description}</p>
                )}

                <div className="mt-auto flex flex-wrap gap-2 pt-1">
                  <Button asChild size="sm" className="flex-1">
                    <Link href={`/packs/${pack.id}`}>
                      <Play className="h-4 w-4" />
                      Open
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/packs/${pack.id}/results`} title="Results">
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
                    <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">{pack.description}</p>
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
