"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, RotateCcw, Save, Upload, Video } from "lucide-react"
import { ScenarioVideoPlayer } from "@/components/scenario-video-player"
import { SCENARIO_CATEGORIES } from "@/lib/scenario-categories"
import { ACCEPTED_TYPES, MAX_BYTES, discardOrphan, rejectFile, uploadScenarioVideo } from "./video-upload"

/** The slice of a scenario this dialog edits. */
export interface EditableScenario {
  id: string
  title: string
  category: string | null
  video_url: string | null
  video_key: string | null
  video_credit: string | null
}

interface PendingVideo {
  key: string
  url: string
  fileName: string
}

/**
 * Edit a scenario's footage and its acknowledgement in a modal.
 *
 * Nothing is written until Save is pressed, so closing the dialog throws the
 * edits away. A replacement video is uploaded to R2 as soon as it is picked —
 * the bytes have to go somewhere — but the scenario keeps pointing at the old
 * object until the save lands; the old object is deleted only then, and the
 * new one is discarded if the dialog is closed instead.
 *
 * Mount this only while it is open (and let it unmount on close) so each
 * opening starts from the saved values.
 */
export function ScenarioEditDialog({
  scenario,
  onClose,
  onSaved,
  onError,
}: {
  scenario: EditableScenario
  onClose: () => void
  onSaved: (patch: Partial<EditableScenario>) => void
  onError: (title: string, message: string) => void
}) {
  const savedCategory = scenario.category || ""
  const savedCredit = scenario.video_credit || ""

  const [category, setCategory] = useState(savedCategory)
  const [credit, setCredit] = useState(savedCredit)
  const [pendingVideo, setPendingVideo] = useState<PendingVideo | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadRef = useRef<XMLHttpRequest | null>(null)
  // Saving hands the new object to the scenario row, so the unmount cleanup
  // must not then delete the video out from under it.
  const pendingRef = useRef<PendingVideo | null>(null)
  pendingRef.current = pendingVideo

  // Closing the dialog mid-edit would otherwise leave the replacement video in
  // the bucket with nothing pointing at it.
  useEffect(() => {
    return () => {
      uploadRef.current?.abort()
      const orphan = pendingRef.current
      if (orphan) void discardOrphan(orphan.key)
    }
  }, [])

  const isUploading = uploadProgress !== null
  const isDirty = category !== savedCategory || credit !== savedCredit || pendingVideo !== null
  const isBusy = isUploading || isSaving
  const previewUrl = pendingVideo?.url || scenario.video_url

  const handleFile = async (file: File) => {
    setError("")

    const rejection = rejectFile(file)
    if (rejection) {
      setError(rejection)
      return
    }

    // Picking a second replacement before saving: the first upload is now
    // dead weight.
    if (pendingVideo) {
      void discardOrphan(pendingVideo.key)
      setPendingVideo(null)
    }

    setUploadProgress(0)

    try {
      const { key, publicUrl } = await uploadScenarioVideo(file, {
        onProgress: setUploadProgress,
        registerXhr: (xhr) => {
          uploadRef.current = xhr
        },
      })

      setPendingVideo({ key, url: publicUrl, fileName: file.name })
    } catch (err) {
      console.error("Footage replacement error:", err)
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      uploadRef.current = null
      setUploadProgress(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const revertVideo = () => {
    if (pendingVideo) void discardOrphan(pendingVideo.key)
    setPendingVideo(null)
    setError("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const save = async () => {
    if (!isDirty || isBusy) return

    setIsSaving(true)
    setError("")

    const patch: Partial<EditableScenario> = {
      category: category || null,
      video_credit: credit.trim() || null,
    }
    if (pendingVideo) {
      patch.video_url = pendingVideo.url
      patch.video_key = pendingVideo.key
    }

    // Through the API, not the browser's Supabase client: that client is
    // anonymous (auth is Clerk), so RLS drops the write and reports success.
    let saveError: string | null = null
    try {
      const response = await fetch("/api/admin/update-scenario", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: scenario.id, ...patch }),
      })
      const data = await response.json()
      if (!response.ok) saveError = data.error || "The server rejected the change"
    } catch (err) {
      saveError = err instanceof Error ? err.message : "The change could not be sent"
    }

    if (saveError) {
      setIsSaving(false)
      onError("Could not save the changes", saveError)
      return
    }

    // The row now owns the new object, and the one it replaced is unreachable.
    const replaced = pendingVideo ? scenario.video_key : null
    setPendingVideo(null)
    if (replaced) void discardOrphan(replaced)

    onSaved(patch)
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        // A half-finished upload should not be abandoned by a stray click.
        if (!open && !isBusy) onClose()
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {scenario.title}</DialogTitle>
          <DialogDescription>
            Change the footage or its acknowledgement. Nothing is saved until you press Save changes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Footage</Label>
              {pendingVideo && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer"
                  disabled={isBusy}
                  onClick={revertVideo}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Keep the old clip
                </Button>
              )}
            </div>

            {previewUrl ? (
              <div className="rounded-lg overflow-hidden border">
                <ScenarioVideoPlayer key={previewUrl} url={previewUrl} autoPlay={false} />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">This scenario has no video attached.</p>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES.join(",")}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void handleFile(file)
              }}
            />
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              disabled={isBusy}
              onClick={() => fileInputRef.current?.click()}
            >
              <Video className="h-4 w-4 mr-2" />
              {previewUrl ? "Replace footage" : "Upload footage"}
            </Button>
            <p className="text-xs text-muted-foreground">
              MP4, WebM, MOV or MKV, up to {MAX_BYTES / (1024 * 1024)}MB. The clip currently in use
              stays live until you save.
            </p>

            {isUploading && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Upload className="h-3.5 w-3.5 animate-pulse" />
                    Uploading new footage
                  </span>
                  <span className="font-medium tabular-nums">{uploadProgress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            {pendingVideo && (
              <p className="text-xs text-amber-600">
                Previewing <span className="font-medium">{pendingVideo.fileName}</span> — save to put
                it live.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-video-credit">Footage acknowledgement</Label>
            <Input
              id="edit-video-credit"
              value={credit}
              onChange={(e) => setCredit(e.target.value)}
              placeholder="e.g. A-League Men 2024/25 — Perth Glory v Western Sydney Wanderers (Paramount+)"
              disabled={isBusy}
            />
            <p className="text-xs text-muted-foreground">
              Shown to referees above the video. Name the competition, the fixture and the
              broadcaster where you can.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-training-category">Training Category</Label>
            <Select value={category} onValueChange={setCategory} disabled={isBusy}>
              <SelectTrigger id="edit-training-category">
                <SelectValue placeholder="Pick a training category" />
              </SelectTrigger>
              <SelectContent>
                {SCENARIO_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.slug} value={cat.slug}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              This is what coaches filter by — an uncategorised scenario never shows up in the
              category menu.
            </p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" className="cursor-pointer" disabled={isBusy} onClick={onClose}>
            Cancel
          </Button>
          <Button className="cursor-pointer" disabled={!isDirty || isBusy} onClick={save}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
