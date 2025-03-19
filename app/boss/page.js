"use client";
import { useState, useEffect } from "react";
import TimerForm from "./components/TimerForm";
import BossGuide from "./components/BossGuide";
import GroupModal from "./components/GroupModal/GroupModal";
import EditModal from "./components/GroupModal/EditModal";

export default function BossPage() {
  const [timers, setTimers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupedTimers, setGroupedTimers] = useState({});
  const [editingTimer, setEditingTimer] = useState(null); // ✅ 수정 모달용 상태

  // ✅ 서버에서 유저의 타이머 불러오기
  useEffect(() => {
    const fetchTimers = async () => {
      try {
        const res = await fetch("/api/timers");
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

  // ✅ 그룹화 (게임명 기준)
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
    const newTimer = {
      ...form,
      killTime: form.killTime ? new Date(form.killTime).toISOString() : null,
      nextSpawnTime: form.nextSpawnTime || null,
      respawnTimeHours: form.respawnTimeHours || "0",
      respawnTimeMinutes: form.respawnTimeMinutes || "0",
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

  // ✅ 보스 처치 처리
  const handleKill = async (timerId) => {
    const timer = timers.find((t) => t._id === timerId);
    if (!timer) return;

    const now = new Date();
    const respawnMs =
      (parseInt(timer.respawnTimeHours || 0) * 60 * 60 * 1000) +
      (parseInt(timer.respawnTimeMinutes || 0) * 60 * 1000);
    const nextSpawnTime = new Date(now.getTime() + respawnMs);

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
        const updatedTimers = timers.filter((timer) => timer._id !== timerId);
        setTimers(updatedTimers);
        const updatedGroup = updatedTimers.filter((timer) => timer.gameName === selectedGroup);
        if (updatedGroup.length === 0) {
          console.log("✅ 그룹이 비어 모달 닫음");
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
          console.log(`⚠️ ${timer.bossName} 젠 완료!`);
          return { ...timer, nextSpawnTime: "젠 완료" };
        }
        return { ...timer, [field]: value };
      })
    );
    console.log(`🟢 업데이트 → ID: ${timerId}, ${field}: ${value}`);
  };

  // ✅ 수정 저장(DB 반영)
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

  // ✅ 수정 모달 열기
  const openEditModal = (timer) => {
    setEditingTimer(timer);
  };

  return (
    <div className="flex justify-center bg-gray-50 min-h-screen">
      {/* 좌측 광고 영역 */}
      <div className="w-[200px] hidden lg:block p-4">
        <div className="bg-gray-300 h-[600px] rounded">광고 자리</div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="w-full max-w-6xl p-6">
        <BossGuide />

        {/* 타이머 생성 폼과 그룹 */}
        <div className="flex gap-6 mt-6">
          <div className="flex-[0.7] bg-white p-6 rounded shadow">
            <TimerForm addTimer={addTimer} />
          </div>

          {/* 게임 그룹 리스트 */}
          <div className="flex-[0.3] bg-gray-100 p-4 rounded shadow h-fit">
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
        </div>
      </div>

      {/* 우측 광고 영역 */}
      <div className="w-[200px] hidden lg:block p-4">
        <div className="bg-gray-300 h-[600px] rounded">광고 자리</div>
      </div>

      {/* 그룹 클릭 시 모달 */}
      {selectedGroup && (
        <GroupModal
          groupName={selectedGroup}
          timers={groupedTimers[selectedGroup]}
          onClose={() => setSelectedGroup(null)}
          handleKill={handleKill}
          removeTimer={removeTimer}
          updateTimer={updateTimer}
          saveEdit={saveEdit}
          onEdit={openEditModal}  // ✅ 수정 버튼 누르면 모달 열림
        />
      )}

      {/* 수정 모달 */}
      {editingTimer && (
        <EditModal
          timer={editingTimer}
          onClose={() => setEditingTimer(null)}
          saveEdit={saveEdit}
        />
      )}
    </div>
  );
}
