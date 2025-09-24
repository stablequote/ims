const Expense = require('../models/expenses.model');

exports.createExpense = async (req, res) => {
    try {
        const { amount, description, category, paymentMethod, date  } = req.body;
        console.log(req.body)

        const payload = {
            amount,
            description,
            category,
            paymentMethod
        }

        if(date) {
            payload.createdAt = new Date(date)
        }
        
        const newExpense = new Expense(payload)
        await newExpense.save();

        res.status(201).json({ message: "Expense created successfully", newExpense })
    } catch (error) {
        res.status(500).json({ error: "Failed to create expense" })
        console.log(error)
    }
}

exports.listSingleExpense = async (req, res) => {
    const { id } = req.params;

    try {
        const foundExpense = await Expense.findOneById(id)
        if(!foundExpense) {
            res.status(404).json({ message: "No expense found!" })
        } else {
            res.status(200).json({ message: "Expense found successfully!", foundExpense})
        }
    } catch (error) {
        
    }
}

exports.listTodayExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({});

        const isToday = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        return date >= start && date <= end;
        };

        const todayExpenses = expenses.filter(exp => isToday(exp.createdAt));
        const totalTodayExpenses = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        res.status(200).json({ message: "Total Expenses today:", totalTodayExpenses })
    } catch (error) {
        res.stauts(500).json({ message: error })
    }
}

exports.listAllExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({});
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to list expenses.' });
    }
};

exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    console.log(id)

    try {
        const foundExpense = Expense.findByIdAndDelete(id);
        if(!foundExpense) {
            res.status(404).json({ message: "No Expense found!" })
        } else {
            res.status(200).json({ message: "Expense successfully deleted!" })
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to delete expense!" })
    }
}