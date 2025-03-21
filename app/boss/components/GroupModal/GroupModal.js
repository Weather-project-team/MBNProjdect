import { useState } from 'react';
import GroupTimerCard from './GroupTimerCard';
import Pagination from './Pagination'; // 페이지네이션 컴포넌트 추가로 불러온다고 가정

export default function GroupModal({ 
  groupName, 
  timers = [], 
  onClose, 
  handleKill, 
  removeTimer, 
  updateTimer, 
  saveEdit, 
  onEdit 
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // ✅ 젠 시간 기준 오름차순 정렬 (젠 완료거나 nextSpawnTime 없으면 뒤로)
  const sortedTimers = [...timers].sort((a, b) => {
    const aTime = a.nextSpawnTime && a.nextSpawnTime !== '젠 완료'
      ? new Date(a.nextSpawnTime).getTime()
      : Infinity;
    const bTime = b.nextSpawnTime && b.nextSpawnTime !== '젠 완료'
      ? new Date(b.nextSpawnTime).getTime()
      : Infinity;
    return aTime - bTime;
  });

  // ✅ 페이지네이션 적용
  const totalPages = Math.ceil(sortedTimers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedTimers.slice(startIndex, endIndex);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[1200px] max-h-[85vh] overflow-y-auto relative">
        <h2 className="text-xl font-bold mb-4">{groupName} - 보스 리스트</h2>
        <button onClick={onClose} className="absolute top-4 right-6 text-xl font-bold">X</button>

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

        {/* ✅ 페이지네이션 버튼 추가 */}
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
