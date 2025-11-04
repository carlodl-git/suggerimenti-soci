-- Enum per i circoli golf (crea solo se non esiste)
DO $$ BEGIN
    CREATE TYPE club AS ENUM ('montecchia', 'frassanelle', 'galzignano', 'albarella');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tabella suggestions (crea solo se non esiste)
CREATE TABLE IF NOT EXISTS public.suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  club club NOT NULL,
  message text NOT NULL,
  is_anonymous boolean NOT NULL DEFAULT true,
  name text,
  user_agent text,
  ip_sha256 text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'archived'))
);

-- Abilita Row Level Security
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

-- Commenti per documentazione
COMMENT ON TABLE public.suggestions IS 'Tabella per i suggerimenti dei soci dei circoli golf';
COMMENT ON COLUMN public.suggestions.club IS 'Circolo golf di riferimento';
COMMENT ON COLUMN public.suggestions.message IS 'Messaggio del suggerimento';
COMMENT ON COLUMN public.suggestions.is_anonymous IS 'Se true, il suggerimento è anonimo';
COMMENT ON COLUMN public.suggestions.name IS 'Nome del suggeritore (opzionale, se non anonimo)';
COMMENT ON COLUMN public.suggestions.user_agent IS 'User agent del browser';
COMMENT ON COLUMN public.suggestions.ip_sha256 IS 'Indirizzo IP hashato con SHA256 per privacy';
COMMENT ON COLUMN public.suggestions.status IS 'Stato del suggerimento: new, reviewed, archived';

