-- =================================================================
-- MIGRÁCIA: Oprava Storage Policies pre Clerk Autentifikáciu
-- Verzia: 1.1
-- =================================================================

-- Táto migrácia rieši problém s RLS policies pre storage
-- Pre development povolíme všetky operácie na user_documents bucket

-- Najprv odstránime existujúce komplikované politiky
DROP POLICY IF EXISTS "Allow user to read their own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow user to upload to their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Allow user to update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow user to delete their own files" ON storage.objects;

-- Vytvoríme jednoduchú politiku pre development (iba ak app.env = 'development')
DO $
BEGIN
  -- očakávame: ALTER DATABASE postgres SET app.env = 'development'; v dev prostredí
  IF current_setting('app.env', true) = 'development' THEN
    -- odstrániť predchádzajúcu politiku, ak re-migration
    DROP POLICY IF EXISTS "dev: allow authenticated users scoped to their folder" ON storage.objects;
    CREATE POLICY "dev: allow authenticated users scoped to their folder"
      ON storage.objects FOR ALL
      TO authenticated
      USING (
        bucket_id = 'user_documents'
        AND name LIKE auth.uid()::text || '/%'
      )
      WITH CHECK (
        bucket_id = 'user_documents'
        AND name LIKE auth.uid()::text || '/%'
      );
  END IF;
END
$;

-- Pre produkciu by sme mali implementovať Clerk JWT template a proper RLS policies
-- Toto je dočasné riešenie pre development
