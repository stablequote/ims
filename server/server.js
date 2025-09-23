const express = require('express')
const app = express()
const mongoose = require('mongoose');
const cors = require('cors')
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const os = require('os');

dotenv.config();

const DB_URL = process.env.DB_URL
// const DB_LOCAL = process.env.DB_LOCAL

const authRouter = require("./routes/auth.route")
const merchantsRouter = require("./routes/merchants.route")
const expensesRouter = require("./routes/expenses.route")
const purchasesRouter = require("./routes/purchases.route")
const productsRouter = require("./routes/products.route")
const productionRouter = require("./routes/production.route")
const distributionsRouter = require("./routes/distributions.route")
const inventoryRouter = require("./routes/inventory.route")
const reportsRouter = require("./routes/reports.route")

const connectDB = async () => {
  try {
    console.log("Vercel URL: ", DB_URL)
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to Database");
  } catch (error) {
    console.error("❌ Database Connection Error:", error.message);
    process.exit(1); // Exit process if DB connection fails
  }
};
connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
dotenv.config({ path: path.join(__dirname, '.env') });

// middleware
app.use(cors({
    // origin: ["http://localhost:5173"],
    origin: "*",
    credentials: 'true',
}))
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}))

// routes
app.use("/auth", authRouter)
app.use("/merchants", merchantsRouter)
app.use("/expenses", expensesRouter)
app.use("/purchases", purchasesRouter)
app.use("/products", productsRouter)
app.use("/production", productionRouter)
app.use("/distributions", distributionsRouter)
app.use("/inventory", inventoryRouter)
app.use("/reports", reportsRouter)

app.get("/test", (req, res) => {
  res.send("server is working")
  console.log("test is working!!")
})

// running the server0
app.listen(5003, () => {
  console.log("server running on port 5003")  
})

process.stdin.resume(); // Keeps the process open