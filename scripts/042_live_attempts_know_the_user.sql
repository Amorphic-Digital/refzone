-- ============================================================================
-- 042: A live attempt knows who is behind it
--
-- Public packs were built for people with no account, so every answer went to
-- pack_guest_attempts regardless. That meant a referee who does have an
-- account and joins their coach's training night got nothing for it: no
-- scenario response, no law performance, no streak, no points. The clips they
-- judged in the room did not count as clips they had done.
--
-- So an attempt now records the Clerk id when there was a session behind the
-- request. Guests stay NULL and behave exactly as before; a signed-in
-- participant is credited through the same path as any other scenario
-- (lib/scenario-credit.ts) and shows up in the coach's results under their
-- real name rather than as a guest.
--
-- Safe to re-run.
-- ============================================================================

ALTER TABLE public.pack_guest_attempts
  ADD COLUMN IF NOT EXISTS user_id TEXT;

COMMENT ON COLUMN public.pack_guest_attempts.user_id IS
  'Clerk id of the participant when they were signed in; NULL for a true guest. Set at join time and used to credit their profile and to name them in the coach''s results.';

COMMENT ON TABLE public.pack_guest_attempts IS
  'One person''s run at a public pack, signed in or not. Named "guest" because it is the no-account path; user_id is set whenever we do know who it is.';

-- The credit path asks "has this person already been credited for this clip",
-- and the results view groups a session's attempts by account.
CREATE INDEX IF NOT EXISTS pack_guest_attempts_user_idx
  ON public.pack_guest_attempts (user_id)
  WHERE user_id IS NOT NULL;
