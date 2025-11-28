import mongoose from "mongoose";

// a hashed token each times someone connects. Can be labeled as Expired if someone logged out
const lastConnectionsSchema = new mongoose.Schema({
  token: { type: String },
  expired : { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('LastConnection', lastConnectionsSchema);