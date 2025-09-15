const express = require('express');
const router = express.Router();
const expensesController = require('../controllers/expenses.controller');

// Authentication routes
router.post('/create', expensesController.createExpense);
router.get('/list/:expenseId', expensesController.listSingleExpense);
router.get('/list', expensesController.listAllExpenses);
router.get('/list/today', expensesController.listTodayExpenses);
router.delete('/delete/:expenseId', expensesController.deleteExpense);

module.exports = router;