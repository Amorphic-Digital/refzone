"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScenarioVideoPlayer } from "@/components/scenario-video-player"
import { ScenarioVideoCredit } from "@/components/scenario-video-credit"
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Radio,
  Square,
} from "lucide-react"

interface LiveScenario {
  id: string
  title: string
  video_url: string | null
  video_credit: string | null
  answer: string | null
}

interface LiveSession {
  id: string
  join_code: string
  current_index: number
  reveal: boolean
  is_open: boolean
}

/**
 * The coach's console.
 *
 * The room polls the session row; this page writes to it. Everything the coach
 * does — next clip, reveal, end — is one small update, which is why a hundred
 * phones in a hall with bad wifi is not a problem here.
 *
 * The official answer is on screen throughout. This is the one view where that
 * is correct: the coach is running the discussion.
 */
export function LiveSessionControl({
  packId,
  packTitle,
  isPublic,
  scenarios,
  session,
}: {
  packId: string
  packTitle: string
  isPublic: boolean
  scenarios: LiveScenario[]
  session: LiveSession | null
}) {
  const router = useRouter()
  const [isBusy, setIsBusy] = useState(false)
  const [error, setError] = useState("")

  const index = session?.current_index ?? 0
  const current = scenarios[index]
  const joinUrl =
    typeof window !== "undefined" && session
      ? `${window.location.origin}/live/${session.join_code}`
      : ""

  const call = async (method: "POST" | "PATCH", body?: Record<string, unknown>) => {
    setIsBusy(true)
    setError("")
    try {
      const response = await fetch(`/api/packs/${packId}/live`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "That did not work")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "That did not work")
    } finally {
      setIsBusy(false)
    }
  }

  if (!isPublic) {
    return (
      <Card className="border-dashed">
        <CardContent className="space-y-3 py-12 text-center">
          <Radio className="mx-auto h-10 w-10 text-muted-foreground" />
          <h1 className="font-semibold text-foreground">Turn on the public link first</h1>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            A live session works by having the room answer on their phones without signing in, so
            this pack needs its public link switched on before you can run one.
          </p>
          <Button asChild variant="outline">
            <Link href={`/packs/${packId}/results`}>Pack settings</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!session) {
    return (
      <Card>
        <CardContent className="space-y-4 py-12 text-center">
          <Radio className="mx-auto h-10 w-10 text-muted-foreground" />
          <div>
            <h1 className="text-xl font-semibold text-foreground">Run {packTitle} live</h1>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              You get a five-character code for the room. Everyone answers on their phone, you hold
              the answer back until they have all had a go, then you move the room on together.
            </p>
          </div>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <Button onClick={() => call("POST")} disabled={isBusy} size="lg">
            {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Radio className="h-4 w-4" />}
            Start the session
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Button asChild variant="ghost" size="sm" className="-ml-2 mb-1">
            <Link href={`/packs/${packId}/results`}>
              <ArrowLeft className="h-4 w-4" />
              Results
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-foreground">{packTitle}</h1>
        </div>
        <Button variant="outline" onClick={() => call("PATCH", { end: true })} disabled={isBusy}>
          <Square className="h-4 w-4" />
          End session
        </Button>
      </div>

      {/* The join code is the thing that goes on the projector, so it is the
          biggest element on the page. */}
      <Card className="border-primary/40">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Join at {typeof window !== "undefined" ? window.location.host : "refzone"}/live
            </p>
            <p className="font-mono text-4xl font-bold tracking-[0.2em] text-foreground">
              {session.join_code}
            </p>
          </div>
          {joinUrl && (
            <img
              src={`/api/qr?url=${encodeURIComponent(joinUrl)}`}
              alt={`QR code for ${joinUrl}`}
              className="h-28 w-28 rounded-lg bg-white p-1"
            />
          )}
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardContent className="py-3 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      {current ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-foreground">{current.title}</h2>
              <Badge variant="outline">
                {index + 1} of {scenarios.length}
              </Badge>
            </div>

            {current.video_credit && <ScenarioVideoCredit credit={current.video_credit} />}

            {current.video_url && (
              <div className="overflow-hidden rounded-lg border-2 border-border">
                <ScenarioVideoPlayer url={current.video_url} key={current.id} autoPlay={false} />
              </div>
            )}

            <div className="rounded-lg border bg-muted/40 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                The official call — yours only, until you reveal it
              </p>
              <p className="text-sm text-foreground">{current.answer || "No answer recorded."}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={session.reveal ? "secondary" : "default"}
                onClick={() => call("PATCH", { reveal: !session.reveal })}
                disabled={isBusy}
                className="flex-1"
              >
                {session.reveal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {session.reveal ? "Hide the answer again" : "Reveal to the room"}
              </Button>

              <Button
                variant="outline"
                onClick={() => call("PATCH", { currentIndex: index - 1 })}
                disabled={isBusy || index === 0}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={() => call("PATCH", { currentIndex: index + 1 })}
                disabled={isBusy || index + 1 >= scenarios.length}
              >
                Next clip
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            You have worked through every clip in this pack. End the session when you are done.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
