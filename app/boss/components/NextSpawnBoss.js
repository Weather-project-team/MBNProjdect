import { useState, useEffect } from "react";

export default function NextSpawnBoss({ timers }) {
  const [nextBoss, setNextBoss] = useState(null);

  useEffect(() => {
    const calculateNextBoss = () => {
      const now = new Date().getTime();
      const upcoming = timers
        .filter((timer) => timer.nextSpawnTime && timer.nextSpawnTime !== "젠 완료")
        .map((timer) => ({
          ...timer,
          timeRemaining: new Date(timer.nextSpawnTime).getTime() - now,
        }))
        .filter((timer) => timer.timeRemaining > 0)
        .sort((a, b) => a.timeRemaining - b.timeRemaining);

      setNextBoss(upcoming[0] || null);
    };

    // ✅ 처음 계산
    calculateNextBoss();

    // ✅ 1초마다 계산 (실시간)
    const interval = setInterval(() => {
      calculateNextBoss();
    }, 1000);

    return () => clearInterval(interval); // 언마운트 시 정리
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
