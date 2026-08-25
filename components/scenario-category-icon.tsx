import {
  AlertOctagon,
  Drama,
  FastForward,
  Flag,
  Footprints,
  Grab,
  Hand,
  MessagesSquare,
  Monitor,
  Move,
  RotateCcw,
  Shield,
  ShieldAlert,
  Target,
  Timer,
  type LucideIcon,
} from "lucide-react"

/**
 * Maps the `icon` field on a ScenarioCategory to a Lucide component.
 *
 * Explicit map rather than a dynamic import so the icons are tree-shaken and
 * an unknown name degrades to a sensible default instead of crashing.
 */
const ICONS: Record<string, LucideIcon> = {
  AlertOctagon,
  Drama,
  FastForward,
  Flag,
  Footprints,
  Grab,
  Hand,
  MessagesSquare,
  Monitor,
  Move,
  RotateCcw,
  Shield,
  ShieldAlert,
  Target,
  Timer,
}

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Target
  return <Icon className={className} />
}
