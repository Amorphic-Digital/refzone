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

/** Creates a group. Two fields, because a roster is not a form to fill in. */
export function CreateGroupButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  const create = async () => {
    setIsSaving(true)
    setError("")

    try {
      const response = await fetch("/api/coach/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Could not create the group")

      setOpen(false)
      setName("")
      setDescription("")
      router.push(`/coach/groups/${data.group.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the group")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          New group
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New group</DialogTitle>
          <DialogDescription>
            You will get a join code to read out. Referees enter it once and stay on your roster.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Name</Label>
            <Input
              id="group-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Thursday night development squad"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="group-description">Description (optional)</Label>
            <Textarea
              id="group-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Who is in it, what you are working on"
            />
          </div>

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>

        <DialogFooter>
          <Button onClick={create} disabled={isSaving || !name.trim()}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Create group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
