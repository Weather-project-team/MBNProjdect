import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB(); // ✅ MongoDB 연결

  const { email, password } = await req.json();

  // ✅ 이메일 중복 확인
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "이미 존재하는 이메일입니다." }, { status: 400 });
  }

  // ✅ 비밀번호 해싱 후 저장
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });

  await newUser.save();
  return NextResponse.json({ message: "회원가입 성공!" }, { status: 201 });
}


// /api/auth/signup API로 POST 요청을 보내면, MongoDB에 유저가 저장됨