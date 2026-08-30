import { notFound } from "next/navigation"
import { findPublicPack } from "@/lib/public-pack"
import { GuestPackPlayer } from "@/components/guest-pack-player"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const pack = await findPublicPack(code)
  return {
    title: pack ? `${pack.title} — RefZone` : "RefZone",
    description: pack?.description || "Judge real match footage and give your decision.",
  }
}

/**
 * A pack anyone can answer, no account.
 *
 * This is the link a coach sends the whole branch. Nothing here is behind
 * Clerk (see the /p bypass in proxy.ts) and nothing here knows the answers —
 * every decision is graded by /api/public/pack/[code]/answer on the server.
 */
export default async function PublicPackPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>
  searchParams: Promise<{ session?: string }>
}) {
  const { code } = await params
  const { session } = await searchParams

  const pack = await findPublicPack(code)

  // Also the answer when a pack exists but the coach never made it public:
  // "this pack is private" would confirm the code is real.
  if (!pack) notFound()

  return (
    <GuestPackPlayer
      code={pack.share_code}
      title={pack.title}
      description={pack.description}
      collectName={pack.collect_name}
      sessionCode={session ?? null}
    />
  )
}
