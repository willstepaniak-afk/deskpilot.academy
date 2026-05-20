/*
  # Seed Sales Fundamentals Campus

  4 levels covering the complete road-to-the-sale process.
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
  SELECT id INTO v_campus_id FROM campuses WHERE slug = 'sales-fundamentals';
  SELECT id INTO v_type_video FROM session_types WHERE slug = 'video';
  SELECT id INTO v_type_ai_sim FROM session_types WHERE slug = 'ai_sim';
  SELECT id INTO v_type_live FROM session_types WHERE slug = 'live';
  SELECT id INTO v_type_assessment FROM session_types WHERE slug = 'assessment';
  SELECT id INTO v_type_discussion FROM session_types WHERE slug = 'discussion';

  -- Level 1: Meet & Greet to Needs Analysis
  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'Meet & Greet to Needs Analysis', 'First impressions, building rapport, and uncovering the real buying motivation.', 1, 'always_open')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level1_id;

  IF v_level1_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level1_id, v_type_video, 'The First 30 Seconds', 'Why the meet-and-greet sets the tone for everything. Body language, energy, and the no-pressure opener.', 1, 18, true, false, 'published'),
      (v_level1_id, v_type_video, 'Needs Analysis: Asking Better Questions', 'The questions that reveal budget, timeline, trade situation, and emotional triggers — without sounding like an interrogation.', 2, 25, true, false, 'published'),
      (v_level1_id, v_type_video, 'Building Real Rapport (Not Small Talk)', 'Connection that accelerates trust. How to match pace, mirror energy, and find genuine common ground.', 3, 20, true, false, 'published'),
      (v_level1_id, v_type_ai_sim, 'Sim: Walk-In Customer, First Contact', 'A couple walks onto the lot. Make first contact, build rapport, and uncover their needs.', 4, 25, true, false, 'published'),
      (v_level1_id, v_type_discussion, 'Best Openers That Actually Work', 'Share your go-to meet-and-greet lines that get customers talking.', 5, 10, false, false, 'published'),
      (v_level1_id, v_type_assessment, 'Level 1 Assessment', '80% to advance.', 6, 15, true, true, 'published');
  END IF;

  -- Level 2: Presentation & Demo Drive
  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'Presentation & Demo Drive', 'Vehicle selection, feature presentation, and the test drive that sells.', 2, 'complete_prior')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level2_id;

  IF v_level2_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level2_id, v_type_video, 'Vehicle Selection Strategy', 'Matching the vehicle to the need — not just showing them what has the most gross.', 1, 20, true, false, 'published'),
      (v_level2_id, v_type_video, 'The Walk-Around That Sells', 'Feature-benefit presentation structured around what THEY care about, not a spec sheet recitation.', 2, 22, true, false, 'published'),
      (v_level2_id, v_type_video, 'Demo Drive Excellence', 'Route planning, engagement during the drive, and transitional questions that lead to commitment.', 3, 18, true, false, 'published'),
      (v_level2_id, v_type_ai_sim, 'Sim: Customer Wants to See Three Vehicles', 'Manage a customer who wants to compare multiple units. Guide them to a decision without being pushy.', 4, 30, true, false, 'published'),
      (v_level2_id, v_type_assessment, 'Level 2 Assessment', '80% to advance.', 5, 15, true, true, 'published');
  END IF;

  -- Level 3: Negotiation & Close
  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'Negotiation & Close', 'From the write-up to the handshake — closing techniques that work without pressure.', 3, 'complete_prior')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level3_id;

  IF v_level3_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level3_id, v_type_video, 'The Transition to Write-Up', 'How to move from demo to desk without the awkward "let me talk to my manager" transition.', 1, 20, true, false, 'published'),
      (v_level3_id, v_type_video, 'Handling Price Objections', 'When they say "that is too much" — the 5 responses that keep the deal alive.', 2, 25, true, false, 'published'),
      (v_level3_id, v_type_video, 'Closing Techniques for the Modern Buyer', 'Assumptive closes, trial closes, and urgency creation that doesn''t feel manipulative.', 3, 22, true, false, 'published'),
      (v_level3_id, v_type_ai_sim, 'Sim: The "I Need to Think About It" Customer', 'They loved the car, loved the drive, but now they want to leave. Keep them engaged and close.', 4, 30, true, false, 'published'),
      (v_level3_id, v_type_discussion, 'Your Best Close This Month', 'Share the technique or moment that sealed your latest deal.', 5, 10, false, false, 'published'),
      (v_level3_id, v_type_assessment, 'Level 3 Assessment', '85% to advance.', 6, 20, true, true, 'published');
  END IF;

  -- Level 4: Delivery & Follow-Up
  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'Delivery & Follow-Up', 'The delivery experience that generates referrals and repeat business.', 4, 'complete_prior')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level4_id;

  IF v_level4_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level4_id, v_type_video, 'The Premium Delivery Experience', 'Making delivery memorable — the details that turn buyers into advocates.', 1, 18, true, false, 'published'),
      (v_level4_id, v_type_video, 'Post-Sale Follow-Up System', 'The 30/60/90 day cadence that generates reviews, referrals, and repeat business.', 2, 20, true, false, 'published'),
      (v_level4_id, v_type_discussion, 'Referral Strategies That Work', 'What do you do to generate referrals? Share your system.', 3, 10, false, false, 'published'),
      (v_level4_id, v_type_assessment, 'Final Assessment & Certification', '85% required. Passing earns the Sales Certified badge.', 4, 25, true, true, 'published');
  END IF;
END $$;
