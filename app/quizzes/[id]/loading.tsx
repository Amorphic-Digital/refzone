import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function QuizLoading() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Title + progress */}
      <div>
        <Skeleton className="h-8 w-64 mb-3" />
        <Skeleton className="h-2 w-full rounded-full" />
        <div className="flex justify-between mt-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      {/* Question card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-4/5 mt-1" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
              <Skeleton className="h-5 w-5 rounded-full shrink-0" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
