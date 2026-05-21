// Re-export shim — the real clients live in lib/supabase/. Kept so existing
// API-route imports (`@/lib/supabase`) need no changes.
export { getServiceClient } from './supabase/service';
export { getServerClient } from './supabase/anon';
