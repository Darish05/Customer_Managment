const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/customer_management";

// Schemas
const customerSchema = new mongoose.Schema({
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

const Customer = mongoose.model("Customer", customerSchema);

async function clearDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");
    console.log("🗑️  Deleting all sample customers...");

    const result = await Customer.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} customers from database`);

    console.log("✨ Database cleared successfully!");
    console.log("📝 The database is now empty and ready for real data.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

clearDatabase();
