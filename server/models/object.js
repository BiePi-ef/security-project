import mongoose from "mongoose";

const descriptionsSchema = new mongoose.Schema({
  descripton: String,
  summary: String,
})

const statsSchema = new mongoose.Schema({
  strength: {type: Number, min: 0, max: 30, required: true},
  dexterity: {type: Number, min: 0, max: 30, required: true},
  intelligence: {type: Number, min: 0, max: 30, required: true},
  constitution: {type: Number, min: 0, max: 30, required: true},
  wisdom: {type: Number, min: 0, max: 30, required: true},
  charisma: {type: Number, min: 0, max: 30, required: true},
})

const othersSchema = new mongoose.Schema({
  name: String,
  descripton: String,
  content: String,
})

const optionsSchema = new mongoose.Schema({
  descriptions: descriptionsSchema,
  stats: statsSchema,
  others: [othersSchema]
})

const objectSchema = new mongoose.Schema({
  name: {type: String, required: true},
  category: {type: String}, // TDO : implement dynamique enum from bdd (type is a bd schema)
  options: optionsSchema, // either one or several option schemas
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  visibility: {type: [String], enum: ["Public", "Private"], required: true}, // public : everyone, private : author and admins 
  search_tags: [String],
  created_at: { type: Date, default: Date.now },
  last_updated_at: { type: [Date], default: [Date.now()] },
});

export default mongoose.model('Object', objectSchema);