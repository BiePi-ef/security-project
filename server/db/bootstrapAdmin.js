import User from "../models/user.js";
import crypt from "../services/hash.js";

export async function bootstrapAdmin() {
  const admins = await User.countDocuments({ role: "admin" });

  if (admins > 0) {
    console.log("✅ Admin already exists — skipping bootstrap");
    return;
  }

  console.log("🚨 No admin found — creating bootstrap admin");

  const admin = new User({
    userName: process.env.BOOTSTRAP_ADMIN_USERNAME || "default",
    email: process.env.BOOTSTRAP_ADMIN_EMAIL,
    password: crypt(process.env.BOOTSTRAP_ADMIN_PASSWORD),
    role: 'admin'
  });

  await admin.save();
  console.log("✅ Bootstrap admin created successfully");
}
