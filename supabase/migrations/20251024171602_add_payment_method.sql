-- Add payment method constraints to guesses table
-- This migration makes payment_provider non-nullable with venmo as default
-- and adds a check constraint to only allow 'venmo' or 'cash'

-- Step 1: Backfill existing NULL values with 'venmo' (default)
UPDATE public.guesses 
SET payment_provider = 'venmo' 
WHERE payment_provider IS NULL;

-- Step 2: Now we can safely make it NOT NULL and add constraints
ALTER TABLE public.guesses 
  ALTER COLUMN payment_provider SET DEFAULT 'venmo',
  ALTER COLUMN payment_provider SET NOT NULL,
  ADD CONSTRAINT payment_provider_check 
    CHECK (payment_provider IN ('venmo', 'cash'));

