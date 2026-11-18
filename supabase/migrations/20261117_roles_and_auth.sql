-- =============================================================================
-- AdaptFlow Role-Based Authentication & Profile Security Migration
-- Roles: consumer, vendor, staff, admin
-- Security: Admin role cannot be self-selected by the public.
-- =============================================================================

-- 1. Profiles Table with Multi-Role Support & Extra Fields
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'consumer' CHECK (role IN ('consumer', 'vendor', 'staff', 'admin')),
  business_name TEXT,
  department TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure any existing table has the extra columns
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS business_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- 2. Trigger on auth.users Insert: Strictly Enforce Public Roles
-- 'admin' is IGNORED from raw_user_meta_data during public signup and defaults to 'consumer'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  requested_role TEXT;
  assigned_role TEXT;
BEGIN
  requested_role := LOWER(COALESCE(NEW.raw_user_meta_data->>'role', 'consumer'));
  
  -- Public registration ONLY allows consumer, vendor, staff.
  -- Even if a user attempts to send 'admin', it is rejected and safely set to 'consumer'.
  IF requested_role IN ('vendor', 'staff', 'consumer') THEN
    assigned_role := requested_role;
  ELSE
    assigned_role := 'consumer';
  END IF;

  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    phone,
    avatar_url,
    role,
    business_name,
    department,
    is_active
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    assigned_role,
    NEW.raw_user_meta_data->>'business_name',
    NEW.raw_user_meta_data->>'department',
    TRUE
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    business_name = COALESCE(EXCLUDED.business_name, public.profiles.business_name),
    department = COALESCE(EXCLUDED.department, public.profiles.department),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Server-side Secret Admin Activation RPC Function
-- Validates invite code server-side and promotes verified user to admin
CREATE OR REPLACE FUNCTION public.promote_to_admin_with_code(invite_code text)
RETURNS JSON AS $$
DECLARE
  current_user_id UUID;
  expected_secret TEXT := 'ADAPTFLOW_SECRET_ADMIN_2026';
BEGIN
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Unauthenticated request');
  END IF;

  IF invite_code IS NULL OR invite_code <> expected_secret THEN
    RETURN json_build_object('success', false, 'error', 'Invalid admin invite code');
  END IF;

  UPDATE public.profiles
  SET role = 'admin', updated_at = NOW()
  WHERE id = current_user_id;

  RETURN json_build_object('success', true, 'message', 'Admin privileges granted');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Row Level Security & Column Protection
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper to check if caller is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Prevent non-admins from changing their role column directly
CREATE OR REPLACE FUNCTION public.prevent_role_modification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role <> OLD.role AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Security breach: Non-admin users cannot alter their role.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS protect_user_role ON public.profiles;
CREATE TRIGGER protect_user_role
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_role_modification();

-- Policies
DROP POLICY IF EXISTS "Users can read own profile or admin reads all" ON public.profiles;
CREATE POLICY "Users can read own profile or admin reads all"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users update own profile (role protected)" ON public.profiles;
CREATE POLICY "Users update own profile (role protected)"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin());
