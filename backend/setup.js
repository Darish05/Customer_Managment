const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = "mongodb://localhost:27017/customer_management";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: "admin" },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

async function setupAdmin() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("✅ Connected to MongoDB");

    // Check if admin exists
    const existingAdmin = await User.findOne({ username: "admin" });
    
    if (existingAdmin) {
      console.log("⚠️  Admin user already exists");
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin", 10);
    const admin = new User({
      username: "admin",
      password: hashedPassword,
      name: "Dad",
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin user created successfully");
    console.log("   Username: admin");
    console.log("   Password: admin");
    console.log("   (Change password after first login!)");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

setupAdmin();