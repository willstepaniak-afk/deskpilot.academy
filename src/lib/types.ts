export type UserRole = "admin" | "professor" | "student";
export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled" | "inactive";
export type CampusStatus = "draft" | "published" | "archived";
export type SessionStatus = "draft" | "published";
export type ProgressStatus = "not_started" | "in_progress" | "completed" | "passed" | "failed";
export type LevelProgressStatus = "locked" | "unlocked" | "in_progress" | "completed";
export type UnlockRule = "complete_prior" | "manual" | "always_open";
export type ThreadType = "broadcast" | "open";
export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  badges: string[];
  badge_names: string[];
  stripe_customer_id: string | null;
  subscription_status: SubscriptionStatus | null;
  subscription_plan_id: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface Campus {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  color: string;
  description: string;
  professor_id: string | null;
  status: CampusStatus;
  display_order: number;
  badge_emoji: string;
  badge_name: string;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Level {
  id: string;
  campus_id: string;
  name: string;
  description: string | null;
  level_order: number;
  unlock_rule: UnlockRule;
  created_at: string;
  updated_at: string;
}

export interface SessionType {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
}

export interface Session {
  id: string;
  level_id: string;
  session_type_id: string;
  title: string;
  description: string | null;
  session_order: number;
  duration_min: number | null;
  is_required: boolean;
  is_gate: boolean;
  status: SessionStatus;
  content_url: string | null;
  passing_score: number | null;
  max_attempts: number | null;
  time_limit_min: number | null;
  ai_scenario_id: string | null;
  thread_type: ThreadType | null;
  schedule: string | null;
  meeting_url: string | null;
  capacity: number | null;
  recording_url: string | null;
  created_at: string;
  updated_at: string;
  session_types?: SessionType;
}

export interface Enrollment {
  id: string;
  student_id: string;
  campus_id: string;
  status: "active" | "completed" | "paused";
  enrolled_at: string;
  completed_at: string | null;
  current_level_id: string | null;
  progress_pct: number;
  created_at: string;
  updated_at: string;
}

export interface LevelProgress {
  id: string;
  student_id: string;
  level_id: string;
  enrollment_id: string;
  status: LevelProgressStatus;
  unlocked_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  gate_passed: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudentProgress {
  id: string;
  student_id: string;
  session_id: string;
  level_progress_id: string;
  status: ProgressStatus;
  started_at: string | null;
  completed_at: string | null;
  score: number | null;
  attempt_number: number;
  time_spent_sec: number;
  ai_feedback: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
}

export interface AiScenario {
  id: string;
  name: string;
  difficulty: Difficulty;
  customer_persona: string;
  deal_profile: Record<string, unknown>;
  scoring_rubric: Record<string, unknown>;
  system_prompt: string;
  max_score: number;
  passing_score: number;
  created_at: string;
  updated_at: string;
}
