import { requireAdmin } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { NextResponse } from "next/server"

/**
 * Admin writes that used to be sent straight from the browser.
 *
 * The pages under /admin wrote with the browser's Supabase client, but this
 * app authenticates with Clerk, so that client is anonymous: the "Admins can
 * update …" policies in scripts/024 all test auth.uid() against profiles, and
 * an anonymous request fails every one of them. PostgREST answers a blocked
 * UPDATE with 200 and zero rows, so the panels reported success and changed
 * nothing until the page was reloaded.
 *
 * Writes therefore run here, on the service client, behind requireAdmin —
 * which is how the scenario and quiz insert/delete routes already worked. The
 * service key bypasses RLS, so the table and every column written is checked
 * against the allow-list below rather than taken from the request.
 */

type Action = "insert" | "update" | "upsert" | "delete"

interface TableRule {
  /** Columns a request may write. Anything else is rejected, not dropped. */
  columns: string[]
  /** Columns a request may match rows on. */
  match: string[]
  actions: Action[]
}

const RULES: Record<string, TableRule> = {
  quizzes: {
    columns: ["title", "description", "difficulty", "time_limit_minutes", "is_active"],
    match: ["id"],
    actions: ["insert", "update"],
  },
  quiz_questions: {
    columns: [
      "quiz_id",
      "question_text",
      "question_type",
      "options",
      "correct_answer",
      "explanation",
      "points_value",
      "law_category",
      "law_section",
      "order_index",
    ],
    match: ["id"],
    actions: ["insert", "update", "delete"],
  },
  forum_posts: {
    columns: ["moderation_status", "moderation_reason", "is_pinned", "is_locked"],
    match: ["id"],
    actions: ["update", "delete"],
  },
  forum_reports: {
    // reviewed_by is deliberately absent: it is a UUID column and the app's
    // user ids are Clerk strings, so writing it would fail the whole update.
    columns: ["status", "reviewed_at"],
    match: ["id"],
    actions: ["update"],
  },
  user_feedback: {
    columns: ["status"],
    match: ["id"],
    actions: ["update", "delete"],
  },
  admin_config: {
    columns: ["config_value", "updated_at"],
    match: ["config_key"],
    actions: ["update"],
  },
  feature_closures: {
    // closed_by is absent for the same reason as reviewed_by above.
    columns: [
      "feature_key",
      "is_closed",
      "message",
      "recommendation_text",
      "recommendation_url",
      "recommendation_feature_key",
      "closed_at",
      "updated_at",
    ],
    match: ["feature_key"],
    actions: ["update", "upsert"],
  },
}

export async function POST(request: Request) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { table, action, match, values } = await request.json()

    const rule = typeof table === "string" ? RULES[table] : undefined
    if (!rule) {
      return NextResponse.json({ error: `Not a writable table: ${table}` }, { status: 400 })
    }
    if (!rule.actions.includes(action)) {
      return NextResponse.json({ error: `${action} is not allowed on ${table}` }, { status: 400 })
    }

    const isPlainObject = (v: unknown) => !!v && typeof v === "object" && !Array.isArray(v)

    if (action !== "insert") {
      if (!isPlainObject(match) || Object.keys(match).length === 0) {
        return NextResponse.json({ error: "Missing the rows to match" }, { status: 400 })
      }
      const badMatch = Object.keys(match).find((key) => !rule.match.includes(key))
      if (badMatch) {
        return NextResponse.json({ error: `Cannot match ${table} on ${badMatch}` }, { status: 400 })
      }
    }

    if (action !== "delete") {
      if (!isPlainObject(values) || Object.keys(values).length === 0) {
        return NextResponse.json({ error: "Nothing to write" }, { status: 400 })
      }
      const badColumn = Object.keys(values).find((key) => !rule.columns.includes(key))
      if (badColumn) {
        return NextResponse.json(
          { error: `Cannot write ${badColumn} on ${table}` },
          { status: 400 },
        )
      }
    }

    const supabase = createServiceClient()
    const rows = supabase.from(table)

    let result
    switch (action) {
      case "insert":
        result = await rows.insert(values).select().single()
        break
      case "update": {
        let query = rows.update(values)
        for (const [key, value] of Object.entries(match)) query = query.eq(key, value)
        result = await query.select()
        break
      }
      case "upsert":
        // The closures page edits rows that may never have been created, so a
        // plain update would match nothing and report success.
        result = await rows
          .upsert({ ...match, ...values }, { onConflict: rule.match[0] })
          .select()
          .single()
        break
      case "delete": {
        let query = rows.delete()
        for (const [key, value] of Object.entries(match)) query = query.eq(key, value)
        result = await query.select()
        break
      }
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 })
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    // An update or delete that matched nothing is the exact failure this route
    // exists to stop being silent.
    if ((action === "update" || action === "delete") && Array.isArray(result.data) && result.data.length === 0) {
      return NextResponse.json({ error: "That record no longer exists" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      record: Array.isArray(result.data) ? result.data[0] : result.data,
    })
  } catch (err) {
    console.error("Admin record write failed:", err)
    return NextResponse.json({ error: "The change could not be saved" }, { status: 500 })
  }
}
