import Link from "next/link"
import { Button } from "@/components/ui/button"

/**
 * The only pitch on a guest page.
 *
 * Someone answering a pack their coach sent has not asked for a product tour,
 * so this is one quiet link and nothing else — no modal, no banner across the
 * clip they are trying to judge.
 */
export function NodumFreeBadge() {
  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-xs text-muted-foreground sm:inline">No account needed</span>
      <Button asChild size="sm" variant="outline">
        <Link href="/auth/sign-up">Create an account</Link>
      </Button>
    </div>
  )
}
