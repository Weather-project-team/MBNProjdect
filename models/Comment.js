import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: true, min: 3 },
  createdAt: { type: Date, default: Date.now },
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  // 🔺 신고 관련
  reportCount: { type: Number, default: 0 },
  isBlinded: { type: Boolean, default: false },
  blindedAt: { type: Date },

  // 🗑️ 삭제 처리
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },

  // 📝 수정 이력
  isEdited: { type: Boolean, default: false },
  editedAt: { type: Date },
  previousVersions: [
    {
      content: { type: String },
      editedAt: { type: Date },
    },
  ],
});

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", CommentSchema);

export { Comment };
