-- Stripe Billing Schema

-- Create a table for storing subscription plans
CREATE TABLE IF NOT EXISTS public.plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_id TEXT UNIQUE, -- Stripe Price ID
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'usd',
  interval TEXT CHECK (interval IN ('month', 'year')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create a table for user subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id TEXT PRIMARY KEY, -- Stripe Subscription ID
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL, -- active, trialing, past_due, canceled, etc.
  plan_id TEXT REFERENCES public.plans(id),
  cancel_at_period_end BOOLEAN DEFAULT false,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create a table for customer mapping
CREATE TABLE IF NOT EXISTS public.customers (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access to plans" ON public.plans
  FOR SELECT USING (true);

CREATE POLICY "Users can view their own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own customer data" ON public.customers
  FOR SELECT USING (auth.uid() = user_id);

-- Insert default plans
INSERT INTO public.plans (id, name, description, price_id, amount, interval)
VALUES 
  ('free', 'Free', 'Up to 10 users, basic features', NULL, 0, 'month'),
  ('pro', 'Pro', '$5 per active user/month, unlimited everything', 'price_pro_placeholder', 500, 'month'),
  ('enterprise', 'Enterprise', 'Custom pricing for large organizations', 'price_enterprise_placeholder', 0, 'month')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  amount = EXCLUDED.amount;
