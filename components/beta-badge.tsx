import { cn } from "@/lib/utils"

/**
 * The "Beta" tag on a nav link.
 *
 * Small and quiet on purpose: it is there so a referee knows DecisionLab is
 * still finding its feet before they rely on it, not to advertise the feature.
 * `onPrimary` is for when it sits on an active nav row, where the muted
 * palette would disappear into the fill.
 */
export function BetaBadge({
  onPrimary = false,
  className,
}: {
  onPrimary?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        "rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase leading-none tracking-wide",
        onPrimary
          ? "bg-primary-foreground/20 text-primary-foreground"
          : "bg-primary/10 text-primary",
        className,
      )}
    >
      Beta
    </span>
  )
}
