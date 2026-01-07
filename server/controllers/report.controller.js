const Purchases = require('../models/purchases.model.js');
const Expenses = require('../models/expenses.model.js');
const Production = require('../models/production.model.js');
const Distribution = require('../models/distributions.model.js');
const Inventory = require('../models/inventory.model.js');
// const { calculateDynamicUnitCost } = require("./production.controller.js")
/**
 * GET /api/reports/weekly?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 * If dates not provided, default to last 8 weeks.
*/
exports.getWeeklyReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let start = startDate ? new Date(startDate) : null;
    let end = endDate ? new Date(endDate) : null;

    if (!start || !end) {
      // default last 8 weeks
      end = new Date();
      start = new Date();
      start.setDate(end.getDate() - (7 * 8));
    }

    // MongoDB pipeline to group by week: use $dateTrunc (available in MongoDB 5+)
    const truncateToWeek = (field) => ({
      $dateTrunc: { date: `$${field}`, unit: 'week', binSize: 1, timezone: 'UTC' }
    }); 

    // 1) Purchases (costs)
    const purchases = await Purchases.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: truncateToWeek('createdAt'), purchasesTotal: { $sum: '$totalCost' } } },
      { $sort: { _id: 1 } }
    ]);

    // 2) Expenses
    const expenses = await Expenses.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: truncateToWeek('createdAt'), expensesTotal: { $sum: '$amount' } } },
      { $sort: { _id: 1 } }
    ]);

    // 3) Production value (quantity * unitCost)
    const production = await Production.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $project: {
          week: truncateToWeek('createdAt'),
          value: { $multiply: ['$quantity', '$unitCost'] }
        }
      },
      { $group: { _id: '$week', productionValue: { $sum: '$value' } } },
      { $sort: { _id: 1 } }
    ]);

    // 4) Distribution revenue
    const distribution = await Distribution.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: truncateToWeek('createdAt'), distributionValue: { $sum: '$totalAmount' } } },
      { $sort: { _id: 1 } }
    ]);

    // Merge results by week keys
    const weeksMap = new Map();

    const pushToMap = (arr, keyName, valueName) => {
      arr.forEach(r => {
        const wk = r._id.toISOString();
        if (!weeksMap.has(wk)) weeksMap.set(wk, { weekStart: r._id });
        weeksMap.get(wk)[valueName] = r[keyName];
      });
    };

    pushToMap(purchases, 'purchasesTotal', 'purchasesTotal');
    pushToMap(expenses, 'expensesTotal', 'expensesTotal');
    pushToMap(production, 'productionValue', 'productionValue');
    pushToMap(distribution, 'distributionValue', 'distributionValue');

    // Convert to array and compute net
    const result = Array.from(weeksMap.values())
      .map(w => {
        const purchasesTotal = w.purchasesTotal || 0;
        const expensesTotal = w.expensesTotal || 0;
        const productionValue = w.productionValue || 0;
        const distributionValue = w.distributionValue || 0;

        const net = (productionValue + distributionValue) - (purchasesTotal + expensesTotal);

        return {
          weekStart: w.weekStart,
          purchasesTotal,
          expensesTotal,
          productionValue,
          distributionValue,
          net
        };
      })
      .sort((a, b) => new Date(a.weekStart) - new Date(b.weekStart));

    res.json({ start, end, weeks: result });
  } catch (err) {
    console.error('weeklyReport err', err);
    res.status(500).json({ error: err.message });
  }
};

