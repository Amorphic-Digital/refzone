/**
 * Client-side helpers for admin writes.
 *
 * The browser's Supabase client is anonymous here — auth is Clerk — so RLS
 * drops any write it sends and PostgREST still answers 200. Everything under
 * /admin goes through /api/admin/records instead, which checks the table and
 * the columns and runs the write on the service client. See that route for the
 * allow-list.
 *
 * Each helper returns the saved row, or an error message fit to show an admin.
 */

type Match = Record<string, string>
type Values = Record<string, unknown>

interface WriteResult<T = Record<string, unknown>> {
  record?: T
  error?: string
}

async function write<T = Record<string, unknown>>(body: {
  table: string
  action: "insert" | "update" | "upsert" | "delete"
  match?: Match
  values?: Values
}): Promise<WriteResult<T>> {
  try {
    const response = await fetch("/api/admin/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = await response.json()
    if (!response.ok) return { error: data.error || "The server rejected the change" }
    return { record: data.record as T }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "The change could not be sent" }
  }
}

export function adminInsert<T = Record<string, unknown>>(table: string, values: Values) {
  return write<T>({ table, action: "insert", values })
}

export function adminUpdate<T = Record<string, unknown>>(
  table: string,
  match: Match,
  values: Values,
) {
  return write<T>({ table, action: "update", match, values })
}

export function adminUpsert<T = Record<string, unknown>>(
  table: string,
  match: Match,
  values: Values,
) {
  return write<T>({ table, action: "upsert", match, values })
}

export function adminDelete<T = Record<string, unknown>>(table: string, match: Match) {
  return write<T>({ table, action: "delete", match })
}
