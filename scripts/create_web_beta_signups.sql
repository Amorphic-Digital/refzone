-- Create table for RefZone Web beta email signups
CREATE TABLE IF NOT EXISTS web_beta_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  signed_up_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for admin queries
CREATE INDEX IF NOT EXISTS idx_web_beta_signups_created_at ON web_beta_signups(created_at DESC);

-- Allow service role full access (no RLS needed — only accessed via service client)
ALTER TABLE web_beta_signups ENABLE ROW LEVEL SECURITY;
