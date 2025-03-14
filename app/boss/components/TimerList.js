import TimerItem from "./TimerItem";

export default function TimerList({ timers, handleKill, toggleEditMode, removeTimer, updateTimer }) {
  // ✅ "젠 완료"가 아닌 타이머만 정상적으로 정렬 (남은 시간 짧은 순)
  const sortedTimers = [...timers].filter(timer => timer.nextSpawnTime !== "젠 완료").sort((a, b) => {
    const timeA = a.nextSpawnTime ? new Date(a.nextSpawnTime).getTime() : Infinity;
    const timeB = b.nextSpawnTime ? new Date(b.nextSpawnTime).getTime() : Infinity;
    return timeA - timeB;
  });

  return (
    <div className="mt-6">
      {sortedTimers.length > 0 ? (
        sortedTimers.map((timer, index) => (
          <TimerItem
            key={timer.id || `${timer.bossName}-${Date.now()}`} 
            timer={timer}
            index={index}
            handleKill={handleKill}
            toggleEditMode={toggleEditMode}
            removeTimer={removeTimer}
            updateTimer={updateTimer}
          />
        ))
      ) : (
        <p className="text-gray-500 text-center">타이머가 없습니다. 새로운 타이머를 추가해주세요.</p>
      )}
    </div>
  );
}
