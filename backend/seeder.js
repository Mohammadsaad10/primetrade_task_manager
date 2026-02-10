import "dotenv/config";
import User from "./src/models/user.model.js";
import connectDB from "./src/config/db.js";

// Connect to DB
connectDB();

const importData = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: "admin@primetrade.ai" });

    if (adminExists) {
      console.log("Admin already exists...");
      process.exit();
    }

    await User.create({
      username: "Super Admin",
      email: "admin@primetrade.ai",
      password: "adminpassword123",
      role: "admin",
    });

    console.log("✅ Admin Account Imported!");
    process.exit();
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    process.exit(1);
  }
};

importData();
