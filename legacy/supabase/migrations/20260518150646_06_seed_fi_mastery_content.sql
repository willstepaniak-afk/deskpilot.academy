/*
  # Seed F&I Mastery Campus Content

  Seeds Level 1–4 for the F&I Mastery campus with all sessions
  as described in the implementation plan.
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
  -- Get campus ID
  SELECT id INTO v_campus_id FROM campuses WHERE slug = 'fi-mastery';

  -- Get session type IDs
  SELECT id INTO v_type_video FROM session_types WHERE slug = 'video';
  SELECT id INTO v_type_ai_sim FROM session_types WHERE slug = 'ai_sim';
  SELECT id INTO v_type_live FROM session_types WHERE slug = 'live';
  SELECT id INTO v_type_assessment FROM session_types WHERE slug = 'assessment';
  SELECT id INTO v_type_discussion FROM session_types WHERE slug = 'discussion';

  -- Level 1
  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'Menu Fundamentals', 'The 4-column tiered menu system, product knowledge, and your first simulation.', 1, 'always_open')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level1_id;

  IF v_level1_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level1_id, v_type_video, 'The 4-Column Tiered Menu System', 'How the platinum/gold/silver/base structure drives penetration through choice architecture.', 1, 20, true, false, 'published'),
      (v_level1_id, v_type_video, 'Product Knowledge Deep Dive', 'VSC, GAP, maintenance, and ancillary products — what they cover, what they cost, and how to position each.', 2, 30, true, false, 'published'),
      (v_level1_id, v_type_ai_sim, 'Sim: First Menu Presentation', 'Practice presenting all 4 columns to a moderately engaged customer. Beginner difficulty.', 3, 25, true, false, 'published'),
      (v_level1_id, v_type_discussion, 'Share Your Current Process', 'Where are you in your F&I journey? What do you want to improve most?', 4, 15, false, false, 'published'),
      (v_level1_id, v_type_assessment, 'Level 1 Assessment', 'Test your knowledge of the menu structure and product positioning. 80% required to advance.', 5, 20, true, true, 'published');
  END IF;

  -- Level 2
  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'Objection Mastery', 'The complete objection flowchart system — budget branch and value branch.', 2, 'complete_prior')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level2_id;

  IF v_level2_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level2_id, v_type_video, 'The Objection Flowchart System', 'The 4-step sequence for handling a customer who declines all 4 columns. Budget vs. value branch logic.', 1, 25, true, false, 'published'),
      (v_level2_id, v_type_ai_sim, 'Sim: Budget Objection — Branch A', 'Customer says "I don''t want any of these." Navigate the soft recovery, isolation, and budget close.', 2, 30, true, false, 'published'),
      (v_level2_id, v_type_ai_sim, 'Sim: Value Objection — Branch B', 'Customer says it''s not about money — they just don''t want it. Navigate the value branch correctly.', 3, 30, true, false, 'published'),
      (v_level2_id, v_type_live, 'Objection Handling Workshop', 'Live role-play session with instructor feedback. RSVP required.', 4, 60, false, false, 'published'),
      (v_level2_id, v_type_assessment, 'Level 2 Assessment', 'Demonstrate mastery of the objection flowchart system. 80% required to advance.', 5, 20, true, true, 'published');
  END IF;

  -- Level 3
  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'Advanced Deal Structuring', 'Negative equity playbook, lender routing for maximum reserve.', 3, 'complete_prior')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level3_id;

  IF v_level3_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level3_id, v_type_video, 'Negative Equity Playbook', 'The 3-step negative equity process: work cash down first, then structure, then present reality.', 1, 25, true, false, 'published'),
      (v_level3_id, v_type_ai_sim, 'Sim: $10K Negative Equity, Zero Down', 'Advanced simulation — customer has $10K negative equity, no cash down, is payment-sensitive. Structure the deal.', 2, 35, true, false, 'published'),
      (v_level3_id, v_type_video, 'Lender Routing for Maximum Reserve', 'How to match the deal to the right lender — advance limits, rate spread, and program selection.', 3, 20, true, false, 'published'),
      (v_level3_id, v_type_assessment, 'Level 3 Assessment', 'Deal structure and lender routing scenarios. 85% required to advance.', 4, 25, true, true, 'published');
  END IF;

  -- Level 4
  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'PVR Optimization', 'From $1,400 to $2,600 PVR — the complete system. Final certification assessment.', 4, 'complete_prior')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level4_id;

  IF v_level4_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level4_id, v_type_video, 'From $1,400 to $2,600 PVR: The System', 'The full PVR optimization framework — where the gaps are, how to close them, and how to sustain it.', 1, 30, true, false, 'published'),
      (v_level4_id, v_type_ai_sim, 'Sim: Full Deal Desk to Delivery', 'Expert simulation — manage the entire deal from first pencil through F&I close. All objection types combined.', 2, 45, true, false, 'published'),
      (v_level4_id, v_type_discussion, 'Post Your Best Deal This Month', 'Share a recent deal breakdown — what you did well, what you would do differently.', 3, 20, false, false, 'published'),
      (v_level4_id, v_type_assessment, 'Final Assessment & Certification', 'Comprehensive assessment covering all 4 levels. 85% required. Passing earns the F&I Mastery certificate.', 4, 30, true, true, 'published');
  END IF;

END $$;
