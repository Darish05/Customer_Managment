// Quick database check script
const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/customer_management";

async function checkDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    const Customer = mongoose.model(
      "Customer",
      new mongoose.Schema({}, { strict: false })
    );
    const User = mongoose.model(
      "User",
      new mongoose.Schema({}, { strict: false })
    );

    const users = await User.find().select("username name role");
    const customers = await Customer.find().select(
      "name boxId streetName userId"
    );

    console.log("👥 USERS IN DATABASE:");
    console.log("═══════════════════════════════════════");
    if (users.length === 0) {
      console.log("❌ No users found! Please register a user first.\n");
    } else {
      users.forEach((user, index) => {
        console.log(
          `${index + 1}. ${user.name} (@${user.username}) - Role: ${user.role}`
        );
        console.log(`   User ID: ${user._id}\n`);
      });
    }

    console.log("\n📦 CUSTOMERS IN DATABASE:");
    console.log("═══════════════════════════════════════");
    if (customers.length === 0) {
      console.log("❌ No customers found! Add some customers first.\n");
    } else {
      console.log(`Total: ${customers.length} customers\n`);

      const withUserId = customers.filter((c) => c.userId);
      const withoutUserId = customers.filter((c) => !c.userId);

      console.log(`✅ With userId: ${withUserId.length}`);
      console.log(`❌ Without userId: ${withoutUserId.length}\n`);

      if (withoutUserId.length > 0) {
        console.log("⚠️  WARNING: Some customers don't have userId!");
        console.log("   Run: node migrateUserId.js\n");
      }

      // Show first 5 customers
      console.log("First 5 customers:");
      customers.slice(0, 5).forEach((c, i) => {
        console.log(`${i + 1}. ${c.name} (${c.boxId}) - ${c.streetName}`);
        console.log(`   userId: ${c.userId || "❌ MISSING"}\n`);
      });
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

checkDatabase();
