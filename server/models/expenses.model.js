const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({
  amount: Number,
  description: String,
  category: {
    type: String,
    enum: ["Fuel", "Bill", "Meal", "Other", "Wage"]
  },
  paymentMethod: {
    type: String,
    enum: ["Cash", "Bankak"],
    default: "Cash"
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
}, { timestaps: true })

module.exports = mongoose.model('Expense', expenseSchema);
