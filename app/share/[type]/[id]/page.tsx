import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { getAuthUserId } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { RefZoneLogo } from "@/components/refzone-logo"
import { categoryLabel } from "@/lib/scenario-categories"
import { getDifficultyColor } from "@/lib/shared-utils"
import { ClipboardList, Layers, PlayCircle } from "lucide-react"

export const dynamic = "force-dynamic"

type ShareType = "scenario" | "quiz" | "pack"

const SHARE_TYPES: ShareType[] = ["scenario", "quiz", "pack"]

interface SharedItem {
  title: string
  subtitle: string
  canonicalPath: string
  difficulty?: string
  category?: string | null
  kind: ShareType
}

/**
 * Resolves a share link to the thing it points at.
 *
 * Only ever returns display metadata — never the answer, the questions, or the
 * AI analysis. Shared links require sign-in to open the content itself.
 */
async function resolveShare(type: ShareType, id: string): Promise<SharedItem | null> {
  const supabase = createServiceClient()

  if (type === "scenario") {
    const { data } = await supabase
      .from("scenarios")
      .select("id, title, difficulty, category, is_active")
      .eq("id", id)
      .single()

    if (!data || !data.is_active) return null

    return {
      kind: "scenario",
      title: data.title,
      subtitle: "A match scenario to judge — watch the clip and give your decision.",
      canonicalPath: `/scenarios/${data.id}`,
      difficulty: data.difficulty,
      category: data.category,
    }
  }

  if (type === "quiz") {
    const { data } = await supabase
      .from("quizzes")
      .select("id, title, description, difficulty, is_active, quiz_questions(id)")
      .eq("id", id)
      .single()

    if (!data || !data.is_active) return null

    const questionCount = ((data as any).quiz_questions || []).length

    return {
      kind: "quiz",
      title: data.title,
      subtitle: data.description || `${questionCount} questions on the Laws of the Game.`,
      canonicalPath: `/quizzes/${data.id}`,
      difficulty: data.difficulty,
    }
  }

  // Packs are shared by their share_code rather than their uuid, so the link is
  // shorter and pack ids are not enumerable.
  const { data } = await supabase
    .from("training_packs")
    .select("id, title, description, category, is_active, training_pack_items(id)")
    .eq("share_code", id)
    .single()

  if (!data || !data.is_active) return null

  const itemCount = ((data as any).training_pack_items || []).length

  return {
    kind: "pack",
    title: data.title,
    subtitle: data.description || `A training pack of ${itemCount} scenarios.`,
    canonicalPath: `/packs/${data.id}`,
    category: data.category,
  }
}

function isShareType(value: string): value is ShareType {
  return (SHARE_TYPES as string[]).includes(value)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; id: string }>
}): Promise<Metadata> {
  const { type, id } = await params
  if (!isShareType(type)) return { title: "Shared with you" }

  const item = await resolveShare(type, id)
  if (!item) return { title: "Link not found" }

  return {
    title: `${item.title} — shared on RefZone`,
    description: item.subtitle,
    // Share links are per-recipient and behind sign-in; keep them out of search.
    robots: { index: false, follow: false },
  }
}

const KIND_COPY: Record<ShareType, { icon: typeof PlayCircle; noun: string }> = {
  scenario: { icon: PlayCircle, noun: "scenario" },
  quiz: { icon: ClipboardList, noun: "quiz" },
  pack: { icon: Layers, noun: "training pack" },
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ type: string; id: string }>
}) {
  const { type, id } = await params

  if (!isShareType(type)) notFound()

  const item = await resolveShare(type, id)
  if (!item) notFound()

  // Already signed in? Skip the landing page entirely and go straight to it.
  const userId = await getAuthUserId()
  if (userId) redirect(item.canonicalPath)

  const { icon: Icon, noun } = KIND_COPY[item.kind]
  const target = encodeURIComponent(item.canonicalPath)

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-lg space-y-6">
        <div className="flex justify-center">
          <RefZoneLogo href="/" size="lg" />
        </div>

        <Card>
          <CardContent className="space-y-5 pt-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div className="min-w-0 space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  A {noun} has been shared with you
                </p>
                <h1 className="text-xl font-semibold leading-tight">{item.title}</h1>
                <p className="text-sm text-muted-foreground">{item.subtitle}</p>
              </div>
            </div>

            {(item.category || item.difficulty) && (
              <div className="flex flex-wrap gap-2">
                {item.category && <Badge variant="secondary">{categoryLabel(item.category)}</Badge>}
                {item.difficulty && (
                  <Badge className={getDifficultyColor(item.difficulty)}>{item.difficulty}</Badge>
                )}
              </div>
            )}

            <div className="space-y-2 rounded-lg border bg-muted/40 p-4">
              <p className="text-sm font-medium">Sign in to open it</p>
              <p className="text-sm text-muted-foreground">
                RefZone is free. Signing in means your answers, points and streak are saved — and
                your coach can see how the squad went.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild className="flex-1">
                <Link href={`/auth/sign-up?redirect_url=${target}`}>Create a free account</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href={`/auth/login?redirect_url=${target}`}>I already have one</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          RefZone — football referee training for Australian referees.
        </p>
      </div>
    </div>
  )
}
