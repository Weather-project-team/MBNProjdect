import { connectDB } from "../../../lib/mongoose";
import BossTimer from "../../../models/BossTimer";
import { auth } from "@/app/api/auth/[...nextauth]/route"; 

export async function POST(req) {
  try {
    await connectDB(); // ✅ DB 연결

    // ✅ NextAuth 5에서는 auth()를 직접 호출하여 세션 가져오기
    const session = await auth();
    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "로그인이 필요합니다." }), { status: 401 });
    }

    const data = await req.json(); // 요청 데이터 파싱
    const { gameName, bossName, location, respawnTimeHours, respawnTimeMinutes, killTime, nextSpawnTime } = data;

    if (!gameName || !bossName || (!respawnTimeHours && !respawnTimeMinutes)) {
      return new Response(JSON.stringify({ error: "필수 입력값이 없습니다." }), { status: 400 });
    }

    // ✅ 타이머 저장
    const newTimer = new BossTimer({
      userId: session.user.id, // ✅ 로그인된 유저의 ID 저장
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
