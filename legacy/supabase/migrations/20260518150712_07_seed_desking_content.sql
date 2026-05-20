/*
  # Seed Desking & Deal Structure Campus Content
*/

DO $$
DECLARE
  v_campus_id uuid;
  v_level1_id uuid;
  v_level2_id uuid;
  v_level3_id uuid;
  v_type_video uuid;
  v_type_ai_sim uuid;
  v_type_assessment uuid;
  v_type_discussion uuid;
BEGIN
  SELECT id INTO v_campus_id FROM campuses WHERE slug = 'desking-deal-structure';
  SELECT id INTO v_type_video FROM session_types WHERE slug = 'video';
  SELECT id INTO v_type_ai_sim FROM session_types WHERE slug = 'ai_sim';
  SELECT id INTO v_type_assessment FROM session_types WHERE slug = 'assessment';
  SELECT id INTO v_type_discussion FROM session_types WHERE slug = 'discussion';

  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'Deal Structure Fundamentals', 'First pencil strategy, lead source posture, and the 9-option payment grid.', 1, 'always_open')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level1_id;

  IF v_level1_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level1_id, v_type_video, 'Lead Source & First Pencil Strategy', 'How lead source determines your opening posture — walk-in to internet lead.', 1, 22, true, false, 'published'),
      (v_level1_id, v_type_video, 'The 9-Option Payment Grid', 'The 3x3 payment matrix, why short-term anchoring works, and how to present it.', 2, 18, true, false, 'published'),
      (v_level1_id, v_type_ai_sim, 'Sim: Walk-In, Clean Deal', 'Structure a clean deal on a new Silverado — walk-in customer, good credit, no negative equity.', 3, 25, true, false, 'published'),
      (v_level1_id, v_type_assessment, 'Level 1 Assessment', 'Deal structure fundamentals. 80% to advance.', 4, 20, true, true, 'published');
  END IF;

  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'Gross Protection & Bump Strategy', 'How to hold gross without losing the deal. The 2-pencil rule and TO protocol.', 2, 'complete_prior')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level2_id;

  IF v_level2_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level2_id, v_type_video, 'The 2-Pencil Rule & TO Protocol', 'Why 2 pencils is the ceiling and how the TO is a planned process, not a rescue.', 1, 20, true, false, 'published'),
      (v_level2_id, v_type_video, 'Bump Strategy by Lead Source', 'How bump size varies by customer profile and deal dynamics.', 2, 18, true, false, 'published'),
      (v_level2_id, v_type_ai_sim, 'Sim: Internet Lead, Prior Quote Honored', 'Customer has a competitive quote. Structure the deal correctly.', 3, 30, true, false, 'published'),
      (v_level2_id, v_type_discussion, 'Your Biggest Gross Recovery Wins', 'Share a deal where the TO or process made the difference.', 4, 15, false, false, 'published'),
      (v_level2_id, v_type_assessment, 'Level 2 Assessment', '80% to advance.', 5, 20, true, true, 'published');
  END IF;

  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'Advanced Deal Grading', 'Deal grading rubric, segment-specific gross expectations, and deal review process.', 3, 'complete_prior')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level3_id;

  IF v_level3_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level3_id, v_type_video, 'Deal Grading: Volume vs. Constrained-Supply Models', 'Why a $1,200 front gross on a Tahoe is an F and on a Silverado is a C.', 1, 25, true, false, 'published'),
      (v_level3_id, v_type_video, 'Used Vehicle Deal Grading: MDS + Age Matrix', 'How market days supply and inventory age combine to set gross expectations.', 2, 20, true, false, 'published'),
      (v_level3_id, v_type_ai_sim, 'Sim: Constrained-Supply Deal, Pressure to Discount', 'Customer wants a Tahoe below market. Hold gross. Two pencils max.', 3, 35, true, false, 'published'),
      (v_level3_id, v_type_assessment, 'Final Assessment & Certification', '85% required. Passing earns the Desk Certified badge.', 4, 25, true, true, 'published');
  END IF;

END $$;
