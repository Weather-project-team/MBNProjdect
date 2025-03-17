import mongoose from "mongoose";

// ✅ User 스키마 정의
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // 해싱된 비밀번호 저장
  name: { type: String, default: "" }, // 닉네임
  phone: { type: String, default: "" }, // 전화번호
  address: { type: String, default: "" }, // 주소
  
}, { timestamps: true }); // createdAt, updatedAt 자동 생성

// ✅ 모델 생성 (이미 존재하면 기존 모델 사용)
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;