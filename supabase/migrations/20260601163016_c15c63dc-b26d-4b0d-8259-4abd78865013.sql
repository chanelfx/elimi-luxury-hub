
-- ============================================================
-- Phase 3 + 4: Products, Likes, Daily Reports
-- ============================================================

-- Product status enum
CREATE TYPE public.product_status AS ENUM ('draft', 'available', 'reserved', 'sold');

-- ============================================================
-- products
-- ============================================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT NOT NULL,
  status public.product_status NOT NULL DEFAULT 'available',
  price NUMERIC(14,2),
  currency TEXT NOT NULL DEFAULT 'RWF',
  location TEXT,
  brand TEXT,
  condition TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  attributes JSONB NOT NULL DEFAULT '{}'::jsonb,
  views_count INTEGER NOT NULL DEFAULT 0,
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX idx_products_featured ON public.products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_created_by ON public.products(created_by);

GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public can view non-draft listings
CREATE POLICY "Public views published products"
ON public.products FOR SELECT
TO anon, authenticated
USING (status <> 'draft');

-- Staff can view all (including drafts)
CREATE POLICY "Staff view all products"
ON public.products FOR SELECT
TO authenticated
USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff insert products"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (public.is_staff(auth.uid()) AND created_by = auth.uid());

CREATE POLICY "Staff update products"
ON public.products FOR UPDATE
TO authenticated
USING (public.is_staff(auth.uid()))
WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Admins delete products"
ON public.products FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- product_likes  (anonymous device-based)
-- ============================================================
CREATE TABLE public.product_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, device_id)
);

CREATE INDEX idx_likes_product ON public.product_likes(product_id);

-- No direct GRANTs — all access goes through server fn with admin client
GRANT ALL ON public.product_likes TO service_role;

ALTER TABLE public.product_likes ENABLE ROW LEVEL SECURITY;
-- (no policies — blocked from direct API; server fn uses admin)

-- ============================================================
-- daily_reports
-- ============================================================
CREATE TABLE public.daily_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  report_date DATE NOT NULL DEFAULT CURRENT_DATE,
  summary TEXT NOT NULL,
  products_added INTEGER NOT NULL DEFAULT 0,
  customers_contacted INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, report_date)
);

CREATE INDEX idx_reports_user ON public.daily_reports(user_id);
CREATE INDEX idx_reports_date ON public.daily_reports(report_date DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_reports TO authenticated;
GRANT ALL ON public.daily_reports TO service_role;

ALTER TABLE public.daily_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own reports"
ON public.daily_reports FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins view all reports"
ON public.daily_reports FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users insert own reports"
ON public.daily_reports FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own reports"
ON public.daily_reports FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER reports_updated_at
BEFORE UPDATE ON public.daily_reports
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
