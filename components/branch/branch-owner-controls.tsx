"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Crown, Loader2, LogOut } from "lucide-react"

interface CoachOption {
  userId: string
  name: string
}

/**
 * Hands the branch to another coach in it.
 *
 * Only offered when there is somebody to hand it to — an owner staring at an
 * empty picker learns nothing except that the button does not work. When they
 * are the only coach, the copy says what to do about it instead.
 */
export function TransferOwnershipButton({ coaches }: { coaches: CoachOption[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  if (coaches.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        You are the only coach here. Another coach has to join with the branch code before you can
        hand it on.
      </p>
    )
  }

  const transfer = async () => {
    setIsSaving(true)
    setError("")

    try {
      const response = await fetch("/api/branches/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selected }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Could not transfer the branch")

      setOpen(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not transfer the branch")
    } finally {
      setIsSaving(false)
    }
  }

  const selectedName = coaches.find((coach) => coach.userId === selected)?.name

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="new-owner">Hand the branch to</Label>
        <Select value={selected} onValueChange={setSelected}>
          <SelectTrigger id="new-owner">
            <SelectValue placeholder="Pick a coach" />
          </SelectTrigger>
          <SelectContent>
            {coaches.map((coach) => (
              <SelectItem key={coach.userId} value={coach.userId}>
                {coach.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="outline" disabled={!selected}>
            <Crown className="mr-2 h-4 w-4" />
            Transfer ownership
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Make {selectedName} the owner?</AlertDialogTitle>
            <AlertDialogDescription>
              They take over the branch immediately and you become an ordinary coach in it. Only
              they can hand it back.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault()
                void transfer()
              }}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Transfer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

/** Leaves the branch. Owners are told to transfer first rather than blocked silently. */
export function LeaveBranchButton({
  branchName,
  isOwner,
}: {
  branchName: string
  isOwner: boolean
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const [error, setError] = useState("")

  const leave = async () => {
    setIsLeaving(true)
    setError("")

    try {
      const response = await fetch("/api/branches/leave", { method: "POST" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Could not leave the branch")

      setOpen(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not leave the branch")
    } finally {
      setIsLeaving(false)
    }
  }

  if (isOwner) {
    return (
      <Button variant="ghost" size="sm" disabled title="Transfer the branch first">
        <LogOut className="mr-2 h-4 w-4" />
        Leave branch
      </Button>
    )
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <LogOut className="mr-2 h-4 w-4" />
          Leave branch
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave {branchName}?</AlertDialogTitle>
          <AlertDialogDescription>
            You drop off its leaderboard and its coaches stop seeing your answers. Your points,
            streak and history stay with you, and you can rejoin with the code.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLeaving}>Stay</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault()
              void leave()
            }}
            disabled={isLeaving}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLeaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Leave
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
