const Purchase = require('../models/purchases.model');

exports.createPurchase = async (req, res) => {
    try {
        // console.log("Body", req.body)
        const { totalCost, paymentMethod, description, date } = req.body;
        const payload = {
            // items: items,
            totalCost,
            paymentMethod,
            description,
        }
        console.log("Payload", payload)

        if(date) {
            payload.createdAt = new Date(date)
        }

        const purchase = new Purchase(payload)

        await purchase.save();
        res.status(201).json({ message: "Purchase created successfully", purchase })
    } catch (error) {
        res.status(500).json({ error })
        console.log(error)
    }
}

exports.listSinglePurchase = async (req, res) => {
    const { id } = req.params;

    try {
        const foundPurchase = await Purchase.findOneById(id)
        if(!foundPurchase) {
            res.status(404).json({ message: "No purchase found!" })
        } else {
            res.status(200).json({ message: "Purchase found successfully!", foundPurchase})
        }
    } catch (error) {
        res.status(500).json({ error })
    }
}

exports.listTodayPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find().sort({ createdAt: -1 });

        const isToday = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        return date >= start && date <= end;
        };

        const todayPurchases = purchases.filter(purch => isToday(purch.createdAt));
        const totalTodayPurchases = todayPurchases.items.reduce((sum, itm) => sum + itm.itemPrice, 0);
        res.status(200).json({ message: "Total Purchases today:", totalTodayPurchases })
    } catch (error) {
        res.stauts(500).json({ message: error })
    }
}

exports.listAllPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find().sort({ createdAt: -1 });
        res.status(200).json(purchases);
    } catch (error) {
        res.status(500).json({ error: 'Failed to list purchases.' });
    }
};

exports.deleteSinglePurchase = async (req, res) => {
    const { id } = req.params;
    console.log(id)

    try {
        const foundPurchases = Expense.findByIdAndDelete(id);
        if(!foundPurchases) {
            res.status(404).json({ message: "No Purchase Found!" })
        } else {
            res.status(200).json({ message: "Purchase successfully deleted!" })
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to delete purchase!" })
    }
}