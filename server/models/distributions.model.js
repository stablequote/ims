const mongoose = require('mongoose');

const distributionSchema = mongoose.Schema({
    merchant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Merchant', // Links to the merchant
    },
    items: [
        {   type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    quantity: {
        type: Number,
        required: true,
    },
    unitSalePrice: {
        type: Number,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    paidAmount: {
        type: Number,
        default: 0,
    },
    paymentMethod: {
        type: String,
        enum: ["Cash", "Bankak", "Later"],
        // default: "Cash",
        // required: true,
    },
    transactionNumber: {
        type: String,
    },
    paymentStatus: {
        type: String,
        enum: ["Paid", "Pending", "Partial"],
        default: "Pending",
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Distribution', distributionSchema);