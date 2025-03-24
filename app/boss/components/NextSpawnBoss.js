import { useMemo } from "react";

export default function NextSpawnBoss({ timers }) {
  // 🔥 가장 먼저 젠 되는 보스 계산
  const nextBoss = useMemo(() => {
    const now = new Date().getTime();
    const upcoming = timers
      .filter((timer) => timer.nextSpawnTime && timer.nextSpawnTime !== "젠 완료")
      .map((timer) => ({
        ...timer,
        timeRemaining: new Date(timer.nextSpawnTime).getTime() - now,
      }))
      .filter((timer) => timer.timeRemaining > 0)
      .sort((a, b) => a.timeRemaining - b.timeRemaining);

    return upcoming[0] || null;
  }, [timers]);

  return (
    <div className="mt-6 bg-yellow-100 p-4 rounded shadow">
      <h2 className="font-bold text-lg mb-2">⚠️ 가장 먼저 젠되는 보스</h2>
      {nextBoss ? (
        <div>
          🎮 <span className="font-semibold">{nextBoss.gameName}</span> - 🐲{" "}
          <span className="font-semibold">{nextBoss.bossName}</span>
          <br />
          ⏰ 젠까지{" "}
          <span className="text-red-500 font-bold">
            {Math.ceil(nextBoss.timeRemaining / 60000)}분
          </span>{" "}
          남음
        </div>
      ) : (
        <p>현재 곧 젠되는 보스가 없습니다.</p>
      )}
    </div>
  );
}
