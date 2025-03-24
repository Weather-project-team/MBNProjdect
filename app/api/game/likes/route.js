import { auth } from "@/app/auth";
import { connectDB } from "@/lib/mongoose";
import { Game, Like } from "@/models/game";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connectDB();
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  const { id: userId } = session.user;
  const { gameId } = await request.json();

  if (!gameId || !userId) {
    return NextResponse.json(
      { success: false, message: "필수값 누락" },
      { status: 400 }
    );
  }

  try {
    const existingLike = await Like.findOne({ gameId, userId });
    let hasLiked;

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      await Game.findByIdAndUpdate(gameId, { $inc: { likeCount: -1 } });
      hasLiked = false;
    } else {
      await Like.create({ gameId, userId });
      await Game.findByIdAndUpdate(gameId, { $inc: { likeCount: +1 } });
      hasLiked = true;
    }

    const game = await Game.findById(gameId).lean();

    return NextResponse.json({
      success: true,
      likeCount: game.likeCount,
      hasLiked,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { success: false, message: "서버 에러", error: e.message },
      { status: 500 }
    );
  }
}
