const db = require('../config/database');

class Influencer {
    static async create({ name, email, phone, uniqueCode }) {
        const query = `
            INSERT INTO influencers (name, email, phone, unique_code)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const values = [name, email, phone, uniqueCode];
        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async findByUniqueCode(uniqueCode) {
        const query = `
            SELECT * FROM influencers
            WHERE unique_code = $1
        `;
        const { rows } = await db.query(query, [uniqueCode]);
        return rows[0];
    }

    static async getReferrals(uniqueCode) {
        const query = `
            SELECT c.* FROM candidates c
            JOIN influencer_referrals ir ON c.id = ir.candidate_id
            JOIN influencers i ON ir.influencer_id = i.id
            WHERE i.unique_code = $1
        `;
        const { rows } = await db.query(query, [uniqueCode]);
        return rows;
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
        const sql = 'SELECT * FROM influencers WHERE email = ?';
        return db.get(sql, [email]);
    }

    static async updateReferralCount(code) {
        const query = `
            UPDATE influencers
            SET referral_count = referral_count + 1
            WHERE unique_code = $1
            RETURNING *
        `;
        const { rows } = await db.query(query, [code]);
        return rows[0];
    }
}

module.exports = Influencer; 