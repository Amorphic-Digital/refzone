"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getDifficultyColor } from "@/lib/shared-utils"
import { SCENARIO_CATEGORIES, categoryLabel } from "@/lib/scenario-categories"
import { Layers, Play, Plus, Search } from "lucide-react"

interface LibraryScenario {
  id: string
  title: string
  category: string | null
  difficulty: string
  law_category: string | null
  law_section: string | null
  video_credit: string | null
  created_at: string
}

const ANY = "__any"

/**
 * The coach's view of the library: every live scenario, filterable, with each
 * one openable directly.
 *
 * Filtering happens in the browser. The list is a few hundred rows of titles
 * and tags at most, so paging it server-side would cost a round trip per
 * keystroke to save nothing.
 */
export function ScenarioLibrary({ scenarios }: { scenarios: LibraryScenario[] }) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState(ANY)
  const [difficulty, setDifficulty] = useState(ANY)

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return scenarios.filter((s) => {
      if (category !== ANY && (s.category || "") !== category) return false
      if (difficulty !== ANY && s.difficulty !== difficulty) return false
      if (!needle) return true

      return [s.title, s.law_category, s.law_section, s.video_credit]
        .filter(Boolean)
        .some((field) => (field as string).toLowerCase().includes(needle))
    })
  }, [scenarios, query, category, difficulty])

  // Only offer topics that something is actually filed under, so the menu
  // cannot filter the list down to nothing.
  const stocked = useMemo(
    () => new Set(scenarios.map((s) => s.category).filter(Boolean) as string[]),
    [scenarios],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Scenario Library"
        description="Every live scenario. Open one to watch it and see the answer, or gather a set into a pack for your group."
        back={{ href: "/coach", label: "Coaching" }}
        actions={
          <Button asChild>
            <Link href="/packs/new">
              <Plus className="h-4 w-4" />
              New pack
            </Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="flex flex-wrap gap-3 pt-6">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search titles, laws or footage source…"
              className="pl-9"
              aria-label="Search the library"
            />
          </div>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[200px]" aria-label="Filter by topic">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>All topics</SelectItem>
              {SCENARIO_CATEGORIES.filter((c) => stocked.has(c.slug)).map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-[150px]" aria-label="Filter by difficulty">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>Any difficulty</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        {visible.length} of {scenarios.length} scenarios
      </p>

      {visible.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Layers className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Nothing matches those filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {visible.map((scenario) => (
            <Card key={scenario.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h2 className="font-medium text-foreground">{scenario.title}</h2>
                    <Badge className={getDifficultyColor(scenario.difficulty)}>
                      {scenario.difficulty}
                    </Badge>
                    {scenario.category && (
                      <Badge variant="secondary" className="text-xs">
                        {categoryLabel(scenario.category)}
                      </Badge>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {[scenario.law_category, scenario.video_credit].filter(Boolean).join(" · ") ||
                      "No law or source recorded"}
                  </p>
                </div>

                <Button asChild size="sm" variant="outline">
                  <Link href={`/scenarios/${scenario.id}`}>
                    <Play className="h-4 w-4" />
                    Open
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
