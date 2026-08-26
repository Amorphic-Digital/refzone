-- ============================================================================
-- 037: Move scenario videos from YouTube to Cloudflare R2
--
-- Scenario videos used to be YouTube URLs pasted into the admin form. They are
-- now files in an R2 bucket, uploaded straight from the browser and served
-- from a Cloudflare custom domain.
--
-- Every existing scenario points at a YouTube video that is going away, so
-- this wipes the scenario table and starts again. The FKs from
-- scenario_responses, training_pack_items and training_pack_progress all
-- cascade, so their rows go with it — past answers to those scenarios and any
-- pack built from them are deleted deliberately, not by accident.
--
-- Safe to re-run (the delete is then a no-op).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Clear out the YouTube-era scenarios
-- ---------------------------------------------------------------------------

-- Explicit, though ON DELETE CASCADE would do it, so the blast radius is
-- written down rather than implied.
DELETE FROM public.training_pack_progress;
DELETE FROM public.training_pack_items;
DELETE FROM public.scenario_responses;
DELETE FROM public.scenarios;

-- ---------------------------------------------------------------------------
-- 2. Track the R2 object behind each video
-- ---------------------------------------------------------------------------

-- video_url stays the playable URL, so nothing that reads a scenario has to
-- change. video_key is the object key inside the bucket: it is what lets a
-- scenario delete also delete its video, and what would let the bucket move to
-- a different public domain without orphaning every object
-- (UPDATE scenarios SET video_url = '<new base>/' || video_key).
ALTER TABLE public.scenarios
  ADD COLUMN IF NOT EXISTS video_key TEXT;

COMMENT ON COLUMN public.scenarios.video_url IS
  'Public CDN URL of the scenario video on the R2 custom domain (required).';
COMMENT ON COLUMN public.scenarios.video_key IS
  'R2 object key for the video, e.g. scenarios/<uuid>.mp4. Used for deletion.';
COMMENT ON TABLE public.scenarios IS
  'Video-based match scenarios. Videos live in Cloudflare R2; everything else is Supabase.';

-- video_duration_seconds was only ever set by the old YouTube import path and
-- nothing reads it — the player reads duration from the file itself.
ALTER TABLE public.scenarios
  DROP COLUMN IF EXISTS video_duration_seconds;

-- ---------------------------------------------------------------------------
-- 3. Retire the unused Supabase video buckets
-- ---------------------------------------------------------------------------

-- 033 created a 'scenario-videos' bucket that was never actually used (the
-- app went to YouTube instead), and an unused /api/upload-video route wrote to
-- a 'videos' bucket. Both are gone from the code now.
--
-- Only the policies are dropped here. Supabase guards storage.objects and
-- storage.buckets with a protect_delete() trigger that rejects any direct
-- DELETE ("Direct deletion from storage tables is not allowed"), and because
-- the SQL editor runs this file in a single transaction, that one error rolls
-- back the scenario wipe above with it. The buckets are empty and harmless, so
-- delete them from Storage in the dashboard if you want them gone.
DROP POLICY IF EXISTS "Admins can upload scenario videos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read scenario videos"   ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete scenario videos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update scenario videos" ON storage.objects;
