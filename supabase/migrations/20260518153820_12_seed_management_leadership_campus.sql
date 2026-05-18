/*
  # Seed Management & Leadership Campus

  4 levels covering desk management, team building, performance culture.
*/

DO $$
DECLARE
  v_campus_id uuid;
  v_level1_id uuid;
  v_level2_id uuid;
  v_level3_id uuid;
  v_level4_id uuid;
  v_type_video uuid;
  v_type_ai_sim uuid;
  v_type_live uuid;
  v_type_assessment uuid;
  v_type_discussion uuid;
BEGIN
  SELECT id INTO v_campus_id FROM campuses WHERE slug = 'management-leadership';
  SELECT id INTO v_type_video FROM session_types WHERE slug = 'video';
  SELECT id INTO v_type_ai_sim FROM session_types WHERE slug = 'ai_sim';
  SELECT id INTO v_type_live FROM session_types WHERE slug = 'live';
  SELECT id INTO v_type_assessment FROM session_types WHERE slug = 'assessment';
  SELECT id INTO v_type_discussion FROM session_types WHERE slug = 'discussion';

  -- Level 1: The Desk Manager Role
  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'The Desk Manager Role', 'What the desk actually does, the mindset shift from selling to managing deals.', 1, 'always_open')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level1_id;

  IF v_level1_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level1_id, v_type_video, 'From Salesperson to Desk Manager', 'The mindset shift — you are no longer selling cars, you are managing deals and developing people.', 1, 22, true, false, 'published'),
      (v_level1_id, v_type_video, 'Managing the Flow: Multiple Deals Simultaneously', 'How to juggle 4-5 deals at once without dropping any. Prioritization and delegation.', 2, 20, true, false, 'published'),
      (v_level1_id, v_type_video, 'The Manager TO: When and How', 'When to take over a deal, what to say, and how to close without undermining your salesperson.', 3, 25, true, false, 'published'),
      (v_level1_id, v_type_discussion, 'Your First Week on the Desk', 'What surprised you most when you moved from sales to management?', 4, 10, false, false, 'published'),
      (v_level1_id, v_type_assessment, 'Level 1 Assessment', '80% to advance.', 5, 15, true, true, 'published');
  END IF;

  -- Level 2: Building & Developing Your Team
  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'Building & Developing Your Team', 'Hiring, training, coaching, and retaining talent in a high-turnover industry.', 2, 'complete_prior')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level2_id;

  IF v_level2_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level2_id, v_type_video, 'Hiring for Attitude, Training for Skill', 'What to look for in candidates and how to build a 90-day onboarding plan that produces.', 1, 22, true, false, 'published'),
      (v_level2_id, v_type_video, 'One-on-One Coaching That Works', 'The deal review format, the training meeting structure, and how to give feedback that sticks.', 2, 25, true, false, 'published'),
      (v_level2_id, v_type_ai_sim, 'Sim: Coaching an Underperforming Salesperson', 'They have been under 8 units for 3 months. Have the coaching conversation.', 3, 30, true, false, 'published'),
      (v_level2_id, v_type_discussion, 'Retention Strategies for Good People', 'How do you keep your best salespeople from leaving? Share what works.', 4, 10, false, false, 'published'),
      (v_level2_id, v_type_assessment, 'Level 2 Assessment', '80% to advance.', 5, 15, true, true, 'published');
  END IF;

  -- Level 3: Performance Culture
  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'Performance Culture', 'Setting standards, running meetings, and building accountability that drives results.', 3, 'complete_prior')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level3_id;

  IF v_level3_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level3_id, v_type_video, 'The Monday Morning Meeting', 'How to run a sales meeting that energizes instead of deflates. Agenda, tone, and follow-up.', 1, 20, true, false, 'published'),
      (v_level3_id, v_type_video, 'Setting Standards & Accountability', 'How to set clear expectations, track them visibly, and hold people accountable without being punitive.', 2, 22, true, false, 'published'),
      (v_level3_id, v_type_video, 'Comp Plans That Drive Behavior', 'Designing pay plans that incentivize what you actually want — gross, volume, CSI, or a blend.', 3, 25, true, false, 'published'),
      (v_level3_id, v_type_discussion, 'Culture Wins', 'What is one thing you do that builds a winning culture in your store?', 4, 10, false, false, 'published'),
      (v_level3_id, v_type_assessment, 'Level 3 Assessment', '85% to advance.', 5, 20, true, true, 'published');
  END IF;

  -- Level 4: P&L and Department Management
  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'P&L and Department Management', 'Reading financial statements, managing expenses, and optimizing department profitability.', 4, 'complete_prior')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level4_id;

  IF v_level4_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level4_id, v_type_video, 'Reading Your Department P&L', 'Understanding gross, semi-fixed, variable expenses, and net departmental profit.', 1, 28, true, false, 'published'),
      (v_level4_id, v_type_video, 'Managing to the Forecast', 'How to pace your month, identify when you are behind, and course-correct before day 25.', 2, 22, true, false, 'published'),
      (v_level4_id, v_type_live, 'P&L Review Workshop', 'Bring your department P&L and review it live with instructor feedback.', 3, 60, false, false, 'published'),
      (v_level4_id, v_type_assessment, 'Final Assessment & Certification', '85% required. Passing earns the Leadership Certified badge.', 4, 25, true, true, 'published');
  END IF;
END $$;
