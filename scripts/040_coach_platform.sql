-- ============================================================================
-- 040: The Referee Coach platform
--
-- 039 created the coach flag. This is everything a coach actually needs behind
-- it:
--
--   1. A grant with a lifetime      — coach accounts are free now and may not
--                                     always be, so the grant can expire.
--   2. Groups                       — a named roster, instead of "whoever
--                                     happened to open my link".
--   3. Assignments with a due date  — homework, not a link people ignore.
--   4. Coach review of answers      — read what they wrote, override a bad AI
--                                     call, write back.
--   5. Public packs + guest attempts— share a link with the branch; no account
--                                     needed to answer.
--   6. Live sessions                — the coach drives the clip, the room
--                                     answers on their phones.
--   7. Scenario submissions         — coaches have footage; let them send it.
--
-- Safe to re-run.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. The grant has a lifetime
--
-- profiles.is_coach stays the switch that code reads, but on its own it cannot
-- express "free for the 2026 season". Recording when the grant started and
-- when it lapses now costs nothing and means moving to paid later is a policy
-- change rather than a migration under pressure.
-- ---------------------------------------------------------------------------

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS coach_since      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS coach_expires_at TIMESTAMPTZ;

COMMENT ON COLUMN public.profiles.coach_since IS
  'When the coach grant was made. NULL for accounts granted before 040.';
COMMENT ON COLUMN public.profiles.coach_expires_at IS
  'When the coach grant lapses. NULL means it does not — the current default while coach accounts are free.';

-- Existing coaches keep an open-ended grant; only the start date is backfilled.
UPDATE public.profiles
   SET coach_since = COALESCE(coach_since, now())
 WHERE is_coach = true AND coach_since IS NULL;

-- ---------------------------------------------------------------------------
-- 2. Groups
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.coach_groups (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Clerk user id of the coach. Text, not a FK to auth.users: this app
  -- authenticates with Clerk and profiles.id holds the same id.
  coach_id    TEXT NOT NULL,
  name        TEXT NOT NULL,
  description TEXT,
  -- Typed off a screen at a training night, so it uses the same look-alike-free
  -- alphabet as pack share codes (lib/training-packs.ts).
  join_code   TEXT NOT NULL UNIQUE,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.coach_groups IS
  'A coach''s named roster of referees. Referees join with the code; the coach never adds anyone without them acting.';

CREATE INDEX IF NOT EXISTS coach_groups_coach_idx ON public.coach_groups (coach_id);
CREATE INDEX IF NOT EXISTS coach_groups_join_code_idx ON public.coach_groups (join_code);

CREATE TABLE IF NOT EXISTS public.coach_group_members (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id  UUID NOT NULL REFERENCES public.coach_groups(id) ON DELETE CASCADE,
  user_id   TEXT NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (group_id, user_id)
);

CREATE INDEX IF NOT EXISTS coach_group_members_user_idx ON public.coach_group_members (user_id);

-- ---------------------------------------------------------------------------
-- 3. Assignments
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.pack_assignments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id          UUID NOT NULL REFERENCES public.training_packs(id) ON DELETE CASCADE,
  group_id         UUID NOT NULL REFERENCES public.coach_groups(id) ON DELETE CASCADE,
  assigned_by      TEXT NOT NULL,
  due_at           TIMESTAMPTZ,
  -- Stamped by the reminder cron so a group is never nudged twice for the
  -- same assignment.
  reminder_sent_at TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (pack_id, group_id)
);

CREATE INDEX IF NOT EXISTS pack_assignments_group_idx ON public.pack_assignments (group_id);
CREATE INDEX IF NOT EXISTS pack_assignments_due_idx
  ON public.pack_assignments (due_at)
  WHERE due_at IS NOT NULL AND reminder_sent_at IS NULL;

-- The reminder writes a notification, and 017 constrained the type column to a
-- fixed list that the app has already outgrown (it writes 'admin_announcement').
-- Drop the constraint rather than keep chasing it.
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;

-- ---------------------------------------------------------------------------
-- 4. Coach review of answers
--
-- Answers are graded by a model at >=70% confidence. It gets calls wrong, and
-- the coach is the one who can say so — that judgement is the point of a coach
-- account, so it is recorded beside the answer rather than replacing it.
-- ---------------------------------------------------------------------------

ALTER TABLE public.training_pack_progress
  ADD COLUMN IF NOT EXISTS coach_override_correct BOOLEAN,
  ADD COLUMN IF NOT EXISTS coach_note             TEXT,
  ADD COLUMN IF NOT EXISTS coach_reviewed_by      TEXT,
  ADD COLUMN IF NOT EXISTS coach_reviewed_at      TIMESTAMPTZ;

COMMENT ON COLUMN public.training_pack_progress.coach_override_correct IS
  'Coach''s verdict where it differs from the model. NULL means the model''s is_correct stands.';
COMMENT ON COLUMN public.training_pack_progress.coach_note IS
  'Written back to the referee alongside their answer.';

-- ---------------------------------------------------------------------------
-- 5. Public packs and guest attempts
--
-- A coach sending a pack to a whole branch cannot make three hundred people
-- create accounts first. A public pack answers on the link alone.
--
-- Guests get their own tables rather than nullable columns on
-- training_pack_progress: the signed-in path keeps its NOT NULL user_id and
-- its unique key untouched, and a guest row can never be mistaken for a
-- member's progress in a query that forgot to filter.
-- ---------------------------------------------------------------------------

