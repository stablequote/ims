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
        enum: ["Cash", "Bankak"],
        default: "Cash",
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ["paid", "unpaid", "partial"],
        default: "unpaid",
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Distribution', distributionSchema);