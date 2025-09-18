const Production = require("../models/production.model");
const Inventory = require("../models/inventory.model");

exports.addProduction = async (req, res) => {
    try {
        const { product, quantity, category } = req.body;
        const newProduction = new Production({ product, quantity });
        await newProduction.save();
        
        let inventory = await Inventory.findOne({ product })

        console.log(inventory)

        if(!inventory) {
            inventory = new Inventory({ product, stock: quantity })
        } else {
            inventory.stock += quantity;
        }

        await inventory.save();
        
        res.status(201).json({ message: "Successfully added production and updated inventory", newProduction, inventory });
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.getProductions = async (req, res) => {
    try {
        const productions = await Production.find({})
        .populate('product')
        .lean();
        if(!productions) {
            res.status(403).json({ message: "No production found" });
        }
        res.status(200).json(productions)
    } catch (error) {
        res.status(500).json(error)
    }
}