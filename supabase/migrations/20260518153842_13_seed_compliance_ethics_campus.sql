/*
  # Seed Compliance & Ethics Campus

  2 levels covering legal requirements, deal compliance, and ethical practices.
*/

DO $$
DECLARE
  v_campus_id uuid;
  v_level1_id uuid;
  v_level2_id uuid;
  v_type_video uuid;
  v_type_ai_sim uuid;
  v_type_assessment uuid;
  v_type_discussion uuid;
BEGIN
  SELECT id INTO v_campus_id FROM campuses WHERE slug = 'compliance-ethics';
  SELECT id INTO v_type_video FROM session_types WHERE slug = 'video';
  SELECT id INTO v_type_ai_sim FROM session_types WHERE slug = 'ai_sim';
  SELECT id INTO v_type_assessment FROM session_types WHERE slug = 'assessment';
  SELECT id INTO v_type_discussion FROM session_types WHERE slug = 'discussion';

  -- Level 1: Federal & State Compliance
  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'Federal & State Compliance', 'ECOA, TILA, MLA, Red Flags Rule, and state-specific regulations every dealer must follow.', 1, 'always_open')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level1_id;

  IF v_level1_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level1_id, v_type_video, 'Equal Credit Opportunity Act (ECOA)', 'What you can and cannot consider when structuring a deal. Prohibited bases and documentation requirements.', 1, 25, true, false, 'published'),
      (v_level1_id, v_type_video, 'Truth in Lending & Rate Markup Rules', 'TILA disclosure requirements, state-specific rate markup caps, and dealer participation rules.', 2, 22, true, false, 'published'),
      (v_level1_id, v_type_video, 'Military Lending Act (MLA)', 'Identifying servicemembers, rate caps, prohibited products, and compliance documentation.', 3, 20, true, false, 'published'),
      (v_level1_id, v_type_video, 'Red Flags Rule & Identity Verification', 'Detecting and responding to identity theft red flags during the deal process.', 4, 18, true, false, 'published'),
      (v_level1_id, v_type_discussion, 'Compliance Close Calls', 'Share a time where a compliance issue almost slipped through — and what caught it.', 5, 10, false, false, 'published'),
      (v_level1_id, v_type_assessment, 'Level 1 Assessment', '85% to advance. Compliance standards are higher.', 6, 20, true, true, 'published');
  END IF;

  -- Level 2: Deal-Level Compliance & Ethics
  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'Deal-Level Compliance & Ethics', 'Payment packing, power booking, product disclosure, and ethical deal structuring.', 2, 'complete_prior')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level2_id;

  IF v_level2_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level2_id, v_type_video, 'Payment Packing: What It Is and Why It Destroys Dealers', 'The legal definition, how it happens accidentally, and how to prevent it at every touchpoint.', 1, 22, true, false, 'published'),
      (v_level2_id, v_type_video, 'Power Booking & Trade Manipulation', 'What constitutes book value manipulation and the legal consequences for the dealer and individual.', 2, 20, true, false, 'published'),
      (v_level2_id, v_type_video, 'F&I Product Disclosure Requirements', 'What must be said, what must be in writing, and what cannot be implied during the F&I presentation.', 3, 22, true, false, 'published'),
      (v_level2_id, v_type_ai_sim, 'Sim: Spotting the Compliance Violation', 'Review a deal jacket and identify everything that is wrong. Compliance audit simulation.', 4, 30, true, false, 'published'),
      (v_level2_id, v_type_discussion, 'Building an Ethical Culture', 'What systems or habits does your store use to keep everyone on the right side of compliance?', 5, 10, false, false, 'published'),
      (v_level2_id, v_type_assessment, 'Final Assessment & Certification', '90% required. Compliance certification demands mastery. Passing earns the Compliance Certified badge.', 6, 25, true, true, 'published');
  END IF;
END $$;
