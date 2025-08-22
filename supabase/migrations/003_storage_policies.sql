-- Storage bucket politiky pre user_documents
-- Toto musíte spustiť v Supabase SQL Editore

-- Najprv vytvorte bucket cez UI ak ešte neexistuje
-- Potom spustite tieto politiky:

-- Povoliť všetky operácie pre development
-- POZOR: Toto je len pre development, nie pre produkciu!

-- Povoliť upload súborov
INSERT INTO storage.policies (bucket_id, name, definition, operation)
VALUES (
  'user_documents',
  'Allow all uploads for dev',
  'true'::jsonb,
  'INSERT'
) ON CONFLICT (bucket_id, name) DO UPDATE SET definition = 'true'::jsonb;

-- Povoliť čítanie súborov
INSERT INTO storage.policies (bucket_id, name, definition, operation)
VALUES (
  'user_documents',
  'Allow all reads for dev',
  'true'::jsonb,
  'SELECT'
) ON CONFLICT (bucket_id, name) DO UPDATE SET definition = 'true'::jsonb;

-- Povoliť mazanie súborov
INSERT INTO storage.policies (bucket_id, name, definition, operation)
VALUES (
  'user_documents',
  'Allow all deletes for dev',
  'true'::jsonb,
  'DELETE'
) ON CONFLICT (bucket_id, name) DO UPDATE SET definition = 'true'::jsonb;

-- Povoliť update súborov
INSERT INTO storage.policies (bucket_id, name, definition, operation)
VALUES (
  'user_documents',
  'Allow all updates for dev',
  'true'::jsonb,
  'UPDATE'
) ON CONFLICT (bucket_id, name) DO UPDATE SET definition = 'true'::jsonb;
