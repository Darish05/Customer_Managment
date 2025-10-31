// seedDatabase.js - Populate database with sample data
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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

// Sample data
const sampleCustomers = [
  // Main Street
  {
    name: "John Doe",
    boxId: "BOX001",
    streetName: "Main Street",
    rechargeAmount: 500,
    status: "paid",
    lastPaymentDate: new Date("2025-10-20"),
  },
  {
    name: "Jane Smith",
    boxId: "BOX002",
    streetName: "Main Street",
    rechargeAmount: 500,
    status: "unpaid",
  },
  {
    name: "Bob Johnson",
    boxId: "BOX003",
    streetName: "Main Street",
    rechargeAmount: 500,
    status: "paid",
    lastPaymentDate: new Date("2025-10-22"),
  },
  {
    name: "Alice Brown",
    boxId: "BOX004",
    streetName: "Main Street",
    rechargeAmount: 500,
    status: "unpaid",
  },
  {
    name: "Charlie Wilson",
    boxId: "BOX005",
    streetName: "Main Street",
    rechargeAmount: 500,
    status: "paid",
    lastPaymentDate: new Date("2025-10-21"),
  },
  {
    name: "Diana Prince",
    boxId: "BOX006",
    streetName: "Main Street",
    rechargeAmount: 500,
    status: "unpaid",
  },
  {
    name: "Edward Norton",
    boxId: "BOX007",
    streetName: "Main Street",
    rechargeAmount: 500,
    status: "paid",
    lastPaymentDate: new Date("2025-10-19"),
  },
  {
    name: "Fiona Green",
    boxId: "BOX008",
    streetName: "Main Street",
    rechargeAmount: 500,
    status: "paid",
    lastPaymentDate: new Date("2025-10-23"),
  },
  {
    name: "George Miller",
    boxId: "BOX009",
    streetName: "Main Street",
    rechargeAmount: 500,
    status: "unpaid",
  },
  {
    name: "Hannah Lee",
    boxId: "BOX010",
    streetName: "Main Street",
    rechargeAmount: 500,
    status: "paid",
    lastPaymentDate: new Date("2025-10-18"),
  },

  // Park Avenue
  {
    name: "David Lee",
    boxId: "BOX011",
    streetName: "Park Avenue",
    rechargeAmount: 500,
    status: "paid",
    lastPaymentDate: new Date("2025-10-19"),
  },
  {
    name: "Emma Davis",
    boxId: "BOX012",
    streetName: "Park Avenue",
    rechargeAmount: 500,
    status: "paid",
    lastPaymentDate: new Date("2025-10-23"),
  },
  {
    name: "Frank Miller",
    boxId: "BOX013",
    streetName: "Park Avenue",
    rechargeAmount: 500,
    status: "unpaid",
  },
  {
    name: "Grace Taylor",
    boxId: "BOX014",
    streetName: "Park Avenue",
    rechargeAmount: 500,
    status: "paid",
    lastPaymentDate: new Date("2025-10-21"),
  },
  {
    name: "Henry Anderson",
    boxId: "BOX015",
    streetName: "Park Avenue",
    rechargeAmount: 500,
    status: "paid",
    lastPaymentDate: new Date("2025-10-20"),
  },
  {
    name: "Isabel Thomas",
    boxId: "BOX016",
    streetName: "Park Avenue",
    rechargeAmount: 500,
    status: "unpaid",
  },
  {
    name: "Jack Robinson",
    boxId: "BOX017",
    streetName: "Park Avenue",
    rechargeAmount: 500,
    status: "paid",
    lastPaymentDate: new Date("2025-10-22"),
  },
  {
    name: "Karen White",
    boxId: "BOX018",
    streetName: "Park Avenue",
    rechargeAmount: 500,
    status: "paid",
    lastPaymentDate: new Date("2025-10-24"),
  },

  // Oak Drive
  {
    name: "Liam Harris",
    boxId: "BOX019",
    streetName: "Oak Drive",
    rechargeAmount: 500,
    status: "paid",
    lastPaymentDate: new Date("2025-10-20"),
  },
  {
    name: "Mia Martin",
    boxId: "BOX020",
    streetName: "Oak Drive",
    rechargeAmount: 500,
    status: "unpaid",
  },
  {
    name: "Noah Garcia",
    boxId: "BOX021",
    streetName: "Oak Drive",
    rechargeAmount: 500,
    status: "paid",
    lastPaymentDate: new Date("2025-10-19"),
  },
  {
    name: "Olivia Martinez",
    boxId: "BOX022",
    streetName: "Oak Drive",
    rechargeAmount: 500,
    status: "unpaid",
  },
  {
    name: "Paul Rodriguez",
    boxId: "BOX023",
    streetName: "Oak Drive",
    rechargeAmount: 500,
    status: "paid",
    lastPaymentDate: new Date("2025-10-21"),
  },
  {
    name: "Quinn Lopez",
    boxId: "BOX024",
    streetName: "Oak Drive",
    rechargeAmount: 500,
    status: "paid",
    lastPaymentDate: new Date("2025-10-23"),
  },
  {
    name: "Rachel Hernandez",
    boxId: "BOX025",
    streetName: "Oak Drive",
    rechargeAmount: 500,
    status: "unpaid",
  },
  {
    name: "Samuel Gonzalez",
    boxId: "BOX026",
    streetName: "Oak Drive",
    rechargeAmount: 500,
    status: "paid",
    lastPaymentDate: new Date("2025-10-22"),
  },

  // Maple Road
  {
    name: "Tina Wilson",
    boxId: "BOX027",
    streetName: "Maple Road",
    rechargeAmount: 500,
    status: "paid",
    lastPaymentDate: new Date("2025-10-20"),
  },
  {
    name: "Uma Patel",
    boxId: "BOX028",
    streetName: "Maple Road",
    rechargeAmount: 500,
    status: "paid",
    lastPaymentDate: new Date("2025-10-19"),
  },
  {
    name: "Victor Moore",
    boxId: "BOX029",
    streetName: "Maple Road",
    rechargeAmount: 500,
    status: "unpaid",
  },
  {
    name: "Wendy Taylor",
    boxId: "BOX030",
    streetName: "Maple Road",
    rechargeAmount: 500,
    status: "paid",
    lastPaymentDate: new Date("2025-10-21"),
  },
  {
    name: "Xavier Brown",
    boxId: "BOX031",
    streetName: "Maple Road",
    rechargeAmount: 500,
    status: "paid",
    lastPaymentDate: new Date("2025-10-23"),
  },
  {
    name: "Yara Ahmed",
    boxId: "BOX032",
    streetName: "Maple Road",
    rechargeAmount: 500,
    status: "unpaid",
  },
  {
    name: "Zack Chen",
    boxId: "BOX033",
    streetName: "Maple Road",
    rechargeAmount: 500,
    status: "paid",
    lastPaymentDate: new Date("2025-10-24"),
  },
];

