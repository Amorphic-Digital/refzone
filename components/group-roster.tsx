"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, UserMinus, Users } from "lucide-react"

interface Member {
  userId: string
  name: string
  joinedAt: string
  totalPoints: number
}

/** The roster, with the one action a coach needs on it. */
export function GroupRoster({ groupId, members }: { groupId: string; members: Member[] }) {
  const router = useRouter()
  const [removing, setRemoving] = useState<string | null>(null)

  const remove = async (userId: string) => {
    setRemoving(userId)
    try {
      await fetch(`/api/coach/groups/${groupId}?member=${encodeURIComponent(userId)}`, {
        method: "DELETE",
      })
      router.refresh()
    } finally {
      setRemoving(null)
    }
  }

  if (members.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-10 text-center">
          <Users className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Nobody has joined yet. Read the code out at your next session.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {members.map((member) => (
        <Card key={member.userId}>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div>
              <p className="font-medium text-foreground">{member.name}</p>
              <p className="text-xs text-muted-foreground">
                Joined {new Date(member.joinedAt).toLocaleDateString("en-AU")} ·{" "}
                {member.totalPoints} points
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => remove(member.userId)}
              disabled={removing === member.userId}
              aria-label={`Remove ${member.name} from the group`}
            >
              {removing === member.userId ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserMinus className="h-4 w-4" />
              )}
              Remove
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
