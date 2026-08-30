import Link from "next/link"
import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { isCoach } from "@/lib/coach"
import { getBranchMembership, listBranchMembers } from "@/lib/referee-branches"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { JoinBranchForm } from "@/components/branch/join-branch-form"
import { CreateBranchButton } from "@/components/branch/create-branch-button"
import {
  LeaveBranchButton,
  TransferOwnershipButton,
} from "@/components/branch/branch-owner-controls"
import { Building2, ChevronRight, Crown, Flame, GraduationCap, Trophy, Users } from "lucide-react"

export const metadata = { title: "Your Branch — RefZone" }

/**
 * The branch: who you referee with.
 *
 * Everything about this page assumes one branch per person, which is what the
 * database enforces. That is what makes "your leaderboard" a question with one
 * answer, and it is why there is no branch list here — there is nothing to
 * choose between.
 */
export default async function BranchPage() {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    redirect("/auth/login")
  }

  const [membership, coach] = await Promise.all([getBranchMembership(userId), isCoach(userId)])

  // ---- Not in a branch yet ------------------------------------------------
  if (!membership) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Your branch"
          description="A branch is the association you actually referee for. Join one and the leaderboard becomes the people you turn up with, instead of nine thousand strangers."
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" />
                Join with a code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Whoever runs your training has a six-character code. Enter it once and you are on
                the roster.
              </p>
              <JoinBranchForm />
            </CardContent>
          </Card>

          <Card className={coach ? undefined : "border-dashed"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-primary" />
                Set one up
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {coach ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    No branch for your association yet? Create it, hand out the code, and you own it
                    until you pass it to another coach.
                  </p>
                  <CreateBranchButton className="w-full" />
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Branches are set up by Referee Coach accounts, so there is always somebody
                    answerable for the roster. Free to apply for.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/coach">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      Apply for a coach account
                    </Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // ---- In a branch --------------------------------------------------------
  const { branch, role, isOwner } = membership
  const members = await listBranchMembers(branch.id)
  const referees = members.filter((member) => member.role === "referee")
  const coaches = members.filter((member) => member.role === "coach")
  const isBranchCoach = role === "coach"

  return (
    <div className="space-y-6">
      <PageHeader
        title={branch.name}
        description={branch.description || branch.region || undefined}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/leaderboard">
                <Trophy className="mr-2 h-4 w-4" />
                Branch leaderboard
              </Link>
            </Button>
            <LeaveBranchButton branchName={branch.name} isOwner={isOwner} />
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        {branch.region && <Badge variant="secondary">{branch.region}</Badge>}
        <Badge variant="outline">
          {referees.length} {referees.length === 1 ? "referee" : "referees"}
        </Badge>
        <Badge variant="outline">
          {coaches.length} {coaches.length === 1 ? "coach" : "coaches"}
        </Badge>
        {isOwner && (
          <Badge className="gap-1">
            <Crown className="h-3 w-3" />
            You own this branch
          </Badge>
        )}
      </div>

      {/* The code is a key to the roster, so only the people running the branch
          see it. A referee who needs it asks their coach, which is the same
          conversation as being told about the branch in the first place. */}
      {isBranchCoach && (
        <Card className="border-primary/40">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 py-5">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Branch code</p>
              <p className="font-mono text-3xl font-bold tracking-[0.2em] text-foreground">
                {branch.join_code}
              </p>
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">
              Referees enter this at <span className="font-medium text-foreground">/branch</span>.
              Coaches who join with it get the same view of the roster you have.
            </p>
          </CardContent>
        </Card>
      )}

      {/* ---- Referees --------------------------------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5" />
            Referees
          </CardTitle>
        </CardHeader>
        <CardContent>
          {referees.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Nobody has joined yet. Read out the code at your next training night.
            </p>
          ) : (
            <ul className="divide-y">
              {referees.map((member, index) => {
                const row = (
                  <div className="flex items-center gap-3 py-3">
                    <span className="w-6 shrink-0 text-sm font-semibold text-muted-foreground">
                      {index + 1}
                    </span>
                    <span className="flex-1 truncate font-medium text-foreground">
                      {member.name}
                      {member.userId === userId && (
                        <span className="ml-2 text-xs text-muted-foreground">(you)</span>
                      )}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Flame className="h-4 w-4 text-orange-500" />
                      {member.currentStreak}
                    </span>
                    <span className="w-20 text-right text-sm tabular-nums text-muted-foreground">
                      {member.totalPoints.toLocaleString()} pts
                    </span>
                    {isBranchCoach && (
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                  </div>
                )

                return (
                  <li key={member.userId}>
                    {/* A coach in the branch can open a referee's answers. That
                        access is what the referee agreed to by joining, and it
                        goes no further than this branch — see
                        canCoachSeeReferee in lib/referee-branches.ts. */}
                    {isBranchCoach ? (
                      <Link
                        href={`/branch/referees/${member.userId}`}
                        className="block rounded-md px-2 transition-colors hover:bg-accent"
                      >
                        {row}
                      </Link>
                    ) : (
                      <div className="px-2">{row}</div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* ---- Coaches ----------------------------------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <GraduationCap className="h-5 w-5" />
            Coaches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {coaches.map((member) => (
              <li key={member.userId} className="flex items-center gap-2 py-3">
                <span className="flex-1 truncate font-medium text-foreground">
                  {member.name}
                  {member.userId === userId && (
                    <span className="ml-2 text-xs text-muted-foreground">(you)</span>
                  )}
                </span>
                {member.isOwner && (
                  <Badge variant="secondary" className="gap-1">
                    <Crown className="h-3 w-3" />
                    Owner
                  </Badge>
                )}
              </li>
            ))}
          </ul>
          <p className="pt-3 text-xs text-muted-foreground">
            Coaches are not ranked on the branch leaderboard — a ladder is between people doing the
            same job.
          </p>
        </CardContent>
      </Card>

      {/* ---- Ownership --------------------------------------------------- */}
      {isOwner && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Crown className="h-5 w-5" />
              Ownership
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TransferOwnershipButton
              coaches={coaches
                .filter((member) => member.userId !== userId)
                .map((member) => ({ userId: member.userId, name: member.name }))}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
