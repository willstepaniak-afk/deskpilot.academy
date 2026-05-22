import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/marketing/SectionHeading';
import { SubscribeForm } from '@/components/marketing/SubscribeForm';
import { getCurrentUser } from '@/lib/auth';
import { getServiceClient } from '@/lib/supabase/service';

export const metadata: Metadata = {
  title: 'Subscribe',
  robots: { index: false, follow: false },
};

// Reads founder availability + display prices per request; never prerender.
export const dynamic = 'force-dynamic';

export default async function SubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>;
}) {
  const { canceled } = await searchParams;

  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/subscribe');

  const service = getServiceClient();

  // Founder availability decides which plan's pricing to display. price_*_cents
  // are DISPLAY ONLY — the actual Stripe price id is resolved server-side in
  // /api/checkout from the plans row, so display and charge can't drift.
  let foundersRemaining = 0;
  let monthlyCents = 0;
  let annualCents = 0;
  let isFounder = false;

  if (service) {
    const { data: state } = await service
      .from('site_state')
      .select('founders_individual_remaining')
      .eq('id', 1)
      .maybeSingle();
    foundersRemaining = state?.founders_individual_remaining ?? 0;
    isFounder = foundersRemaining > 0;

    const slug = isFounder ? 'all-access-founding' : 'all-access';
    const { data: plan } = await service
      .from('plans')
      .select('price_monthly_cents, price_annual_cents')
      .eq('slug', slug)
      .maybeSingle();
    monthlyCents = plan?.price_monthly_cents ?? 0;
    annualCents = plan?.price_annual_cents ?? 0;
  }

  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Subscribe"
        title={isFounder ? 'Lock in founders pricing.' : 'All-Access to DeskPilot Academy.'}
        description={
          isFounder
            ? 'The first 100 operators get the founder rate, locked for as long as you stay subscribed. When the cohort fills, pricing returns to standard.'
            : 'One subscription, every campus, every module — taught by working operators.'
        }
        align="center"
      />
      <div className="mt-10">
        <SubscribeForm
          isFounder={isFounder}
          foundersRemaining={foundersRemaining}
          monthlyCents={monthlyCents}
          annualCents={annualCents}
          canceled={canceled === '1'}
        />
      </div>
    </Container>
  );
}
