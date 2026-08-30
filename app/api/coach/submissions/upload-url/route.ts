import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { isCoach } from "@/lib/coach"
import {
  ALLOWED_VIDEO_TYPES,
  MAX_VIDEO_BYTES,
  R2ConfigError,
  newVideoKey,
  presignVideoUpload,
  publicVideoUrl,
} from "@/lib/r2"

/**
 * A presigned PUT so a coach can send a clip straight to R2.
 *
 * Same mechanics as the admin uploader — the bytes never touch this server —
 * but gated on a coach account and landing in scenario_submissions rather than
 * the library. Until an admin approves it, the object is just a file in the
 * bucket that nothing points at.
 */
export async function POST(request: Request) {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!(await isCoach(userId))) {
    return NextResponse.json({ error: "Referee Coach accounts only" }, { status: 403 })
  }

  try {
    const { contentType, size } = await request.json()

    if (typeof contentType !== "string" || !(contentType in ALLOWED_VIDEO_TYPES)) {
      return NextResponse.json(
        {
          error: `Unsupported video type${
            typeof contentType === "string" ? `: ${contentType}` : ""
          }. Allowed: ${Object.keys(ALLOWED_VIDEO_TYPES).join(", ")}`,
        },
        { status: 400 },
      )
    }

    if (typeof size !== "number" || !Number.isFinite(size) || size <= 0) {
      return NextResponse.json({ error: "Missing file size" }, { status: 400 })
    }

    if (size > MAX_VIDEO_BYTES) {
      return NextResponse.json(
        { error: `Video is too large. Maximum ${MAX_VIDEO_BYTES / (1024 * 1024)}MB.` },
        { status: 400 },
      )
    }

    const key = newVideoKey(contentType)

    return NextResponse.json({
      key,
      uploadUrl: await presignVideoUpload(key, contentType),
      contentType,
      publicUrl: publicVideoUrl(key),
    })
  } catch (error) {
    if (error instanceof R2ConfigError) {
      console.error("[coach-submission] ", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    console.error("[coach-submission] Failed to presign upload:", error)
    return NextResponse.json({ error: "Could not start the upload" }, { status: 500 })
  }
}
