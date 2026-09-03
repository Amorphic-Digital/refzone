import { Skeleton } from "@/components/ui/skeleton"

/** One clip's worth of skeleton — the session shows exactly one at a time. */
export default function ScenarioPlayLoading() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
      <Skeleton className="aspect-video w-full rounded-xl" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="ml-auto h-5 w-12" />
      </div>
      <Skeleton className="h-7 w-3/4" />
      <Skeleton className="h-20 w-full rounded-lg" />
      <Skeleton className="h-11 w-full rounded-lg" />
    </div>
  )
}
