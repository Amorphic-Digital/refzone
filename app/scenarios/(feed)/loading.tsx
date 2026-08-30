import { Skeleton } from "@/components/ui/skeleton"

/** The chooser is two halves, so its skeleton is too. */
export default function ScenariosLoading() {
  return (
    <div className="flex h-full flex-col">
      <Skeleton className="flex-1 rounded-none" />
      <div className="h-px shrink-0" />
      <Skeleton className="flex-1 rounded-none" />
    </div>
  )
}