// unit cost calculation:
exports.calculateWeeklyUnitCost = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Expenses
    const totalExpenses = await Expenses.aggregate([
      { $match: { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // Purchases
    const totalPurchases = await Purchases.aggregate([
      { $match: { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
      { $group: { _id: null, total: { $sum: "$totalCost" } } }
    ]);

    // Production
    const totalProduction = await Production.aggregate([
      { $match: { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
      { $group: { _id: null, totalQty: { $sum: "$quantity" } } }
    ]);

    console.log(totalExpenses)
    console.log(totalPurchases)
    console.log(totalProduction)

    const expenses = totalExpenses[0]?.total || 0;
    const purchases = totalPurchases[0]?.total || 0;
    const producedQty = totalProduction[0]?.totalQty || 0;

    if (producedQty === 0) {
      return res.status(400).json({ message: "No production found in this date range" });
    }

    const unitCost = (expenses + purchases) / producedQty;

    res.status(200).json({
      week: { startDate, endDate },
      expenses,
      purchases,
      producedQty,
      unitCost,
    });

  } catch (error) {
    res.status(500).json({ message: "Error calculating unit cost", error: error.message });
  }
};

// response
const calculateDynamicUnitCost = async (start, end) => {
  try {
    // Optional date filters from query (ex: ?start=2025-01-01&end=2025-01-31)
    // const { start, end } = req.query;

    const dateFilter = {};
    if (start && end) {
      dateFilter.createdAt = {
        $gte: new Date(start),
        $lte: new Date(end),
      };
    }

    // Aggregate total expenses
    const expenses = await Expenses.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, totalExpenses: { $sum: "$amount" } } },
    ]);

    // Aggregate total purchases
    const purchases = await Purchases.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, totalPurchases: { $sum: "$totalCost" } } }, // adjust field name
    ]);

    // Aggregate total production quantity
    const productions = await Production.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, totalQuantity: { $sum: "$quantity" } } },
    ]);

    const totalExpenses = expenses[0]?.totalExpenses || 0;
    const totalPurchases = purchases[0]?.totalPurchases || 0;
    const totalQuantity = productions[0]?.totalQuantity || 0;

    const totalCost = totalExpenses + totalPurchases;
    const unitCost = totalQuantity > 0 ? totalCost / totalQuantity : 0;

    // res.status(200).json({
    //   success: true,
    //   totalExpenses,
    //   totalPurchases,
    //   totalQuantity,
    //   unitCost,
    // });
    return {
      totalExpenses,
      totalPurchases,
      totalQuantity,
      unitCost,
    }
  } catch (error) {
    console.error("Error calculating dynamic unit cost:", error);
    // res.status(500).json({
    //   success: false,
    //   message: "Server Error",
    // });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const now = new Date();

    // today boundaries
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // Week starts on Saturday
    const startOfWeek = new Date(now);
    const diffToSaturday = (now.getDay() + 1) % 7;

    startOfWeek.setDate(now.getDate() - diffToSaturday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // 1. Expenses
    const expensesToday = await Expenses.aggregate([
      { $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const expensesWeek = await Expenses.aggregate([
      { $match: { createdAt: { $gte: startOfWeek, $lte: endOfWeek } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const avgWeeklyExpenses = await Expenses.aggregate([
      {
        $group: {
          _id: { week: { $isoWeek: "$createdAt" }, year: { $year: "$createdAt" } },
          total: { $sum: "$amount" },
        },
      },
      { $group: { _id: null, avg: { $avg: "$total" } } },
    ]);

    // 2. Purchases
    const purchasesToday = await Purchases.aggregate([
      { $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } } },
      { $group: { _id: null, total: { $sum: "$totalCost" } } },
    ]);

    const purchasesWeek = await Purchases.aggregate([
      { $match: { createdAt: { $gte: startOfWeek, $lte: endOfWeek } } },
      { $group: { _id: null, total: { $sum: "$totalCost" } } },
    ]);

    const avgWeeklyPurchases = await Purchases.aggregate([
      {
        $group: {
          _id: { week: { $isoWeek: "$createdAt" }, year: { $year: "$createdAt" } },
          total: { $sum: "$totalCost" },
        },
      },
      { $group: { _id: null, avg: { $avg: "$total" } } },
    ]);

    // 3. Production
    const productionToday = await Production.aggregate([
      { $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } } },
      { $group: { _id: null, totalQty: { $sum: "$quantity" } } },
    ]);

    const productionFlipsToday = await Production.aggregate([
      { $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } } },
      { $count: "flips" },
    ]);

    const productionWeek = await Production.aggregate([
      { $match: { createdAt: { $gte: startOfWeek, $lte: endOfWeek } } },
      { $group: { _id: null, totalQty: { $sum: "$quantity" } } },
    ]);

    // 4. Revenue
    const unitCost = await calculateDynamicUnitCost(startOfWeek, endOfWeek);
    // console.log("Unit Cost: ", unitCost)

    const revenueToday = await Distribution.aggregate([
      { $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } } },
      { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } },
    ]);

    const revenueWeek = await Distribution.aggregate([
      { $match: { createdAt: { $gte: startOfWeek, $lte: endOfWeek } } },
      { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } },
    ]);

    const netRevenueToday =
      (revenueToday[0]?.totalSales || 0) -
      unitCost.unitCost * (productionToday[0]?.totalQty || 0);
    
    // console.log("Revenue today: ", revenueToday[0].totalSales)
    // console.log("Production today: ", productionToday[0].totalQty)

    // const equation = revenueToday[0].totalSales - (unitCost)

    const netRevenueWeek =
      (revenueWeek[0]?.totalSales || 0) -
      unitCost.unitCost * (productionWeek[0]?.totalQty || 0);

    // 5. Distribution
    const pendingDistributions = await Distribution.aggregate([
      { $match: { paymentStatus: "Pending" } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    const distributionsToday = await Distribution.aggregate([
      { $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } } },
      { $count: "quantity" },
    ]);

    // console.log("Distributions log:", distributionsToday[0].quantity)

    const distributionsWeek = await Distribution
    .aggregate([
      { $match: { createdAt: { $gte: startOfWeek, $lte: endOfWeek } } },
      {$count: "quantity"},
    ]);
    const distributionsQuantityWeek = await Distribution
    .aggregate([
      { $match: { createdAt: { $gte: startOfWeek, $lte: endOfWeek } } },
      {$group: {
        _id: null,
        quantity: { $sum: "$quantity" },
    },},
    ]);
    console.log("Weekly Distributions Quantity: ", distributionsQuantityWeek)

    // 6. Inventory
    const inventory = await Inventory.aggregate([
      { $group: { _id: null, totalStock: { $sum: "$stock" } } },
    ]);

    // 📦 Response
    res.json({
      expenses: {
        today: expensesToday[0]?.total || 0,
        week: expensesWeek[0]?.total || 0,
        avgWeekly: avgWeeklyExpenses[0]?.avg || 0,
      },
      purchases: {
        today: purchasesToday[0]?.total || 0,
        week: purchasesWeek[0]?.total || 0,
        avgWeekly: avgWeeklyPurchases[0]?.avg || 0,
      },
      production: {
        today: productionToday[0]?.totalQty || 0,
        flipsToday: productionFlipsToday[0]?.flips || 0,
        week: productionWeek[0]?.totalQty || 0,
      },
      revenue: {
        unitCost,
        netToday: netRevenueToday,
        netWeek: netRevenueWeek,
      },
      distribution: {
        pendingCount: pendingDistributions[0]?.count || 0,
        pendingAmount: pendingDistributions[0]?.totalAmount || 0,
        distributionsToday: distributionsToday[0]?.quantity || 0,
        distributionsWeek: distributionsWeek[0]?.quantity || 0,
        distributionsQuantityWeek: distributionsQuantityWeek[0].quantity || 0,
      },
      inventory: {
        availableStock: inventory[0]?.totalStock || 0,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching analytics" });
  }
};