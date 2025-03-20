import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB(); // ✅ MongoDB 연결

  const { email, password, name, birthdate } = await req.json();

  // ✅ 필수 입력값 확인
  if (!name || !email || !password || !birthdate) {
    return NextResponse.json({ error: "모든 필드를 입력해주세요." }, { status: 400 });
  }

  // ✅ 생년월일 유효성 체크 (YYYY-MM-DD 형식 검사)
  const birthdateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!birthdateRegex.test(birthdate)) {
    return NextResponse.json({ error: "올바른 생년월일 형식이 아닙니다." }, { status: 400 });
  }

  // ✅ 이메일 중복 확인
  const existingUserByEmail = await User.findOne({ email });
  if (existingUserByEmail) {
    return NextResponse.json({ error: "이미 존재하는 이메일입니다." }, { status: 400 });
  }

  // ✅ 닉네임 중복 확인
  const existingUserByName = await User.findOne({ name });
  if (existingUserByName) {
    return NextResponse.json({ error: "이미 존재하는 닉네임입니다." }, { status: 400 });
  }

  // ✅ 비밀번호 해싱 후 저장
  const hashedPassword = await bcrypt.hash(password, 10);

  // ✅ 새로운 유저 저장
  const newUser = new User({ email, password: hashedPassword, name, birthdate });
  await newUser.save();

  return NextResponse.json({ message: "회원가입 성공!" }, { status: 201 });
}
