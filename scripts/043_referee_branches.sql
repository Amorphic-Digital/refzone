-- ============================================================================
-- 043: Referee branches
--
-- A branch is the real-world body a referee belongs to — an association, a
-- district, a club's referee panel. Until now the only social structure in the
-- app was the global leaderboard, which is the wrong shape for the thing
-- referees actually care about: how they are going against the people they
-- turn up with on a Saturday. Ranking 400th of 9,000 strangers is a number
-- nobody acts on. Ranking 4th in your branch is.
--
-- Branches are deliberately NOT coach groups (040). A group is a coach's
-- teaching roster — several per coach, a referee in as many as their coaches
-- make. A branch is where you referee: one per person, and it outlives any
-- particular coach, which is why ownership can be handed on.
--
-- Safe to re-run.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. The branch
--
-- owner_id is the coach responsible for it. It is separate from created_by so
-- that handing a branch on is a change of one column rather than a lie about
-- who built it — branches outlast the coach who set them up, and a coach who
-- moves association should be able to leave without taking the branch with
-- them.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.referee_branches (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  -- Free text: "Northern NSW", "Sydney Metro". Branch naming is not consistent
  -- enough across associations to be worth a lookup table.
  region      TEXT,
  -- Clerk user id of the coach who owns it. Text, not a FK to auth.users: this
  -- app authenticates with Clerk and profiles.id holds the same id.
  owner_id    TEXT NOT NULL,
  created_by  TEXT NOT NULL,
  -- Read out at a training night, so it uses the same look-alike-free alphabet
  -- as pack share codes and group join codes (lib/share-codes.ts).
  join_code   TEXT NOT NULL UNIQUE,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.referee_branches IS
  'A referee association/branch. One coach owns it; ownership transfers to another coach in the branch.';
COMMENT ON COLUMN public.referee_branches.owner_id IS
  'The coach responsible for the branch. Always also present in referee_branch_members with role = coach.';

CREATE INDEX IF NOT EXISTS referee_branches_owner_idx ON public.referee_branches (owner_id);
CREATE INDEX IF NOT EXISTS referee_branches_join_code_idx ON public.referee_branches (join_code);

-- ---------------------------------------------------------------------------
-- 2. Membership
--
-- UNIQUE on user_id, not on (branch_id, user_id): you referee for one branch.
-- That single constraint is what lets "your branch leaderboard" be a question
-- with one answer, and what stops someone collecting branches to be top of the
-- easiest one.
--
-- role is stored here rather than read from profiles.is_coach because the two
-- are different questions. is_coach says what the account can do in the app;
-- role says what this person is *in this branch*, and it is the branch role
-- that decides who appears on the ladder and who can see other people's
-- answers.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.referee_branch_members (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES public.referee_branches(id) ON DELETE CASCADE,
  user_id   TEXT NOT NULL UNIQUE,
  role      TEXT NOT NULL DEFAULT 'referee' CHECK (role IN ('referee', 'coach')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.referee_branch_members IS
  'Who is in which branch. UNIQUE (user_id): one branch per person.';
COMMENT ON COLUMN public.referee_branch_members.role IS
  'referee = ranked on the branch ladder. coach = not ranked, and can read the branch''s referees'' answers.';

CREATE INDEX IF NOT EXISTS referee_branch_members_branch_idx
  ON public.referee_branch_members (branch_id);
CREATE INDEX IF NOT EXISTS referee_branch_members_branch_role_idx
  ON public.referee_branch_members (branch_id, role);

-- ---------------------------------------------------------------------------
-- 3. Access
--
-- Every read and write goes through the service-role client in
-- lib/supabase/service.ts, which bypasses RLS. RLS is enabled with no policy so
-- the anon-key browser client cannot reach any of it directly — the roster is
-- a list of other referees' names, and the join code is a key to the branch.
-- ---------------------------------------------------------------------------

ALTER TABLE public.referee_branches       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referee_branch_members ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 4. updated_at maintenance
--
-- touch_updated_at() is created by 040.
-- ---------------------------------------------------------------------------

DROP TRIGGER IF EXISTS referee_branches_touch_updated_at ON public.referee_branches;
CREATE TRIGGER referee_branches_touch_updated_at
  BEFORE UPDATE ON public.referee_branches
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
