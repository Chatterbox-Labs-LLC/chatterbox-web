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

    const { priceId } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    // 1. Check if user already has a customer ID in our database
    const { data: customerData } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    let stripeCustomerId = customerData?.stripe_customer_id;

    // 2. If not, create a new customer in Stripe and save to database
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabaseUUID: user.id,
        },
      });
      stripeCustomerId = customer.id;

      await supabase
        .from('customers')
        .insert({ user_id: user.id, stripe_customer_id: stripeCustomerId });
    }

    // 3. Create a checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
      subscription_data: {
        metadata: {
          supabaseUUID: user.id,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('[Stripe Checkout Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
