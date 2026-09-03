import Link from "next/link"
import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { isCoach } from "@/lib/coach"
import { createServiceClient } from "@/lib/supabase/service"
import { checkFeatureClosure } from "@/lib/feature-closures"
import { FeatureClosure } from "@/components/ui/feature-closure"
import { Button } from "@/components/ui/button"
import { ArrowRight, Layers, Library, LayoutGrid, Shuffle } from "lucide-react"

/**
 * The scenario door: two halves, one decision.
 *
 * Top half deals clips at random, bottom half lets you choose the topic first.
 * That is the whole page on purpose — the old version opened on a wall of
 * category cards, which is a menu to read before you have trained anything.
 * A referee who just wants a clip should be one tap from one.
 *
 * Nothing here counts. There is no "3 of 230", no progress bar and no
 * per-topic tally — a library that grows every week turns a completion figure
 * into a number that only ever looks worse, and the training is the next
 * decision, not the backlog.
 */
export default async function ScenariosPage() {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    redirect("/auth/login")
  }
  const supabase = createServiceClient()

  const closure = await checkFeatureClosure("scenarios")
  if (closure) {
    return <FeatureClosure closure={closure} />
  }

  const [scenariosResult, coach] = await Promise.all([
    supabase.from("scenarios").select("id").eq("is_active", true).limit(1),
    isCoach(userId),
  ])

  const stocked = (scenariosResult.data?.length ?? 0) > 0

  if (!stocked) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Match Scenarios</h1>
          <p className="mt-2 text-muted-foreground">
            No scenarios are available yet. Check back soon.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex h-full flex-col">
      {/* Top half — straight into a session. */}
      <Half
        href="/scenarios/play"
        eyebrow="Just deal me one"
        title="Random"
        blurb="Real match footage, one decision at a time. Next when you are ready."
        icon={<Shuffle className="h-7 w-7" />}
        className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600"
      />

      {/* Hairline between the halves, so neither reads as the page background. */}
      <div className="h-px shrink-0 bg-background/40" />

      {/* Bottom half — pick the topic first. */}
      <Half
        href="/scenarios/categories"
        eyebrow="Train one thing"
        title="By category"
        blurb="DOGSO, handball, offside, penalties — choose the topic and drill it."
        icon={<LayoutGrid className="h-7 w-7" />}
        className="bg-gradient-to-br from-[#9114af] via-[#a51fb8] to-[#ff5eb8]"
      />

      {/* The two side doors. Deliberately small: neither is the reason a
          referee opened this page. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center gap-2 p-3">
        <Button
          asChild
          size="sm"
          variant="secondary"
          className="pointer-events-auto bg-black/30 text-white backdrop-blur-sm hover:bg-black/50"
        >
          <Link href="/packs">
            <Layers className="h-4 w-4" />
            Training packs
          </Link>
        </Button>
        {coach && (
          <Button
            asChild
            size="sm"
            variant="secondary"
            className="pointer-events-auto bg-black/30 text-white backdrop-blur-sm hover:bg-black/50"
          >
            <Link href="/scenarios/browse">
              <Library className="h-4 w-4" />
              Library
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}

/** One of the two halves. Whole surface is the hit target, by design. */
function Half({
  href,
  eyebrow,
  title,
  blurb,
  icon,
  className,
}: {
  href: string
  eyebrow: string
  title: string
  blurb: string
  icon: React.ReactNode
  className: string
}) {
  return (
    <Link
      href={href}
      className={`group relative flex flex-1 flex-col items-center justify-center gap-3 overflow-hidden px-6 text-center text-white transition-[filter] duration-300 hover:brightness-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white/60 ${className}`}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
        {icon}
      </span>
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
        {eyebrow}
      </span>
      <span className="text-4xl font-bold leading-none tracking-tight md:text-5xl">{title}</span>
      <span className="max-w-sm text-sm text-white/80">{blurb}</span>
      <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-white/90">
        Start
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  )
}
