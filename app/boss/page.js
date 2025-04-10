"use client";

import { useState, useEffect } from "react";
import TimerForm from "./components/TimerForm";
import BossGuide from "./components/BossGuide";
import GroupModal from "./components/GroupModal/GroupModal";
import EditModal from "./components/GroupModal/EditModal";
import SearchFilter from "./components/SearchFilter";
import GroupTimerCard from "./components/GroupModal/GroupTimerCard";
import NextSpawnBoss from "./components/NextSpawnBoss";
import { requestNotificationPermission, scheduleNotification } from "./components/GroupModal/useNotification";

export default function BossPage() {
  const [timers, setTimers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupedTimers, setGroupedTimers] = useState({});
  const [editingTimer, setEditingTimer] = useState(null);
  const [filteredTimers, setFilteredTimers] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTimers = async () => {
    try {
      const res = await fetch("/api/timers", { cache: "no-store" });
      const data = await res.json();
      if (res.ok) setTimers(data);
    } catch (err) {
      console.error("❌ 서버 요청 오류:", err);
    }
  };

  useEffect(() => {
    fetchTimers();
  }, []);

  // ✅ 타이머 실시간 상태 업데이트 (젠 완료 / 곧 등장)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const updated = timers.map((timer) => {
        if (!timer.nextSpawnTime || timer.nextSpawnTime === "젠 완료") return timer;
        const next = new Date(timer.nextSpawnTime).getTime();
        const remaining = next - now;
        if (remaining <= 0) return { ...timer, status: "젠 완료", isUpcoming: false };
        if (remaining <= 5 * 60 * 1000) return { ...timer, isUpcoming: true, status: null };
        return { ...timer, isUpcoming: false, status: null };
      });
      setTimers(updated);
    }, 1000);
    return () => clearInterval(interval);
  }, [timers]);

  // ✅ 검색된 보스 모달 실시간 업데이트
  useEffect(() => {
    if (!searchResult) return;
    const interval = setInterval(() => {
      const latest = timers.find(t => t._id === searchResult._id);
      if (!latest) return;

      const now = new Date().getTime();
      const nextTime = new Date(latest.nextSpawnTime).getTime();
      const timeRemaining = nextTime - now;

      let updatedStatus = null;
      let isUpcoming = false;
      if (timeRemaining <= 0) updatedStatus = "젠 완료";
      else if (timeRemaining <= 5 * 60 * 1000) isUpcoming = true;

      setSearchResult({
        ...latest,
        status: updatedStatus,
        isUpcoming,
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [searchResult, timers]);

  useEffect(() => {
    const groupMap = timers.reduce((groups, timer) => {
      const gameName = timer.gameName || "기타 게임";
      if (!groups[gameName]) groups[gameName] = [];
      groups[gameName].push(timer);
      return groups;
    }, {});
    setGroupedTimers(groupMap);
  }, [timers]);

  const addTimer = async (form) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/timers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) await fetchTimers();
    } catch (err) {
      console.error("❌ 저장 요청 실패:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      if (res.ok) {
        await fetchTimers();
        if (searchResult && searchResult._id === timer._id) {
          setSearchResult({
            ...timer,
            killTime: now.toISOString(),
            nextSpawnTime: nextSpawnTime.toISOString(),
            status: null,
          });
        }
        requestNotificationPermission();
        scheduleNotification(timer.bossName, nextSpawnTime.toISOString());
      }
    } catch (err) {
      console.error("❌ 처치 실패:", err);
    }
  };

  const removeTimer = async (timerId) => {
    try {
      const res = await fetch("/api/timers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timerId }),
      });
      if (res.ok) {
        await fetchTimers();
        if (searchResult && searchResult._id === timerId) {
          setSearchResult(null);
        }
      }
    } catch (err) {
      console.error("❌ 삭제 실패:", err);
    }
  };

  const saveEdit = async (timerId, newData) => {
    try {
      const res = await fetch("/api/timers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timerId, updates: newData }),
      });
      if (res.ok) {
        await fetchTimers();
        if (searchResult && searchResult._id === timerId) {
          setSearchResult((prev) => ({ ...prev, ...newData }));
        }
      }
    } catch (err) {
      console.error("❌ 수정 실패:", err);
    }
  };

  const openEditModal = (timer) => setEditingTimer(timer);

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-8 flex justify-center">
      <div className="w-[200px] hidden lg:block p-4">
        <div className="bg-gray-300 h-[600px] border border-gray-400">광고 자리</div>
      </div>

      <div className="w-full max-w-7xl p-6 bg-white">
        <BossGuide />
        <div className="mt-6">
          <SearchFilter timers={timers} setFiltered={setFilteredTimers} resetSearch={() => setFilteredTimers([])} />
        </div>

        <div className="flex gap-8 mt-8">
          <div className="flex-[0.7] bg-white p-6">
            <TimerForm addTimer={addTimer} />
          </div>

          <div className="flex-[0.3] bg-white p-6 ">
            <h2 className="text-xl font-bold mb-4">게임 그룹</h2>
            {Object.keys(groupedTimers).map((game) => (
              <div
                key={game}
                className="cursor-pointer p-3 bg-white border border-gray-300 mb-3 hover:bg-gray-100 transition"
                onClick={() => setSelectedGroup(game)}
              >
                {game}
              </div>
            ))}
            <NextSpawnBoss timers={timers} />

            <div className="mt-6 bg-black p-4 border border-green-500 rounded-lg max-h-[300px] overflow-auto w-full cursor-default">
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
                    className="mt-4 bg-green-700 text-black px-4 py-2 rounded hover:bg-green-600 cursor-pointer w-full"
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
                      className="font-mono text-[#00FF00] bg-black border border-green-500 p-3 mb-2 text-xl tracking-wider shadow-[0_0_6px_#00FF00] cursor-pointer hover:bg-green-900 transition"
                      onClick={() => setSearchResult(timer)}
                    >
                      🕒 {timer.bossName} ({timer.gameName})
                    </div>
                  ))}
                </>
              ) : (
                <p className="mt-4 text-green-400 font-mono text-center">검색 결과가 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-[200px] hidden lg:block p-4">
        <div className="bg-gray-300 h-[600px] border border-gray-400">광고 자리</div>
      </div>

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
