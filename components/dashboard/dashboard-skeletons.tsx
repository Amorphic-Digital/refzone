import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function StatsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Streak bar skeleton */}
      <Card className="border">
        <CardContent className="py-3 px-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-3 w-20 ml-6" />
            </div>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-5 rounded-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats + Chart grid skeleton */}
      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Insights skeleton */}
        <Card className="border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-48" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-32" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded bg-muted/40">
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-5 w-10 rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Performance stats skeleton */}
        <Card className="border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-40" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-primary/5">
                <Skeleton className="h-8 w-14 mx-auto mb-1" />
                <Skeleton className="h-3 w-24 mx-auto" />
              </div>
              <div className="text-center p-3 rounded-lg bg-blue-500/5">
                <Skeleton className="h-8 w-14 mx-auto mb-1" />
                <Skeleton className="h-3 w-20 mx-auto" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <Skeleton className="h-6 w-10 mx-auto mb-1" />
                <Skeleton className="h-3 w-24 mx-auto" />
              </div>
              <div>
                <Skeleton className="h-6 w-10 mx-auto mb-1" />
                <Skeleton className="h-3 w-20 mx-auto" />
              </div>
            </div>
            <Skeleton className="h-[120px] w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>

      {/* Law breakdown skeleton */}
      <Card className="border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-44" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </CardContent>
      </Card>
    </div>
  )
}
