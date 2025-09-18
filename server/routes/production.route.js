const express = require('express');
const router = express.Router();
const productionController = require('../controllers/production.controller');

// Authentication routes
router.post('/add', productionController.addProduction);
router.get('/list', productionController.getProductions);

module.exports = router;