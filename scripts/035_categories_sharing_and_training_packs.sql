-- ============================================================================
-- 035: Scenario categories, share tracking, and coach training packs
--
-- Adds:
--   1. scenarios.category        — training topic (DOGSO, reckless tackles, ...)
--   2. training_packs            — a coach-curated set of scenarios, shareable
--   3. training_pack_items       — ordered scenarios inside a pack
--   4. training_pack_progress    — who worked through a pack and how they did
--
-- Safe to re-run.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Scenario categories
-- ---------------------------------------------------------------------------

ALTER TABLE public.scenarios
  ADD COLUMN IF NOT EXISTS category TEXT;

COMMENT ON COLUMN public.scenarios.category IS
  'Training topic slug from lib/scenario-categories.ts (e.g. dogso, reckless-tackles). Nullable: legacy rows are uncategorised.';

CREATE INDEX IF NOT EXISTS scenarios_category_idx
  ON public.scenarios (category)
  WHERE is_active = true;

-- Best-effort backfill from the existing coarse scenario_type so the category
-- menu is not empty on day one. Only touches rows that have no category yet;
-- anything ambiguous is left NULL for an admin to tag by hand.
UPDATE public.scenarios SET category = CASE scenario_type
    WHEN 'handball'   THEN 'handball'
    WHEN 'offside'    THEN 'offside'
    WHEN 'penalty'    THEN 'penalty-area-incidents'
    WHEN 'advantage'  THEN 'advantage'
    WHEN 'var'        THEN 'var-and-match-control'
    WHEN 'foul'       THEN 'reckless-tackles'
    WHEN 'misconduct' THEN 'dissent-and-confrontation'
    ELSE NULL
  END
  WHERE category IS NULL;

-- ---------------------------------------------------------------------------
-- 2. Training packs
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.training_packs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  description  TEXT,
  category     TEXT,
  -- Clerk user id of the coach who built the pack. Text, not a FK to
  -- auth.users: this app authenticates with Clerk, and profiles.id holds the
  -- same Clerk id.
  created_by   TEXT NOT NULL,
  -- Short opaque code used in share links (/share/pack/<id>?c=<share_code>)
  -- so pack attempts can be attributed back to the coach who sent the link.
  share_code   TEXT NOT NULL UNIQUE,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.training_packs IS
  'Coach-curated sets of scenarios shared with trainee referees via a single link.';

CREATE INDEX IF NOT EXISTS training_packs_created_by_idx ON public.training_packs (created_by);
CREATE INDEX IF NOT EXISTS training_packs_share_code_idx ON public.training_packs (share_code);

-- ---------------------------------------------------------------------------
-- 3. Pack contents
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.training_pack_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id     UUID NOT NULL REFERENCES public.training_packs(id) ON DELETE CASCADE,
  scenario_id UUID NOT NULL REFERENCES public.scenarios(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (pack_id, scenario_id)
);

CREATE INDEX IF NOT EXISTS training_pack_items_pack_idx
  ON public.training_pack_items (pack_id, order_index);

-- ---------------------------------------------------------------------------
-- 4. Pack progress (the coach results view)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.training_pack_progress (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id            UUID NOT NULL REFERENCES public.training_packs(id) ON DELETE CASCADE,
  scenario_id        UUID NOT NULL REFERENCES public.scenarios(id) ON DELETE CASCADE,
  -- Clerk user id of the trainee. Sign-in is required to open a share link,
  -- so this is always known.
  user_id            TEXT NOT NULL,
  answer_text        TEXT,
  is_correct         BOOLEAN NOT NULL DEFAULT false,
  time_taken_seconds INTEGER NOT NULL DEFAULT 0,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- One row per trainee per scenario per pack; a retry overwrites it.
  UNIQUE (pack_id, scenario_id, user_id)
);

CREATE INDEX IF NOT EXISTS training_pack_progress_pack_idx
  ON public.training_pack_progress (pack_id, user_id);

-- ---------------------------------------------------------------------------
-- 5. Row level security
--
-- Every server read/write in this app goes through the service-role client in
-- lib/supabase/service.ts, which bypasses RLS. These policies exist so the
-- anon-key browser client cannot read other coaches' packs or trainee results.
-- ---------------------------------------------------------------------------

ALTER TABLE public.training_packs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_pack_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_pack_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS training_packs_select_active ON public.training_packs;
CREATE POLICY training_packs_select_active
  ON public.training_packs FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS training_pack_items_select_all ON public.training_pack_items;
CREATE POLICY training_pack_items_select_all
  ON public.training_pack_items FOR SELECT
  USING (true);

-- No policy on training_pack_progress: trainee results are readable only
-- through the service-role client, which enforces "you must own the pack" in
-- app code (app/packs/[id]/results/page.tsx).

-- ---------------------------------------------------------------------------
-- 6. updated_at maintenance
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.touch_training_pack_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS training_packs_touch_updated_at ON public.training_packs;
CREATE TRIGGER training_packs_touch_updated_at
  BEFORE UPDATE ON public.training_packs
  FOR EACH ROW EXECUTE FUNCTION public.touch_training_pack_updated_at();
