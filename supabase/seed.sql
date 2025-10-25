-- Seed file for babybet
-- This will populate the database with sample data for testing

-- The migration already creates the default baby, so this just adds guesses
-- Insert some sample guesses using the baby created in the migration
INSERT INTO public.guesses (name, guess_date, code, paid, baby_id, payment_provider)
SELECT
  name,
  guess_date::date,
  code,
  paid,
  (SELECT id FROM public.babies WHERE url_path = 'flores-castro'),
  payment_provider
FROM (VALUES
  ('John Doe', '2025-02-20', 'JD-A1B2', true, 'venmo'),
  ('Jane Smith', '2025-02-22', 'JS-C3D4', true, 'venmo'),
  ('Bob Wilson', '2025-02-25', 'BW-E5F6', false, 'cash'),
  ('Alice Brown', '2025-02-27', 'AB-G7H8', true, 'venmo'),
  ('Charlie Davis', '2025-02-20', 'CD-I9J0', true, 'venmo')
) AS data(name, guess_date, code, paid, payment_provider);

