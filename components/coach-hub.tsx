import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { CoachOverview } from "@/lib/coach-overview"
import {
  ArrowRight,
  Film,
  Layers,
  Library,
  MessageSquare,
  Plus,
  Radio,
  UsersRound,
} from "lucide-react"

/**
 * A coach's home.
 *
 * Not a pitch — they already have the account. The order is what they came
 * here to do: anything waiting on them first, then the four places they work,
 * then their groups and packs.
 */
export function CoachHub({
  overview,
  expiresAt,
}: {
  overview: CoachOverview
  expiresAt: string | null
}) {
  const { groups, packs, memberCount, unreviewed, pendingSubmissions, liveSession } = overview

  const expiryLabel = expiresAt
    ? new Date(expiresAt).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null

  const places = [
    {
      href: "/scenarios/browse",
      icon: Library,
      title: "Scenario library",
      body: "Every clip, filterable by topic, law and difficulty.",
    },
    {
      href: "/packs/new",
      icon: Plus,
      title: "Build a pack",
      body: "Pick clips, put them in teaching order, send one link.",
    },
    {
      href: "/coach/groups",
      icon: UsersRound,
      title: "Groups",
      body:
        groups.length === 0
          ? "Make a roster your referees join with a code."
          : `${groups.length} group${groups.length === 1 ? "" : "s"} · ${memberCount} referee${memberCount === 1 ? "" : "s"}`,
    },
    {
      href: "/coach/submit",
      icon: Film,
      title: "Send a clip",
      body:
        pendingSubmissions > 0
          ? `${pendingSubmissions} waiting on an admin`
          : "Got footage the library does not have?",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Referee Coach</Badge>
            {expiryLabel ? (
              <Badge variant="outline">Until {expiryLabel}</Badge>
            ) : (
              <Badge variant="outline" className="border-primary/40 text-primary">
                Free for now
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold text-foreground">Coaching</h1>
          <p className="text-sm text-muted-foreground">
            {packs.length === 0
              ? "Start by building a pack — that is what everything else hangs off."
              : `${packs.length} pack${packs.length === 1 ? "" : "s"} · ${groups.length} group${groups.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/packs/new">
            <Plus className="h-4 w-4" />
            New pack
          </Link>
        </Button>
      </div>

      {/* ---- Waiting on you ---------------------------------------------- */}
      {(unreviewed > 0 || liveSession) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {liveSession && (
            <Card className="border-primary/50">
              <CardContent className="flex items-center justify-between gap-3 py-4">
                <div className="flex items-start gap-3">
                  <Radio className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">A session is still running</p>
                    <p className="text-sm text-muted-foreground">
                      Code{" "}
                      <span className="font-mono font-semibold tracking-widest">
                        {liveSession.joinCode}
                      </span>
                    </p>
                  </div>
                </div>
                <Button asChild size="sm">
                  <Link href={`/packs/${liveSession.packId}/live`}>Open</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {unreviewed > 0 && (
            <Card className="border-primary/50">
              <CardContent className="flex items-center justify-between gap-3 py-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">
                      {unreviewed} answer{unreviewed === 1 ? "" : "s"} you have not read
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Open a pack&rsquo;s results to read them and correct the grading.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ---- The four places you work ------------------------------------ */}
      <div className="grid gap-4 sm:grid-cols-2">
        {places.map(({ href, icon: Icon, title, body }) => (
          <Link key={href} href={href} className="group">
            <Card className="h-full transition-colors group-hover:border-primary/50">
              <CardContent className="flex h-full items-start gap-3 pt-6">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold leading-tight text-foreground">{title}</h2>
                  <p className="text-sm text-muted-foreground">{body}</p>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* ---- Your packs --------------------------------------------------- */}
      {packs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Layers className="h-4 w-4" />
              Your packs
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/packs">See all</Link>
            </Button>
          </div>
          <div className="space-y-2">
            {packs.slice(0, 5).map((pack) => (
              <Card key={pack.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{pack.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {pack.itemCount} scenario{pack.itemCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/packs/${pack.id}/results`}>Results</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/packs/${pack.id}/live`}>
                        <Radio className="h-4 w-4" />
                        Live
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ---- Your groups -------------------------------------------------- */}
      {groups.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <UsersRound className="h-4 w-4" />
              Your groups
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/coach/groups">See all</Link>
            </Button>
          </div>
          <div className="space-y-2">
            {groups.slice(0, 5).map((group) => (
              <Card key={group.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <Link
                      href={`/coach/groups/${group.id}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {group.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {group.memberCount} referee{group.memberCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  <span className="font-mono text-sm font-semibold tracking-widest text-muted-foreground">
                    {group.join_code}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        {expiryLabel
          ? `Your coach account runs until ${expiryLabel}. We will be in touch before then.`
          : "Coach accounts are free at the moment. If that changes we will tell you well beforehand."}
      </p>
    </div>
  )
}
