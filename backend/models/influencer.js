const db = require('../config/database');

class Influencer {
    static async create({ name, email, phone, uniqueCode }) {
        const query = `
            INSERT INTO influencers (name, email, phone, unique_code)
            VALUES (?, ?, ?, ?)
            RETURNING *
        `;
        const values = [name, email, phone, uniqueCode];
        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async findByUniqueCode(uniqueCode) {
        const query = `
            SELECT * FROM influencers
            WHERE unique_code = ?
        `;
        const { rows } = await db.query(query, [uniqueCode]);
        return rows[0];
    }

    static async getReferrals(uniqueCode) {
        // First try to get referrals from the influencer_referrals join table
        try {
            const query = `
                SELECT c.* FROM candidates c
                JOIN influencer_referrals ir ON c.id = ir.candidate_id
                JOIN influencers i ON ir.influencer_id = i.id
                WHERE i.unique_code = ?
            `;
            const { rows } = await db.query(query, [uniqueCode]);
            
            // If no referrals found in the join table, try checking the referral_code column directly
            if (rows.length === 0) {
                const directQuery = `
                    SELECT * FROM candidates
                    WHERE referral_code = ?
                `;
                const directResult = await db.query(directQuery, [uniqueCode]);
                return directResult.rows;
            }
            
            return rows;
        } catch (error) {
            console.error('Error getting referrals:', error);
            
            // Fallback to checking referral_code column directly if the join query fails
            try {
                const directQuery = `
                    SELECT * FROM candidates
                    WHERE referral_code = ?
                `;
                const { rows } = await db.query(directQuery, [uniqueCode]);
                return rows;
            } catch (fallbackError) {
                console.error('Error in fallback referral query:', fallbackError);
                return [];
            }
        }
    }

    static async getAll() {
        const query = `
            SELECT * FROM influencers
            ORDER BY created_at DESC
        `;
        const { rows } = await db.query(query);
        return rows;
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM influencers WHERE email = ?';
        const { rows } = await db.query(query, [email]);
        return rows[0];
    }

    static async updateReferralCount(code) {
        const query = `
            UPDATE influencers
            SET referral_count = referral_count + 1
            WHERE unique_code = ?
            RETURNING *
        `;
        const { rows } = await db.query(query, [code]);
        return rows[0];
    }
}

module.exports = Influencer; 