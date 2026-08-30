"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Loader2 } from "lucide-react"

/** Enter the code your coach read out. */
export function JoinGroupForm() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState("")
  const [joined, setJoined] = useState<string | null>(null)

  const join = async () => {
    setIsJoining(true)
    setError("")
    setJoined(null)

    try {
      const response = await fetch("/api/coach/groups/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Could not join that group")

      setJoined(data.alreadyMember ? `You are already in ${data.group.name}` : data.group.name)
      setCode("")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not join that group")
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <Label htmlFor="join-code">Join code</Label>
          <Input
            id="join-code"
            value={code}
            // Codes are read out, not copied, so typing them in caps is normal
            // and the lookup is case-insensitive anyway.
            onChange={(e) => setCode(e.target.value.trim().toLowerCase())}
            onKeyDown={(e) => e.key === "Enter" && code.trim() && join()}
            placeholder="e.g. k7mfp2"
            className="font-mono text-lg tracking-widest"
            maxLength={12}
            autoFocus
          />
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        {joined && (
          <p className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            {joined.startsWith("You are already") ? joined : `Joined ${joined}`}
          </p>
        )}

        <Button onClick={join} disabled={isJoining || !code.trim()} className="w-full">
          {isJoining ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Join
        </Button>
      </CardContent>
    </Card>
  )
}
