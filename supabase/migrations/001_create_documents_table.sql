-- Create documents table for storing document metadata
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL, -- Používame TEXT pre Clerk user ID
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  document_type TEXT DEFAULT 'General',
  encrypted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security)
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- DOČASNÉ RLS politiky pre development
-- V produkcii by sme mali použiť auth.uid() kontrolu
-- Teraz používame jednoduché porovnanie user_id

-- Každý môže vidieť len svoje dokumenty
CREATE POLICY "Users can view own documents" ON public.documents
  FOR SELECT USING (true); -- DOČASNE: povolíme všetky SELECT

-- Každý môže vkladať dokumenty
CREATE POLICY "Users can insert own documents" ON public.documents
  FOR INSERT WITH CHECK (true); -- DOČASNE: povolíme všetky INSERT

-- Každý môže upravovať svoje dokumenty
CREATE POLICY "Users can update own documents" ON public.documents
  FOR UPDATE USING (true); -- DOČASNE: povolíme všetky UPDATE

-- Každý môže mazať svoje dokumenty  
CREATE POLICY "Users can delete own documents" ON public.documents
  FOR DELETE USING (true); -- DOČASNE: povolíme všetky DELETE

-- Indexy zostávajú rovnaké
CREATE INDEX idx_documents_user_id ON public.documents(user_id);
CREATE INDEX idx_documents_created_at ON public.documents(created_at DESC);

-- Trigger zostáva rovnaký
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
