import { useState, useEffect } from "react";
import debounce from "lodash.debounce";

export default function SearchFilter({ timers, setFiltered }) {
  const [searchText, setSearchText] = useState("");
  const [filterRespawn, setFilterRespawn] = useState("all");

  // ✅ 검색 & 필터 처리
  const handleFilter = () => {
    let result = [...timers];

    // ✅ 텍스트 검색
    if (searchText.trim()) {
      result = result.filter(
        (timer) =>
          timer.bossName.includes(searchText) ||
          timer.gameName.includes(searchText)
      );
    }

    // ✅ 리젠 시간 필터
    if (filterRespawn === "under1") {
      result = result.filter((timer) => parseInt(timer.respawnTimeHours) < 1);
    } else if (filterRespawn === "over1") {
      result = result.filter((timer) => parseInt(timer.respawnTimeHours) >= 1);
    }

    setFiltered(result);
  };

  const debouncedFilter = debounce(handleFilter, 500);

  useEffect(() => {
    if (searchText.trim() === "" && filterRespawn === "all") {
      setFiltered([]); // ✅ 완전 초기화
      return;
    }
    debouncedFilter();
    return debouncedFilter.cancel;
  }, [searchText, filterRespawn]);
  

  // ✅ 검색 초기화
  const handleReset = () => {
    debouncedFilter.cancel();      
    setSearchText("");
    setFilterRespawn("all");
    setFiltered([]);              
  };

  return (
    <div className="mb-4 w-full">
      <div className="flex gap-2">
        {/* 검색창 (60%) */}
        <input
          type="text"
          placeholder="보스 이름 or 게임 이름 검색"
          className="border p-2 rounded w-[60%]"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {/* 리젠 시간 필터 (25%) */}
        <select
          className="border p-2 rounded w-[25%]"
          value={filterRespawn}
          onChange={(e) => setFilterRespawn(e.target.value)}
        >
          <option value="all">리젠 시간 전체</option>
          <option value="under1">1시간 미만</option>
          <option value="over1">1시간 이상</option>
        </select>

        {/* 검색 초기화 버튼 (15%) */}
        <button
          onClick={handleReset}
          className="bg-red-500 text-white rounded w-[15%]"
        >
          초기화
        </button>
      </div>
    </div>
  );
}
