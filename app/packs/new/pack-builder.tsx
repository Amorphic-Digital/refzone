"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Search, XCircle } from "lucide-react"
import { toast } from "sonner"
import { SCENARIO_CATEGORIES, categoryLabel } from "@/lib/scenario-categories"
import { getDifficultyColor } from "@/lib/shared-utils"

interface BuilderScenario {
  id: string
  title: string
  category: string | null
  difficulty: string
  law_category: string | null
}

const ALL = "__all"

export function PackBuilder({ scenarios }: { scenarios: BuilderScenario[] }) {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<string>(ALL)
  const [difficulty, setDifficulty] = useState<string>(ALL)
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  // Only offer categories that actually have scenarios behind them.
  const availableCategories = useMemo(() => {
    const present = new Set(scenarios.map((s) => s.category).filter(Boolean) as string[])
    return SCENARIO_CATEGORIES.filter((c) => present.has(c.slug))
  }, [scenarios])

  const filtered = useMemo(() => {
    return scenarios.filter((scenario) => {
      if (category !== ALL && scenario.category !== category) return false
      if (difficulty !== ALL && scenario.difficulty !== difficulty) return false
      if (search) {
        const needle = search.toLowerCase()
        const haystack = `${scenario.title} ${scenario.law_category || ""} ${categoryLabel(scenario.category)}`
        if (!haystack.toLowerCase().includes(needle)) return false
      }
      return true
    })
  }, [scenarios, category, difficulty, search])

  const toggle = (id: string) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((s) => s !== id) : [...current, id],
    )
  }

  const selectAllVisible = () => {
    // Preserves existing order, appends the visible ones not already picked.
    setSelected((current) => [
      ...current,
      ...filtered.map((s) => s.id).filter((id) => !current.includes(id)),
    ])
  }

  const save = async () => {
    if (!title.trim()) {
      setError("Give the pack a title")
      return
    }
    if (selected.length === 0) {
      setError("Pick at least one scenario")
      return
    }

    setIsSaving(true)
    setError("")

    try {
      const response = await fetch("/api/packs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category: category === ALL ? null : category,
          scenarioIds: selected,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Could not create pack")

      toast.success("Pack created")
      router.push(`/packs/${data.pack.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create pack")
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-1 text-3xl font-bold text-foreground">New Training Pack</h1>
        <p className="text-sm text-muted-foreground">
          Pick the scenarios you want your referees to work through, in the order you want them.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="pack-title">Title</Label>
            <Input
              id="pack-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. U14 Pre-Season: Tackles and DOGSO"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pack-description">Description (optional)</Label>
            <Textarea
              id="pack-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What should the group focus on?"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All categories</SelectItem>
                  {availableCategories.map((cat) => (
                    <SelectItem key={cat.slug} value={cat.slug}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Any difficulty</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pack-search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="pack-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Title or law"
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
            <p className="text-sm text-muted-foreground">
              {filtered.length} scenario{filtered.length === 1 ? "" : "s"} shown · {selected.length}{" "}
              selected
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAllVisible} disabled={filtered.length === 0}>
                Select all shown
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelected([])}
                disabled={selected.length === 0}
              >
                Clear
              </Button>
            </div>
          </div>

          <div className="max-h-[26rem] space-y-1.5 overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No scenarios match those filters.
              </p>
            ) : (
              filtered.map((scenario) => {
                const index = selected.indexOf(scenario.id)
                const isSelected = index !== -1

                return (
                  <label
                    key={scenario.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50"
                  >
                    <Checkbox checked={isSelected} onCheckedChange={() => toggle(scenario.id)} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-foreground">{scenario.title}</span>
                        <Badge className={getDifficultyColor(scenario.difficulty)} variant="outline">
                          {scenario.difficulty}
                        </Badge>
                        {scenario.category && (
                          <Badge variant="secondary" className="text-xs">
                            {categoryLabel(scenario.category)}
                          </Badge>
                        )}
                      </div>
                      {scenario.law_category && (
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {scenario.law_category}
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <Badge className="shrink-0" title="Position in the pack">
                        #{index + 1}
                      </Badge>
                    )}
                  </label>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
          <XCircle className="h-5 w-5 shrink-0 text-red-500" />
          <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button onClick={save} disabled={isSaving} size="lg">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating…
            </>
          ) : (
            <>Create pack ({selected.length})</>
          )}
        </Button>
        <Button variant="outline" size="lg" onClick={() => router.push("/packs")} disabled={isSaving}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
