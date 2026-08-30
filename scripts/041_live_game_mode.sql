-- ============================================================================
-- 041: Live sessions become a game
--
-- 040 gave a live session a current clip and a reveal flag, which is enough to
-- drive a room but reads like a slideshow. This makes it the thing a training
-- night actually wants: a lobby with the code on the wall, a clip on a timer,
-- points for being right and quick, the spread of answers when the coach
-- reveals, and a leaderboard between clips.
--
-- Safe to re-run.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. A session has phases now
--
-- reveal (040) stays, because the room's poll and the results view both still
-- read it, but phase is what the projector renders from. They are kept in step
-- by the route that writes them — reveal is simply (phase = 'reveal').
-- ---------------------------------------------------------------------------

ALTER TABLE public.pack_live_sessions
  ADD COLUMN IF NOT EXISTS phase TEXT NOT NULL DEFAULT 'lobby'
    CHECK (phase IN ('lobby', 'question', 'reveal', 'leaderboard', 'ended')),
  -- When the clip on screen opened for answers. The countdown every phone
  -- shows is computed from this, so a device with a wrong clock cannot buy
  -- itself more time.
  ADD COLUMN IF NOT EXISTS question_started_at TIMESTAMPTZ,
  -- Seconds allowed per clip. Per-session rather than global: a DOGSO clip for
  -- new referees needs longer than a throw-in for a panel.
  ADD COLUMN IF NOT EXISTS question_seconds INTEGER NOT NULL DEFAULT 90,
  -- The game-show parts are all optional. A panel assessment wants the clips
  -- and none of the theatre; a Thursday night with juniors wants all of it.
  -- Defaults are on, because the coach who does not care never opens settings.
  ADD COLUMN IF NOT EXISTS timer_enabled       BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS scoring_enabled     BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS leaderboard_enabled BOOLEAN NOT NULL DEFAULT true;

COMMENT ON COLUMN public.pack_live_sessions.timer_enabled IS
  'Off: no countdown, and answers stay open until the coach reveals.';
COMMENT ON COLUMN public.pack_live_sessions.scoring_enabled IS
  'Off: answers are still marked right or wrong, but nothing is worth points.';
COMMENT ON COLUMN public.pack_live_sessions.leaderboard_enabled IS
  'Off: no leaderboard phase and no standings on the projector. Ranking a room by name is not always what a coach wants.';

COMMENT ON COLUMN public.pack_live_sessions.phase IS
  'lobby (people joining) -> question (timer running) -> reveal (answer + spread) -> leaderboard -> next question, or ended.';
COMMENT ON COLUMN public.pack_live_sessions.question_started_at IS
  'Server clock when the current clip opened. The countdown and the speed bonus are both measured from this.';

-- Sessions opened before this migration are mid-flight slideshows; put them in
-- the phase that matches the flag they already have.
UPDATE public.pack_live_sessions
   SET phase = CASE WHEN NOT is_open THEN 'ended' WHEN reveal THEN 'reveal' ELSE 'question' END
 WHERE phase = 'lobby' AND (reveal OR NOT is_open);

-- ---------------------------------------------------------------------------
-- 2. Points
--
-- Only meaningful inside a live session: the self-paced path through a public
-- pack has no timer, so those rows keep 0 and the leaderboard ignores them.
-- ---------------------------------------------------------------------------

ALTER TABLE public.pack_guest_answers
  ADD COLUMN IF NOT EXISTS points INTEGER NOT NULL DEFAULT 0,
  -- Seconds from the clip opening to the answer landing. Distinct from
  -- time_taken_seconds, which the client reports and which a self-paced guest
  -- can spread over a lunch break.
  ADD COLUMN IF NOT EXISTS answered_in_seconds INTEGER;

COMMENT ON COLUMN public.pack_guest_answers.points IS
  'Live-session score for this answer: a base for being right plus a bonus for being quick. 0 outside a live session.';

-- The leaderboard sums points per attempt, so that is the index it wants.
CREATE INDEX IF NOT EXISTS pack_guest_answers_points_idx
  ON public.pack_guest_answers (attempt_id)
  WHERE points > 0;

-- Ordering the lobby and the leaderboard both start from "attempts in this
-- session", which 040 left unindexed because nothing read it that way.
CREATE INDEX IF NOT EXISTS pack_guest_attempts_session_idx
  ON public.pack_guest_attempts (session_id)
  WHERE session_id IS NOT NULL;
