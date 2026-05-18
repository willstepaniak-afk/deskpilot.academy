/*
  # Seed Lender Intelligence Campus

  3 levels covering lender profiles, routing strategy, and rate optimization.
*/

DO $$
DECLARE
  v_campus_id uuid;
  v_level1_id uuid;
  v_level2_id uuid;
  v_level3_id uuid;
  v_type_video uuid;
  v_type_ai_sim uuid;
  v_type_live uuid;
  v_type_assessment uuid;
  v_type_discussion uuid;
BEGIN
  SELECT id INTO v_campus_id FROM campuses WHERE slug = 'lender-intelligence';
  SELECT id INTO v_type_video FROM session_types WHERE slug = 'video';
  SELECT id INTO v_type_ai_sim FROM session_types WHERE slug = 'ai_sim';
  SELECT id INTO v_type_live FROM session_types WHERE slug = 'live';
  SELECT id INTO v_type_assessment FROM session_types WHERE slug = 'assessment';
  SELECT id INTO v_type_discussion FROM session_types WHERE slug = 'discussion';

  -- Level 1: Lender Profiles & Programs
  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'Lender Profiles & Programs', 'Deep knowledge of major auto lenders — credit appetite, advance limits, and special programs.', 1, 'always_open')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level1_id;

  IF v_level1_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level1_id, v_type_video, 'Captive Finance: GM Financial & Manufacturer Programs', 'When captive wins — subvented rates, lease programs, incentive stacking, and loyalty programs.', 1, 25, true, false, 'published'),
      (v_level1_id, v_type_video, 'Ally Financial: The Full-Spectrum Workhorse', 'Advance limits, SmartAuction integration, and why Ally is often the go-to for negative equity deals.', 2, 22, true, false, 'published'),
      (v_level1_id, v_type_video, 'Capital One, Chase, Wells Fargo', 'Where each bank excels, where they fall short, and when to route to each.', 3, 25, true, false, 'published'),
      (v_level1_id, v_type_video, 'Subprime Lenders: Westlake, Credit Acceptance, US Auto', 'Deep subprime programs, deal structure requirements, and getting deals bought that others decline.', 4, 22, true, false, 'published'),
      (v_level1_id, v_type_discussion, 'Your Go-To Lender and Why', 'Which lender do you route to most often? What makes them your default?', 5, 10, false, false, 'published'),
      (v_level1_id, v_type_assessment, 'Level 1 Assessment', '80% to advance.', 6, 20, true, true, 'published');
  END IF;

  -- Level 2: Routing Strategy & Decision Trees
  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'Routing Strategy & Decision Trees', 'Building systematic lender routing logic based on FICO, LTV, vehicle type, and deal structure.', 2, 'complete_prior')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level2_id;

  IF v_level2_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level2_id, v_type_video, 'The Routing Decision Tree', 'IF/THEN logic for lender selection — FICO tier, LTV threshold, term, vehicle type, and advance needs.', 1, 25, true, false, 'published'),
      (v_level2_id, v_type_video, 'Maximizing Approval Probability', 'When to prioritize getting the deal bought vs. maximizing reserve. Reading the signals.', 2, 20, true, false, 'published'),
      (v_level2_id, v_type_ai_sim, 'Sim: Route This Deal — 650 FICO, $6K Negative Equity', 'Select the right lender for a near-prime customer with moderate negative equity. Justify your choice.', 3, 30, true, false, 'published'),
      (v_level2_id, v_type_ai_sim, 'Sim: Route This Deal — 580 FICO, First-Time Buyer', 'Deep subprime, no credit history. Which lender will buy it and what do they need?', 4, 25, true, false, 'published'),
      (v_level2_id, v_type_discussion, 'Routing Mistakes That Cost Money', 'Share a time you sent a deal to the wrong lender — and what you learned.', 5, 10, false, false, 'published'),
      (v_level2_id, v_type_assessment, 'Level 2 Assessment', '85% to advance.', 6, 20, true, true, 'published');
  END IF;

  -- Level 3: Rate Markup & Reserve Optimization
  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'Rate Markup & Reserve Optimization', 'Maximizing back-end gross through intelligent rate spread management — within compliance limits.', 3, 'complete_prior')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level3_id;

  IF v_level3_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level3_id, v_type_video, 'Rate Markup Strategy by Credit Tier', 'How much to mark up by FICO tier, when to go max vs. when to leave room, and state-specific caps.', 1, 25, true, false, 'published'),
      (v_level3_id, v_type_video, 'Handling "I Can Get X% at My Credit Union"', 'The customer has a pre-approval. When to match, when to beat, and when to let the rate go and win on products.', 2, 20, true, false, 'published'),
      (v_level3_id, v_type_ai_sim, 'Sim: Maximize Reserve on a Prime Deal', '720 FICO, clean deal, customer is payment-focused. Structure for maximum total back-end gross.', 3, 30, true, false, 'published'),
      (v_level3_id, v_type_live, 'Rate Strategy Workshop', 'Live deal review — bring real deals and optimize the lender match and rate structure.', 4, 60, false, false, 'published'),
      (v_level3_id, v_type_assessment, 'Final Assessment & Certification', '85% required. Passing earns the Lender Intel Certified badge.', 5, 25, true, true, 'published');
  END IF;
END $$;
