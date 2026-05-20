import { NextResponse } from 'next/server';
import { getServerClient } from '@/lib/supabase';
import { FOUNDERS_B2B_TOTAL, FOUNDERS_INDIVIDUAL_TOTAL } from '@/lib/site';

export const runtime = 'nodejs';
export const revalidate = 60;

const FALLBACK = {
  founders_individual_remaining: FOUNDERS_INDIVIDUAL_TOTAL,
  founders_b2b_remaining: FOUNDERS_B2B_TOTAL,
};

export async function GET() {
  const client = getServerClient();
  if (!client) return NextResponse.json(FALLBACK);

  try {
    const { data, error } = await client
      .from('site_state')
      .select('founders_individual_remaining, founders_b2b_remaining')
      .eq('id', 1)
      .maybeSingle();
    if (error || !data) return NextResponse.json(FALLBACK);
    return NextResponse.json({
      founders_individual_remaining: data.founders_individual_remaining ?? FALLBACK.founders_individual_remaining,
      founders_b2b_remaining: data.founders_b2b_remaining ?? FALLBACK.founders_b2b_remaining,
    });
  } catch {
    return NextResponse.json(FALLBACK);
  }
}
