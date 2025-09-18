const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    stock: {
        type: Number,
        default: 0,
    },
}, {timestamps: true});

module.exports = mongoose.model('Inventory', inventorySchema);