const mongoose = require('mongoose');

const productionSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
    },
    labor: {
        type: String,
    }
}, {timestamps: true});

module.exports = mongoose.model('Production', productionSchema);