import { requireAdmin } from "@/lib/auth"
import {
  ALLOWED_VIDEO_TYPES,
  MAX_VIDEO_BYTES,
  R2ConfigError,
  newVideoKey,
  presignVideoUpload,
  publicVideoUrl,
} from "@/lib/r2"
import { NextResponse } from "next/server"

/**
 * Hand the admin uploader a presigned PUT so the browser can send a scenario
 * video straight to R2. The bytes never touch this server.
 */
export async function POST(request: Request) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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
      // Echoed back so the client PUTs a Content-Type R2 will store, rather
      // than letting the object land as application/octet-stream.
      contentType,
      publicUrl: publicVideoUrl(key),
    })
  } catch (error) {
    if (error instanceof R2ConfigError) {
      console.error("[scenario-video] ", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    console.error("[scenario-video] Failed to presign upload:", error)
    return NextResponse.json({ error: "Could not start the upload" }, { status: 500 })
  }
}
