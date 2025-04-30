-- Create influencers table
CREATE TABLE IF NOT EXISTS influencers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    unique_code TEXT UNIQUE NOT NULL,
    referral_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create influencer_referrals table
CREATE TABLE IF NOT EXISTS influencer_referrals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    influencer_id INTEGER NOT NULL,
    candidate_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (influencer_id) REFERENCES influencers(id),
    FOREIGN KEY (candidate_id) REFERENCES candidates(id),
    UNIQUE(influencer_id, candidate_id)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_influencers_unique_code ON influencers(unique_code); 