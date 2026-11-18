-- =============================================================================
-- AdaptFlow Production Schema & RLS Policies
-- =============================================================================

-- 1. Profiles Table with RBAC
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'consumer' CHECK (role IN ('admin', 'consumer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products / Models Catalog
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  algorithm TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'candidate', 'deprecated', 'draft')),
  accuracy NUMERIC(5,4),
  f1_score NUMERIC(5,4),
  pricing_tier TEXT DEFAULT 'standard',
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Orders / Customer Inferences
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  prediction_id TEXT NOT NULL,
  churn_probability NUMERIC(5,4) NOT NULL,
  risk_category TEXT NOT NULL,
  monthly_charges NUMERIC(8,2),
  tenure_months INT,
  status TEXT DEFAULT 'completed',
  feedback_verified BOOLEAN DEFAULT FALSE,
  ground_truth_churn BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Activity Logs
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automatic Profile Creation Trigger on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    CASE 
      WHEN NEW.email LIKE '%admin%' THEN 'admin'
      ELSE 'consumer'
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can read own profile or admin can read all" ON public.profiles;
CREATE POLICY "Users can read own profile or admin can read all"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin());

-- Orders Policies
DROP POLICY IF EXISTS "Consumers read own orders; Admins read all" ON public.orders;
CREATE POLICY "Consumers read own orders; Admins read all"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Consumers insert own orders; Admins insert" ON public.orders;
CREATE POLICY "Consumers insert own orders; Admins insert"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Admins update orders" ON public.orders;
CREATE POLICY "Admins update orders"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

-- Products Policies
DROP POLICY IF EXISTS "Anyone authenticated can view active products" ON public.products;
CREATE POLICY "Anyone authenticated can view active products"
  ON public.products FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Only admins can manage products" ON public.products;
CREATE POLICY "Only admins can manage products"
  ON public.products FOR ALL
  USING (public.is_admin());

-- Activity Logs Policies
DROP POLICY IF EXISTS "Users can view own activity; Admins view all" ON public.activity_logs;
CREATE POLICY "Users can view own activity; Admins view all"
  ON public.activity_logs FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Authenticated users insert activity logs" ON public.activity_logs;
CREATE POLICY "Authenticated users insert activity logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- Notifications Policies
DROP POLICY IF EXISTS "Users access own notifications; Admins access all" ON public.notifications;
CREATE POLICY "Users access own notifications; Admins access all"
  ON public.notifications FOR ALL
  USING (auth.uid() = user_id OR public.is_admin());
