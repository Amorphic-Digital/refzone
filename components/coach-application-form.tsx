"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send, XCircle } from "lucide-react"

const MIN_REASON = 40

/**
 * The Referee Coach application.
 *
 * Short on purpose — an admin reads these by hand, and the only question that
 * really decides it is "who are you coaching, and why do you need the whole
 * library to do it".
 */
export function CoachApplicationForm({
  defaultName,
  previous,
}: {
  defaultName: string
  /** A previous rejection, so the applicant can see the note and try again. */
  previous: { reason: string; note: string | null } | null
}) {
  const router = useRouter()

  const [association, setAssociation] = useState("")
  const [level, setLevel] = useState("")
  const [reason, setReason] = useState(previous?.reason || "")
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState("")

  const tooShort = reason.trim().length < MIN_REASON

  const submit = async () => {
    if (tooShort) {
      setError(`Please write a bit more — at least ${MIN_REASON} characters.`)
      return
    }

    setIsSending(true)
    setError("")

    try {
      const response = await fetch("/api/coach/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: defaultName,
          association: association.trim(),
          level: level.trim(),
          reason: reason.trim(),
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Could not send your application")

      // The page re-renders into the "application received" state.
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your application")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Card>
      <CardContent className="space-y-5 pt-6">
        <div>
          <h2 className="font-semibold text-foreground">Apply for a coach account</h2>
          <p className="text-sm text-muted-foreground">
            An admin reads every application. Approval is usually a day or two, and the account
            is free — we may charge for coach accounts in future, with notice.
          </p>
        </div>

        {previous && (
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-4 text-sm">
            <p className="font-medium text-foreground">Your last application was not approved</p>
            {previous.note ? (
              <p className="mt-1 text-muted-foreground">{previous.note}</p>
            ) : (
              <p className="mt-1 text-muted-foreground">
                No reason was recorded. Add any detail you can and send it again.
              </p>
            )}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="coach-association">Association or club</Label>
            <Input
              id="coach-association"
              value={association}
              onChange={(e) => setAssociation(e.target.value)}
              placeholder="e.g. Football West"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coach-level">Level you coach at</Label>
            <Input
              id="coach-level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="e.g. Metro Div 2, junior development"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="coach-reason">
            Who are you coaching, and what would you use the library for?{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="coach-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={5}
            placeholder="e.g. I run the Thursday night session for about fifteen junior referees. I want to build a DOGSO pack for next week and go through the clips together."
          />
          <p className="text-xs text-muted-foreground">
            {tooShort
              ? `${MIN_REASON - reason.trim().length} more characters`
              : "That is plenty — thanks."}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-500/10">
            <XCircle className="h-5 w-5 shrink-0 text-red-500" />
            <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
          </div>
        )}

        <Button onClick={submit} disabled={isSending || tooShort} className="w-full" size="lg">
          {isSending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send application
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
