-- Add country column to guesses table to track where bets are placed from
ALTER TABLE public.guesses 
ADD COLUMN country text;

-- Add index for faster country-based queries
CREATE INDEX idx_guesses_country ON public.guesses(country);

-- Add comment to explain the column
COMMENT ON COLUMN public.guesses.country IS 'ISO 3166-1 alpha-2 country code (e.g., US, MX) detected from IP address';

