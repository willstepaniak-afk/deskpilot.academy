/*
  # Seed Fixed Ops Campus

  3 levels covering service drive revenue, advisor performance, and retention.
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
  SELECT id INTO v_campus_id FROM campuses WHERE slug = 'fixed-ops';
  SELECT id INTO v_type_video FROM session_types WHERE slug = 'video';
  SELECT id INTO v_type_ai_sim FROM session_types WHERE slug = 'ai_sim';
  SELECT id INTO v_type_live FROM session_types WHERE slug = 'live';
  SELECT id INTO v_type_assessment FROM session_types WHERE slug = 'assessment';
  SELECT id INTO v_type_discussion FROM session_types WHERE slug = 'discussion';

  -- Level 1: Service Drive Revenue
  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'Service Drive Revenue', 'Maximizing RO value, advisor presentation, and service menu selling.', 1, 'always_open')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level1_id;

  IF v_level1_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level1_id, v_type_video, 'The Service Advisor as Revenue Driver', 'Repositioning the advisor role from order-taker to sales professional on the drive.', 1, 22, true, false, 'published'),
      (v_level1_id, v_type_video, 'Multi-Point Inspection Presentation', 'How to present findings in a way that builds trust AND sells work — not just scares the customer.', 2, 25, true, false, 'published'),
      (v_level1_id, v_type_video, 'Menu Selling on the Service Drive', 'Maintenance packages, tire bundles, and value-added services presented the right way.', 3, 20, true, false, 'published'),
      (v_level1_id, v_type_discussion, 'Highest RO of the Month', 'Share your best RO this month — what services were sold and how you presented them.', 4, 10, false, false, 'published'),
      (v_level1_id, v_type_assessment, 'Level 1 Assessment', '80% to advance.', 5, 15, true, true, 'published');
  END IF;

  -- Level 2: Customer Retention & Lifecycle
  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'Customer Retention & Lifecycle', 'Keeping customers in the service lane through lifecycle management and proactive outreach.', 2, 'complete_prior')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level2_id;

  IF v_level2_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level2_id, v_type_video, 'Service Retention Metrics That Matter', 'Customer pay retention rate, first-service capture rate, and lifecycle value per VIN.', 1, 20, true, false, 'published'),
      (v_level2_id, v_type_video, 'Proactive Service Outreach', 'Building a communication cadence that brings customers back before they defect.', 2, 18, true, false, 'published'),
      (v_level2_id, v_type_ai_sim, 'Sim: Customer Considering Independent Shop', 'A long-time customer says the dealer is too expensive. Retain them without discounting below margin.', 3, 25, true, false, 'published'),
      (v_level2_id, v_type_discussion, 'Retention Wins', 'Share a strategy that improved your service retention rate.', 4, 10, false, false, 'published'),
      (v_level2_id, v_type_assessment, 'Level 2 Assessment', '80% to advance.', 5, 15, true, true, 'published');
  END IF;

  -- Level 3: Service-to-Sales Pipeline
  INSERT INTO levels (campus_id, name, description, level_order, unlock_rule)
  VALUES (v_campus_id, 'Service-to-Sales Pipeline', 'Turning service customers into vehicle buyers through equity mining and trade alerts.', 3, 'complete_prior')
  ON CONFLICT (campus_id, level_order) DO NOTHING
  RETURNING id INTO v_level3_id;

  IF v_level3_id IS NOT NULL THEN
    INSERT INTO sessions (level_id, session_type_id, title, description, session_order, duration_min, is_required, is_gate, status) VALUES
      (v_level3_id, v_type_video, 'Equity Mining from the Service Drive', 'Identifying service customers with positive equity or lease maturity — and making the introduction.', 1, 22, true, false, 'published'),
      (v_level3_id, v_type_video, 'The Service-to-Sales Handoff', 'How to introduce a service customer to sales without it feeling like an ambush.', 2, 18, true, false, 'published'),
      (v_level3_id, v_type_ai_sim, 'Sim: Service Customer with Equity Opportunity', 'Customer is in for a 60K service. Their vehicle has strong equity. Make the introduction.', 3, 25, true, false, 'published'),
      (v_level3_id, v_type_assessment, 'Final Assessment & Certification', '85% required. Passing earns the Fixed Ops Certified badge.', 4, 20, true, true, 'published');
  END IF;
END $$;
