import { requireAuth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { getPackResults, resultsToCsv } from "@/lib/pack-results"
import { loadOwnedPack } from "@/lib/pack-ownership"

export const dynamic = "force-dynamic"

/**
 * Pack results as CSV.
 *
 * Coaches doing formal assessment have to report to their association, and
 * they are not going to retype a results page into a spreadsheet.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const pack = await loadOwnedPack(id, userId)
  if (!pack) return NextResponse.json({ error: "Pack not found" }, { status: 404 })

  const csv = resultsToCsv(pack.title, await getPackResults(id))
  const filename = `${pack.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-results.csv`

  // Excel on Windows reads a UTF-8 CSV as Latin-1 without a byte order mark,
  // which turns every name with an accent in it into mojibake.
  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}
