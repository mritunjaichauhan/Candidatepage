const db = require('../config/database');

class Candidate {
    static async create({ 
        full_name, 
        phone, 
        email, 
        primary_city, 
        work_radius, 
        aadhar_number,
        referral_code = null 
    }) {
        const sql = `
            INSERT INTO candidates (
                full_name, 
                phone, 
                email, 
                primary_city, 
                work_radius, 
                aadhar_number,
                referral_code
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        return db.run(sql, [
            full_name, 
            phone, 
            email, 
            primary_city, 
            work_radius, 
            aadhar_number,
            referral_code
        ]);
    }

    static async findByPhone(phone) {
        const sql = 'SELECT * FROM candidates WHERE phone = ?';
        return db.get(sql, [phone]);
    }

    static async findByEmail(email) {
        const sql = 'SELECT * FROM candidates WHERE email = ?';
        return db.get(sql, [email]);
    }

    static async findByAadhar(aadhar_number) {
        const sql = 'SELECT * FROM candidates WHERE aadhar_number = ?';
        return db.get(sql, [aadhar_number]);
    }

    static async getAll() {
        const sql = 'SELECT * FROM candidates ORDER BY created_at DESC';
        return db.all(sql);
    }

    static async getByReferralCode(referral_code) {
        const sql = 'SELECT * FROM candidates WHERE referral_code = ?';
        return db.all(sql, [referral_code]);
    }
}

module.exports = Candidate; 