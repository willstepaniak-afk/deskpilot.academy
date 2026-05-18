/*
  # Seed Digital Retailing & AI Campus

  4 levels with video lessons, AI simulations, discussions, and assessments.
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
  SELECT id INTO v_campus_id FROM campuses WHERE slug = 'digital-retailing-ai';
  SELECT id INTO v_type_video FROM session_types WHERE slug = 'video';
  SELECT id INTO v_type_ai_sim FROM session_types WHERE slug = 'ai_sim';
  SELECT id INTO v_type_live FROM session_types WHERE slug = 'live';
  SELECT id INTO v_type_assessment FROM session_types WHERE slug = 'assessment';
  SELECT id INTO v_type_discussion FROM session_types WHERE slug = 'discussion';

  -- Level 1: Digital Showroom Foundations
  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'Digital Showroom Foundations', 'Understanding the modern digital buyer, online lead flow, and digital retailing platforms.', 1, 'always_open')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level1_id;

  IF v_level1_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level1_id, v_type_video, 'The Modern Car Buyer Journey', 'How 80% of the deal happens before the customer arrives. Understanding digital touchpoints.', 1, 22, true, false, 'published'),
      (v_level1_id, v_type_video, 'Digital Retailing Platform Overview', 'Cox, Roadster, Tekion, CDK — which platforms matter and how they integrate into your workflow.', 2, 25, true, false, 'published'),
      (v_level1_id, v_type_video, 'Internet Lead Response Mastery', 'The 5-minute rule, template architecture, and converting online inquiries to appointments.', 3, 20, true, false, 'published'),
      (v_level1_id, v_type_discussion, 'What Digital Tools Does Your Store Use?', 'Share your current digital retailing stack and biggest pain points.', 4, 10, false, false, 'published'),
      (v_level1_id, v_type_assessment, 'Level 1 Assessment', 'Digital foundations knowledge check. 80% to advance.', 5, 15, true, true, 'published');
  END IF;

  -- Level 2: AI-Powered Selling
  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'AI-Powered Selling', 'Leveraging AI chatbots, automated follow-up, and predictive lead scoring.', 2, 'complete_prior')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level2_id;

  IF v_level2_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level2_id, v_type_video, 'AI Chatbots in Automotive Retail', 'How conversational AI captures leads 24/7 and qualifies buyers while you sleep.', 1, 20, true, false, 'published'),
      (v_level2_id, v_type_video, 'Predictive Lead Scoring', 'Using AI to prioritize the hottest leads — who to call first and why.', 2, 18, true, false, 'published'),
      (v_level2_id, v_type_ai_sim, 'Sim: Converting an AI-Qualified Lead', 'The AI flagged a high-intent buyer. Pick up the conversation and close the appointment.', 3, 25, true, false, 'published'),
      (v_level2_id, v_type_discussion, 'AI Success Stories', 'Share a time AI tools helped you close a deal or saved you time.', 4, 10, false, false, 'published'),
      (v_level2_id, v_type_assessment, 'Level 2 Assessment', '80% to advance.', 5, 15, true, true, 'published');
  END IF;

  -- Level 3: Online-to-Showroom Handoff
  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'Online-to-Showroom Handoff', 'Seamlessly transitioning the digital deal into the physical showroom without restarting.', 3, 'complete_prior')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level3_id;

  IF v_level3_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level3_id, v_type_video, 'The Seamless Handoff', 'How to honor what was done online without losing gross or repeating steps.', 1, 22, true, false, 'published'),
      (v_level3_id, v_type_video, 'Managing Customer Expectations Post-Online', 'When the customer arrives expecting the online price but the deal needs restructuring.', 2, 20, true, false, 'published'),
      (v_level3_id, v_type_ai_sim, 'Sim: Customer Arrives with Online Quote', 'They built a deal online with a specific payment. Manage the transition without losing them.', 3, 30, true, false, 'published'),
      (v_level3_id, v_type_live, 'Digital-to-Showroom Workshop', 'Live role-play with instructor: handling the handoff conversation.', 4, 45, false, false, 'published'),
      (v_level3_id, v_type_assessment, 'Level 3 Assessment', '85% to advance.', 5, 20, true, true, 'published');
  END IF;

  -- Level 4: Data-Driven Sales Management
  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'Data-Driven Sales Management', 'Using analytics, CRM data, and AI insights to manage your team and forecast results.', 4, 'complete_prior')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level4_id;

  IF v_level4_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level4_id, v_type_video, 'CRM Analytics That Matter', 'The 5 metrics that actually predict whether your BDC/internet team will hit target.', 1, 25, true, false, 'published'),
      (v_level4_id, v_type_video, 'Building an AI-Augmented Sales Process', 'How to layer AI tools into your existing process without disrupting what works.', 2, 22, true, false, 'published'),
      (v_level4_id, v_type_discussion, 'Your Digital KPI Dashboard', 'What metrics do you track weekly? Share your reporting setup.', 3, 15, false, false, 'published'),
      (v_level4_id, v_type_assessment, 'Final Assessment & Certification', '85% required. Passing earns the Digital Retail Certified badge.', 4, 25, true, true, 'published');
  END IF;
END $$;
