import { auth } from "@/app/auth";
import { connectDB } from "@/lib/mongoose";
import { Game } from "@/models/game";

import { NextResponse } from "next/server"; // Next.js에서 Response 사용

export async function POST(request) {
  await connectDB();
  console.log("✅ MongoDB 연결 확인됨"); // 연결 성공 확인
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  const { name, email, id } = session.user;

  try {
    // 1️⃣ 요청 데이터 확인
    const body = await request.json();
    console.log("📥 받은 데이터:", body);

    // 2️⃣ 필수값 확인
    const { title, description, category } = body;
    if (!title || !description || !category) {
      console.log("❌ 필수값 누락됨");
      return NextResponse.json(
        { success: false, message: "필수값이 없습니다." },
        { status: 400 }
      );
    }

    // 4️⃣ 새로운 문서 생성
    const newGame = new Game({
      title,
      description,
      category,
      author: id,
    });
    console.log("📝 새로운 게임 객체 생성됨:", newGame);

    // 5️⃣ MongoDB 저장
    const savedGame = await newGame.save();
    console.log("✅ 게임 저장 성공:", savedGame);

    return NextResponse.json({ success: true, data: savedGame });
  } catch (e) {
    console.error("❌ 서버 내부 에러 발생:", e);
    return NextResponse.json(
      { success: false, message: e.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  await connectDB();
  try {
    const games = await Game.find({}).populate("author", "name"); // name 필드만 포함
    return NextResponse.json({ success: true, data: games });
  } catch (e) {
    console.error("❌ 서버 내부 에러 발생:", e);
    return NextResponse.json(
      { success: false, message: e.message },
      { status: 500 }
    );
  }
}
