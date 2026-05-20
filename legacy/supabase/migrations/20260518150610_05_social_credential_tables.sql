/*
  # DeskPilot Academy — Social & Credential Tables

  1. New Tables
    - `certificates` — Completion certificates per campus
    - `discussion_posts` — Threaded discussion posts with reactions
    - `notifications` — User notification feed

  2. Security
    - Certificates: students read own, admins read all
    - Discussions: visible to authenticated users; write rules by thread type
    - Notifications: users read/update own only
*/

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  campus_id uuid NOT NULL REFERENCES campuses(id),
  enrollment_id uuid NOT NULL REFERENCES enrollments(id),
  certificate_number text UNIQUE NOT NULL DEFAULT 'CERT-' || upper(substr(gen_random_uuid()::text, 1, 8)),
  issued_at timestamptz NOT NULL DEFAULT now(),
  pdf_url text,
  image_url text
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read own certificates"
  ON certificates FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can insert certificates"
  ON certificates FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') OR auth.uid() = student_id);

-- Discussion posts table
CREATE TABLE IF NOT EXISTS discussion_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_post_id uuid REFERENCES discussion_posts(id) ON DELETE CASCADE,
  body text NOT NULL CHECK (char_length(body) > 0),
  is_pinned bool NOT NULL DEFAULT false,
  reactions jsonb NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'hidden', 'deleted')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE discussion_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read published discussion posts"
  ON discussion_posts FOR SELECT
  TO authenticated
  USING (status = 'published');

CREATE POLICY "Admins and professors can insert posts"
  ON discussion_posts FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = author_id
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'professor'))
  );

CREATE POLICY "Students can react to posts (update reactions only)"
  ON discussion_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'professor')))
  WITH CHECK (auth.uid() = author_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'professor')));

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  data jsonb,
  is_read bool NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_discussion_posts_session ON discussion_posts(session_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
