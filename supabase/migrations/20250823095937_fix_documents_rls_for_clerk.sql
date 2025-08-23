-- =================================================================
-- MIGRÁCIA: Produkčne pripravené Clerk-aware RLS Policies pre documents tabuľku
-- Verzia: 2.0 - Production Ready
-- =================================================================

-- Táto migrácia implementuje produkčne pripravené RLS policies
-- pre Clerk autentifikáciu s proper security

-- Najprv odstránime existujúce development policies
DROP POLICY IF EXISTS "Allow all operations for development" ON public.documents;
DROP POLICY IF EXISTS "Users can view their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can insert their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can update their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON public.documents;

-- Vytvorenie app schema pre helper funkcie
CREATE SCHEMA IF NOT EXISTS app;
GRANT USAGE ON SCHEMA app TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION app.current_external_id() TO authenticated, service_role;
-- Helper funkcia na čítanie Clerk subject z JWT
CREATE OR REPLACE FUNCTION app.current_external_id()
RETURNS TEXT
LANGUAGE SQL
STABLE
AS $$
  SELECT (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')
$$;

-- Produkčné RLS policies pre Clerk autentifikáciu
-- Používame user_id stĺpec (TEXT) ktorý obsahuje Clerk user ID

-- Policy pre čítanie dokumentov
CREATE POLICY "Users can view their own documents"
ON public.documents
FOR SELECT
TO authenticated
USING (user_id = app.current_external_id());

-- Policy pre vkladanie dokumentov
CREATE POLICY "Users can insert their own documents"
ON public.documents
FOR INSERT
TO authenticated
WITH CHECK (user_id = app.current_external_id());

-- Policy pre aktualizáciu dokumentov
CREATE POLICY "Users can update their own documents"
ON public.documents
FOR UPDATE
TO authenticated
USING (user_id = app.current_external_id())
WITH CHECK (user_id = app.current_external_id());

-- Policy pre mazanie dokumentov
CREATE POLICY "Users can delete their own documents"
ON public.documents
FOR DELETE
TO authenticated
USING (user_id = app.current_external_id());

-- Vytvorenie indexu na user_id pre rýchle per-user queries
CREATE INDEX IF NOT EXISTS idx_documents_user_id_clerk ON public.documents(user_id);

-- Komentáre pre lepšiu orientáciu
COMMENT ON TABLE public.documents IS 'Stores metadata about user-uploaded documents with Clerk authentication.';
COMMENT ON SCHEMA app IS 'Application-specific helper functions and utilities.';
COMMENT ON FUNCTION app.current_external_id() IS 'Helper function to extract Clerk user ID from JWT claims.';
COMMENT ON POLICY "Users can view their own documents" ON public.documents IS 'Ensures users can only read their own document records using Clerk JWT.';
COMMENT ON POLICY "Users can insert their own documents" ON public.documents IS 'Ensures users can only insert documents with their own Clerk user ID.';
COMMENT ON POLICY "Users can update their own documents" ON public.documents IS 'Ensures users can only update their own documents with proper validation.';
COMMENT ON POLICY "Users can delete their own documents" ON public.documents IS 'Ensures users can only delete their own documents.';
COMMENT ON INDEX idx_documents_user_id_clerk IS 'Index for fast per-user document queries using Clerk user ID.';
