import { createClient } from '@/lib/supabase-server';
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get customer ID from database
    const { data: customerData } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (!customerData?.stripe_customer_id) {
      return NextResponse.json({ error: 'No customer found. Please subscribe first.' }, { status: 400 });
    }

    // Create a billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerData.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('[Stripe Portal Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
