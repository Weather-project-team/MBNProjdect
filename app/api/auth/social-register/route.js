import { auth } from "@/app/auth";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await auth();

  if (!session || !session.user || !session.user.name || !session.user.kakaoId) {
    return NextResponse.json({ error: "인증되지 않은 사용자입니다." }, { status: 401 });
  }

  const { birthdate } = await req.json();
  if (!birthdate) {
    return NextResponse.json({ error: "생년월일을 입력해주세요." }, { status: 400 });
  }

  await connectDB();

  const name = session.user.name;
  const kakaoId = session.user.kakaoId;

  // ✅ 같은 kakaoId가 이미 등록되었는지 확인 (가장 정확함)
  const existing = await User.findOne({ provider: "kakao", providerId: kakaoId });
  if (existing) {
    return NextResponse.json({ error: "이미 등록된 사용자입니다." }, { status: 409 });
  }

  // ✅ 유저 등록
  const newUser = await User.create({
    name,
    birthdate,
    role: "user",
    provider: "kakao",
    providerId: kakaoId,
    profileImage: session.user.picture ?? null, // ❗ 나중에 프로필 이미지 구현할 수 있도록 임시 저장
  });

  return NextResponse.json({ message: "회원가입 완료",   user: {
    name: newUser.name,
    id: newUser._id,
    birthdate: newUser.birthdate,
    provider: newUser.provider, } });
}
