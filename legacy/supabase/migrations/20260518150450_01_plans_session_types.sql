/*
  # DeskPilot Academy — Reference Tables

  Creates plans, session_types, and app_settings tables with seed data.
  Profiles table is created in the next migration after RLS can reference it.
*/

-- Plans table
CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  price_monthly_cents int NOT NULL DEFAULT 0,
  price_annual_cents int NOT NULL DEFAULT 0,
  stripe_monthly_price_id text,
  stripe_annual_price_id text,
  features jsonb DEFAULT '[]',
  is_active bool DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Plans are readable by authenticated users"
  ON plans FOR SELECT
  TO authenticated
  USING (true);

INSERT INTO plans (name, slug, price_monthly_cents, price_annual_cents, features)
VALUES (
  'All-Access',
  'all-access',
  9900,
  89900,
  '["All 9 training campuses", "140+ on-demand sessions", "25+ AI deal simulations", "Live coaching sessions", "Campus certifications", "Performance analytics"]'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- Session types table
CREATE TABLE IF NOT EXISTS session_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text NOT NULL DEFAULT 'play',
  color text NOT NULL DEFAULT '#f59e0b',
  description text DEFAULT ''
);

ALTER TABLE session_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Session types are readable by authenticated users"
  ON session_types FOR SELECT
  TO authenticated
  USING (true);

INSERT INTO session_types (name, slug, icon, color, description) VALUES
  ('Video Lesson', 'video', 'play-circle', '#3b82f6', 'On-demand video content with progress tracking'),
  ('AI Simulation', 'ai_sim', 'brain', '#8b5cf6', 'Interactive deal practice with AI-powered customer personas'),
  ('Live Session', 'live', 'users', '#10b981', 'Scheduled live coaching and Q&A sessions'),
  ('Assessment', 'assessment', 'clipboard-list', '#f59e0b', 'Graded quizzes and exams with passing score requirements'),
  ('Discussion', 'discussion', 'message-square', '#ec4899', 'Broadcast or open threaded discussions')
ON CONFLICT (slug) DO NOTHING;

-- App settings table
CREATE TABLE IF NOT EXISTS app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Simple read policy - write policy added after profiles table exists
CREATE POLICY "App settings readable by authenticated users"
  ON app_settings FOR SELECT
  TO authenticated
  USING (true);

INSERT INTO app_settings (key, value) VALUES
  ('allowed_reactions', '["👍","🔥","💡","✅","🎯"]'::jsonb),
  ('platform_name', '"DeskPilot Academy"'::jsonb),
  ('support_email', '"support@deskpilot.com"'::jsonb),
  ('max_assessment_attempts', '3'::jsonb)
ON CONFLICT (key) DO NOTHING;
