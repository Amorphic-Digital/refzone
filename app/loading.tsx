import { Skeleton } from "@/components/ui/skeleton"

export default function RootLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="space-y-3 w-48">
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-2 w-3/4 rounded-full" />
      </div>
    </div>
  )
}
