import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface LawItem {
  num: number
  slug: string
  title: string
  shortDesc: string
}

interface LawsGridProps {
  laws: LawItem[]
}

const colorClasses: Record<string, string> = {
  green: 'border-l-green-400',
  blue: 'border-l-blue-400',
  purple: 'border-l-purple-500',
  amber: 'border-l-amber-400',
}

function getLawColor(num: number) {
  if (num <= 4) return colorClasses.green
  if (num <= 8) return colorClasses.blue
  if (num <= 12) return colorClasses.purple
  return colorClasses.amber
}

export function LawsGrid({ laws }: LawsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {laws.map((law) => (
            <Link
              key={law.num}
              href={`/web/${law.slug}`}
              className={`group flex gap-4 rounded-xl border border-white/10 bg-white/[0.05] p-5 transition hover:border-purple-400/40 hover:bg-white/[0.07] border-l-2 ${getLawColor(law.num)}`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-400/10 text-sm font-bold text-purple-400">
                {law.num}
              </span>
              <div className="flex-1">
                <h2 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                  {law.title}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-white/45">{law.shortDesc}</p>
              </div>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-white/20 group-hover:text-purple-400 transition-colors" />
            </Link>
      ))}
    </div>
  )
}
