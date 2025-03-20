import { useState } from "react";

export default function TimerList({ groupedTimers, onGroupClick }) {
  const [openGroup, setOpenGroup] = useState(null); // ✅ 열려있는 그룹 상태

  // ✅ 그룹 클릭 시 열기 / 닫기
  const handleGroupClick = (gameName) => {
    setOpenGroup(prev => (prev === gameName ? null : gameName));
    onGroupClick(gameName); // 모달 띄우는 이벤트 전달
  };

  return (
    <div className="mt-6">
      {Object.keys(groupedTimers).length > 0 ? (
        Object.entries(groupedTimers).map(([gameName, group]) => (
          <div key={gameName} className="mb-6">
            {/* 🔥 그룹명 클릭 시 모달로 이동 */}
            <h2 
              className="text-lg font-bold text-gray-700 mb-3 cursor-pointer bg-gray-200 p-2 rounded"
              onClick={() => handleGroupClick(gameName)}
            >
              {gameName}
            </h2>
            <p className="text-sm text-gray-500">({group.length}개 등록됨)</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">타이머가 없습니다. 새로운 타이머를 추가해주세요.</p>
      )}
    </div>
  );
}
