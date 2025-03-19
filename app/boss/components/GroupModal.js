import { useState, useEffect } from "react";

export default function GroupModal({
  groupName,
  timers,
  onClose,
  handleKill,
  toggleEditMode,
  removeTimer,
  updateTimer,
  saveEdit,
}) {
  const [killInputs, setKillInputs] = useState({});

  // 남은 시간 계산 및 젠 완료 처리
  useEffect(() => {
    timers?.forEach((timer) => {
      const now = new Date().getTime();
      const nextSpawnTime = timer.nextSpawnTime ? new Date(timer.nextSpawnTime).getTime() : null;
      const timeRemainingMs = nextSpawnTime ? nextSpawnTime - now : null;

      if (timeRemainingMs !== null && timeRemainingMs <= 0) {
        updateTimer(timer._id, "status", "젠 완료");
      }
    });
  }, [timers, updateTimer]);

  const handleManualSave = async (timer) => {
    const timeStr = killInputs[timer._id];
    if (!timeStr) return alert("처치 시간을 입력해주세요 (예: 18:30)");

    const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(timeStr)) return alert("올바른 형식으로 입력해주세요 (예: 18:30)");

    const today = new Date();
    const [hour, minute] = timeStr.split(":").map(Number);
    today.setHours(hour, minute, 0, 0);

    const respawnMs =
      (parseInt(timer.respawnTimeHours || 0) * 60 * 60 * 1000) +
      (parseInt(timer.respawnTimeMinutes || 0) * 60 * 1000);
    const nextSpawn = new Date(today.getTime() + respawnMs);

    await saveEdit(timer._id, {
      killTime: today.toISOString(),
      nextSpawnTime: nextSpawn.toISOString(),
    });
    toggleEditMode(timer._id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[700px] max-h-[80vh] overflow-y-auto relative">
        <h2 className="text-xl font-bold mb-4">{groupName} - 보스 리스트</h2>
        <button onClick={onClose} className="absolute top-4 right-6 text-xl font-bold">X</button>

        {timers && timers.length > 0 ? (
          timers.map((timer) => {
            const now = new Date().getTime();
            const nextSpawnTime = timer.nextSpawnTime ? new Date(timer.nextSpawnTime).getTime() : null;
            const timeRemainingMs = nextSpawnTime ? nextSpawnTime - now : null;

            return (
              <div key={timer._id} className="p-3 border-b bg-gray-100 rounded mb-3">
                <p><strong>게임:</strong> {timer.gameName} | <strong>보스:</strong> {timer.bossName}</p>
                <p><strong>위치:</strong> {timer.location || "위치 없음"}</p>
                <p><strong>리젠:</strong> {timer.respawnTimeHours}시간 {timer.respawnTimeMinutes}분</p>

                {timer.status !== "젠 완료" && timeRemainingMs !== null && timeRemainingMs <= 300000 && (
                  <p className="text-red-500 font-bold">⚠️ 곧 등장합니다!</p>
                )}

                <p>
                  <strong>처치 시간:</strong>{" "}
                  {timer.killTime
                    ? new Date(timer.killTime).toLocaleString("ko-KR")
                    : <span className="text-red-500">처치 중 (업데이트 필요)</span>}
                </p>

                <p>
                  <strong>다음 젠:</strong>{" "}
                  {timer.nextSpawnTime && timer.nextSpawnTime !== "젠 완료"
                    ? new Date(timer.nextSpawnTime).toLocaleString("ko-KR")
                    : "처치 후 표시"}
                  {timer.status === "젠 완료" && (
                    <span style={{ color: "red", fontWeight: "bold", marginLeft: "8px" }}>⚠️ 젠 완료!</span>
                  )}
                </p>

                {timer.isEditing ? (
                  <div className="mt-2">
                    <input
                      type="time"
                      value={killInputs[timer._id] || ""}
                      onChange={(e) =>
                        setKillInputs((prev) => ({ ...prev, [timer._id]: e.target.value }))
                      }
                      className="border p-2 rounded mr-2"
                    />
                    <button
                      onClick={() => handleManualSave(timer)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => toggleEditMode(timer._id)}
                      className="ml-2 bg-gray-300 text-black px-3 py-1 rounded"
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleKill(timer._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      처치
                    </button>
                    <button
                      onClick={() => toggleEditMode(timer._id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => removeTimer(timer._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p>등록된 보스가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
