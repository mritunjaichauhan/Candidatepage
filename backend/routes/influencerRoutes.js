const express = require('express');
const router = express.Router();
const influencerController = require('../controllers/influencerController');
const db = require('../config/database');

// Create a new influencer
router.post('/', influencerController.createInfluencer);

// Get influencer by unique code
router.get('/:code', influencerController.getInfluencerByCode);

// Get all referrals for an influencer
router.get('/:code/referrals', influencerController.getInfluencerReferrals);

// Get all influencers
router.get('/', influencerController.getAllInfluencers);

// Update the referral_code for existing candidate records that don't have it
router.post('/update-referrals', async (req, res) => {
    try {
        // This endpoint will look for candidates that were submitted with an influencer code
        // but don't have it in their referral_code field
        
        // Get candidates with influencer codes from the API request body
        const { entries } = req.body;
        
        if (!entries || !Array.isArray(entries)) {
            return res.status(400).json({ error: 'Invalid request format. Expected an array of entries.' });
        }
        
        const updates = [];
        
        for (const entry of entries) {
            const { candidateId, influencerCode } = entry;
            
            if (!candidateId || !influencerCode) {
                continue;
            }
            
            try {
                // Update the referral_code
                await db.run(
                    'UPDATE candidates SET referral_code = ? WHERE id = ?',
                    [influencerCode, candidateId]
                );
                
                // Try to create the relationship if it doesn't exist
                const influencer = await db.query(
                    'SELECT id FROM influencers WHERE unique_code = ?',
                    [influencerCode]
                );
                
                if (influencer.rows && influencer.rows.length > 0) {
                    // Create the relationship in the junction table
                    try {
                        await db.run(
                            'INSERT OR IGNORE INTO influencer_referrals (influencer_id, candidate_id) VALUES (?, ?)',
                            [influencer.rows[0].id, candidateId]
                        );
                        
                        // Update referral count
                        await db.run(
                            'UPDATE influencers SET referral_count = referral_count + 1 WHERE id = ?',
                            [influencer.rows[0].id]
                        );
                        
                        updates.push({
                            candidateId,
                            influencerCode,
                            status: 'success'
                        });
                    } catch (error) {
                        updates.push({
                            candidateId,
                            influencerCode,
                            status: 'error',
                            message: error.message
                        });
                    }
                }
            } catch (error) {
                updates.push({
                    candidateId,
                    influencerCode,
                    status: 'error',
                    message: error.message
                });
            }
        }
        
        res.json({
            message: 'Referral relationships updated',
            updates
        });
    } catch (error) {
        console.error('Error updating referrals:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; 