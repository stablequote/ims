const mongoose = require('mongoose');

const merchantSchema = mongoose.Schema({
    shopName: {
        type: String,
        required: true,
    },
    ownerName: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    unitSalePrice: {
        type: Number,
        required: true,
    },
    distributions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Distributions', // Links to the sales made by the user
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model('Merchant', merchantSchema);