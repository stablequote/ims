const express = require('express');
const router = express.Router();
const distributionController = require('../controllers/distributions.controller');

// Authentication routes
router.post('/create', distributionController.createDistribution);
router.get('/list', distributionController.getDistributions);
router.post('/close-ticket', distributionController.closeTicket);

module.exports = router;