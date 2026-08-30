"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import type { CoachApplication } from "@/lib/coach"
import { Check, Inbox, Loader2, X } from "lucide-react"

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

/**
 * The review queue.
 *
 * Rejecting takes a note because the applicant sees it — "not enough detail
 * about the group you coach" is actionable, a silent no is not.
 */
export function CoachApplicationsTable({
  pending,
  decided,
}: {
  pending: CoachApplication[]
  decided: CoachApplication[]
}) {
  const router = useRouter()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [error, setError] = useState("")

  const review = async (id: string, action: "approve" | "reject") => {
    setBusyId(id)
    setError("")

    try {
      const response = await fetch("/api/admin/coach-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: id, action, note: notes[id]?.trim() || null }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Could not save that decision")

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save that decision")
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Card className="border-destructive">
          <CardContent className="py-4 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Pending ({pending.length})</h2>

        {pending.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-10 text-center">
              <Inbox className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Nothing waiting for review.</p>
            </CardContent>
          </Card>
        ) : (
          pending.map((application) => (
            <Card key={application.id}>
              <CardContent className="space-y-4 pt-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {application.display_name || "Unnamed referee"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {application.email || "No email on file"} · applied{" "}
                      {formatDate(application.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {application.association && (
                      <Badge variant="secondary">{application.association}</Badge>
                    )}
                    {application.level && <Badge variant="outline">{application.level}</Badge>}
                  </div>
                </div>

                <p className="whitespace-pre-wrap rounded-lg bg-muted/50 p-4 text-sm text-foreground">
                  {application.reason}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    value={notes[application.id] || ""}
                    onChange={(e) => setNotes({ ...notes, [application.id]: e.target.value })}
                    placeholder="Note back to the applicant (required to reject)"
                    className="min-w-[240px] flex-1"
                    aria-label={`Note for ${application.display_name || "applicant"}`}
                  />
                  <Button
                    onClick={() => review(application.id, "approve")}
                    disabled={busyId === application.id}
                  >
                    {busyId === application.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => review(application.id, "reject")}
                    disabled={busyId === application.id || !notes[application.id]?.trim()}
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </section>

      {decided.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Decided ({decided.length})</h2>
          <div className="space-y-2">
            {decided.map((application) => (
              <Card key={application.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">
                      {application.display_name || "Unnamed referee"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {application.review_note || application.reason}
                    </p>
                  </div>
                  <Badge variant={application.status === "approved" ? "default" : "outline"}>
                    {application.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
