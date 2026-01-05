import Stripe from 'stripe';

// Initialize Stripe with a placeholder key during build/initialization
// to avoid "Cannot read properties of undefined (reading 'default')" or key errors
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-01-02' as Stripe.LatestApiVersion,
  appInfo: {
    name: 'Chatterbox Teams',
    version: '0.1.0',
  },
  // Essential for Edge runtime compatibility
  httpClient: Stripe.createFetchHttpClient(),
});
