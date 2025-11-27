import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: String,
  email: { type: String, unique: true},
  password: String,
  role: { type: String, enum: ['user', 'admin'] },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);