async function seedDatabase() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Customer.deleteMany({});
    console.log("✅ Existing data cleared");

    // Create admin user
    console.log("👤 Creating admin user...");
    const hashedPassword = await bcrypt.hash("admin", 10);
    const adminUser = new User({
      username: "admin",
      password: hashedPassword,
      name: "Dad",
      role: "admin",
      createdAt: new Date(),
    });
    await adminUser.save();
    console.log("✅ Admin user created (username: admin, password: admin)");

    // Insert sample customers
    console.log("📦 Inserting sample customers...");
    const customers = sampleCustomers.map((c) => ({
      ...c,
      createdAt: new Date(),
      updatedAt: new Date(),
      paymentHistory: c.lastPaymentDate
        ? [
            {
              date: c.lastPaymentDate,
              amount: c.rechargeAmount,
              month: c.lastPaymentDate.toLocaleDateString("en-US", {
                month: "long",
              }),
              year: c.lastPaymentDate.getFullYear(),
            },
          ]
        : [],
    }));

    await Customer.insertMany(customers);
    console.log(`✅ Inserted ${customers.length} sample customers`);

    // Display statistics
    const stats = await Customer.aggregate([
      {
        $group: {
          _id: "$streetName",
          totalCustomers: { $sum: 1 },
          paidCount: { $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] } },
          unpaidCount: {
            $sum: { $cond: [{ $eq: ["$status", "unpaid"] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    console.log("\n📊 Database Statistics:");
    console.log("═══════════════════════════════════════════════");
    stats.forEach((street) => {
      console.log(`\n${street._id}:`);
      console.log(`  Total: ${street.totalCustomers} customers`);
      console.log(`  Paid: ${street.paidCount}`);
      console.log(`  Unpaid: ${street.unpaidCount}`);
    });
    console.log("\n═══════════════════════════════════════════════");
    console.log("\n✨ Database seeding completed successfully!");
    console.log("\n🔐 Login Credentials:");
    console.log("   Username: admin");
    console.log("   Password: admin");
    console.log("\n🚀 You can now start the server with: npm start");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run seeder
seedDatabase();
