# Stripe Billing Setup Guide

This guide will help you set up Stripe billing for Chatterbox Teams.

## 1. Stripe Account Setup
1. Create a [Stripe account](https://dashboard.stripe.com/register).
2. Go to the [Stripe Dashboard](https://dashboard.stripe.com/test/dashboard) and make sure you are in **Test Mode**.
3. Create products in Stripe:
   - **Pro Plan**:
     - Name: `Pro Plan`
     - Price: `$5.00`
     - Billing: `Recurring`
     - Interval: `Monthly`
     - **Note**: This is set up as a per-unit price in Stripe. You can update the quantity based on active users.
   - **Enterprise**: (Optional) Contact sales flow.
4. Copy the **Price ID** for the Pro plan and update it in your `stripe.sql` and `.env` file.

## 2. Environment Variables
Add the following to your `.env` file:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRO_PRICE_ID=price_...
```

## 3. Database Setup
Run the `stripe.sql` file in your Supabase SQL Editor to create the necessary tables and policies.

## 4. Webhook Configuration (No Brew)
1. **Download the binary**:
   - Go to the [Stripe CLI Releases](https://github.com/stripe/stripe-cli/releases/latest) page.
   - Download the `mac-os_arm64.tar.gz` (for Apple Silicon) or `mac-os_x86_64.tar.gz` (for Intel).
2. **Extract and Install**:
   - Open your terminal and run:
     ```bash
     tar -xvf stripe_*.tar.gz
     sudo mv stripe /usr/local/bin
     ```
3. **Login**:
   ```bash
   stripe login
   ```
4. **Start the webhook forwarder**:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
5. **Copy the secret**: Copy the webhook signing secret provided by the CLI and add it to your `.env` as `STRIPE_WEBHOOK_SECRET`.

## 5. Billing Flow
- **Checkout**: Handled via `/api/billing/checkout`.
- **Portal**: Handled via `/api/billing/portal`.
- **Webhooks**: Handled via `/api/webhooks/stripe`.

## 6. Testing
Use Stripe's [test cards](https://stripe.com/docs/testing) to verify the checkout flow.
- Success card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
