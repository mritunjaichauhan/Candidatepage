-- Add referral_code column to candidates table
ALTER TABLE candidates ADD COLUMN referral_code TEXT;

-- Create index on referral_code for faster lookups
CREATE INDEX idx_candidates_referral_code ON candidates(referral_code); 