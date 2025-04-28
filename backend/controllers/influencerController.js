const Influencer = require('../models/influencer');
const Candidate = require('../models/candidate');
const { generateUniqueCode } = require('../utils/helpers');

class InfluencerController {
    static async createInfluencer(req, res) {
        try {
            const { name, email, phone } = req.body;
            
            if (!name || !email || !phone) {
                return res.status(400).json({ error: 'Name, email and phone are required' });
            }

            const uniqueCode = generateUniqueCode();

            const influencer = await Influencer.create({
                name,
                email,
                phone,
                uniqueCode
            });

            res.status(201).json({
                message: 'Influencer created successfully',
                influencer
            });
        } catch (error) {
            console.error('Error creating influencer:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getInfluencerByCode(req, res) {
        try {
            const { code } = req.params;
            const influencer = await Influencer.findByUniqueCode(code);

            if (!influencer) {
                return res.status(404).json({ error: 'Influencer not found' });
            }

            res.json(influencer);
        } catch (error) {
            console.error('Error fetching influencer:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getInfluencerReferrals(req, res) {
        try {
            const { code } = req.params;
            const referrals = await Influencer.getReferrals(code);
            
            res.json(referrals);
        } catch (error) {
            console.error('Error fetching referrals:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getAllInfluencers(req, res) {
        try {
            const influencers = await Influencer.getAll();
            res.json(influencers);
        } catch (error) {
            console.error('Error fetching influencers:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = InfluencerController; 