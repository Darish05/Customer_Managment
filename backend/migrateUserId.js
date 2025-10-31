// Migration script to add userId to existing customers
// Run this ONCE to assign existing customers to the admin user

const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/customer_management";

// Schemas
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  role: String,
  createdAt: Date,
});

const customerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  boxId: String,
  streetName: String,
  rechargeAmount: Number,
  status: String,
  lastPaymentDate: Date,
  paymentHistory: Array,
  createdAt: Date,
  updatedAt: Date,
});

const User = mongoose.model("User", userSchema);
const Customer = mongoose.model("Customer", customerSchema);

async function migrateData() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Find admin user (or create one)
    let admin = await User.findOne({ username: "admin" });

    if (!admin) {
      console.log("❌ Admin user not found!");
      console.log(
        "Please create an admin user first by registering with username 'admin'"
      );
      process.exit(1);
    }

    console.log(`✅ Found admin user: ${admin.name} (${admin.username})\n`);

    // Find customers without userId
    const customersWithoutUserId = await Customer.find({
      $or: [{ userId: { $exists: false } }, { userId: null }],
    });

    console.log(
      `📊 Found ${customersWithoutUserId.length} customers without userId\n`
    );

    if (customersWithoutUserId.length === 0) {
      console.log("✅ All customers already have userId assigned!");
      console.log("No migration needed.\n");
    } else {
      console.log("🔄 Migrating customers to admin user...\n");

      const result = await Customer.updateMany(
        {
          $or: [{ userId: { $exists: false } }, { userId: null }],
        },
        { $set: { userId: admin._id } }
      );

      console.log(`✅ Migration complete!`);
      console.log(`   Modified ${result.modifiedCount} customers\n`);
      console.log(
        `📋 All existing customers are now assigned to: ${admin.name}\n`
      );
    }

    // Show summary
    const totalCustomers = await Customer.countDocuments();
    const customersWithUserId = await Customer.countDocuments({
      userId: { $exists: true, $ne: null },
    });

    console.log("📊 Database Summary:");
    console.log(`   Total Customers: ${totalCustomers}`);
    console.log(`   With userId: ${customersWithUserId}`);
    console.log(`   Without userId: ${totalCustomers - customersWithUserId}\n`);

    if (customersWithUserId === totalCustomers) {
      console.log("✅ All customers have userId! You're good to go!\n");
    }

    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  } catch (error) {
    console.error("❌ Migration error:", error);
    process.exit(1);
  }
}

console.log("═══════════════════════════════════════════════════");
console.log("  Customer Data Migration Script");
console.log("  Assigns existing customers to admin user");
console.log("═══════════════════════════════════════════════════\n");

migrateData();
