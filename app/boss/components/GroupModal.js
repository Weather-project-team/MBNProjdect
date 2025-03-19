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
  const [editInputs, setEditInputs] = useState({});

  // ✅ 무한루프 방지용 젠 완료 처리
  useEffect(() => {
    timers?.forEach((timer) => {
      if (timer.status === "젠 완료") return;
      const now = new Date().getTime();
      const nextSpawnTime = timer.nextSpawnTime ? new Date(timer.nextSpawnTime).getTime() : null;
      const timeRemainingMs = nextSpawnTime ? nextSpawnTime - now : null;
      if (timeRemainingMs !== null && timeRemainingMs <= 0) {
        updateTimer(timer._id, "status", "젠 완료");
      }
    });
  }, [timers, updateTimer]);

  // ✅ 수정 저장 처리
  const handleManualSave = async (timer) => {
    if (!window.confirm("정말로 수정하시겠습니까?")) return;

    const inputs = editInputs[timer._id];
    if (!inputs) return alert("수정할 정보를 입력해주세요!");

    const {
      killTimeInput,
      gameName,
      bossName,
      location,
      respawnTimeHours,
      respawnTimeMinutes,
    } = inputs;

    if (!killTimeInput || !gameName || !bossName) {
      return alert("게임 이름, 보스 이름, 처치 시간을 모두 입력해주세요!");
    }

    const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(killTimeInput)) return alert("처치 시간 형식은 예: 18:30 입니다.");

    const today = new Date();
    const [hour, minute] = killTimeInput.split(":").map(Number);
    today.setHours(hour, minute, 0, 0);

    const respawnMs =
      (parseInt(respawnTimeHours || 0) * 60 * 60 * 1000) +
      (parseInt(respawnTimeMinutes || 0) * 60 * 1000);
    const nextSpawn = new Date(today.getTime() + respawnMs);

    await saveEdit(timer._id, {
      gameName,
      bossName,
      location,
      respawnTimeHours,
      respawnTimeMinutes,
      killTime: today.toISOString(),
      nextSpawnTime: nextSpawn.toISOString(),
    });

    alert("✅ 수정이 완료되었습니다!");
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
                {timer.isEditing ? (
                  <div className="space-y-3">
                    {/* ✅ 필드명 라벨 추가 */}
                    <div>
                      <label className="block text-sm font-semibold mb-1">게임 이름</label>
                      <input
                        type="text"
                        value={editInputs[timer._id]?.gameName ?? timer.gameName}
                        className="border p-2 rounded w-full"
                        onChange={(e) =>
                          setEditInputs((prev) => ({
                            ...prev,
                            [timer._id]: { ...prev[timer._id], gameName: e.target.value },
                          }))
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1">보스 이름</label>
                      <input
                        type="text"
                        value={editInputs[timer._id]?.bossName ?? timer.bossName}
                        className="border p-2 rounded w-full"
                        onChange={(e) =>
                          setEditInputs((prev) => ({
                            ...prev,
                            [timer._id]: { ...prev[timer._id], bossName: e.target.value },
                          }))
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1">위치</label>
                      <input
                        type="text"
                        value={editInputs[timer._id]?.location ?? timer.location}
                        className="border p-2 rounded w-full"
                        onChange={(e) =>
                          setEditInputs((prev) => ({
                            ...prev,
                            [timer._id]: { ...prev[timer._id], location: e.target.value },
                          }))
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1">리젠 시간 (시간)</label>
                      <input
                        type="number"
                        value={editInputs[timer._id]?.respawnTimeHours ?? timer.respawnTimeHours}
                        className="border p-2 rounded w-full"
                        onChange={(e) =>
                          setEditInputs((prev) => ({
                            ...prev,
                            [timer._id]: { ...prev[timer._id], respawnTimeHours: e.target.value },
                          }))
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1">리젠 시간 (분)</label>
                      <input
                        type="number"
                        value={editInputs[timer._id]?.respawnTimeMinutes ?? timer.respawnTimeMinutes}
                        className="border p-2 rounded w-full"
                        onChange={(e) =>
                          setEditInputs((prev) => ({
                            ...prev,
                            [timer._id]: { ...prev[timer._id], respawnTimeMinutes: e.target.value },
                          }))
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1">처치 시간 (예: 18:30)</label>
                      <input
                        type="time"
                        value={editInputs[timer._id]?.killTimeInput || ""}
                        className="border p-2 rounded w-full"
                        onChange={(e) =>
                          setEditInputs((prev) => ({
                            ...prev,
                            [timer._id]: { ...prev[timer._id], killTimeInput: e.target.value },
                          }))
                        }
                      />
                    </div>

                    <button
                      onClick={() => handleManualSave(timer)}
                      className="bg-blue-500 text-white px-3 py-1 rounded w-full"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => toggleEditMode(timer._id)}
                      className="bg-gray-300 text-black px-3 py-1 rounded w-full"
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <>
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

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => {
                          if (window.confirm("처치하시겠습니까?")) {
                            handleKill(timer._id);
                            alert("✅ 처치가 완료되었습니다!");
                          }
                        }}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        처치
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm("수정하시겠습니까?")) toggleEditMode(timer._id);
                        }}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm("삭제하시겠습니까?")) {
                            removeTimer(timer._id);
                            alert("✅ 삭제가 완료되었습니다!");
                          }
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        삭제
                      </button>
                    </div>
                  </>
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
