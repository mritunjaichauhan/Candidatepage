const express = require('express');
const router = express.Router();
const influencerController = require('../controllers/influencerController');

// Create a new influencer
router.post('/', influencerController.createInfluencer);

// Get influencer by unique code
router.get('/:code', influencerController.getInfluencerByCode);

// Get all referrals for an influencer
router.get('/:code/referrals', influencerController.getInfluencerReferrals);

// Get all influencers
router.get('/', influencerController.getAllInfluencers);

module.exports = router; 