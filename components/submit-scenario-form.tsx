"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScenarioVideoPlayer } from "@/components/scenario-video-player"
import { SCENARIO_CATEGORIES } from "@/lib/scenario-categories"
import { CheckCircle2, Loader2, Send, Trash2, Upload, XCircle } from "lucide-react"

/** Kept in step with ALLOWED_VIDEO_TYPES in lib/r2.ts. */
const ACCEPTED_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/x-matroska"]
const MAX_BYTES = 500 * 1024 * 1024

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * The coach's version of the admin uploader.
 *
 * Same direct-to-R2 upload, but the result is a submission an admin reads
 * rather than a live scenario. Source and correct decision are both required:
 * without the first nobody can judge whether we may use the clip, and without
 * the second there is nothing to grade referees against.
 */
export function SubmitScenarioForm() {
  const router = useRouter()

  const [videoKey, setVideoKey] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [fileName, setFileName] = useState("")
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)

  const [credit, setCredit] = useState("")
  const [answer, setAnswer] = useState("")
  const [category, setCategory] = useState("")
  const [note, setNote] = useState("")

  const [isSending, setIsSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadRef = useRef<XMLHttpRequest | null>(null)

  const isUploading = uploadProgress !== null
  const hasVideo = !!videoKey && !isUploading

  const handleFile = async (file: File) => {
    setError("")

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Unsupported video type. Use MP4, WebM, MOV or MKV.")
      return
    }
    if (file.size > MAX_BYTES) {
      setError(`Video is too large (${formatBytes(file.size)}). Maximum ${MAX_BYTES / (1024 * 1024)}MB.`)
      return
    }

    setFileName(file.name)
    setUploadProgress(0)

    try {
      const presignRes = await fetch("/api/coach/submissions/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: file.type, size: file.size }),
      })
      const presign = await presignRes.json()
      if (!presignRes.ok) throw new Error(presign.error || "Could not start the upload")

      // XHR rather than fetch, because fetch still cannot report upload progress.
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        uploadRef.current = xhr
        xhr.open("PUT", presign.uploadUrl)
        xhr.setRequestHeader("Content-Type", presign.contentType)
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setUploadProgress(Math.round((event.loaded / event.total) * 100))
          }
        }
        xhr.onload = () =>
          xhr.status >= 200 && xhr.status < 300
            ? resolve()
            : reject(new Error(`Upload rejected by storage (${xhr.status})`))
        xhr.onerror = () => reject(new Error("Upload failed — check your connection and try again"))
        xhr.onabort = () => reject(new Error("Upload cancelled"))
        xhr.send(file)
      })

      setVideoKey(presign.key)
      setVideoUrl(presign.publicUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
      setFileName("")
    } finally {
      uploadRef.current = null
      setUploadProgress(null)
    }
  }

  const removeVideo = () => {
    setVideoKey("")
    setVideoUrl("")
    setFileName("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const send = async () => {
    setIsSending(true)
    setError("")

    try {
      const response = await fetch("/api/coach/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video_url: videoUrl,
          video_key: videoKey,
          video_credit: credit,
          suggested_answer: answer,
          suggested_category: category || null,
          note,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Could not send that clip")

      setSent(true)
      removeVideo()
      setCredit("")
      setAnswer("")
      setCategory("")
      setNote("")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send that clip")
    } finally {
      setIsSending(false)
    }
  }

  const ready = hasVideo && credit.trim() && answer.trim()

  return (
    <Card>
      <CardContent className="space-y-5 pt-6">
        {sent && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-4">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
            <span className="text-sm text-foreground">
              Sent. It will show below as pending until an admin has looked at it.
            </span>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="submission-video">The clip</Label>
          <Input
            ref={fileInputRef}
            id="submission-video"
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            disabled={isUploading || isSending}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void handleFile(file)
            }}
            className="cursor-pointer"
          />
          <p className="text-xs text-muted-foreground">
            MP4, WebM, MOV or MKV, up to {MAX_BYTES / (1024 * 1024)}MB.
          </p>
        </div>

        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Upload className="h-4 w-4 animate-pulse" />
                Uploading {fileName}
              </span>
              <span className="font-medium tabular-nums">{uploadProgress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary transition-all" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        )}

        {hasVideo && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Preview</Label>
                <Button variant="ghost" size="sm" onClick={removeVideo} disabled={isSending}>
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </div>
              <div className="overflow-hidden rounded-lg border">
                <ScenarioVideoPlayer url={videoUrl} autoPlay={false} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="submission-credit">
                Where is it from? <span className="text-red-500">*</span>
              </Label>
              <Input
                id="submission-credit"
                value={credit}
                onChange={(e) => setCredit(e.target.value)}
                placeholder="e.g. A-League Men 2024/25 — Perth Glory v Western Sydney Wanderers (Paramount+)"
              />
              <p className="text-xs text-muted-foreground">
                Name the competition, the fixture and the broadcaster. This is what tells us whether
                we can use the footage, and it is shown to referees above the clip.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="submission-answer">
                The correct decision <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="submission-answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={4}
                placeholder="What is the call, and any card? Referees' answers get compared against this."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="submission-category">Topic (optional)</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="submission-category">
                  <SelectValue placeholder="Pick a training topic" />
                </SelectTrigger>
                <SelectContent>
                  {SCENARIO_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.slug} value={cat.slug}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="submission-note">Anything else (optional)</Label>
              <Textarea
                id="submission-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Why this one is worth having, or anything we should know"
              />
            </div>
          </>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-500/10">
            <XCircle className="h-5 w-5 shrink-0 text-red-500" />
            <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
          </div>
        )}

        {hasVideo && (
          <Button onClick={send} disabled={!ready || isSending} className="w-full" size="lg">
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send for review
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
