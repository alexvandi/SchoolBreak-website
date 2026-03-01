-- Esegui questo script nel SQL Editor di Supabase per configurare il DB

-- 1. Crea la tabella "events"
CREATE TABLE public.events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  title text NOT NULL,
  event_date date NOT NULL,
  poster_url text,
  ticket_link text NOT NULL
);

-- 2. Permetti la lettura e l'inserimento pubblico (per farti testare l'admin senza creare un sistema di login complesso per ora)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.events FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.events FOR INSERT WITH CHECK (true);

-- 3. Crea il Bucket Storage "event-posters" per le immagini
INSERT INTO storage.buckets (id, name, public) VALUES ('event-posters', 'event-posters', true);
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'event-posters');
CREATE POLICY "Public Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'event-posters');
