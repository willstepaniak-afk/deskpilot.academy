/*
  # DeskPilot Academy — Progress Tracking Tables

  1. New Tables
    - `enrollments` — Student enrollment in a campus
    - `level_progress` — Per-level unlock and completion state
    - `student_progress` — Per-session completion, scores, attempts

  2. Security
    - Students read/write their own progress only
    - Admins can read all progress data

  3. Indexes
    - Optimized for common query patterns (student_id, campus_id, session_id)
*/

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  campus_id uuid NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  current_level_id uuid REFERENCES levels(id) ON DELETE SET NULL,
  progress_pct int NOT NULL DEFAULT 0 CHECK (progress_pct >= 0 AND progress_pct <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (student_id, campus_id)
);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read own enrollments"
  ON enrollments FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Students can insert own enrollments"
  ON enrollments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own enrollments"
  ON enrollments FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- Level progress table
CREATE TABLE IF NOT EXISTS level_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  level_id uuid NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
  enrollment_id uuid NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'unlocked', 'in_progress', 'completed')),
  unlocked_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  gate_passed bool NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (student_id, level_id)
);

ALTER TABLE level_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read own level progress"
  ON level_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Students can insert own level progress"
  ON level_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own level progress"
  ON level_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- Student progress table (per-session)
CREATE TABLE IF NOT EXISTS student_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  level_progress_id uuid NOT NULL REFERENCES level_progress(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'passed', 'failed')),
  started_at timestamptz,
  completed_at timestamptz,
  score int,
  attempt_number int NOT NULL DEFAULT 1,
  time_spent_sec int NOT NULL DEFAULT 0,
  ai_feedback jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (student_id, session_id, attempt_number)
);

ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read own session progress"
  ON student_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Students can insert own session progress"
  ON student_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own session progress"
  ON student_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_campus ON enrollments(campus_id);
CREATE INDEX IF NOT EXISTS idx_level_progress_student ON level_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_level_progress_level ON level_progress(level_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_student ON student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_session ON student_progress(session_id);
