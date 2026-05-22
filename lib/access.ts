import 'server-only';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getServiceClient } from '@/lib/supabase/service';
import { revokeAcademy, ACADEMY } from '@/lib/billing';

const GRACE_MS = 72 * 60 * 60 * 1000;

// Access contract: profiles.products contains 'academy' <=> active paid access.
//
// Gated routes (e.g. the P5 LMS) call this at the top of the server component.
// It returns the user id when access is granted, and redirects otherwise:
//   - not signed in        -> /login?next=<path>
//   - no 'academy' product -> /subscribe
//
// Lazy 72h guard (belt-and-suspenders to the pg_cron dunning sweep): if the
// user's subscription is past_due and past_due_since + 72h has elapsed, revoke
// 'academy' inline before serving so a stale cron never leaves access open.
export async function requireAcademyAccess(nextPath = '/dashboard'): Promise<string> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(nextPath)}`);

  const service = getServiceClient();
  if (!service) redirect('/subscribe');

  const { data: profile } = await service
    .from('profiles')
    .select('products')
    .eq('id', user.id)
    .single();
  let products: string[] = profile?.products ?? [];

  if (products.includes(ACADEMY)) {
    const { data: sub } = await service
      .from('subscriptions')
      .select('status, past_due_since')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (sub?.status === 'past_due' && sub.past_due_since) {
      const elapsed = Date.now() - new Date(sub.past_due_since).getTime();
      if (elapsed > GRACE_MS) {
        await revokeAcademy(service, user.id);
        products = products.filter((p) => p !== ACADEMY);
      }
    }
  }

  if (!products.includes(ACADEMY)) redirect('/subscribe');
  return user.id;
}
