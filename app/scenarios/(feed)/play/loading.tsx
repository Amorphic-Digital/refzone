import { Skeleton } from "@/components/ui/skeleton"

/** One panel's worth of skeleton — the feed opens on exactly one clip. */
export default function ScenarioPlayLoading() {
  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col justify-center gap-4 px-4 pb-6 pt-16">
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
