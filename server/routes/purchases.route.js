const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchases.controller');

// Authentication routes
router.post('/create', purchaseController.createPurchase);
router.get('/list/:expenseId', purchaseController.listSinglePurchase);
router.get('/list', purchaseController.listAllPurchases);
router.get('/list/today', purchaseController.listTodayPurchases);
router.delete('/delete/:expenseId', purchaseController.deleteSinglePurchase);

module.exports = router;