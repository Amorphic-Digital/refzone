import Link from "next/link"
import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { isCoach } from "@/lib/coach"
import { listGroupsForCoach } from "@/lib/coach-groups"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreateGroupButton } from "@/components/create-group-button"
import { ArrowRight, Users } from "lucide-react"

export const metadata = { title: "Groups — RefZone" }

/**
 * A coach's groups.
 *
 * The roster is what turns "whoever opened my link" into people you can track
 * over a season, assign homework to, and read results for by name.
 */
export default async function CoachGroupsPage() {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    redirect("/auth/login")
  }
  if (!(await isCoach(userId))) redirect("/coach")

  const groups = await listGroupsForCoach(userId)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 text-3xl font-bold text-foreground">Groups</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Your referees, by name. Give the group your join code once and everything you assign
            after that reaches them without another link.
          </p>
        </div>
        <CreateGroupButton />
      </div>

      {groups.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Users className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
            <h2 className="mb-1 font-semibold text-foreground">No groups yet</h2>
            <p className="mx-auto max-w-md text-sm text-muted-foreground">
              Make one for the squad you coach. You get a six-character code — they enter it once
              and they are on your roster.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Link key={group.id} href={`/coach/groups/${group.id}`} className="group">
              <Card className="h-full transition-colors group-hover:border-primary/50">
                <CardContent className="flex h-full flex-col gap-3 pt-6">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-semibold leading-tight text-foreground">{group.name}</h2>
                    <Badge variant="outline" className="shrink-0 gap-1">
                      <Users className="h-3 w-3" />
                      {group.memberCount}
                    </Badge>
                  </div>

                  {group.description && (
                    <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">
                      {group.description}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between border-t pt-3">
                    <span className="font-mono text-sm font-semibold tracking-widest text-foreground">
                      {group.join_code}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 py-5">
          <p className="text-sm text-muted-foreground">
            Referees join at <span className="font-medium text-foreground">/coach/join</span> with
            your code — they do not need a coach account themselves.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/coach/join">See the join page</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
