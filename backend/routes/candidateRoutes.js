const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Influencer = require('../models/influencer');

// Submit candidate application
router.post('/', async (req, res) => {
    try {
        const { 
            name, 
            email, 
            phone,
            influencerCode, // Use influencerCode from the form
            job_id, 
            resume_path, 
            additional_info,
            // Add step1 fields
            full_name,
            phone_number,
            phone_verified,
            email_verified,
            primary_city,
            additional_cities,
            work_radius,
            pincode,
            open_to_relocate,
            calling_number,
            // Add step2 fields
            age,
            work_schedule,
            education,
            in_field_experience,
            experience,
            expected_ctc,
            open_to_gig,
            open_to_full_time,
            has_license,
            license_types,
            additional_vehicle,
            additional_vehicle_type,
            commercial_vehicle_type,
            // Add step3 fields
            languages,
            pan,
            pancard,
            aadhar,
            aadharcard,
            agree_terms
        } = req.body;
        
        if (!name || !email) {
            return res.status(400).json({ error: "Name and email are required" });
        }

        console.log('Received influencer code:', influencerCode);

        // Prepare fields for database
        const additionalCitiesString = Array.isArray(additional_cities) ? JSON.stringify(additional_cities) : additional_cities;
        const licenseTypesString = Array.isArray(license_types) ? JSON.stringify(license_types) : license_types;
        const languagesString = Array.isArray(languages) ? JSON.stringify(languages) : languages;

        // Start a transaction
        await db.query('BEGIN TRANSACTION');

        // Insert the candidate
        const insertCandidateQuery = `
            INSERT INTO candidates (
                name, email, phone, job_id, resume_path, additional_info,
                full_name, phone_number, phone_verified, email_verified, primary_city, 
                additional_cities, work_radius, pincode, open_to_relocate, calling_number,
                age, work_schedule, education, in_field_experience, experience, expected_ctc,
                open_to_gig, open_to_full_time, has_license, license_types, additional_vehicle,
                additional_vehicle_type, commercial_vehicle_type, languages, pan, pancard,
                aadhar, aadharcard, agree_terms, referral_code
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING id
        `;

        const { rows: [candidate] } = await db.query(insertCandidateQuery, [
            name, email, phone, job_id, resume_path, additional_info,
            full_name || name,
            phone_number || phone,
            phone_verified ? 1 : 0,
            email_verified ? 1 : 0,
            primary_city,
            additionalCitiesString,
            work_radius,
            pincode,
            open_to_relocate ? 1 : 0,
            calling_number,
            age,
            work_schedule,
            education,
            in_field_experience,
            experience,
            expected_ctc,
            open_to_gig ? 1 : 0,
            open_to_full_time ? 1 : 0,
            has_license ? 1 : 0,
            licenseTypesString,
            additional_vehicle,
            additional_vehicle_type,
            commercial_vehicle_type,
            languagesString,
            pan,
            pancard,
            aadhar,
            aadharcard,
            agree_terms ? 1 : 0,
            influencerCode // Store the influencer code directly
        ]);

        // If there's an influencer code, create the referral relationship and increment the count
        if (influencerCode) {
            console.log(`Processing referral for influencer code: ${influencerCode}`);
            
            try {
                // Get the influencer by code
                const influencer = await Influencer.findByUniqueCode(influencerCode);
                
                if (influencer) {
                    console.log(`Found influencer with ID: ${influencer.id}`);
                    
                    // Insert into the junction table to create the relationship
                    await db.query(`
                        INSERT INTO influencer_referrals (influencer_id, candidate_id)
                        VALUES (?, ?)
                    `, [influencer.id, candidate.id]);
                    
                    // Update the referral count
                    await db.query(`
                        UPDATE influencers 
                        SET referral_count = referral_count + 1 
                        WHERE id = ?
                    `, [influencer.id]);
                    
                    console.log(`Updated referral count for influencer ${influencer.id}`);
                } else {
                    console.log(`No influencer found with code: ${influencerCode}`);
                }
            } catch (referralError) {
                console.error('Error processing referral:', referralError);
                // Continue with the transaction even if referral processing fails
            }
        }

        await db.query('COMMIT');
        
        res.status(201).json({
            message: "Candidate added successfully",
            candidateId: candidate.id,
            referralCode: influencerCode || null
        });
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Error creating candidate:', error);
        
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: "Email address already exists" });
        }
        res.status(500).json({ error: error.message });
    }
});

// Get all candidates
router.get('/', async (req, res) => {
    try {
        const { rows } = await db.query(`
            SELECT c.*, j.title AS job_title 
            FROM candidates c
            LEFT JOIN jobs j ON c.job_id = j.id
            ORDER BY c.created_at DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 