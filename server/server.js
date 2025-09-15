const express = require('express')
const app = express()
const mongoose = require('mongoose');
const cors = require('cors')
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const os = require('os');

// const DB_URI = process.env.DB_URI
// const DB_LOCAL = process.env.DB_LOCAL

const authRouter = require("./routes/auth.route")
const merchantsRouter = require("./routes/merchants.route")
const expensesRouter = require("./routes/expenses.route")
const purchasesRouter = require("./routes/purchases.route")
const productsRouter = require("./routes/products.route")

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ims', {
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

app.get("/test", (req, res) => {
  res.send("server is working")
  console.log("test is working!!")
})

// running the server
app.listen(5003, () => {
  console.log("server running on port 5003")  
})

process.stdin.resume(); // Keeps the process open