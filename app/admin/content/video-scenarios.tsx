"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, XCircle, Sparkles, Upload, Trash2 } from "lucide-react"
import { ScenarioVideoPlayer } from "@/components/scenario-video-player"
import { SCENARIO_CATEGORIES } from "@/lib/scenario-categories"

/** Kept in step with ALLOWED_VIDEO_TYPES in lib/r2.ts. */
const ACCEPTED_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/x-matroska"]
const MAX_BYTES = 500 * 1024 * 1024

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Best-effort removal of a video that will never be attached to a scenario. */
async function discardOrphan(key: string) {
  try {
    await fetch(`/api/admin/scenario-video?key=${encodeURIComponent(key)}`, { method: "DELETE" })
  } catch {
    // An orphan in the bucket is not worth blocking the admin over.
  }
}

export function VideoScenarioUpload({ onSuccess }: { onSuccess: () => void }) {
  // The uploaded video, once it is sitting in R2.
  const [videoKey, setVideoKey] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [fileName, setFileName] = useState("")

  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isGeneratingTags, setIsGeneratingTags] = useState(false)
  const [error, setError] = useState("")
  const [nextNumber, setNextNumber] = useState(1)
  const [answer, setAnswer] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadRef = useRef<XMLHttpRequest | null>(null)
  // Saving hands ownership of the object to the scenario row, so the unmount
  // cleanup must not then delete the video out from under it.
  const savedRef = useRef(false)

  // AI-suggested tags
  const [suggestedLawCategory, setSuggestedLawCategory] = useState("")
  const [suggestedLawSection, setSuggestedLawSection] = useState("")
  const [suggestedScenarioType, setSuggestedScenarioType] = useState("foul")
  const [suggestedCategory, setSuggestedCategory] = useState("")
  const [suggestedDifficulty, setSuggestedDifficulty] = useState("medium")
  const [tagsGenerated, setTagsGenerated] = useState(false)

  useEffect(() => {
    async function getNextNumber() {
      const supabase = createClient()
      const { count } = await supabase
        .from("scenarios")
        .select("*", { count: "exact", head: true })
      setNextNumber((count || 0) + 1)
    }
    getNextNumber()
  }, [])

  // Closing the dialog mid-flow would otherwise leave the uploaded video in
  // the bucket with nothing pointing at it.
  useEffect(() => {
    return () => {
      uploadRef.current?.abort()
      if (videoKey && !savedRef.current) void discardOrphan(videoKey)
    }
  }, [videoKey])

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

    // Replacing an existing upload: the old object is now dead weight.
    if (videoKey) {
      void discardOrphan(videoKey)
      setVideoKey("")
      setVideoUrl("")
    }

    setFileName(file.name)
    setUploadProgress(0)

    try {
      const presignRes = await fetch("/api/admin/scenario-video/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: file.type, size: file.size }),
      })
      const presign = await presignRes.json()
      if (!presignRes.ok) throw new Error(presign.error || "Could not start the upload")

      // The bytes go browser -> R2 directly. XHR rather than fetch, because
      // fetch still cannot report upload progress.
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        uploadRef.current = xhr
        xhr.open("PUT", presign.uploadUrl)
        // R2 stores whatever Content-Type the PUT carried, and the player
        // needs a real video/* type to play the file back.
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
        xhr.onerror = () =>
          reject(new Error("Upload failed — check the bucket CORS policy allows this origin"))
        xhr.onabort = () => reject(new Error("Upload cancelled"))
        xhr.send(file)
      })

      setVideoKey(presign.key)
      setVideoUrl(presign.publicUrl)
    } catch (err) {
      console.error("Video upload error:", err)
      setError(err instanceof Error ? err.message : "Upload failed")
      setFileName("")
    } finally {
      uploadRef.current = null
      setUploadProgress(null)
    }
  }

  const removeVideo = () => {
    if (videoKey) void discardOrphan(videoKey)
    setVideoKey("")
    setVideoUrl("")
    setFileName("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const generateTags = async () => {
    if (!answer.trim()) {
      setError("Please enter an answer first")
      return
    }

    setIsGeneratingTags(true)
    setError("")

    try {
      const response = await fetch("/api/suggest-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: answer.trim() })
      })

      if (!response.ok) {
        throw new Error("Failed to generate tags")
      }

      const { tags } = await response.json()

      setSuggestedLawCategory(tags.lawCategory || "")
      setSuggestedLawSection(tags.lawSection || "")
      setSuggestedScenarioType(tags.scenarioType || "foul")
      setSuggestedCategory(tags.category || "")
      setSuggestedDifficulty(tags.difficulty || "medium")
      setTagsGenerated(true)
    } catch (err) {
      console.error("Tag generation error:", err)
      setError("Failed to generate tags. You can still enter them manually.")
      // Still show the manual entry form even if generation fails
      setTagsGenerated(true)
    } finally {
      setIsGeneratingTags(false)
    }
  }

  const saveScenario = async () => {
    if (!hasVideo) {
      setError("Please upload a video first")
      return
    }
    if (!answer.trim()) {
      setError("Please provide the correct answer")
      return
    }
    // Required: an uncategorised scenario never appears in the category menu
    // or on its topic page, so it is effectively invisible to coaches.
    if (!suggestedCategory) {
      setError("Please pick a training category")
      return
    }

    setIsSaving(true)
    setError("")

    try {
      const answerText = answer.trim()
      const scenarioTitle = `Scenario #${nextNumber}`

      const response = await fetch("/api/admin/save-scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: scenarioTitle,
          video_url: videoUrl,
          video_key: videoKey,
          ai_answer: answerText,
          ai_description: answerText,
          law_category: suggestedLawCategory || null,
          law_section: suggestedLawSection || null,
          scenario_type: suggestedScenarioType,
          category: suggestedCategory,
          difficulty: suggestedDifficulty,
          points_value: 10,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to save")

      // The scenario row now owns the object — do not clean it up on unmount.
      savedRef.current = true
      onSuccess()
    } catch (err) {
      console.error("Save scenario error:", err)
      setError(err instanceof Error ? err.message : "Failed to save scenario. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-5">
          {/* Title Preview */}
          <div className="p-3 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">This scenario will be saved as</p>
            <p className="text-lg font-bold">Scenario #{nextNumber}</p>
          </div>

          {/* Video upload */}
          <div className="space-y-2">
            <Label htmlFor="scenario-video">Scenario Video</Label>
            <Input
              ref={fileInputRef}
              id="scenario-video"
              type="file"
              accept={ACCEPTED_TYPES.join(",")}
              disabled={isUploading || isSaving}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void handleFile(file)
              }}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              MP4, WebM, MOV or MKV, up to {MAX_BYTES / (1024 * 1024)}MB. Uploads straight to
              Cloudflare R2, so large files will not time out.
            </p>
          </div>

          {/* Upload progress */}
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
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Video Preview */}
          {hasVideo && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Video Preview</Label>
                <Button variant="ghost" size="sm" onClick={removeVideo} disabled={isSaving}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
              <div className="rounded-lg overflow-hidden border">
                <ScenarioVideoPlayer url={videoUrl} autoPlay={false} />
              </div>
              <p className="text-xs text-muted-foreground truncate">{fileName}</p>
            </div>
          )}

          {/* Answer field - shown once the video is in place */}
          {hasVideo && (
            <>
              <div className="space-y-2">
                <Label htmlFor="answer">Answer</Label>
                <Textarea
                  id="answer"
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value)
                    setTagsGenerated(false) // Reset tags when answer changes
                  }}
                  placeholder="Enter the correct answer for this scenario..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  AI will compare user answers against this to provide feedback.
                </p>
              </div>

              {/* Generate Tags Button */}
              {!tagsGenerated && (
                <div className="flex gap-2">
                  <Button
                    onClick={generateTags}
                    disabled={isGeneratingTags || !answer.trim()}
                    variant="outline"
                    className="flex-1"
                  >
                    {isGeneratingTags ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Tags...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Tags with AI
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setTagsGenerated(true)}
                    disabled={!answer.trim()}
                    variant="secondary"
                  >
                    Enter Manually
                  </Button>
                </div>
              )}

              {/* Tag Review/Edit Section */}
              {tagsGenerated && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-500 text-white">Tags</Badge>
                      <p className="text-sm text-muted-foreground">Review and edit tags before saving</p>
                    </div>
                    <Button
                      onClick={generateTags}
                      disabled={isGeneratingTags}
                      variant="ghost"
                      size="sm"
                    >
                      {isGeneratingTags ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Regenerating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3 w-3 mr-1" />
                          Regenerate
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Training category — drives the category menu on
                      /scenarios, the /topics pages and pack filtering. */}
                  <div className="space-y-2">
                    <Label htmlFor="training-category">
                      Training Category <span className="text-red-500">*</span>
                    </Label>
                    <Select value={suggestedCategory} onValueChange={setSuggestedCategory}>
                      <SelectTrigger id="training-category">
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
                      This is what coaches filter by — e.g. &ldquo;DOGSO&rdquo; or &ldquo;Reckless Tackles&rdquo;.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="law-category">Law Category</Label>
                      <Input
                        id="law-category"
                        value={suggestedLawCategory}
                        onChange={(e) => setSuggestedLawCategory(e.target.value)}
                        placeholder="e.g., Law 12: Fouls and Misconduct"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="law-section">Law Section</Label>
                      <Input
                        id="law-section"
                        value={suggestedLawSection}
                        onChange={(e) => setSuggestedLawSection(e.target.value)}
                        placeholder="e.g., Direct Free Kick"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="scenario-type">Scenario Type</Label>
                      <Select value={suggestedScenarioType} onValueChange={setSuggestedScenarioType}>
                        <SelectTrigger id="scenario-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="foul">Foul</SelectItem>
                          <SelectItem value="offside">Offside</SelectItem>
                          <SelectItem value="handball">Handball</SelectItem>
                          <SelectItem value="misconduct">Misconduct</SelectItem>
                          <SelectItem value="advantage">Advantage</SelectItem>
                          <SelectItem value="penalty">Penalty</SelectItem>
                          <SelectItem value="var">VAR</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select value={suggestedDifficulty} onValueChange={setSuggestedDifficulty}>
                        <SelectTrigger id="difficulty">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              {tagsGenerated && (
                <Button
                  onClick={saveScenario}
                  disabled={isSaving}
                  className="w-full"
                  size="lg"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Save Scenario #{nextNumber}
                    </>
                  )}
                </Button>
              )}
            </>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <XCircle className="h-5 w-5 text-red-500 shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
