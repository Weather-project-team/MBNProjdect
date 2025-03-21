import React from 'react';

export default function GroupTimerCard({
  timer,
  handleKill,
  removeTimer,
  onEdit, // ✅ BossPage에서 내려오는 수정 실행 함수
}) {
  // 날짜 포맷 함수 (월.일 시:분 형태로 변환)
  const formatDateTime = (iso) => {
    const date = new Date(iso);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}.${day} ${hours}:${minutes}`;
  };

      const now = new Date().getTime();
      const nextSpawn = (timer.nextSpawnTime && timer.nextSpawnTime !== '젠 완료')
      ? new Date(timer.nextSpawnTime).getTime()
      : null;
      const timeRemainingMs = nextSpawn ? nextSpawn - now : null;


  return (
    <div className="p-3 bg-white rounded-lg shadow border w-[220px] h-[210px] flex flex-col justify-between text-sm">
      <div className="space-y-1">
        <p className="font-bold truncate">{timer.bossName} <span className="text-gray-500">({timer.gameName})</span></p>
        <p>📍 위치: {timer.location || '없음'}</p>
        <p>⏳ 리젠: {timer.respawnTimeHours}시간 {timer.respawnTimeMinutes}분</p>
        <p>🗡 처치: {timer.killTime ? formatDateTime(timer.killTime) : "처치 중"}</p>
        <p>⏰ 다음 젠: {timer.nextSpawnTime ? formatDateTime(timer.nextSpawnTime) : "처치 후 표시"}</p>

        {/* 상태 표시 */}
        {timer.status === "젠 완료" && (
          <p className="text-red-500 font-bold mt-1">⚠️ 젠 완료!</p>
        )}
        {timeRemainingMs !== null && timeRemainingMs <= 300000 && timeRemainingMs > 0 && (
        <p className="text-red-500 font-bold">⚠️ 곧 등장!</p>)}
        </div>

      <div className="flex justify-between mt-3">
        {/* ✅ 처치 버튼 */}
        <button
          onClick={() => {
            if (confirm("처치하시겠습니까?")) {
              handleKill(timer._id);
              alert("✅ 처치 완료");
            }
          }}
          className="bg-green-500 text-white text-xs px-2 py-1 rounded"
        >
          처치
        </button>

        {/* ✅ 수정 버튼 - 수정 모달로 연결 */}
        <button
          onClick={() => {
            if (confirm("수정하시겠습니까?")) onEdit(timer);
          }}
          className="bg-yellow-500 text-white text-xs px-2 py-1 rounded"
        >
          수정
        </button>

        {/* ✅ 삭제 버튼 */}
        <button
          onClick={() => {
            if (confirm("삭제하시겠습니까?")) {
              removeTimer(timer._id);
              alert("✅ 삭제 완료");
            }
          }}
          className="bg-red-500 text-white text-xs px-2 py-1 rounded"
        >
          삭제
        </button>
      </div>
    </div>
  );
}
