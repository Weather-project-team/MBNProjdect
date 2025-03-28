// boss/components/GroupModal/useNotification.js

// ✅ 알림 권한 요청 함수
export const requestNotificationPermission = async () => {
    if (Notification.permission !== "granted") {
      await Notification.requestPermission();
    }
  };
  
  // ✅ 알림 예약 함수 (1분 전 기준)
  export const scheduleNotification = (bossName, spawnTime) => {
    const now = new Date();
    const target = new Date(spawnTime);
    const timeout = target - now - 60000;
  
    if (timeout > 0 && Notification.permission === "granted") {
      setTimeout(() => {
        new Notification(`⚠️ ${bossName}가 1분 후 등장합니다!`);
      }, timeout);
    }
  };
  