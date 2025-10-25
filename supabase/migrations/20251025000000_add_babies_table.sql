-- Create babies table with firstname, lastname, status, and url_path
-- This allows the app to support multiple babies with custom URL paths

-- Create status enum for baby
CREATE TYPE baby_status AS ENUM ('active', 'inactive');

-- Create babies table
CREATE TABLE IF NOT EXISTS public.babies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  firstname text NULL,
  lastname text NOT NULL,
  status baby_status NOT NULL DEFAULT 'active',
  url_path text NOT NULL UNIQUE,
  due_date date NOT NULL,
  window_start date NOT NULL,
  window_end date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT url_path_format CHECK (url_path ~ '^[a-z0-9-]+$')
);

-- Enable RLS on babies table
ALTER TABLE public.babies ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read active babies
CREATE POLICY "allow_select_active_babies"
ON public.babies FOR SELECT
USING (status = 'active');

-- Add baby_id to guesses table
ALTER TABLE public.guesses 
ADD COLUMN baby_id uuid REFERENCES public.babies(id) ON DELETE CASCADE;

-- Create index for faster lookups
CREATE INDEX idx_guesses_baby_id ON public.guesses(baby_id);

-- Update guesses table RLS policy to be baby-aware
-- Drop old policy and create new one that considers baby status
DROP POLICY IF EXISTS "allow_select_all" ON public.guesses;

CREATE POLICY "allow_select_guesses_for_active_babies"
ON public.guesses FOR SELECT
USING (
  baby_id IS NULL OR 
  EXISTS (
    SELECT 1 FROM public.babies 
    WHERE babies.id = guesses.baby_id 
    AND babies.status = 'active'
  )
);

-- Insert a default baby for existing data (flores-castro)
INSERT INTO public.babies (firstname, lastname, url_path, due_date, window_start, window_end, status)
VALUES (
  NULL,
  'Flores-Castro',
  'flores-castro',
  '2025-02-25',
  '2025-02-15',
  '2025-03-10',
  'active'
);

-- Update existing guesses to associate with the default baby
UPDATE public.guesses
SET baby_id = (SELECT id FROM public.babies WHERE url_path = 'flores-castro')
WHERE baby_id IS NULL;

-- Make baby_id required for new guesses (existing ones are now migrated)
ALTER TABLE public.guesses 
  ALTER COLUMN baby_id SET NOT NULL;

