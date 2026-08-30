-- ============================================================================
-- 038: Record where each scenario video came from
--
-- Scenario clips are broadcast footage, so the play page has to say whose
-- footage it is. The source is typed in by the admin at upload time — nothing
-- in an R2 object tells us the match, competition or broadcaster — and shown
-- above the video in place of the old "watch carefully" instruction.
--
-- Nullable, because every scenario uploaded before this column existed has no
-- source recorded. The player falls back to the instruction line for those,
-- and the admin scenario list lets them be filled in after the fact.
--
-- Safe to re-run.
-- ============================================================================

ALTER TABLE public.scenarios
  ADD COLUMN IF NOT EXISTS video_credit TEXT;

COMMENT ON COLUMN public.scenarios.video_credit IS
  'Human-written acknowledgement of where the video came from, e.g. "A-League Men 2024/25 — Perth Glory v Western Sydney Wanderers (Paramount+)". Shown to users above the video.';
