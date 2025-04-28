const db = require('../config/database');

const createTables = async () => {
    try {
        // Create influencers table
        await db.query(`
            CREATE TABLE IF NOT EXISTS influencers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                unique_code TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                phone TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create influencer_referrals table
        await db.query(`
            CREATE TABLE IF NOT EXISTS influencer_referrals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                influencer_id INTEGER NOT NULL,
                candidate_id INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (influencer_id) REFERENCES influencers(id),
                FOREIGN KEY (candidate_id) REFERENCES candidates(id)
            )
        `);

        // Create index on unique_code
        await db.query(`
            CREATE INDEX IF NOT EXISTS idx_influencers_unique_code 
            ON influencers(unique_code)
        `);

        console.log('Database initialized successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
};

createTables(); 