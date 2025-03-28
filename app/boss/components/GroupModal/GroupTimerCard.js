import React, { useEffect, useState } from 'react';
import NotificationToggle from "./NotificationToggle";
import { scheduleNotification, requestNotificationPermission } from "./useNotification";

export default function GroupTimerCard({
  timer,
  handleKill,
  removeTimer,
  onEdit,
  forceNoti
}) {
  const [isNotiOn, setIsNotiOn] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const localKey = `noti_${timer._id}`;

  // ⏪ localStorage에서 초기 상태 복원
  useEffect(() => {
    const saved = localStorage.getItem(localKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      setIsNotiOn(parsed.enabled);
      setIsManual(parsed.manual);
    }
  }, []);

  // ✅ forceNoti로 전체 알림 ON → 수동 설정은 유지
  useEffect(() => {
    if (forceNoti) {
      setIsNotiOn(true);
      setIsManual(false); // 전체 설정으로 ON
      localStorage.setItem(localKey, JSON.stringify({ enabled: true, manual: false }));

      if (timer.nextSpawnTime && timer.nextSpawnTime !== '젠 완료') {
        requestNotificationPermission();
        scheduleNotification(timer.bossName, timer.nextSpawnTime);
      }
    } else {
      // 전체 OFF일 때, 수동으로 켠 알림만 유지
      const saved = localStorage.getItem(localKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.manual) {
          setIsNotiOn(false);
          localStorage.setItem(localKey, JSON.stringify({ enabled: false, manual: false }));
        }
      }
    }
  }, [forceNoti]);

  // ✅ 개별 토글
  const handleToggleNotification = () => {
    const next = !isNotiOn;
    setIsNotiOn(next);
    setIsManual(true); // 수동 설정으로 간주

    localStorage.setItem(localKey, JSON.stringify({ enabled: next, manual: true }));

    if (next && timer.nextSpawnTime && timer.nextSpawnTime !== '젠 완료') {
      requestNotificationPermission();
      scheduleNotification(timer.bossName, timer.nextSpawnTime);
    }
  };

  // 날짜 포맷
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
    <div className="p-3 bg-white rounded-lg shadow border w-[220px] h-[230px] flex flex-col justify-between text-sm">
      <div className="space-y-1">
        <p className="font-bold truncate">{timer.bossName} <span className="text-gray-500">({timer.gameName})</span></p>
        <p>📍 위치: {timer.location || '없음'}</p>
        <p>⏳ 리젠: {timer.respawnTimeHours}시간 {timer.respawnTimeMinutes}분</p>
        <p>🗡 처치: {timer.killTime ? formatDateTime(timer.killTime) : "처치 중"}</p>
        <p>⏰ 다음 젠: {timer.nextSpawnTime ? formatDateTime(timer.nextSpawnTime) : "처치 후 표시"}</p>

        {timer.status === "젠 완료" && (
          <p className="text-red-500 font-bold mt-1">⚠️ 젠 완료!</p>
        )}
        {timeRemainingMs !== null && timeRemainingMs <= 300000 && timeRemainingMs > 0 && (
          <p className="text-red-500 font-bold">⚠️ 곧 등장!</p>
        )}

        {/* 🔔 알림 체크 라벨 추가 */}
        <NotificationToggle
          isEnabled={isNotiOn}
          onToggle={handleToggleNotification}
          label={`🔔 ${timer.bossName} 알림 받기`}
        />
      </div>

      <div className="flex justify-between mt-3">
        <button
          onClick={() => {
            if (confirm("처치하시겠습니까?")) {
              handleKill(timer._id);
            }
          }}
          className="bg-green-500 text-white text-xs px-2 py-1 rounded"
        >
          처치
        </button>

        <button
          onClick={() => {
            if (confirm("수정하시겠습니까?")) onEdit(timer);
          }}
          className="bg-yellow-500 text-white text-xs px-2 py-1 rounded"
        >
          수정
        </button>

        <button
          onClick={() => {
            if (confirm("삭제하시겠습니까?")) {
              removeTimer(timer._id);
              alert("✅ 삭제 완료");
              localStorage.removeItem(localKey);
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
