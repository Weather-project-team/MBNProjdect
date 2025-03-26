import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: true, min: 3 },
  createdAt: { type: Date, default: Date.now },
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", CommentSchema);

export { Comment };
