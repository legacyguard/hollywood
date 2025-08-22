-- DOČASNÉ RIEŠENIE PRE DEVELOPMENT
-- Vypneme RLS úplne, aby sme mohli testovať

-- Vypnúť RLS na tabuľke documents
ALTER TABLE public.documents DISABLE ROW LEVEL SECURITY;

-- Alternatívne môžeme nechať RLS zapnuté, ale zmeniť politiky:
-- ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Zmazať existujúce politiky
DROP POLICY IF EXISTS "Users can view own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can insert own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can update own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can delete own documents" ON public.documents;

-- Ak chceme RLS zapnuté s povolenými všetkými operáciami:
-- CREATE POLICY "Allow all for development" ON public.documents
--   FOR ALL USING (true) WITH CHECK (true);
