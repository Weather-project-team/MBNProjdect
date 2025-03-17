import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true, min: 10 },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Game || mongoose.model("Game", GameSchema);
