import Link from "next/link"
import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { getCoachState } from "@/lib/coach"
import { getCoachOverview } from "@/lib/coach-overview"
import { createServiceClient } from "@/lib/supabase/service"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CoachHub } from "@/components/coach-hub"
import { CoachApplicationForm } from "@/components/coach-application-form"
import {
  CalendarClock,
  Clock,
  Film,
  Layers,
  Library,
  Radio,
  Scale,
  Upload,
  Users,
} from "lucide-react"

export const metadata = { title: "Coaching — RefZone" }

const FEATURES = [
  {
    icon: Library,
    title: "The whole library",
    body: "Browse every scenario by topic, law and difficulty, and open any one of them directly.",
  },
  {
    icon: Layers,
    title: "Training packs",
    body: "Put clips in the order you want to teach them and send the group a single link or QR code.",
  },
  {
    icon: Users,
    title: "Your own groups",
    body: "A named roster your referees join with a code, so you can follow them across a season.",
  },
  {
    icon: CalendarClock,
    title: "Homework with due dates",
    body: "Assign a pack to a group. Anyone who has not finished gets a nudge the day before.",
  },
  {
    icon: Scale,
    title: "Results by law",
    body: "Not just which clip was hard — which law the group is weakest on, which is what plans a session.",
  },
  {
    icon: Radio,
    title: "Run a session live",
    body: "One clip on the projector, the room answering on their phones, and you decide when the answer appears.",
  },
  {
    icon: Film,
    title: "Send us footage",
    body: "Got a clip the library does not have? Send it in and we will add it once we have checked it.",
  },
  {
    icon: Upload,
    title: "Share with anyone",
    body: "Make a pack public and it becomes a quiz your whole branch can answer — no account needed.",
  },
]

/**
 * Two pages behind one route.
 *
 * A coach gets their home: what is waiting on them, and the way in to
 * everything. Anyone else gets the pitch and the application form — showing
 * eight cards explaining an account to someone who already has it is the
 * mistake this split exists to avoid.
 */
export default async function CoachPage() {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    redirect("/auth/login")
  }

  const { isCoach, grant, application } = await getCoachState(userId)

  if (isCoach) {
    return <CoachHub overview={await getCoachOverview(userId)} expiresAt={grant.expiresAt} />
  }

  const { data: profile } = await createServiceClient()
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .single()

  const expiryLabel = grant.expiresAt
    ? new Date(grant.expiresAt).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Referee Coach</Badge>
          <Badge variant="outline" className="border-primary/40 text-primary">
            Free for now
          </Badge>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-foreground">Coach a group of referees</h1>
        <p className="text-sm text-muted-foreground">
          A coach account is for people running training — an association mentor, a club referee
          coordinator, anyone taking a session. It turns the app around: instead of being handed the
          next scenario, you choose which ones the group sees.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">There is no charge at the moment.</span>{" "}
          Coach accounts may become a paid feature later on — if that happens we will tell existing
          coaches before anything changes.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <Card key={title}>
            <CardContent className="space-y-2 pt-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <h2 className="font-semibold leading-tight text-foreground">{title}</h2>
              <p className="text-sm text-muted-foreground">{body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {grant.expired ? (
        <Card className="border-amber-500/40">
          <CardContent className="space-y-3 py-8">
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <div>
                <h2 className="font-semibold text-foreground">Your coach account has lapsed</h2>
                <p className="text-sm text-muted-foreground">
                  It ran until {expiryLabel}. Your packs and groups are all still here — get in
                  touch and we will put it back.
                </p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <a href="mailto:support@refzone.com.au?subject=Coach%20account">Email us</a>
            </Button>
          </CardContent>
        </Card>
      ) : application?.status === "pending" ? (
        <Card className="border-dashed">
          <CardContent className="flex items-start gap-3 py-8">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <div>
              <h2 className="font-semibold text-foreground">Application received</h2>
              <p className="text-sm text-muted-foreground">
                We are reading it. Everything above appears here once it is approved — there is
                nothing else you need to do.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <CoachApplicationForm
          defaultName={profile?.display_name || ""}
          previous={
            application?.status === "rejected"
              ? { reason: application.reason, note: application.review_note }
              : null
          }
        />
      )}

      {/* Being coached is the other side of this page, and far more people are
          on that side than this one. */}
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 py-5">
          <p className="text-sm text-muted-foreground">
            Someone coaching <span className="font-medium text-foreground">you</span>? You do not
            need any of this — just their join code.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/coach/join">Join a group</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
