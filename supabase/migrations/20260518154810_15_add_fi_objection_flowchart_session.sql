/*
  # Add F&I Objection Flowchart Reference Session

  Adds a dedicated interactive flowchart session to Level 2 (Objection Mastery)
  of the F&I Mastery campus. This session contains the complete 4-step objection
  handling system with Budget (Branch A) and Value (Branch B) decision paths.

  Shifts existing sessions down to make room at position 2.
*/

DO $$
DECLARE
  v_level_id uuid := '50a723bf-ad1b-4202-a164-5c543f5cade8';
  v_type_video uuid;
BEGIN
  SELECT id INTO v_type_video FROM session_types WHERE slug = 'video';

  -- Shift existing sessions 2-5 to 3-6
  UPDATE sessions SET session_order = session_order + 1
  WHERE level_id = v_level_id AND session_order >= 2;

  -- Insert the flowchart session at position 2
  INSERT INTO sessions (
    level_id, session_type_id, title, description, session_order,
    duration_min, is_required, is_gate, status, content_url
  ) VALUES (
    v_level_id,
    v_type_video,
    'The Complete F&I Objection Flowchart',
    'The full 4-step objection handling system mapped as an interactive flowchart. Step 1: Soft Recovery — release pressure with "I''ll be happy to do this however you like" then reframe to core 3 products. Step 2: Isolate the Objection — "if budget wasn''t a concern, which would work best?" This forces Branch A (Budget) or Branch B (Value). Branch A: customer names products, keep asking "anything else?" until list is complete, then close with customized payment. Branch B: customer says "none" — tie VSC to their driving habits and ownership timeline, ask permission to explore, use Socratic questioning or insurance close. Steps 3-4: Strategically timed soft attempts during document review before final print.',
    2,
    35,
    true,
    false,
    'published',
    NULL
  );
END $$;
