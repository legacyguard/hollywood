-- =================================================================
-- MIGRÁCIA: Oprava RLS Policies pre documents tabuľku
-- Verzia: 1.2
-- =================================================================

-- Táto migrácia rieši problém s RLS policies pre documents tabuľku
-- Pre development povolíme všetky operácie na documents tabuľku

-- Najprv odstránime existujúce komplikované politiky
DROP POLICY IF EXISTS "Users can view their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can insert their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can update their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON public.documents;

-- Vytvoríme jednoduchú politiku pre development
-- POZOR: Toto je len pre development, nie pre produkciu!
CREATE POLICY "Allow all operations for development"
ON public.documents FOR ALL
USING (true)
WITH CHECK (true);

-- Pre produkciu by sme mali implementovať Clerk JWT template a proper RLS policies
-- Toto je dočasné riešenie pre development

-- Komentár pre lepšiu orientáciu
COMMENT ON TABLE public.documents IS 'Stores metadata about user-uploaded documents. Development mode - all operations allowed.';
COMMENT ON POLICY "Allow all operations for development" ON public.documents IS 'Development policy - allows all operations. NOT FOR PRODUCTION!';
