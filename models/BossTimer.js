import mongoose from "mongoose";

const BossTimerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 유저 정보와 연결
  gameName: { type: String, required: true },
  bossName: { type: String, required: true },
  location: { type: String },
  respawnTimeHours: { type: Number, required: true },
  respawnTimeMinutes: { type: Number, required: true },
  killTime: { type: Date },
  nextSpawnTime: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.BossTimer || mongoose.model("BossTimer", BossTimerSchema);
