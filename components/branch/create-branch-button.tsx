"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, Plus } from "lucide-react"

/** Sets up a branch. Three fields, two of them optional. */
export function CreateBranchButton({ className }: { className?: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [region, setRegion] = useState("")
  const [description, setDescription] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  const create = async () => {
    setIsSaving(true)
    setError("")

    try {
      const response = await fetch("/api/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, region, description }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Could not create the branch")

      setOpen(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the branch")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={className}>
          <Plus className="mr-2 h-4 w-4" />
          Set up a branch
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set up your branch</DialogTitle>
          <DialogDescription>
            You get a code to give your referees. They join with it, and the leaderboard they see
            becomes your branch instead of the whole app.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="branch-name">Branch name</Label>
            <Input
              id="branch-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Northern Suburbs Referees Association"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch-region">Region (optional)</Label>
            <Input
              id="branch-region"
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              placeholder="e.g. Sydney Metro"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch-description">Description (optional)</Label>
            <Textarea
              id="branch-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              placeholder="Who referees here, which competitions you cover"
            />
          </div>

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>

        <DialogFooter>
          <Button onClick={create} disabled={isSaving || !name.trim()}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Create branch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
