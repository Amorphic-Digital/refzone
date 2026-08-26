import { requireAdmin } from "@/lib/auth"
import { R2ConfigError, deleteVideo, isScenarioVideoKey } from "@/lib/r2"
import { NextResponse } from "next/server"

/**
 * Remove a video from R2 by object key.
 *
 * Called when an admin replaces or discards a video they have already
 * uploaded, so an abandoned upload does not sit in the bucket forever. Videos
 * belonging to saved scenarios are cleaned up by the delete-scenario route.
 */
export async function DELETE(request: Request) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const key = new URL(request.url).searchParams.get("key")

  if (!key || !isScenarioVideoKey(key)) {
    return NextResponse.json({ error: "Not a scenario video key" }, { status: 400 })
  }

  try {
    const deleted = await deleteVideo(key)
    return NextResponse.json({ success: deleted })
  } catch (error) {
    if (error instanceof R2ConfigError) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    console.error("[scenario-video] Failed to delete:", error)
    return NextResponse.json({ error: "Could not delete the video" }, { status: 500 })
  }
}
