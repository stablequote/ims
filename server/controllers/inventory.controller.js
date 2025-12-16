const Inventory = require("../models/inventory.model");

exports.getProductions = async (req, res) => {
    try {
        const inventory = await Inventory.find().sort({ createdAt: -1 });
        if(!inventory) {
            res.status(403).json({ message: "No production found" });
        }
        res.status(200).json(inventory)
    } catch (error) {
        res.status(500).json(error)
    }
}