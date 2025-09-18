const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    inventory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inventory"
    },
    wholePrice: {
        type: Number,
        required: true,
    },
    retailPrice: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        // required: true,
    },
    description: {
        type: String,
        // required: false,
    },
    image: {
        type: String, // URL of the product image
        required: false,
    },
}, {timestamps: true});

module.exports = mongoose.model('Product', productSchema);