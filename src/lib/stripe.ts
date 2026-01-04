import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-02' as Stripe.LatestApiVersion,
  appInfo: {
    name: 'Chatterbox Teams',
    version: '0.1.0',
  },
});
