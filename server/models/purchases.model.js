const mongoose = require('mongoose');

const purchaseSchema = mongoose.Schema({
    items: [
        {
            name: { type: String, required: true }, 
            quantity: { type: Number, required: true },
            itemPrice: { type: Number, required: true },
            itemTotalPrice: { type: Number }
        },
    ],
    totalCost: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    paymentMethod: {
        type: String,
        enum: ["Cash", "Bankak"],
        required: true,
        default: 'Cash'
    }
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);

//   quantity: {
//         type: Number,
//         required: true,
//     },
//     price: {
//         type: Number,
//         required: true,
//     },