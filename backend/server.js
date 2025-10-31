// server.js - Complete Backend Server File
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const XLSX = require("xlsx");
require("dotenv").config();

const app = express();

// Middleware
// Allow CORS for development
app.use(cors());
// Add headers for better error handling
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/vnd.ms-excel"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only Excel files are allowed!"), false);
    }
  },
});

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/customer_management";

console.log("🔄 Attempting to connect to MongoDB...");

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🔗 Host: ${mongoose.connection.host}`);
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    console.error("🔍 Connection Details:", {
      uri: MONGODB_URI.replace(
        /mongodb:\/\/([^:]+):([^@]+)@/,
        "mongodb://***:***@"
      ),
      error: err.message,
    });
    process.exit(1);
  });

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: "user" },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// Customer Schema
const customerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  boxId: { type: String, required: true },
  streetName: { type: String, required: true },
  rechargeAmount: { type: Number, required: true, default: 500 },
  status: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
  lastPaymentDate: { type: Date },
  paymentHistory: [
    {
      date: { type: Date, default: Date.now },
      amount: { type: Number },
      month: { type: String },
      year: { type: Number },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

customerSchema.index({ userId: 1, streetName: 1, status: 1 });
customerSchema.index({ userId: 1, boxId: 1 });

const Customer = mongoose.model("Customer", customerSchema);

// Report Schema
const reportSchema = new mongoose.Schema({
  month: { type: String, required: true },
  year: { type: Number, required: true },
  totalCustomers: { type: Number, default: 0 },
  paidCount: { type: Number, default: 0 },
  unpaidCount: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  collectedAmount: { type: Number, default: 0 },
  streetWiseData: [
    {
      streetName: String,
      totalCustomers: Number,
      paidCount: Number,
      unpaidCount: Number,
      totalAmount: Number,
    },
  ],
  generatedAt: { type: Date, default: Date.now },
});

const Report = mongoose.model("Report", reportSchema);

// Authentication Middleware
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    req.userId = decoded.userId; // Extract userId for easy access
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

// ========== AUTHENTICATION ROUTES ==========

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    console.log("📝 Login attempt received:", req.body);

    // Validate request body
    if (!req.body || !req.body.username || !req.body.password) {
      console.log("❌ Login failed: Missing credentials");
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const { username, password } = req.body;

    const user = await User.findOne({ username });
    console.log("🔍 User lookup result:", user ? "Found" : "Not found");

    if (!user) {
      console.log("❌ Login failed: User not found");
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password, name } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword,
      name,
      role: "user",
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get all available street names (public endpoint for registration)
// ========== CUSTOMER ROUTES ==========

// Get all streets with statistics
app.get("/api/customers/streets", authMiddleware, async (req, res) => {
  try {
    console.log("🔍 GET /api/customers/streets - User ID:", req.userId);

    const streets = await Customer.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.userId) } },
      {
        $group: {
          _id: "$streetName",
          totalCustomers: { $sum: 1 },
          paidCount: {
            $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] },
          },
          unpaidCount: {
            $sum: { $cond: [{ $eq: ["$status", "unpaid"] }, 1, 0] },
          },
          totalAmount: { $sum: "$rechargeAmount" },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          totalCustomers: 1,
          paidCount: 1,
          unpaidCount: 1,
          totalAmount: 1,
        },
      },
      { $sort: { name: 1 } },
    ]);

    console.log("📊 Streets found:", streets.length);
    console.log("📦 Streets data:", JSON.stringify(streets, null, 2));
    res.json(streets);
  } catch (error) {
    console.error("Error fetching streets:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get customers by street
app.get(
  "/api/customers/street/:streetName",
  authMiddleware,
  async (req, res) => {
    try {
      const { streetName } = req.params;
      const { status } = req.query;

      const query = {
        userId: req.userId,
        streetName,
      };
      if (status && status !== "all") {
        query.status = status;
      }

      const customers = await Customer.find(query)
        .select("name boxId streetName rechargeAmount status lastPaymentDate")
        .sort({ name: 1 });

      const formatted = customers.map((c) => ({
        id: c._id.toString(),
        name: c.name,
        boxId: c.boxId,
        streetName: c.streetName,
        amount: c.rechargeAmount,
        status: c.status,
        lastPayment: c.lastPaymentDate
          ? c.lastPaymentDate.toISOString().split("T")[0]
          : "Never",
      }));

      res.json(formatted);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// Get all customers
app.get("/api/customers/all", authMiddleware, async (req, res) => {
  try {
    const customers = await Customer.find({ userId: req.userId })
      .select("name boxId streetName rechargeAmount status lastPaymentDate")
      .sort({ streetName: 1, name: 1 });

    const formatted = customers.map((c) => ({
      id: c._id.toString(),
      name: c.name,
      boxId: c.boxId,
      streetName: c.streetName,
      amount: c.rechargeAmount,
      status: c.status,
      lastPayment: c.lastPaymentDate
        ? c.lastPaymentDate.toISOString().split("T")[0]
        : "Never",
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching all customers:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Mark customer as paid
app.patch("/api/customers/:id/mark-paid", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const today = new Date();
    const month = today.toLocaleDateString("en-US", { month: "long" });
    const year = today.getFullYear();

    const customer = await Customer.findOne({ _id: id, userId: req.userId });
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    customer.status = "paid";
    customer.lastPaymentDate = today;
    customer.paymentHistory.push({
      date: today,
      amount: customer.rechargeAmount,
      month,
      year,
    });
    customer.updatedAt = today;

    await customer.save();

    res.json({
      success: true,
      message: "Payment marked successfully",
      customer: {
        id: customer._id.toString(),
        status: customer.status,
        lastPayment: customer.lastPaymentDate.toISOString().split("T")[0],
      },
    });
  } catch (error) {
    console.error("Error marking payment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Add new customer
app.post("/api/customers", authMiddleware, async (req, res) => {
  try {
    const { name, boxId, streetName, rechargeAmount } = req.body;

    // Check for duplicate boxId within the same user
    const existingCustomer = await Customer.findOne({
      userId: req.userId,
      boxId,
    });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: "Box ID already exists in your account",
      });
    }

    const customer = new Customer({
      userId: req.userId,
      name,
      boxId,
      streetName,
      rechargeAmount: rechargeAmount || 500,
    });

    await customer.save();

    console.log("✅ Customer saved:", {
      name: customer.name,
      boxId: customer.boxId,
      streetName: customer.streetName,
      userId: customer.userId,
    });

    res.status(201).json({
      success: true,
      message: "Customer added successfully",
      customer: {
        id: customer._id.toString(),
        name: customer.name,
        boxId: customer.boxId,
      },
    });
  } catch (error) {
    console.error("Error adding customer:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update customer details
app.put("/api/customers/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, streetName, rechargeAmount } = req.body;

    const customer = await Customer.findOneAndUpdate(
      { _id: id, userId: req.userId },
      {
        name,
        streetName,
        rechargeAmount,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    res.json({
      success: true,
      message: "Customer updated successfully",
      customer,
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Delete customer
app.delete("/api/customers/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    res.json({ success: true, message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ========== FILE IMPORT/EXPORT ROUTES ==========

// Import customers from Excel
app.post(
  "/api/customers/import",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }

      const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      const customers = [];
      const errors = [];

      for (let i = 0; i < data.length; i++) {
        const row = data[i];

        if (!row.name || !row.boxId || !row.streetName) {
          errors.push(`Row ${i + 2}: Missing required fields`);
          continue;
        }

        const exists = await Customer.findOne({ boxId: row.boxId });
        if (exists) {
          errors.push(`Row ${i + 2}: Box ID ${row.boxId} already exists`);
          continue;
        }

        customers.push({
          name: row.name,
          boxId: row.boxId,
          streetName: row.streetName,
          rechargeAmount: row.rechargeAmount || 500,
          status: row.status || "unpaid",
        });
      }

      if (customers.length > 0) {
        await Customer.insertMany(customers);
      }

      res.json({
        success: true,
        message: `Imported ${customers.length} customers`,
        imported: customers.length,
        errors: errors.length > 0 ? errors : undefined,
      });
    } catch (error) {
      console.error("Error importing file:", error);
      res
        .status(500)
        .json({ success: false, message: "Error processing file" });
    }
  }
);

// Export customers to Excel
app.get("/api/customers/export", authMiddleware, async (req, res) => {
  try {
    const customers = await Customer.find()
      .select("name boxId streetName rechargeAmount status lastPaymentDate")
      .sort({ streetName: 1, name: 1 });

    const data = customers.map((c) => ({
      Name: c.name,
      "Box ID": c.boxId,
      "Street Name": c.streetName,
      "Recharge Amount": c.rechargeAmount,
      Status: c.status,
      "Last Payment": c.lastPaymentDate
        ? c.lastPaymentDate.toISOString().split("T")[0]
        : "Never",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=customers.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    console.error("Error exporting customers:", error);
    res.status(500).json({ success: false, message: "Error exporting data" });
  }
});

// ========== REPORTS ROUTES ==========

// Generate monthly report
app.get("/api/reports/monthly", authMiddleware, async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const targetMonth =
      month || currentDate.toLocaleDateString("en-US", { month: "long" });
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();

    const totalStats = await Customer.aggregate([
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          paidCount: { $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] } },
          unpaidCount: {
            $sum: { $cond: [{ $eq: ["$status", "unpaid"] }, 1, 0] },
          },
          totalAmount: { $sum: "$rechargeAmount" },
          collectedAmount: {
            $sum: {
              $cond: [{ $eq: ["$status", "paid"] }, "$rechargeAmount", 0],
            },
          },
        },
      },
    ]);

    const streetWiseData = await Customer.aggregate([
      {
        $group: {
          _id: "$streetName",
          totalCustomers: { $sum: 1 },
          paidCount: { $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] } },
          unpaidCount: {
            $sum: { $cond: [{ $eq: ["$status", "unpaid"] }, 1, 0] },
          },
          totalAmount: { $sum: "$rechargeAmount" },
        },
      },
      {
        $project: {
          _id: 0,
          streetName: "$_id",
          totalCustomers: 1,
          paidCount: 1,
          unpaidCount: 1,
          totalAmount: 1,
        },
      },
      { $sort: { streetName: 1 } },
    ]);

    const report = {
      month: targetMonth,
      year: targetYear,
      ...totalStats[0],
      streetWiseData,
      generatedAt: new Date(),
    };

    await Report.findOneAndUpdate(
      { month: targetMonth, year: targetYear },
      report,
      { upsert: true, new: true }
    );

    res.json(report);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get all historical reports
app.get("/api/reports/history", authMiddleware, async (req, res) => {
  try {
    const reports = await Report.find().sort({ year: -1, month: -1 }).limit(12);

    res.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Reset all customers to unpaid (for new month)
app.post("/api/customers/reset-month", authMiddleware, async (req, res) => {
  try {
    const result = await Customer.updateMany(
      {},
      { $set: { status: "unpaid", updatedAt: new Date() } }
    );

    res.json({
      success: true,
      message: "All customers reset to unpaid",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error resetting customers:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ========== ROOT ROUTE ==========

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Customer Management Backend API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      auth: {
        login: "POST /api/auth/login",
        register: "POST /api/auth/register",
      },
      customers: {
        getAll: "GET /api/customers/all",
        getStreets: "GET /api/customers/streets",
        getByStreet: "GET /api/customers/street/:streetName",
        add: "POST /api/customers",
        update: "PUT /api/customers/:id",
        delete: "DELETE /api/customers/:id",
        markPaid: "PATCH /api/customers/:id/mark-paid",
      },
      health: "GET /api/health",
    },
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// ========== HEALTH CHECK ==========

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date(),
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// ========== ERROR HANDLING ==========

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ========== START SERVER ==========

const PORT = process.env.PORT || 5001;

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API Base URL: http://localhost:${PORT}/api`);
  console.log(
    `🗄️  MongoDB: ${
      mongoose.connection.readyState === 1 ? "Connected" : "Connecting..."
    }`
  );
});
