"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, RotateCcw, Save, Upload, Video } from "lucide-react"
import { SCENARIO_CATEGORIES } from "@/lib/scenario-categories"
import { ACCEPTED_TYPES, discardOrphan, rejectFile, uploadScenarioVideo } from "./video-upload"

/** The slice of a scenario this editor owns. */
export interface EditableFootage {
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
 * Inline editing of a scenario's footage and its acknowledgement.
 *
 * Nothing is written as you type or pick: edits sit as a draft until Save is
 * pressed, so a mistyped acknowledgement or the wrong file can be backed out
 * with Revert. A replacement video is uploaded to R2 straight away — the bytes
 * have to go somewhere — but the scenario keeps pointing at the old object
 * until the save lands, and the old object is only deleted once it does.
 */
export function ScenarioFootageEditor({
  scenario,
  onSaved,
  onError,
}: {
  scenario: EditableFootage
  onSaved: (patch: Partial<EditableFootage>) => void
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

  // Navigating away mid-edit would otherwise leave the replacement video in
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

  const revert = () => {
    if (pendingVideo) void discardOrphan(pendingVideo.key)
    setPendingVideo(null)
    setCategory(savedCategory)
    setCredit(savedCredit)
    setError("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const save = async () => {
    if (!isDirty || isBusy) return

    setIsSaving(true)
    setError("")

    const patch: Partial<EditableFootage> = {
      category: category || null,
      video_credit: credit.trim() || null,
    }
    if (pendingVideo) {
      patch.video_url = pendingVideo.url
      patch.video_key = pendingVideo.key
    }

    const supabase = createClient()
    const { error: saveError } = await supabase.from("scenarios").update(patch).eq("id", scenario.id)

    if (saveError) {
      setIsSaving(false)
      onError("Could not save the changes", saveError.message)
      return
    }

    // The row now owns the new object, and the one it replaced is unreachable.
    const replaced = pendingVideo ? scenario.video_key : null
    setPendingVideo(null)
    if (replaced) void discardOrphan(replaced)

    setCredit(patch.video_credit || "")
    setIsSaving(false)
    onSaved(patch)
  }

  return (
    <div className="mt-2 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {/* Inline retagging — the fastest way to work through scenarios
            created before categories existed. */}
        <Select value={category} onValueChange={setCategory} disabled={isBusy}>
          <SelectTrigger className="h-7 w-[220px] text-xs">
            <SelectValue placeholder="Set category…" />
          </SelectTrigger>
          <SelectContent>
            {SCENARIO_CATEGORIES.map((cat) => (
              <SelectItem key={cat.slug} value={cat.slug}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Uploaded scenarios carry their source from the upload form; this is
            for the ones that predate it, and for fixing a wrong credit. */}
        <Input
          value={credit}
          onChange={(e) => setCredit(e.target.value)}
          placeholder="Footage acknowledgement…"
          aria-label={`Footage acknowledgement for ${scenario.title}`}
          disabled={isBusy}
          className="h-7 w-[260px] text-xs"
        />

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
          className="h-7 cursor-pointer text-xs"
          disabled={isBusy}
          onClick={() => fileInputRef.current?.click()}
        >
          <Video className="h-3.5 w-3.5 mr-1" />
          Replace footage
        </Button>
      </div>

      {isUploading && (
        <div className="space-y-1 max-w-md">
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
          New footage ready: <span className="font-medium">{pendingVideo.fileName}</span> — save to put it live.
        </p>
      )}

      {/* Always on show, so the panel never looks like it saves by itself —
          it simply has nothing to do until something is edited. */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          className="h-7 cursor-pointer text-xs"
          disabled={!isDirty || isBusy}
          onClick={save}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5 mr-1" />
              Save changes
            </>
          )}
        </Button>
        {isDirty && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 cursor-pointer text-xs"
              disabled={isBusy}
              onClick={revert}
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Revert
            </Button>
            <span className="text-xs text-amber-600">Unsaved changes</span>
          </>
        )}
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
