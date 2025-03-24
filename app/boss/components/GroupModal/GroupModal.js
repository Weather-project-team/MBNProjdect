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
  const [filter, setFilter] = useState("all"); // ✅ 필터 추가
  const itemsPerPage = 25;

  // ✅ 필터 바뀌면 무조건 1페이지로 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // ✅ 그룹 보스만 추출
  const groupTimers = allTimers.filter(timer => timer.gameName === groupName);

  // ✅ 필터링 처리
  const now = new Date().getTime();
  const filteredTimers = groupTimers.filter((timer) => {
    const nextTime = new Date(timer.nextSpawnTime).getTime();
    const timeRemaining = nextTime - now;

    if (filter === "completed") return timer.status === "젠 완료";
    if (filter === "incomplete") return timer.status !== "젠 완료";
    if (filter === "under1h") return timer.status !== "젠 완료" && timeRemaining > 0 && timeRemaining <= 60 * 60 * 1000;
    return true; // 전체
  });

  // ✅ 젠 시간 기준 오름차순 정렬
  const sortedTimers = [...filteredTimers].sort((a, b) => {
    const aTime = a.nextSpawnTime && a.nextSpawnTime !== '젠 완료'
      ? new Date(a.nextSpawnTime).getTime()
      : Infinity;
    const bTime = b.nextSpawnTime && b.nextSpawnTime !== '젠 완료'
      ? new Date(b.nextSpawnTime).getTime()
      : Infinity;
    return aTime - bTime;
  });

  // ✅ 페이지네이션
  const totalPages = Math.ceil(sortedTimers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedTimers.slice(startIndex, endIndex);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[1200px] max-h-[85vh] overflow-y-auto relative">
        <h2 className="text-xl font-bold mb-4">{groupName} - 보스 리스트</h2>
        <button onClick={onClose} className="absolute top-4 right-6 text-xl font-bold">X</button>

        {/* ✅ 필터 버튼 영역 */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setFilter("all")} className={`p-2 rounded ${filter === 'all' ? 'bg-blue-400 text-white' : 'bg-gray-300'}`}>전체 보기</button>
          <button onClick={() => setFilter("completed")} className={`p-2 rounded ${filter === 'completed' ? 'bg-blue-400 text-white' : 'bg-green-300'}`}>젠 완료</button>
          <button onClick={() => setFilter("incomplete")} className={`p-2 rounded ${filter === 'incomplete' ? 'bg-blue-400 text-white' : 'bg-yellow-300'}`}>미완료</button>
          <button onClick={() => setFilter("under1h")} className={`p-2 rounded ${filter === 'under1h' ? 'bg-blue-400 text-white' : 'bg-red-300'}`}>1시간 이내</button>
        </div>

        {/* ✅ 카드 렌더 */}
        {currentItems.length > 0 ? (
          <div className="grid grid-cols-5 gap-4">
            {currentItems.map((timer) => (
              <GroupTimerCard
                key={timer._id}
                timer={timer}
                handleKill={handleKill}
                removeTimer={removeTimer}
                updateTimer={updateTimer}
                saveEdit={saveEdit}
                onEdit={onEdit}
              />
            ))}
          </div>
        ) : (
          <p>등록된 보스가 없습니다.</p>
        )}

        {/* ✅ 페이지네이션 */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            goToPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
