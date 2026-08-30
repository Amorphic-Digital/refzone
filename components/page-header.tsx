import type React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

/**
 * The top of a page: where you are, what it is for, and what you can do here.
 *
 * Exists so those three things sit in the same place at the same size on every
 * page. `back` is for going up a level inside a section — pack results back to
 * all packs — and not for "back to dashboard", which is what the sidebar is.
 */
export function PageHeader({
  title,
  description,
  back,
  actions,
}: {
  title: string
  description?: React.ReactNode
  back?: { href: string; label: string }
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        {back && (
          <Link
            href={back.href}
            className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {back.label}
          </Link>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
