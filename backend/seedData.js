// Seed database with sample customers for admin user
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/customer_management";

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: "user" },
  createdAt: { type: Date, default: Date.now },
});

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

const User = mongoose.model("User", userSchema);
const Customer = mongoose.model("Customer", customerSchema);

async function seedDatabase() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Check if admin user exists
    let admin = await User.findOne({ username: "admin" });

    if (!admin) {
      console.log("Creating admin user...");
      const hashedPassword = await bcrypt.hash("admin", 10);
      admin = new User({
        username: "admin",
        password: hashedPassword,
        name: "Administrator",
        role: "admin",
      });
      await admin.save();
      console.log("✅ Admin user created (username: admin, password: admin)\n");
    } else {
      console.log(`✅ Admin user exists: ${admin.name}\n`);
    }

    // Check if customers already exist for admin
    const existingCustomers = await Customer.countDocuments({
      userId: admin._id,
    });

    if (existingCustomers > 0) {
      console.log(`⚠️  Admin already has ${existingCustomers} customers`);
      console.log(
        "Do you want to add more? (This script will add sample data)\n"
      );
    }

    // Sample customers data
    const sampleCustomers = [
      // Main Street
      {
        name: "John Smith",
        boxId: "MS001",
        streetName: "Main Street",
        rechargeAmount: 500,
        status: "paid",
      },
      {
        name: "Jane Doe",
        boxId: "MS002",
        streetName: "Main Street",
        rechargeAmount: 500,
        status: "unpaid",
      },
      {
        name: "Bob Wilson",
        boxId: "MS003",
        streetName: "Main Street",
        rechargeAmount: 600,
        status: "paid",
      },
      {
        name: "Alice Brown",
        boxId: "MS004",
        streetName: "Main Street",
        rechargeAmount: 500,
        status: "unpaid",
      },

      // Oak Avenue
      {
        name: "Charlie Davis",
        boxId: "OA001",
        streetName: "Oak Avenue",
        rechargeAmount: 500,
        status: "paid",
      },
      {
        name: "Diana Evans",
        boxId: "OA002",
        streetName: "Oak Avenue",
        rechargeAmount: 550,
        status: "paid",
      },
      {
        name: "Frank Miller",
        boxId: "OA003",
        streetName: "Oak Avenue",
        rechargeAmount: 500,
        status: "unpaid",
      },

      // Pine Road
      {
        name: "Grace Taylor",
        boxId: "PR001",
        streetName: "Pine Road",
        rechargeAmount: 500,
        status: "paid",
      },
      {
        name: "Henry Anderson",
        boxId: "PR002",
        streetName: "Pine Road",
        rechargeAmount: 600,
        status: "unpaid",
      },
      {
        name: "Ivy Martinez",
        boxId: "PR003",
        streetName: "Pine Road",
        rechargeAmount: 500,
        status: "paid",
      },
      {
        name: "Jack Thompson",
        boxId: "PR004",
        streetName: "Pine Road",
        rechargeAmount: 500,
        status: "unpaid",
      },

      // Elm Street
      {
        name: "Kelly White",
        boxId: "ES001",
        streetName: "Elm Street",
        rechargeAmount: 500,
        status: "paid",
      },
      {
        name: "Leo Harris",
        boxId: "ES002",
        streetName: "Elm Street",
        rechargeAmount: 550,
        status: "unpaid",
      },
    ];

    console.log(`📦 Adding ${sampleCustomers.length} sample customers...\n`);

    let added = 0;
    let skipped = 0;

    for (const customerData of sampleCustomers) {
      // Check if customer with same boxId exists for this user
      const exists = await Customer.findOne({
        userId: admin._id,
        boxId: customerData.boxId,
      });

      if (exists) {
        console.log(
          `⏭️  Skipped: ${customerData.name} (${customerData.boxId}) - already exists`
        );
        skipped++;
        continue;
      }

      const customer = new Customer({
        ...customerData,
        userId: admin._id,
        lastPaymentDate: customerData.status === "paid" ? new Date() : null,
      });

      await customer.save();
      console.log(
        `✅ Added: ${customerData.name} (${customerData.boxId}) - ${customerData.streetName}`
      );
      added++;
    }

    console.log("\n═══════════════════════════════════════");
    console.log(`✅ Seeding complete!`);
    console.log(`   Added: ${added} customers`);
    console.log(`   Skipped: ${skipped} customers (already exist)`);
    console.log("═══════════════════════════════════════\n");

    // Show summary
    const totalCustomers = await Customer.countDocuments({ userId: admin._id });
    const streets = await Customer.distinct("streetName", {
      userId: admin._id,
    });

    console.log("📊 Admin's Database Summary:");
    console.log(`   Total Customers: ${totalCustomers}`);
    console.log(`   Streets: ${streets.length}`);
    console.log(`   Street Names: ${streets.join(", ")}\n`);

    console.log("🎯 Next Steps:");
    console.log("   1. Login as: admin / admin");
    console.log("   2. You should see data in the dashboard!");
    console.log("   3. Navigate to Customers tab to see all streets\n");

    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

console.log("═══════════════════════════════════════════════════");
console.log("  Database Seeding Script");
console.log("  Adds sample customers for admin user");
console.log("═══════════════════════════════════════════════════\n");

seedDatabase();
