import mongoose from "mongoose";

// ✅ User 스키마 정의
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // 중복 불가 이메일
  password: { type: String, required: true }, // 해싱된 비밀번호 저장
  name: { type: String, required: true, unique: true }, // 중복 불가 닉네임
  birthdate: { type: String, required: true }, // 생년월일 (YYYY-MM-DD)
  role: { type: String, enum: ["user", "manager", "admin"], default: "user" },
}, { timestamps: true }); // createdAt, updatedAt 자동 생성

// ✅ 모델 생성 (이미 존재하면 기존 모델 사용)
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
