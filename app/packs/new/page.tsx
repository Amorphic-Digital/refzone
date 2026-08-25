import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { PackBuilder } from "./pack-builder"

export default async function NewPackPage() {
  try {
    await requireAuth()
  } catch {
    redirect("/auth/login")
  }

  const supabase = createServiceClient()

  // Titles and tags only — the builder never needs the answers, and shipping
  // them to the browser would hand every coach the full answer key.
  const { data: scenarios } = await supabase
    .from("scenarios")
    .select("id, title, category, difficulty, law_category")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  return <PackBuilder scenarios={scenarios || []} />
}
