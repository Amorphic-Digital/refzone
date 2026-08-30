import { createServiceClient } from "@/lib/supabase/service"

/**
 * Live sessions: the game a training night runs on.
 *
 * A session moves lobby -> question -> reveal -> leaderboard -> question ...
 * -> ended. The coach drives it; every phone polls the row. No sockets, so a
 * hall full of phones on bad wifi is unremarkable.
 *
 * Two callers with very different rights read this: the coach's presenter
 * view, which may see the official call at any time, and the room, which may
 * only see it in the reveal phase. Both come through here so that rule lives
 * in one place rather than in two route handlers that could drift.
 */

export type LivePhase = "lobby" | "question" | "reveal" | "leaderboard" | "ended"

export interface LiveSession {
  id: string
  pack_id: string
  coach_id: string
  join_code: string
  current_index: number
  reveal: boolean
  is_open: boolean
  phase: LivePhase
  question_started_at: string | null
  question_seconds: number
  timer_enabled: boolean
  scoring_enabled: boolean
  leaderboard_enabled: boolean
}

export interface LiveScenarioRef {
  id: string
  title: string
  answer: string | null
}

export interface LiveCounts {
  players: number
  answered: number
  correct: number
  incorrect: number
}

export interface LeaderboardRow {
  attemptId: string
  name: string
  score: number
  correct: number
}

const SESSION_FIELDS =
  "id, pack_id, coach_id, join_code, current_index, reveal, is_open, phase, question_started_at, question_seconds, timer_enabled, scoring_enabled, leaderboard_enabled"

/** Being right is most of it; being quick is the rest. */
export const BASE_POINTS = 700
export const SPEED_POINTS = 300

/**
 * What one answer is worth.
 *
 * Kahoot's shape: a wrong answer scores nothing no matter how fast, and a
 * right one is worth more the sooner it lands — but never less than the base,
 * so the referee who thinks it through and gets it right still clearly beats
 * the one who guessed instantly and got it wrong.
 */
export function scoreAnswer(isCorrect: boolean, secondsTaken: number, limit: number): number {
  if (!isCorrect) return 0
  if (limit <= 0) return BASE_POINTS

  const fractionLeft = Math.max(0, Math.min(1, 1 - secondsTaken / limit))
  return BASE_POINTS + Math.round(SPEED_POINTS * fractionLeft)
}

/** Seconds left on the clip currently open, or null when no clock is running. */
export function secondsRemaining(
  session: Pick<LiveSession, "phase" | "question_started_at" | "question_seconds" | "timer_enabled">,
): number | null {
  if (!session.timer_enabled) return null
  if (session.phase !== "question" || !session.question_started_at) return null

  const elapsed = (Date.now() - new Date(session.question_started_at).getTime()) / 1000
  return Math.max(0, Math.round(session.question_seconds - elapsed))
}

export async function findSessionByCode(code: string): Promise<LiveSession | null> {
  const { data } = await createServiceClient()
    .from("pack_live_sessions")
    .select(SESSION_FIELDS)
    .eq("join_code", code.trim().toLowerCase())
    .maybeSingle()

  return (data as LiveSession | null) ?? null
}

export async function findOpenSessionForPack(packId: string): Promise<LiveSession | null> {
  const { data } = await createServiceClient()
    .from("pack_live_sessions")
    .select(SESSION_FIELDS)
    .eq("pack_id", packId)
    .eq("is_open", true)
    .maybeSingle()

  return (data as LiveSession | null) ?? null
}

/** The scenario at a given position in the pack's order. */
export async function scenarioAtIndex(
  packId: string,
  index: number,
): Promise<LiveScenarioRef | null> {
  const { data } = await createServiceClient()
    .from("training_pack_items")
    .select("order_index, scenarios(id, title, ai_answer)")
    .eq("pack_id", packId)
    .order("order_index")
    .range(index, index)

  const scenario = (data || [])[0] && (data as any)[0].scenarios
  if (!scenario) return null

  return { id: scenario.id, title: scenario.title, answer: scenario.ai_answer ?? null }
}

/** Everyone who has joined this session, in the order they arrived. */
export async function listPlayers(sessionId: string) {
  const { data } = await createServiceClient()
    .from("pack_guest_attempts")
    .select("id, display_name, created_at")
    .eq("session_id", sessionId)
    .order("created_at")

  return (data || []).map((row) => ({
    attemptId: row.id,
    name: row.display_name || "Guest",
  }))
}

/**
 * How the room is going on the clip currently open.
 *
 * `answered` against `players` is what turns "reveal once everyone has had a
 * go" from a guess made from the front of a dark hall into something the coach
 * can see.
 */
export async function getLiveCounts(
  sessionId: string,
  scenarioId: string | null,
): Promise<LiveCounts> {
  const supabase = createServiceClient()

  const { data: attempts } = await supabase
    .from("pack_guest_attempts")
    .select("id")
    .eq("session_id", sessionId)

  const attemptIds = (attempts || []).map((a) => a.id)
  const empty: LiveCounts = { players: attemptIds.length, answered: 0, correct: 0, incorrect: 0 }

  if (!scenarioId || attemptIds.length === 0) return empty

  const { data: answers } = await supabase
    .from("pack_guest_answers")
    .select("is_correct, coach_override_correct")
    .in("attempt_id", attemptIds)
    .eq("scenario_id", scenarioId)

  const rows = answers || []
  const correct = rows.filter((row) => row.coach_override_correct ?? row.is_correct).length

  return {
    players: attemptIds.length,
    answered: rows.length,
    correct,
    incorrect: rows.length - correct,
  }
}

/** Running totals for the session, highest first. */
export async function getLeaderboard(
  sessionId: string,
  { byScore = true }: { byScore?: boolean } = {},
): Promise<LeaderboardRow[]> {
  const supabase = createServiceClient()

  const { data: attempts } = await supabase
    .from("pack_guest_attempts")
    .select("id, display_name")
    .eq("session_id", sessionId)

  const rows = attempts || []
  if (rows.length === 0) return []

  const { data: answers } = await supabase
    .from("pack_guest_answers")
    .select("attempt_id, points, is_correct, coach_override_correct")
    .in(
      "attempt_id",
      rows.map((a) => a.id),
    )

  const totals = new Map<string, { score: number; correct: number }>()
  for (const answer of answers || []) {
    const entry = totals.get(answer.attempt_id) || { score: 0, correct: 0 }
    entry.score += answer.points ?? 0
    if (answer.coach_override_correct ?? answer.is_correct) entry.correct += 1
    totals.set(answer.attempt_id, entry)
  }

  return rows
    .map((attempt) => ({
      attemptId: attempt.id,
      name: attempt.display_name || "Guest",
      score: totals.get(attempt.id)?.score ?? 0,
      correct: totals.get(attempt.id)?.correct ?? 0,
    }))
    .sort((a, b) =>
      byScore
        ? b.score - a.score || b.correct - a.correct || a.name.localeCompare(b.name)
        : b.correct - a.correct || a.name.localeCompare(b.name),
    )
}