ALTER TABLE public.training_packs
  ADD COLUMN IF NOT EXISTS is_public    BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS collect_name BOOLEAN NOT NULL DEFAULT true;

COMMENT ON COLUMN public.training_packs.is_public IS
  'Anyone with the link may answer, signed in or not. Off by default: a pack is private until the coach says otherwise.';
COMMENT ON COLUMN public.training_packs.collect_name IS
  'Ask guests for a name before they start, so the results view is not a wall of "Anonymous".';

CREATE TABLE IF NOT EXISTS public.pack_guest_attempts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id       UUID NOT NULL REFERENCES public.training_packs(id) ON DELETE CASCADE,
  display_name  TEXT,
  -- Opaque token held in the guest's browser. It is what lets them refresh
  -- without starting a second attempt, and it is the only thing that
  -- authorises writing to this attempt — so it is generated server-side.
  session_token TEXT NOT NULL,
  -- Set when a live session dealt this attempt, so a coach can tell the room
  -- from people who did it at home.
  session_id    UUID,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at  TIMESTAMPTZ,
  UNIQUE (pack_id, session_token)
);

CREATE INDEX IF NOT EXISTS pack_guest_attempts_pack_idx ON public.pack_guest_attempts (pack_id);

CREATE TABLE IF NOT EXISTS public.pack_guest_answers (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id             UUID NOT NULL REFERENCES public.pack_guest_attempts(id) ON DELETE CASCADE,
  scenario_id            UUID NOT NULL REFERENCES public.scenarios(id) ON DELETE CASCADE,
  answer_text            TEXT,
  is_correct             BOOLEAN NOT NULL DEFAULT false,
  coach_override_correct BOOLEAN,
  coach_note             TEXT,
  coach_reviewed_by      TEXT,
  coach_reviewed_at      TIMESTAMPTZ,
  time_taken_seconds     INTEGER NOT NULL DEFAULT 0,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (attempt_id, scenario_id)
);

CREATE INDEX IF NOT EXISTS pack_guest_answers_attempt_idx ON public.pack_guest_answers (attempt_id);
CREATE INDEX IF NOT EXISTS pack_guest_answers_scenario_idx ON public.pack_guest_answers (scenario_id);

-- ---------------------------------------------------------------------------
-- 6. Live sessions
--
-- The training-night case: one clip on the projector, everyone answering at
-- once, then the answer and the spread of responses together.
--
-- Deliberately a table and not a socket. The room polls current_index a few
-- times a minute, which is well inside what this app already does per page and
-- needs no realtime infrastructure to keep working.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.pack_live_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id       UUID NOT NULL REFERENCES public.training_packs(id) ON DELETE CASCADE,
  coach_id      TEXT NOT NULL,
  -- Short code the room types in. Same alphabet as the other codes.
  join_code     TEXT NOT NULL UNIQUE,
  -- Which scenario the room is on, as an index into the pack's item order.
  current_index INTEGER NOT NULL DEFAULT 0,
  -- The coach holds answers back until everyone has had a go.
  reveal        BOOLEAN NOT NULL DEFAULT false,
  is_open       BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS pack_live_sessions_code_idx ON public.pack_live_sessions (join_code);
CREATE INDEX IF NOT EXISTS pack_live_sessions_coach_idx ON public.pack_live_sessions (coach_id);

-- ---------------------------------------------------------------------------
-- 7. Coach-submitted footage
--
-- Coaches have clips the library does not. They go to an admin, never straight
-- to the library: rights and quality are not something to take on trust, and
-- video_credit (038) is where the rights question gets answered in writing.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.scenario_submissions (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_by       TEXT NOT NULL,
  video_url          TEXT NOT NULL,
  video_key          TEXT,
  -- Required here even though scenarios.video_credit is nullable: an admin
  -- cannot judge whether footage is usable without being told where it is from.
  video_credit       TEXT NOT NULL,
  suggested_answer   TEXT NOT NULL,
  suggested_category TEXT,
  note               TEXT,
  status             TEXT NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'approved', 'rejected')),
  review_note        TEXT,
  reviewed_by        TEXT,
  reviewed_at        TIMESTAMPTZ,
  -- Set when an admin turns the submission into a live scenario.
  scenario_id        UUID REFERENCES public.scenarios(id) ON DELETE SET NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS scenario_submissions_status_idx
  ON public.scenario_submissions (status, created_at DESC);
CREATE INDEX IF NOT EXISTS scenario_submissions_by_idx
  ON public.scenario_submissions (submitted_by);

-- ---------------------------------------------------------------------------
-- 8. Row level security
--
-- Every read and write below goes through the service-role client in
-- lib/supabase/service.ts, which bypasses RLS. RLS is enabled with no policy
-- so the anon-key browser client cannot reach any of it directly — these
-- tables hold other people's names, answers and contact details, and the
-- guest tables are written from unauthenticated requests.
-- ---------------------------------------------------------------------------

ALTER TABLE public.coach_groups         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_group_members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pack_assignments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pack_guest_attempts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pack_guest_answers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pack_live_sessions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_submissions ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 9. updated_at maintenance
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS coach_groups_touch_updated_at ON public.coach_groups;
CREATE TRIGGER coach_groups_touch_updated_at
  BEFORE UPDATE ON public.coach_groups
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS pack_live_sessions_touch_updated_at ON public.pack_live_sessions;
CREATE TRIGGER pack_live_sessions_touch_updated_at
  BEFORE UPDATE ON public.pack_live_sessions
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
