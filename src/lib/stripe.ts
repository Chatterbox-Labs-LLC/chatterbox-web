import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = new Stripe(stripeSecretKey || '', {
  apiVersion: '2025-01-27.acacia' as any,
});

if (!stripeSecretKey && process.env.NODE_ENV === 'production') {
  console.warn('Warning: STRIPE_SECRET_KEY is missing');
}
