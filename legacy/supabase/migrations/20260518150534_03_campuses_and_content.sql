/*
  # DeskPilot Academy — Campuses, Levels, Sessions, AI Scenarios

  1. New Tables
    - `campuses` — Training campuses (9 total)
    - `levels` — Sequential levels within each campus
    - `ai_scenarios` — AI simulation scenario definitions
    - `sessions` — Individual training sessions within levels

  2. Seeds
    - All 9 campuses pre-seeded with metadata

  3. Security
    - RLS on all tables
    - Students see published campuses; admins/professors can CRUD
*/

-- Campuses table
CREATE TABLE IF NOT EXISTS campuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  emoji text NOT NULL DEFAULT '📚',
  color text NOT NULL DEFAULT '#f59e0b',
  description text DEFAULT '',
  professor_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  display_order int NOT NULL DEFAULT 99,
  badge_emoji text NOT NULL DEFAULT '🏆',
  badge_name text NOT NULL DEFAULT 'Graduate',
  thumbnail_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE campuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published campuses readable by authenticated users"
  ON campuses FOR SELECT
  TO authenticated
  USING (status = 'published' OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'professor')));

CREATE POLICY "Admins can insert campuses"
  ON campuses FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update campuses"
  ON campuses FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete campuses"
  ON campuses FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Seed all 9 campuses
INSERT INTO campuses (name, slug, emoji, color, description, display_order, badge_emoji, badge_name, status) VALUES
  ('Digital Retailing & AI', 'digital-retailing-ai', '💻', '#3b82f6', 'Master the digital showroom and AI-powered selling tools that are reshaping the automotive retail experience.', 1, '💻', 'Digital Retail Certified', 'published'),
  ('F&I Mastery', 'fi-mastery', '🏦', '#f59e0b', 'From menu basics to advanced objection handling and PVR optimization. The complete F&I curriculum for finance managers at every level.', 2, '🏦', 'F&I Certified', 'published'),
  ('Desking & Deal Structure', 'desking-deal-structure', '📊', '#10b981', 'Gross protection, pencil strategy, and deal structuring discipline. How to hold gross without losing deals.', 3, '📊', 'Desk Certified', 'published'),
  ('Sales Fundamentals', 'sales-fundamentals', '🤝', '#ec4899', 'The complete road to the sale from meet-and-greet to delivery. Process-driven selling that closes without pressure.', 4, '🤝', 'Sales Certified', 'published'),
  ('Fixed Ops', 'fixed-ops', '🔧', '#8b5cf6', 'Service drive revenue, customer retention, and advisor performance. Turn your fixed ops into a growth engine.', 5, '🔧', 'Fixed Ops Certified', 'published'),
  ('Used Vehicle Ops', 'used-vehicle-ops', '🚗', '#f97316', 'Acquisition, appraisal, pricing strategy, and turn rate management. The complete used vehicle department curriculum.', 6, '🚗', 'Used Vehicle Certified', 'published'),
  ('Management & Leadership', 'management-leadership', '📈', '#06b6d4', 'Desk management, team development, and performance culture. How to build and lead a dealership team that wins consistently.', 7, '📈', 'Leadership Certified', 'published'),
  ('Compliance & Ethics', 'compliance-ethics', '⚖️', '#ef4444', 'ECOA, MLA, state-specific rules, and deal compliance guardrails. Know the rules before you break them.', 8, '⚖️', 'Compliance Certified', 'published'),
  ('Lender Intelligence', 'lender-intelligence', '🏛️', '#84cc16', 'Lender profiles, routing strategy, and rate markup optimization. Stop leaving reserve on the table.', 9, '🏛️', 'Lender Intel Certified', 'published')
ON CONFLICT (slug) DO NOTHING;

-- Levels table
CREATE TABLE IF NOT EXISTS levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campus_id uuid NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  level_order int NOT NULL,
  unlock_rule text NOT NULL DEFAULT 'complete_prior' CHECK (unlock_rule IN ('complete_prior', 'manual', 'always_open')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (campus_id, level_order)
);

ALTER TABLE levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Levels readable by authenticated users"
  ON levels FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campuses c
      WHERE c.id = campus_id
      AND (c.status = 'published' OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'professor')))
    )
  );

CREATE POLICY "Admins can insert levels"
  ON levels FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update levels"
  ON levels FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete levels"
  ON levels FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- AI Scenarios table
CREATE TABLE IF NOT EXISTS ai_scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  difficulty text NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
  customer_persona text NOT NULL DEFAULT '',
  deal_profile jsonb NOT NULL DEFAULT '{}',
  scoring_rubric jsonb NOT NULL DEFAULT '{}',
  system_prompt text NOT NULL DEFAULT '',
  max_score int NOT NULL DEFAULT 100,
  passing_score int NOT NULL DEFAULT 70,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ai_scenarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "AI scenarios readable by authenticated users"
  ON ai_scenarios FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage AI scenarios"
  ON ai_scenarios FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update AI scenarios"
  ON ai_scenarios FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete AI scenarios"
  ON ai_scenarios FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level_id uuid NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
  session_type_id uuid NOT NULL REFERENCES session_types(id),
  title text NOT NULL,
  description text,
  session_order int NOT NULL DEFAULT 1,
  duration_min int,
  is_required bool NOT NULL DEFAULT true,
  is_gate bool NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  content_url text,
  passing_score int,
  max_attempts int,
  time_limit_min int,
  ai_scenario_id uuid REFERENCES ai_scenarios(id) ON DELETE SET NULL,
  thread_type text CHECK (thread_type IN ('broadcast', 'open')),
  schedule timestamptz,
  meeting_url text,
  capacity int,
  recording_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published sessions readable by authenticated users"
  ON sessions FOR SELECT
  TO authenticated
  USING (
    status = 'published'
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'professor'))
  );

CREATE POLICY "Admins can insert sessions"
  ON sessions FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update sessions"
  ON sessions FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete sessions"
  ON sessions FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_levels_campus ON levels(campus_id);
CREATE INDEX IF NOT EXISTS idx_sessions_level ON sessions(level_id);
