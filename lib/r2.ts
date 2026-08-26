/**
 * Cloudflare R2 storage for scenario videos.
 *
 * Scenario videos are the one thing this app does not keep in Supabase. They
 * are large, they are streamed with range requests, and they need a CDN in
 * front of them — so they live in an R2 bucket served from a custom domain,
 * while every other row and file stays in Supabase.
 *
 * Uploads never pass through this server. The admin UI asks for a presigned
 * PUT (see app/api/admin/scenario-video/upload-url) and the browser sends the
 * bytes straight to R2, which keeps a 200MB video off the Node process
 * entirely. Playback is a plain public URL on the custom domain.
 *
 * Server-only: this module reads the R2 secret. Never import it from a
 * component that ships to the browser.
 */

import { AwsClient } from "aws4fetch"

/** Video types the admin uploader accepts, mapped to the extension we store. */
export const ALLOWED_VIDEO_TYPES: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "video/x-matroska": "mkv",
}

/** Cap on a single upload. R2 takes far more, but one PUT is the simple path. */
export const MAX_VIDEO_BYTES = 500 * 1024 * 1024 // 500MB

/** How long a presigned upload URL stays valid. Long enough for a slow line. */
const UPLOAD_URL_TTL_SECONDS = 60 * 60 // 1 hour

/** Prefix every scenario video shares inside the bucket. */
const KEY_PREFIX = "scenarios/"

export class R2ConfigError extends Error {}

interface R2Config {
  accountId: string
  accessKeyId: string
  secretAccessKey: string
  bucket: string
  publicBaseUrl: string
}

/**
 * Read and validate the R2 environment. Missing R2 config is a deployment
 * mistake, not a user error, so it names the variable rather than failing
 * later as an opaque 403 from Cloudflare.
 */
function config(): R2Config {
  const accountId = process.env.R2_ACCOUNT_ID
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  const bucket = process.env.R2_BUCKET_NAME
  const publicBaseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL

  const missing = [
    ["R2_ACCOUNT_ID", accountId],
    ["R2_ACCESS_KEY_ID", accessKeyId],
    ["R2_SECRET_ACCESS_KEY", secretAccessKey],
    ["R2_BUCKET_NAME", bucket],
    ["NEXT_PUBLIC_R2_PUBLIC_BASE_URL", publicBaseUrl],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name)

  if (missing.length > 0) {
    throw new R2ConfigError(
      `Scenario video storage is not configured — missing ${missing.join(", ")}.`,
    )
  }

  return {
    accountId: accountId!,
    accessKeyId: accessKeyId!,
    secretAccessKey: secretAccessKey!,
    bucket: bucket!,
    publicBaseUrl: publicBaseUrl!.replace(/\/+$/, ""),
  }
}

function client(cfg: R2Config): AwsClient {
  return new AwsClient({
    accessKeyId: cfg.accessKeyId,
    secretAccessKey: cfg.secretAccessKey,
    service: "s3",
    // R2 is single-region and always signs as "auto".
    region: "auto",
  })
}

function objectUrl(cfg: R2Config, key: string): string {
  return `https://${cfg.accountId}.r2.cloudflarestorage.com/${cfg.bucket}/${key
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`
}

/** The public, CDN-served URL a browser plays the video from. */
export function publicVideoUrl(key: string): string {
  return `${config().publicBaseUrl}/${key.split("/").map(encodeURIComponent).join("/")}`
}

/**
 * Build the object key for a new upload. The name is random rather than
 * derived from the uploaded filename: filenames arrive with spaces, accents
 * and duplicates, and a guessable key would let anyone enumerate the bucket.
 */
export function newVideoKey(contentType: string): string {
  const ext = ALLOWED_VIDEO_TYPES[contentType] ?? "mp4"
  return `${KEY_PREFIX}${crypto.randomUUID()}.${ext}`
}

/** True for keys this app is allowed to touch — guards the delete endpoint. */
export function isScenarioVideoKey(key: string): boolean {
  return (
    key.startsWith(KEY_PREFIX) &&
    !key.includes("..") &&
    key.length > KEY_PREFIX.length
  )
}

/**
 * Presign a PUT so the browser can upload straight to R2.
 *
 * Only `host` ends up in the signature (aws4fetch keeps query signing to the
 * minimum), so the Content-Type is advisory rather than enforced — but the
 * caller still has to send it. R2 stores whatever Content-Type the upload
 * carried, and a video saved as application/octet-stream will not play in
 * Safari.
 */
export async function presignVideoUpload(
  key: string,
  contentType: string,
): Promise<string> {
  const cfg = config()
  const url = new URL(objectUrl(cfg, key))
  url.searchParams.set("X-Amz-Expires", String(UPLOAD_URL_TTL_SECONDS))

  const signed = await client(cfg).sign(
    new Request(url, { method: "PUT", headers: { "content-type": contentType } }),
    { aws: { signQuery: true } },
  )

  return signed.url
}

/**
 * Delete an object. Used when a scenario is deleted and when an admin replaces
 * a video they had already uploaded, so abandoned uploads do not accumulate.
 * Never throws — a failed cleanup should not fail the delete the admin asked
 * for; it just leaves an orphan in the bucket.
 */
export async function deleteVideo(key: string): Promise<boolean> {
  try {
    const cfg = config()
    const response = await client(cfg).fetch(objectUrl(cfg, key), { method: "DELETE" })
    // R2 answers 204 for a delete, and also for a key that was never there.
    return response.ok || response.status === 404
  } catch (error) {
    console.error("[r2] Failed to delete video", key, error)
    return false
  }
}
