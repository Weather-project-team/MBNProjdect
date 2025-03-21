import { connectDB } from "@/lib/mongoose";
import { Category } from "@/models/game";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connectDB();
  console.log("디비 연결됨");
  try {
    const body = await request.json();
    console.log(" 받아온 데이터 = = = = = ", body);

    const { slug, gameTitle, tag } = body;
    if (!slug || !gameTitle || !tag) {
      console.log("필수값 누락");
      return NextResponse.json({ success: false }, { status: 400 });
    }

    console.log(" 모델, 스키마 확인", Category);
    if (!Category) {
      return NextResponse.json(
        { success: false, message: " Category 모델없음" },
        { status: 500 }
      );
    }

    const newCategory = new Category({
      slug,
      gameTitle,
      tag,
    });
    const savedCategory = await newCategory.save();
    console.log("카테고리 생성 성공", savedCategory);
    return NextResponse.json({ success: true, data: savedCategory });
  } catch (e) {
    console.error("에러 발생", e);
  }
}
