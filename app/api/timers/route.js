import { connectDB } from "../../../lib/mongoose";
import BossTimer from "../../../models/BossTimer";
import { auth } from "@/app/auth";

// ✅ POST - 타이머 저장
export async function POST(req) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "로그인이 필요합니다." }), { status: 401 });
    }

    const data = await req.json();
    const { gameName, bossName, location, respawnTimeHours, respawnTimeMinutes, killTime, nextSpawnTime } = data;

    if (!gameName || !bossName || (!respawnTimeHours && !respawnTimeMinutes)) {
      return new Response(JSON.stringify({ error: "⚠️ 게임 이름, 보스 이름, 리젠 시간(시간 또는 분) 은 필수 입력 항목입니다!" }), { status: 400 });
    }

    const newTimer = new BossTimer({
      userId: session.user.id,
      gameName,
      bossName,
      location,
      respawnTimeHours,
      respawnTimeMinutes,
      killTime,
      nextSpawnTime,
    });

    await newTimer.save();

    return new Response(JSON.stringify({ message: "타이머가 성공적으로 저장되었습니다.", timer: newTimer }), { status: 201 });
  } catch (error) {
    console.error("❌ 타이머 저장 오류:", error);
    return new Response(JSON.stringify({ error: "서버 오류 발생" }), { status: 500 });
  }
}

// ✅ GET - 로그인한 유저의 타이머 조회
export async function GET() {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "로그인이 필요합니다." }), { status: 401 });
    }

    // ✅ 로그인한 유저의 타이머만 조회
    const timers = await BossTimer.find({ userId: session.user.id });

    return new Response(JSON.stringify(timers), { status: 200 });
  } catch (error) {
    console.error("❌ 타이머 조회 오류:", error);
    return new Response(JSON.stringify({ error: "서버 오류 발생" }), { status: 500 });
  }
}

export async function PATCH(req) {
  const { timerId, updates } = await req.json();
  await connectDB();
  const timer = await BossTimer.findByIdAndUpdate(timerId, updates, { new: true });
  if (!timer) return new Response("타이머 없음", { status: 404 });
  return new Response(JSON.stringify({ message: "업데이트 성공", timer }), { status: 200 });
}

export async function DELETE(req) {
  const { timerId } = await req.json();
  await connectDB();
  await BossTimer.findByIdAndDelete(timerId);
  return new Response(JSON.stringify({ message: "삭제 성공" }), { status: 200 });
}

