import { notFound, redirect } from "next/navigation"
import { createServiceClient } from "@/lib/supabase/service"

export const dynamic = "force-dynamic"

export const metadata = { title: "Live session — RefZone" }

/**
 * The short code the room types in.
 *
 * A live session is just a public pack with a coach driving it, so this page
 * only resolves the code and hands over to the guest player. Keeping the
 * session code out of the pack URL means a coach can read out five characters
 * instead of a share code plus a query string.
 */
export default async function LiveSessionPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params

  const { data: session } = await createServiceClient()
    .from("pack_live_sessions")
    .select("join_code, is_open, training_packs(share_code, is_public, is_active)")
    .eq("join_code", code.trim().toLowerCase())
    .maybeSingle()

  const pack = (session as any)?.training_packs

  if (!session || !pack?.share_code || !pack.is_active || !pack.is_public) notFound()

  redirect(`/p/${pack.share_code}?session=${session.join_code}`)
}
