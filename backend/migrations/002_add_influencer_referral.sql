-- Create influencers table
CREATE TABLE IF NOT EXISTS influencers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    unique_code TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add referral_code column to candidates table
ALTER TABLE candidates ADD COLUMN referral_code TEXT;

-- Create index on referral_code for faster lookups
CREATE INDEX idx_candidates_referral_code ON candidates(referral_code);

-- Create index on unique_code for faster lookups
CREATE INDEX idx_influencers_unique_code ON influencers(unique_code); 