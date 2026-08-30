import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { listGroupsForMember } from "@/lib/coach-groups"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { JoinGroupForm } from "@/components/join-group-form"
import { Users } from "lucide-react"

export const metadata = { title: "Join a group — RefZone" }

/**
 * The referee side of groups.
 *
 * No coach account needed — this is for the people being coached. Joining is
 * always their own action: being on a roster means a coach can read their
 * answers, so nobody is added to one behind their back.
 */
export default async function JoinGroupPage() {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    redirect("/auth/login")
  }

  const groups = await listGroupsForMember(userId)

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader
        title="Join a group"
        description="If someone coaches you, they will have given you a six-character code. Entering it puts you on their roster, so the packs they set reach you and they can see how you went."
        back={{ href: "/packs", label: "Training Packs" }}
      />

      <JoinGroupForm />

      {groups.length > 0 && (
        <div className="space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Users className="h-4 w-4" />
            You are in
          </h2>
          {groups.map((group) => (
            <Card key={group.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-2 py-4">
                <div>
                  <p className="font-medium text-foreground">{group.name}</p>
                  <p className="text-xs text-muted-foreground">Coached by {group.coachName}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  Joined {new Date(group.joinedAt).toLocaleDateString("en-AU")}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
