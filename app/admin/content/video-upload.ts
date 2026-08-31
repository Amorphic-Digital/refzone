/**
 * Browser-side helpers for getting a scenario video into R2.
 *
 * Shared by the upload dialog (new scenarios) and the inline footage editor
 * on the content list (replacing the video on an existing scenario), so both
 * agree on the limits and on how orphaned objects are cleaned up.
 */

/** Kept in step with ALLOWED_VIDEO_TYPES in lib/r2.ts. */
export const ACCEPTED_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/x-matroska"]
export const MAX_BYTES = 500 * 1024 * 1024

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Best-effort removal of a video that will never be attached to a scenario. */
export async function discardOrphan(key: string) {
  try {
    await fetch(`/api/admin/scenario-video?key=${encodeURIComponent(key)}`, { method: "DELETE" })
  } catch {
    // An orphan in the bucket is not worth blocking the admin over.
  }
}

/** Rejects with a message fit to show the admin, or returns null if the file is fine. */
export function rejectFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Unsupported video type. Use MP4, WebM, MOV or MKV."
  }
  if (file.size > MAX_BYTES) {
    return `Video is too large (${formatBytes(file.size)}). Maximum ${MAX_BYTES / (1024 * 1024)}MB.`
  }
  return null
}

/**
 * Presign, then send the bytes browser -> R2 directly. XHR rather than fetch,
 * because fetch still cannot report upload progress.
 */
export async function uploadScenarioVideo(
  file: File,
  {
    onProgress,
    registerXhr,
  }: { onProgress?: (percent: number) => void; registerXhr?: (xhr: XMLHttpRequest | null) => void } = {},
): Promise<{ key: string; publicUrl: string }> {
  const presignRes = await fetch("/api/admin/scenario-video/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType: file.type, size: file.size }),
  })
  const presign = await presignRes.json()
  if (!presignRes.ok) throw new Error(presign.error || "Could not start the upload")

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    registerXhr?.(xhr)
    xhr.open("PUT", presign.uploadUrl)
    // R2 stores whatever Content-Type the PUT carried, and the player needs a
    // real video/* type to play the file back.
    xhr.setRequestHeader("Content-Type", presign.contentType)
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100))
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

  registerXhr?.(null)
  return { key: presign.key, publicUrl: presign.publicUrl }
}
