const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/report.controller');

// Authentication routes
router.get('/calculate-unit-cost', reportsController.calculateWeeklyUnitCost);
router.get('/weekly', reportsController.getWeeklyReport);
router.get('/analytics', reportsController.getAnalytics);

module.exports = router;