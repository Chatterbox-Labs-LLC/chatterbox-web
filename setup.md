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

## 2. DNS Configuration (Custom Domain)

To use your own domain (e.g., `chatterboxteams.com`), follow these steps in the Cloudflare Dashboard:

1. **Add Custom Domain to Pages**:
   - Go to **Workers & Pages** > **Chatterbox Teams** (your project) > **Custom domains**.
   - Click **Set up a custom domain** and enter your domain (e.g., `chatterboxteams.com`).
   - Cloudflare will automatically offer to configure the DNS for you if your domain is already in Cloudflare.

2. **Manual DNS Records (if needed)**:
   If you need to add them manually under **DNS** > **Records**:

### A. Root Domain (Apex)
If you want your site at `example.com`:
- **Type**: `CNAME`
- **Name**: `@`
- **Target**: `chatterbox-web.pages.dev` (replace with your actual `.pages.dev` URL)
- **Proxy status**: `Proxied` (Orange cloud)

### B. WWW Subdomain
- **Type**: `CNAME`
- **Name**: `www`
- **Target**: `chatterbox-web.pages.dev`
- **Proxy status**: `Proxied` (Orange cloud)

---

## 3. Important: SSL/TLS Settings
Ensure your SSL/TLS encryption mode is set to **Full** or **Full (strict)** in Cloudflare (**SSL/TLS** > **Overview**). This is required for Next.js and Supabase to work correctly over HTTPS.

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
