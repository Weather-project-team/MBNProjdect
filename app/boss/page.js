"use client";
import { useState, useEffect } from "react";
import TimerForm from "./components/TimerForm";
import BossGuide from "./components/BossGuide";
import GroupModal from "./components/GroupModal";

export default function BossPage() {
  const [timers, setTimers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupedTimers, setGroupedTimers] = useState({});

  // ✅ 서버에서 유저의 타이머 불러오기
  useEffect(() => {
    const fetchTimers = async () => {
      try {
        const res = await fetch("/api/timers", { method: "GET" });
        const data = await res.json();
        if (res.ok) {
          console.log("✅ 서버에서 불러온 타이머:", data);
          setTimers(data);
        } else {
          console.error("❌ 타이머 불러오기 실패:", data.error);
        }
      } catch (err) {
        console.error("❌ 서버 요청 오류:", err);
      }
    };
    fetchTimers();
  }, []);

  // ✅ 그룹화 effect
  useEffect(() => {
    const groupMap = timers.reduce((groups, timer) => {
      const gameName = timer.gameName || "기타 게임";
      if (!groups[gameName]) groups[gameName] = [];
      groups[gameName].push(timer);
      return groups;
    }, {});
    setGroupedTimers(groupMap);
  }, [timers]);

  // ✅ 타이머 추가
  const addTimer = async (form) => {
    let nextSpawnTime = form.nextSpawnTime || null;
    const newTimer = {
      ...form,
      killTime: form.killTime ? new Date(form.killTime).toISOString() : null,
      nextSpawnTime,
      respawnTimeHours: form.respawnTimeHours || "0",
      respawnTimeMinutes: form.respawnTimeMinutes || "0",
      isEditing: false,
    };

    try {
      const res = await fetch("/api/timers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTimer),
      });
      const data = await res.json();
      if (res.ok) {
        console.log("✅ DB 저장 성공:", data.timer);
        setTimers((prev) => [...prev, data.timer]);
      } else {
        console.error("❌ DB 저장 실패:", data.error);
      }
    } catch (err) {
      console.error("❌ 저장 요청 실패:", err);
    }
  };

  // ✅ 처치 기능
  const handleKill = async (timerId) => {
    const timer = timers.find((t) => t._id === timerId);
    if (!timer) return;

    const now = new Date();
    const respawnTimeMs =
      (parseInt(timer.respawnTimeHours || 0) * 60 * 60 * 1000) +
      (parseInt(timer.respawnTimeMinutes || 0) * 60 * 1000);
    const nextSpawnTime = new Date(now.getTime() + respawnTimeMs);

    try {
      const res = await fetch("/api/timers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timerId,
          updates: {
            killTime: now.toISOString(),
            nextSpawnTime: nextSpawnTime.toISOString(),
          },
        }),
      });
      if (res.ok) {
        console.log("✅ 처치 성공");
        updateTimer(timerId, "killTime", now.toISOString());
        updateTimer(timerId, "nextSpawnTime", nextSpawnTime.toISOString());
      }
    } catch (err) {
      console.error("❌ 처치 실패:", err);
    }
  };

  // ✅ 수정 모드 전환
  const toggleEditMode = (timerId) => {
    setTimers((prev) =>
      prev.map((timer) =>
        timer._id === timerId ? { ...timer, isEditing: !timer.isEditing } : timer
      )
    );
  };

  // ✅ 삭제
  const removeTimer = async (timerId) => {
    try {
      const res = await fetch("/api/timers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timerId }),
      });
      if (res.ok) {
        console.log("✅ 삭제 성공");
        // 타이머 삭제 후 필터링
        const updatedTimers = timers.filter((timer) => timer._id !== timerId);
        setTimers(updatedTimers);
  
        // ✅ 삭제 후 그룹이 비었는지 확인하고 모달 닫기
        const updatedGroup = updatedTimers.filter((timer) => timer.gameName === selectedGroup);
        if (updatedGroup.length === 0) {
          console.log("✅ 그룹이 비어서 모달 닫음");
          setSelectedGroup(null);
        }
      }
    } catch (err) {
      console.error("❌ 삭제 실패:", err);
    }
  };
  

  // ✅ 상태 업데이트
  const updateTimer = (timerId, field, value) => {
    setTimers((prev) =>
      prev.map((timer) => {
        if (timer._id !== timerId) return timer;
        if (field === "nextSpawnTime" && value === "젠 완료") {
          console.log(`⚠️ 보스 ${timer.bossName} 젠 완료!`);
          return { ...timer, nextSpawnTime: "젠 완료" };
        }
        return { ...timer, [field]: value };
      })
    );
    console.log(`🟢 업데이트됨 → ID: ${timerId}, ${field}: ${value}`);
  };

  // ✅ 수정 저장시 DB 반영
  const saveEdit = async (timerId, newData) => {
    try {
      const res = await fetch("/api/timers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timerId, updates: newData }),
      });
      if (res.ok) {
        console.log("✅ 수정 성공");
        Object.entries(newData).forEach(([key, value]) => {
          updateTimer(timerId, key, value);
        });
      }
    } catch (err) {
      console.error("❌ 수정 실패:", err);
    }
  };

  return (
    <div className="flex">
      {/* 왼쪽 메인 */}
      <div className="p-6 max-w-3xl w-3/4">
        <BossGuide />
        <TimerForm addTimer={addTimer} />
        {/* ✅ 더 이상 TimerList는 필요 없음 */}
      </div>

      {/* 오른쪽 게임 그룹 목록 */}
      <div className="w-1/4 p-4 bg-gray-100 rounded shadow">
        <h2 className="text-lg font-bold mb-4">게임 그룹</h2>
        {Object.keys(groupedTimers).map((game) => (
          <div
            key={game}
            className="cursor-pointer p-2 bg-white rounded mb-2 shadow hover:bg-blue-100"
            onClick={() => setSelectedGroup(game)}
          >
            {game}
          </div>
        ))}
      </div>

      {/* ✅ 그룹 클릭 시 모달 */}
      {selectedGroup && (
        <GroupModal
          groupName={selectedGroup}
          timers={groupedTimers[selectedGroup]}
          onClose={() => setSelectedGroup(null)}
          handleKill={handleKill}
          toggleEditMode={toggleEditMode}
          removeTimer={removeTimer}
          updateTimer={updateTimer}
          saveEdit={saveEdit}
        />
      )}
    </div>
  );
}
