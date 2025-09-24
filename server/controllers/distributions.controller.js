const Distributions = require("../models/distributions.model");
const Inventory = require("../models/inventory.model");
const Production = require("../models/production.model");

exports.createDistribution = async (req, res) => {
    try {
        const { merchant, items, quantity, unitSalePrice, paidAmount, paymentMethod, transactionNumber, paymentStatus, date } = req.body;
        const product = items.map((itm) => itm.product).toString();
        // const inventory = await Inventory.fineOne({ product });
        let inventory = await Inventory.findOne({ product })

        console.log("product", product)
        console.log(inventory)

        if(!inventory) {
            res.status(404).json({ message: "No inventory record found for this product" })
        } else if(inventory.stock < quantity) {
            res.status(404).json({ message: "No enough stock of this product" })
        } else {
            inventory.stock -= quantity;
            await inventory.save();

            const payload = {
                merchant,
                items: items.map((item) => item.product),
                quantity,
                unitSalePrice,
                paymentMethod: paymentMethod || 'Later',
                transactionNumber: transactionNumber || '',
                paymentStatus,
                totalAmount: unitSalePrice * quantity,
                paidAmount,
            }
            if(date) {
                payload.createdAt = date
            }
            const newDistribution = new Distributions(payload)
            await newDistribution.save()

            // const inventory = production.reduce((acc, p) => acc + p.quantity, 0);
            res.status(201).json({ message: "Distrbution created successfully", distribution: newDistribution, inventory })
        }

    } catch (error) {
        res.status(500).json(error)
    }
}

exports.getDistributions = async (req, res) => {
    try {
        const distributions = await Distributions.find({})
        .populate('items')
        .populate('merchant')
        .lean()
        if(!distributions) {
            res.status(403).json({ message: "No distribution found" });
        }
        res.status(200).json(distributions)
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.closeTicket = async (req, res) => {
    try {
        const { distributionId, paymentMethod, transactionNumber } = req.body;
        console.log("Close ticket route hit!")
        console.log(distributionId);

        let foundDistribution = await Distributions.findById(distributionId);
        if(!foundDistribution) {
            res.status(404).json({ message: "No matching ditribution found!" })
        }
        foundDistribution.paymentMethod = paymentMethod;
        foundDistribution.transactionNumber = transactionNumber;
        foundDistribution.paymentStatus = "Paid";

        await foundDistribution.save();

        res.status(200).json({ message: "Ticket closed successfully!", foundDistribution })

        console.log(foundDistribution)
    } catch (error) {
        res.status(500).json(error)
    }
}