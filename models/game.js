import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true, min: 10 },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  viewCount: { type: Number, default: 0 }, // 조회수 추가
  likeCount: { type: Number, default: 0 }, // 추천수 추가
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 작성자 추가
});

const CategoriesSchema = new mongoose.Schema({
  slug: { type: String, require: true },
  gameTitle: { type: String, require: true },
  tag: { type: String, require: true },
});

const LikeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Like = mongoose.models.Like || mongoose.model("Like", LikeSchema);
const Game = mongoose.models.Game || mongoose.model("Game", GameSchema);
const Category =
  mongoose.models.Category || mongoose.model("Category", CategoriesSchema);

export { Game, Category, Like };
