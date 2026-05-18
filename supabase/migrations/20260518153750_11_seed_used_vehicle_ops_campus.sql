/*
  # Seed Used Vehicle Ops Campus

  3 levels covering acquisition, pricing, and turn rate management.
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
  SELECT id INTO v_campus_id FROM campuses WHERE slug = 'used-vehicle-ops';
  SELECT id INTO v_type_video FROM session_types WHERE slug = 'video';
  SELECT id INTO v_type_ai_sim FROM session_types WHERE slug = 'ai_sim';
  SELECT id INTO v_type_assessment FROM session_types WHERE slug = 'assessment';
  SELECT id INTO v_type_discussion FROM session_types WHERE slug = 'discussion';

  -- Level 1: Acquisition & Appraisal
  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'Acquisition & Appraisal', 'Sourcing the right inventory, appraising trades accurately, and building a balanced lot.', 1, 'always_open')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level1_id;

  IF v_level1_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level1_id, v_type_video, 'Sourcing Strategy: Auction vs. Trade vs. Street Purchase', 'Where to find the right units at the right price — and when each channel makes sense.', 1, 25, true, false, 'published'),
      (v_level1_id, v_type_video, 'The Trade Appraisal Walk', 'Conducting a thorough vehicle appraisal — what to look for, how to document, and setting ACV.', 2, 22, true, false, 'published'),
      (v_level1_id, v_type_video, 'Market Days Supply & Stocking Strategy', 'Using MDS data to decide what to stock, what to wholesale, and how deep to go on any unit.', 3, 20, true, false, 'published'),
      (v_level1_id, v_type_ai_sim, 'Sim: Trade Walk with Upside-Down Customer', 'Customer thinks their trade is worth $5K more than market. Manage expectations while keeping the deal alive.', 4, 30, true, false, 'published'),
      (v_level1_id, v_type_discussion, 'Best Auction Finds', 'Share your best auction purchase this quarter — what made it a great buy?', 5, 10, false, false, 'published'),
      (v_level1_id, v_type_assessment, 'Level 1 Assessment', '80% to advance.', 6, 15, true, true, 'published');
  END IF;

  -- Level 2: Pricing & Merchandising
  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'Pricing & Merchandising', 'Market-based pricing, online merchandising, and the first 5 days on lot.', 2, 'complete_prior')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level2_id;

  IF v_level2_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level2_id, v_type_video, 'Market-Based Pricing Methodology', 'Pricing to market using comparable data — not cost-plus guessing. The 72-hour pricing window.', 1, 22, true, false, 'published'),
      (v_level2_id, v_type_video, 'Online Merchandising Excellence', 'Photos, descriptions, and listing optimization that generate calls — not just views.', 2, 20, true, false, 'published'),
      (v_level2_id, v_type_video, 'Reconditioning Speed & Standards', 'Getting units frontline-ready in 72 hours. The recon workflow that prevents aging.', 3, 18, true, false, 'published'),
      (v_level2_id, v_type_discussion, 'Pricing Wins and Losses', 'Share a unit where your pricing strategy worked perfectly — or one where it didn''t.', 4, 10, false, false, 'published'),
      (v_level2_id, v_type_assessment, 'Level 2 Assessment', '80% to advance.', 5, 15, true, true, 'published');
  END IF;

  -- Level 3: Turn Rate & Aged Inventory
  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'Turn Rate & Aged Inventory', 'Managing the clock — preventing age, moving stale units, and optimizing total department gross.', 3, 'complete_prior')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level3_id;

  IF v_level3_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level3_id, v_type_video, 'The 45-Day Rule', 'Why 45 days is the cliff — and what to do at 30, 45, 60, and 90 days to prevent wholesale losses.', 1, 22, true, false, 'published'),
      (v_level3_id, v_type_video, 'Used Vehicle P&L Management', 'Reading the used car department like a business — carrying costs, gross per unit, and turn rate targets.', 2, 25, true, false, 'published'),
      (v_level3_id, v_type_ai_sim, 'Sim: Manager Meeting — 15 Units Over 60 Days', 'Present your aging inventory plan to the GM. Which units to reprice, which to wholesale, and why.', 3, 30, true, false, 'published'),
      (v_level3_id, v_type_assessment, 'Final Assessment & Certification', '85% required. Passing earns the Used Vehicle Certified badge.', 4, 20, true, true, 'published');
  END IF;
END $$;
