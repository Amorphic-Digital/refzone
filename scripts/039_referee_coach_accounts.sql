-- ============================================================================
-- 039: Referee Coach accounts
--
-- Two kinds of account now:
--
--   * A referee trains. They pick a topic and the app deals them clips from it
--     at random. They never see the library, never choose the next clip, and
--     are never shown how much of it they have got through — the point is the
--     next decision, not a completion bar.
--
--   * A referee coach prepares the training. They need the opposite: the whole
--     library, the ability to open any single scenario, and training packs
--     built from clips they chose deliberately.
--
-- Coach is granted, not self-declared, so it is a flag on the profile set by an
-- admin from a written application.
--
-- Safe to re-run.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. The flag
-- ---------------------------------------------------------------------------

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_coach BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.profiles.is_coach IS
  'Referee Coach: may browse the whole scenario library, open a scenario directly, and build training packs. Granted by an admin from a coach_applications row.';

CREATE INDEX IF NOT EXISTS profiles_is_coach_idx
  ON public.profiles (is_coach)
  WHERE is_coach = true;

-- Admins are coaches by definition — they upload the library in the first
-- place, and having to approve themselves is silly.
UPDATE public.profiles SET is_coach = true WHERE is_admin = true AND is_coach = false;

-- ---------------------------------------------------------------------------
-- 2. Applications
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.coach_applications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Clerk user id, matching profiles.id. One live application per person: a
  -- rejected applicant reapplies by overwriting their row, so there is never a
  -- queue of near-identical submissions from the same user to read through.
  user_id       TEXT NOT NULL UNIQUE,
  -- Snapshotted at submission so the review queue reads correctly even if the
  -- applicant later renames themselves.
  display_name  TEXT,
  email         TEXT,
  -- Who they officiate for, and at what level. Free text: the answer is
  -- "Football West, Metro Div 2", and no dropdown survives contact with that.
  association   TEXT,
  level         TEXT,
  -- Why they want the library. This is the part an admin actually reads.
  reason        TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'approved', 'rejected')),
  -- Set on approve/reject. review_note is shown back to the applicant, so it
  -- is the place to say why a rejection happened.
  review_note   TEXT,
  reviewed_by   TEXT,
  reviewed_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.coach_applications IS
  'Requests for a Referee Coach account. One row per user; approving one sets profiles.is_coach.';

CREATE INDEX IF NOT EXISTS coach_applications_status_idx
  ON public.coach_applications (status, created_at DESC);

-- ---------------------------------------------------------------------------
-- 3. Row level security
--
-- Every read and write of this table goes through the service-role client in
-- lib/supabase/service.ts, which bypasses RLS. RLS is on with no policy so
-- that the anon-key browser client cannot read other people's applications —
-- they contain names, emails and a written pitch.
-- ---------------------------------------------------------------------------

ALTER TABLE public.coach_applications ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 4. updated_at maintenance
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.touch_coach_application_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS coach_applications_touch_updated_at ON public.coach_applications;
CREATE TRIGGER coach_applications_touch_updated_at
  BEFORE UPDATE ON public.coach_applications
  FOR EACH ROW EXECUTE FUNCTION public.touch_coach_application_updated_at();
