"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
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
import { Loader2, Trash2 } from "lucide-react"

/**
 * Removes a pack from a coach's list.
 *
 * The route behind it soft-deletes, so results a coach has already collected
 * survive and a trainee halfway through a share link is not left staring at a
 * 404 mid-session. That is worth saying out loud in the dialog: "delete" that
 * quietly keeps the data is worse than one that explains itself.
 */
export function DeletePackButton({
  packId,
  packTitle,
}: {
  packId: string
  packTitle: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")

  const remove = async () => {
    setIsDeleting(true)
    setError("")

    try {
      const response = await fetch(`/api/packs/${packId}`, { method: "DELETE" })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || "Could not delete the pack")

      setOpen(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete the pack")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          title="Delete pack"
          aria-label={`Delete ${packTitle}`}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &ldquo;{packTitle}&rdquo;?</AlertDialogTitle>
          <AlertDialogDescription>
            It disappears from your packs and its share link stops working. Results your referees
            have already submitted are kept.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Keep it</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              // The dialog closes itself on action by default, which would
              // unmount the request mid-flight and lose the error message.
              event.preventDefault()
              void remove()
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Delete pack
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
