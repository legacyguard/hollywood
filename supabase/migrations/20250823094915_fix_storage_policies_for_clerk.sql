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

-- Vytvoríme jednoduchú politiku pre development
-- POZOR: Toto je len pre development, nie pre produkciu!
CREATE POLICY "Allow all operations for development"
ON storage.objects FOR ALL
USING (bucket_id = 'user_documents')
WITH CHECK (bucket_id = 'user_documents');

-- Pre produkciu by sme mali implementovať Clerk JWT template a proper RLS policies
-- Toto je dočasné riešenie pre development
