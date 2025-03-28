import { useState, useEffect } from 'react';
import GroupTimerCard from './GroupTimerCard';
import Pagination from './Pagination';

export default function GroupModal({
  groupName,
  allTimers = [],
  onClose,
  handleKill,
  removeTimer,
  updateTimer,
  saveEdit,
  onEdit
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [allNotiOn, setAllNotiOn] = useState(false); // ✅ 전체 알림 상태

  const itemsPerPage = 25;

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const groupTimers = allTimers.filter(timer => timer.gameName === groupName);

  const now = new Date().getTime();
  const filteredTimers = groupTimers.filter((timer) => {
    const nextTime = new Date(timer.nextSpawnTime).getTime();
    const timeRemaining = nextTime - now;

    if (filter === "completed") return timer.status === "젠 완료";
    if (filter === "incomplete") return timer.status !== "젠 완료";
    if (filter === "under1h") return timer.status !== "젠 완료" && timeRemaining > 0 && timeRemaining <= 60 * 60 * 1000;
    return true;
  });

  const sortedTimers = [...filteredTimers].sort((a, b) => {
    const aTime = a.nextSpawnTime && a.nextSpawnTime !== '젠 완료'
      ? new Date(a.nextSpawnTime).getTime()
      : Infinity;
    const bTime = b.nextSpawnTime && b.nextSpawnTime !== '젠 완료'
      ? new Date(b.nextSpawnTime).getTime()
      : Infinity;
    return aTime - bTime;
  });

  const totalPages = Math.ceil(sortedTimers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedTimers.slice(startIndex, endIndex);

  // ✅ 전체 알림 토글 함수
  const toggleAllNotifications = () => {
    const nextState = !allNotiOn;
    setAllNotiOn(nextState);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 border border-gray-300 rounded-md w-[1300px] max-h-[85vh] overflow-y-auto relative">
        <h2 className="text-2xl font-bold mb-6 border-b pb-3">{groupName} - 보스 리스트</h2>
        <button onClick={onClose} className="absolute top-4 right-6 text-2xl font-bold hover:text-red-500 transition">X</button>

        {/* ✅ 필터 & 전체 알림 토글 버튼 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <button onClick={() => setFilter("all")} className={`px-4 py-2 border rounded-sm ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}>전체 보기</button>
            <button onClick={() => setFilter("completed")} className={`px-4 py-2 border rounded-sm ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}>젠 완료</button>
            <button onClick={() => setFilter("incomplete")} className={`px-4 py-2 border rounded-sm ${filter === 'incomplete' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}>미완료</button>
            <button onClick={() => setFilter("under1h")} className={`px-4 py-2 border rounded-sm ${filter === 'under1h' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}>1시간 이내</button>
          </div>

          {/* ✅ 전체 알림 ON/OFF 토글 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-800">🔔 전체 알림</span>
            <input
              type="checkbox"
              checked={allNotiOn}
              onChange={toggleAllNotifications}
              className="accent-blue-500"
            />
          </div>
        </div>

        {/* ✅ 보스 카드 리스트 */}
        {currentItems.length > 0 ? (
          <div className="grid grid-cols-5 gap-6">
            {currentItems.map((timer) => (
              <GroupTimerCard
                key={timer._id}
                timer={timer}
                handleKill={handleKill}
                removeTimer={removeTimer}
                updateTimer={updateTimer}
                saveEdit={saveEdit}
                onEdit={onEdit}
                forceNoti={allNotiOn} // ✅ 전체 알림 토글 상태 전달
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">등록된 보스가 없습니다.</p>
        )}

        {/* ✅ 페이지네이션 */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              goToPage={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
