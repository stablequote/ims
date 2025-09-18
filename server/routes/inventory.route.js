const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');

// router.post('/add', inventoryController.addProduction);
router.get('/list', inventoryController.getProductions);

module.exports = router;