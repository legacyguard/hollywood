-- Security Hardening Migration
-- Date: 2025-08-25

-- Ensure helper schema/function exist
CREATE SCHEMA IF NOT EXISTS app;
CREATE OR REPLACE FUNCTION app.current_external_id()
RETURNS TEXT
LANGUAGE SQL
STABLE
AS $$
  SELECT (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')
$$;

-- Align document_bundles.user_id to Clerk TEXT ID and add RLS policies
DO $$
BEGIN
  -- Drop FK if exists (UUID to auth.users)
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'document_bundles' AND constraint_type = 'FOREIGN KEY'
  ) THEN
    BEGIN
      ALTER TABLE document_bundles DROP CONSTRAINT IF EXISTS document_bundles_user_id_fkey;
    EXCEPTION WHEN undefined_table THEN NULL; END;
  END IF;

  -- Alter type to TEXT if column exists and is not already TEXT
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'document_bundles' AND column_name = 'user_id' AND data_type <> 'text'
  ) THEN
    ALTER TABLE document_bundles ALTER COLUMN user_id TYPE TEXT USING user_id::text;
  END IF;

  -- Enable RLS
  BEGIN
    ALTER TABLE document_bundles ENABLE ROW LEVEL SECURITY;
  EXCEPTION WHEN undefined_table THEN NULL; END;
END $$;

-- Drop any existing policies and create Clerk-aware policies for document_bundles
DO $$
BEGIN
  IF to_regclass('public.document_bundles') IS NOT NULL THEN
    DROP POLICY IF EXISTS "bundles_select_own" ON public.document_bundles;
    DROP POLICY IF EXISTS "bundles_insert_own" ON public.document_bundles;
    DROP POLICY IF EXISTS "bundles_update_own" ON public.document_bundles;
    DROP POLICY IF EXISTS "bundles_delete_own" ON public.document_bundles;

    CREATE POLICY "bundles_select_own" ON public.document_bundles
      FOR SELECT TO authenticated USING (user_id = app.current_external_id());
    CREATE POLICY "bundles_insert_own" ON public.document_bundles
      FOR INSERT TO authenticated WITH CHECK (user_id = app.current_external_id());
    CREATE POLICY "bundles_update_own" ON public.document_bundles
      FOR UPDATE TO authenticated USING (user_id = app.current_external_id()) WITH CHECK (user_id = app.current_external_id());
    CREATE POLICY "bundles_delete_own" ON public.document_bundles
      FOR DELETE TO authenticated USING (user_id = app.current_external_id());
  END IF;
END $$;

-- Note: RLS cannot be applied to views. Ensure documents_enhanced remains a view without RLS; rely on base table RLS.
-- No-op for dropping policies on views (not supported by Postgres).
