import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardLoading() {
  return (
    <div className="space-y-6 pb-8">
      {/* Greeting */}
      <div>
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* CTA cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="overflow-hidden border-2">
            <CardContent className="p-0">
              <Skeleton className="h-[120px] w-full rounded-none" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Streak bar */}
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

      {/* Stats grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-2">
          <CardContent className="pt-6 space-y-3">
            <Skeleton className="h-5 w-48 mb-4" />
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
        <Card className="border-2">
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-5 w-40 mb-2" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
            </div>
            <Skeleton className="h-[120px] w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>

      {/* Law breakdown */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <Skeleton className="h-5 w-44 mb-4" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </CardContent>
      </Card>
    </div>
  )
}
