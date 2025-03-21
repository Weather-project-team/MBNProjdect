"use client";
import { useState, useEffect } from "react";
import TimerForm from "./components/TimerForm";
import BossGuide from "./components/BossGuide";
import GroupModal from "./components/GroupModal/GroupModal";
import EditModal from "./components/GroupModal/EditModal";
import SearchFilter from "./components/SearchFilter";
import GroupTimerCard from "./components/GroupModal/GroupTimerCard";

export default function BossPage() {
  const [timers, setTimers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupedTimers, setGroupedTimers] = useState({});
  const [editingTimer, setEditingTimer] = useState(null);
  const [filteredTimers, setFilteredTimers] = useState([]);
  const [searchResult, setSearchResult] = useState(null); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ 서버에서 타이머 가져오기 (중복 방지)
  const fetchTimers = async () => {
    try {
      const res = await fetch("/api/timers", { cache: "no-store" });
      const data = await res.json();
      if (res.ok) {
        console.log("✅ [fetchTimers] 서버에서 가져온 타이머:", data);
        setTimers(data);
      } else {
        console.error("❌ 타이머 불러오기 실패:", data.error);
      }
    } catch (err) {
      console.error("❌ 서버 요청 오류:", err);
    }
  };

  useEffect(() => { fetchTimers(); }, []);

  // ✅ 실시간 상태 체크 (젠 완료, 곧 등장), 정렬
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const updatedTimers = timers.map((timer) => {
        if (timer.nextSpawnTime && timer.nextSpawnTime !== "젠 완료") {
          const nextTime = new Date(timer.nextSpawnTime).getTime();
          const timeRemaining = nextTime - now;
          if (timeRemaining <= 0) return { ...timer, status: "젠 완료", isUpcoming: false };
          else if (timeRemaining <= 5 * 60 * 1000) return { ...timer, isUpcoming: true, status: null };
          else return { ...timer, isUpcoming: false, status: null };
        }
        return timer;
      });

      const sorted = [...updatedTimers].sort((a, b) => {
        const aTime = (a.nextSpawnTime && a.nextSpawnTime !== "젠 완료") ? new Date(a.nextSpawnTime).getTime() : Infinity;
        const bTime = (b.nextSpawnTime && b.nextSpawnTime !== "젠 완료") ? new Date(b.nextSpawnTime).getTime() : Infinity;
        return aTime - bTime;
      });

      setTimers(sorted);
    }, 10000);

    return () => clearInterval(interval);
  }, [timers]);

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

  // ✅ 추가
  const addTimer = async (form) => {
    if (isSubmitting) return;  // ✅ 중복 호출 방지
    setIsSubmitting(true);
  
    try {
      const res = await fetch("/api/timers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
  
      const data = await res.json();
      if (res.ok) {
        console.log("✅ DB 저장 성공");
        await fetchTimers();  // ✅ 저장 성공 후만 새로고침
      } else {
        console.error("❌ DB 저장 실패:", data.error);
      }
    } catch (err) {
      console.error("❌ 저장 요청 실패:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ 처치
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
          updates: { killTime: now.toISOString(), nextSpawnTime: nextSpawnTime.toISOString() },
        }),
      });
      if (res.ok) await fetchTimers();
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
        console.log("✅ 삭제 성공, 다시 fetchTimers");
        await fetchTimers();
      }
    } catch (err) {
      console.error("❌ 삭제 실패:", err);
    }
  };

  // ✅ 수정 저장
  const saveEdit = async (timerId, newData) => {
    try {
      const res = await fetch("/api/timers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timerId, updates: newData }),
      });
      if (res.ok) await fetchTimers();
    } catch (err) {
      console.error("❌ 수정 실패:", err);
    }
  };

  // ✅ 수정 모달 열기
  const openEditModal = (timer) => { setEditingTimer(timer); };

  // ✅ 선택 그룹 눌렀을 때 콘솔 확인
  useEffect(() => {
    if (selectedGroup) {
      const filtered = timers.filter(timer => 
        timer.gameName && 
        timer.gameName.trim().toLowerCase() === selectedGroup.trim().toLowerCase()
      )      
    }
  }, [selectedGroup, timers]);

  return (
    <div className="flex justify-center bg-gray-50 min-h-screen">
      {/* 좌측 광고 */}
      <div className="w-[200px] hidden lg:block p-4">
        <div className="bg-gray-300 h-[600px] rounded">광고 자리</div>
      </div>

      {/* 메인 */}
      <div className="w-full max-w-6xl p-6">
        <BossGuide />
        <SearchFilter
          timers={timers}
          setFiltered={setFilteredTimers}
          resetSearch={() => setFilteredTimers([])}  
        />
        <div className="flex gap-6 mt-6">
          <div className="flex-[0.7] bg-white p-6 rounded shadow">
            <TimerForm addTimer={addTimer} />
            {/* ✅ 검색 결과 영역 */}
            <div className="mt-6">
              {searchResult ? (
                <>
                  <GroupTimerCard
                    timer={searchResult}
                    handleKill={handleKill}
                    removeTimer={removeTimer}
                    saveEdit={saveEdit}
                    onEdit={openEditModal}
                  />
                  <button
                    className="mt-4 bg-gray-300 text-black px-4 py-2 rounded"
                    onClick={() => setSearchResult(null)}
                  >
                    🔙 뒤로가기
                  </button>
                </>
              ) : filteredTimers.length > 0 ? (
                <>
                  {filteredTimers.map((timer) => (
                    <div
                      key={timer._id}
                      className="p-2 border rounded mb-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => setSearchResult(timer)}
                    >
                      {timer.bossName} - {timer.gameName}
                    </div>
                  ))}
                </>
              ) : (
                <p className="mt-4 text-gray-500">검색 결과가 없습니다.</p>
              )}
            </div>
          </div>

          {/* 게임 그룹 */}
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

      {/* 우측 광고 */}
      <div className="w-[200px] hidden lg:block p-4">
        <div className="bg-gray-300 h-[600px] rounded">광고 자리</div>
      </div>

      {/* 그룹 모달 */}
      {selectedGroup && (
  <GroupModal
    key={selectedGroup}
    groupName={selectedGroup}
    allTimers={timers}  
    onClose={() => setSelectedGroup(null)}
    handleKill={handleKill}
    removeTimer={removeTimer}
    saveEdit={saveEdit}
    onEdit={openEditModal}
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
