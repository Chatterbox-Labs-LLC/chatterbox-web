# Cloudflare Pages Setup Guide

This guide provides instructions for setting up Chatterbox Teams on Cloudflare Pages and configuring the necessary DNS records.

## 1. Cloudflare Pages Deployment

### Prerequisites
- A GitHub repository with your code.
- A Cloudflare account.

### Step-by-Step Setup
1. **Log in** to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your repository (`chatterbox-web`).
4. Configure the build settings:
   - **Framework preset**: `Next.js`
   - **Build command**: `npm run pages:build`
   - **Build output directory**: `.vercel/output/static`
5. Add **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key.
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for server-side ops).
   - `STRIPE_SECRET_KEY`: Your Stripe secret key.
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret.
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key.
   - `RESEND_API_KEY`: Your Resend API key.
   - `NEXT_PUBLIC_APP_URL`: Your production URL (e.g., `https://chatterboxteams.com`).
6. Click **Save and Deploy**.

---

## 2. DNS Configuration

To make your website work on your custom domain, you need to add the following DNS records in your Cloudflare dashboard (under **DNS** > **Records**).

### A. Root Domain (Apex)
If you want your site at `example.com`:
- **Type**: `CNAME`
- **Name**: `@` (or your root domain)
- **Target**: `<your-app>.pages.dev`
- **Proxy status**: `Proxied`

### B. WWW Subdomain
If you want your site at `www.example.com`:
- **Type**: `CNAME`
- **Name**: `www`
- **Target**: `<your-app>.pages.dev`
- **Proxy status**: `Proxied`

---

## 3. Supabase Custom Domain (Optional)
If you are using a custom domain for Supabase Auth, add these records provided by Supabase:
- **Type**: `CNAME`
- **Name**: `auth` (or as specified)
- **Target**: `<project-id>.supabase.co`
- **Proxy status**: `DNS Only` (usually recommended for Supabase)

---

## 4. Email DNS (Resend)
To send emails from your domain, add these records from your Resend dashboard:

### SPF
- **Type**: `TXT`
- **Name**: `@`
- **Content**: `v=spf1 include:amazonses.com ~all` (Resend uses SES)

### DKIM
- **Type**: `CNAME` (usually 3 records)
- **Name**: `resend._domainkey`
- **Target**: `...`

---

## 5. Verification
After adding records, you can verify them using:
```bash
dig example.com
```
Or use online tools like [DNSChecker.org](https://dnschecker.org/).
