import { useState, useEffect } from "react";

export default function TimerItem({ timer, handleKill, toggleEditMode, removeTimer, updateTimer }) {
  const [killTimeInput, setKillTimeInput] = useState("");

  // 현재 시간 및 남은 시간 계산
  const now = new Date().getTime();
  const nextSpawnTime = timer.nextSpawnTime ? new Date(timer.nextSpawnTime).getTime() : null;
  const timeRemainingMs = nextSpawnTime ? nextSpawnTime - now : null;
  const timeRemainingMin = timeRemainingMs ? Math.floor(timeRemainingMs / (1000 * 60)) : null;

  useEffect(() => {
    if (updateTimer && timeRemainingMs !== null && timeRemainingMs <= 0) {
      updateTimer(timer.id, "status", "젠 완료");
    }
  }, [timeRemainingMs, timer.id, updateTimer]);

  const handleKillClick = () => {
    if (!confirm("처치하시겠습니까?")) return;

    const now = new Date();
    const respawnTimeHours = parseInt(timer.respawnTimeHours || 0, 10);
    const respawnTimeMinutes = parseInt(timer.respawnTimeMinutes || 0, 10);
    const respawnTimeMs = (respawnTimeHours * 60 * 60 * 1000) + (respawnTimeMinutes * 60 * 1000);
    const nextSpawnTime = new Date(now.getTime() + respawnTimeMs);

    updateTimer(timer.id, "killTime", now.toISOString());
    updateTimer(timer.id, "nextSpawnTime", nextSpawnTime.toISOString());
  };

  const handleEditClick = () => {
    if (!confirm("수정하시겠습니까?")) return;
    toggleEditMode(timer.id);
  };

  const handleDeleteClick = () => {
    if (!confirm("삭제하시겠습니까?")) return;
    removeTimer(timer.id);
  };

  const handleSave = () => {
    if (!killTimeInput) {
      alert("처치 시간을 입력해주세요!");
      return;
    }

    // HH:mm 형식 검증
    const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(killTimeInput)) {
      alert("올바른 형식으로 입력해주세요 (예: 18:30)");
      return;
    }

    // 현재 날짜 가져오기
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD 형식
    const [hour, minute] = killTimeInput.split(":").map(val => parseInt(val, 10));

    // ✅ 한국 시간(KST) 기준으로 저장하도록 수정
    const newKillTime = new Date();
    newKillTime.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
    newKillTime.setHours(hour, minute, 0, 0);

    console.log("✅ 생성된 KillTime 값:", newKillTime.toISOString());

    if (isNaN(newKillTime.getTime())) {
      console.error("❌ 오류 발생: newKillTime이 유효하지 않음!");
      return;
    }

    // 리젠 시간 변환 (시간 + 분)
    const respawnTimeHours = parseInt(timer.respawnTimeHours || 0, 10);
    const respawnTimeMinutes = parseInt(timer.respawnTimeMinutes || 0, 10);
    const respawnTimeMs = (respawnTimeHours * 60 * 60 * 1000) + (respawnTimeMinutes * 60 * 1000);

    // ✅ 다음 젠 시간 계산
    const nextSpawnTime = new Date(newKillTime.getTime() + respawnTimeMs);

    console.log("⏳ 다음 젠 시간:", nextSpawnTime.toISOString());

    // ✅ 업데이트 (killTime 반영)
    updateTimer(timer.id, "killTime", newKillTime.toISOString());
    updateTimer(timer.id, "nextSpawnTime", nextSpawnTime.toISOString());

    toggleEditMode(timer.id);
  };

  return (
    <div className="flex flex-col bg-gray-100 p-3 mb-2 rounded shadow">
      <p><strong>게임:</strong> {timer.gameName} | <strong>보스:</strong> {timer.bossName}</p>
      <p><strong>위치:</strong> {timer.location || "위치 없음"}</p>

      <p>
        <strong>리젠:</strong> 
        {timer.respawnTimeHours ? ` ${timer.respawnTimeHours}시간` : ""} 
        {timer.respawnTimeMinutes ? ` ${timer.respawnTimeMinutes}분` : ""}
      </p>

      {/* ✅ "젠 완료" 상태가 아닐 때만 "⚠️ 곧 등장합니다!" 표시 */}
      {timer.status !== "젠 완료" && timeRemainingMs !== null && timeRemainingMs <= 300000 && (
        <p className="text-red-500 font-bold">⚠️ 곧 등장합니다!</p>
      )}

      <p>
        <strong>처치 시간:</strong> 
        {timer.killTime && timer.killTime !== "null"
          ? new Date(timer.killTime).toLocaleString("ko-KR")
          : <span className="text-red-500">처치 중 (업데이트 확인 필요)</span>}
      </p>

      <p>
        <strong>다음 젠:</strong> 
        {timer.nextSpawnTime ? new Date(timer.nextSpawnTime).toLocaleString("ko-KR") : "처치 후 표시"}
        {timer.status === "젠 완료" && (
          <span style={{ color: "red", fontWeight: "bold", marginLeft: "8px" }}>⚠️ 젠 완료!</span>
        )}
      </p>

      {timer.isEditing ? (
        <div className="flex flex-col gap-2">
          <input
            type="time"
            placeholder="처치시간을 수정해주세요 (예: 18:30)"
            value={killTimeInput}
            onChange={(e) => setKillTimeInput(e.target.value)}
            className="border p-2 rounded"
          />
          <button onClick={handleSave} className="bg-green-500 text-white px-3 py-1 rounded">저장</button>
          <button onClick={() => toggleEditMode(timer.id)} className="bg-red-500 text-white px-3 py-1 rounded">취소</button>
        </div>
      ) : (
        <div className="flex gap-2 mt-2">
          <button onClick={handleKillClick} className="bg-green-500 text-white px-3 py-1 rounded">처치</button>
          <button onClick={handleEditClick} className="bg-yellow-500 text-white px-3 py-1 rounded">수정</button>
          <button onClick={handleDeleteClick} className="text-red-500 font-bold">X</button>
        </div>
      )}
    </div>
  );
}
