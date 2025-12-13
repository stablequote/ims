const express = require('express');
const router = express.Router();
const merchantsController = require('../controllers/merchants.controller');

// Authentication routes
router.post('/create', merchantsController.createMerchant);
router.get('/list/:merchantId', merchantsController.getSingleMerchant);
router.get('/list', merchantsController.getAllMerchants);
router.delete('/delete/:merchantId', merchantsController.deleteSingleMerchant);
router.put('/edit/:merchantId', merchantsController.updateMerchant);

module.exports = router;