import 'server-only';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getServiceClient } from '@/lib/supabase/service';
import { revokeAcademy, ACADEMY } from '@/lib/billing';

const GRACE_MS = 72 * 60 * 60 * 1000;

export async function requireAcademyAccess(nextPath = '/dashboard'): Promise<string> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(nextPath)}`);

  const service = getServiceClient();
  if (!service) redirect('/subscribe');

  const { data: profile } = await service
    .from('profiles')
    .select('products')
    .eq('id', user.id)
    .maybeSingle(); // L9: missing profile -> clean /subscribe redirect, not a 500
  let products: string[] = profile?.products ?? [];

  if (products.includes(ACADEMY)) {
    const { data: sub } = await service
      .from('subscriptions')
      .select('status, past_due_since, cancel_at_period_end, current_period_end')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let revoke = false;

    // Dunning: past_due beyond 72h.
    if (sub?.status === 'past_due' && sub.past_due_since) {
      if (Date.now() - new Date(sub.past_due_since).getTime() > GRACE_MS) revoke = true;
    }

    // H5 insurance against a lost customer.subscription.deleted:
    // scheduled-to-cancel AND the paid period has already elapsed.
    // Cannot false-positive on a renewing sub (cancel_at_period_end=false there).
    if (
      sub?.cancel_at_period_end &&
      sub.current_period_end &&
      new Date(sub.current_period_end).getTime() < Date.now()
    ) {
      revoke = true;
    }

    if (revoke) {
      await revokeAcademy(service, user.id);
      products = products.filter((p) => p !== ACADEMY);
    }
  }

  if (!products.includes(ACADEMY)) redirect('/subscribe');
  return user.id;
}
