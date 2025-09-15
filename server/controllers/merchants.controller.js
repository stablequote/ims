const Merchants = require('../models/merchants.model');

exports.createMerchant = async (req, res) => {
    try {
        const { shopName } = req.body;
        console.log(req.body);

        const newMerchant = new Merchants(req.body)

        await newMerchant.save();
        res.status(201).json({ message: "Merchant created successfully", newMerchant })
    } catch (error) {
        res.status(500).json({ error })
        console.log(error)
    }
}

exports.getSingleMerchant = async (req, res) => {
    const { id } = req.params;

    try {
        const foundMerchant = await Merchants.findOneById(id)
        if(!foundMerchant) {
            res.status(404).json({ message: "No merchant found!" })
        } else {
            res.status(200).json({ message: "Merchant found successfully!", foundMerchant})
        }
    } catch (error) {
        res.status(500).josn({ message: "Internal server error", error })
    }
}

exports.getAllMerchants = async (req, res) => {
    try {
        const merchants = await Merchants.find({});
        res.status(200).json(merchants);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get all merchants.' });
    }
};

exports.deleteSingleMerchant = async (req, res) => {
    const { id } = req.params;
    console.log(id)

    try {
        const foundMerchant = Merchants.findByIdAndDelete(id);
        if(!foundMerchant) {
            res.status(404).json({ message: "No Merchants found!" })
        } else {
            res.status(200).json({ message: "Merchants successfully deleted!" })
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to delete merchant!" })
    }
}