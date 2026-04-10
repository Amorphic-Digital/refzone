-- Drop unique constraints on display_name since users are identified by their Clerk id.
-- Multiple users can share the same display name.
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS unique_display_name;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_display_name_key;
