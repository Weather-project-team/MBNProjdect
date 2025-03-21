import { useState, useEffect } from "react";
import debounce from "lodash.debounce";

export default function SearchFilter({ timers, setFiltered }) {
  const [searchText, setSearchText] = useState("");
  const [filterRespawn, setFilterRespawn] = useState("all");
  const [filterGame, setFilterGame] = useState("all");

  // ✅ 검색 & 필터 처리
  const handleFilter = () => {
    let result = [...timers];

    // ✅ 텍스트 검색
    if (searchText.trim()) {
      result = result.filter(timer =>
        timer.bossName.includes(searchText) || timer.gameName.includes(searchText)
      );
    }

    // ✅ 리젠 시간 필터
    if (filterRespawn === "under1") {
      result = result.filter(timer => parseInt(timer.respawnTimeHours) < 1);
    } else if (filterRespawn === "over1") {
      result = result.filter(timer => parseInt(timer.respawnTimeHours) >= 1);
    }

    // ✅ 게임 이름 필터
    if (filterGame !== "all") {
      result = result.filter(timer => timer.gameName === filterGame);
    }

    setFiltered(result);
  };

  // ✅ debounce 적용 (500ms)
  const debouncedFilter = debounce(handleFilter, 500);

  useEffect(() => {
    debouncedFilter();
    return debouncedFilter.cancel;
  }, [searchText, filterRespawn, filterGame, timers]);

  return (
    <div className="mb-4 space-y-2">
      <input
        type="text"
        placeholder="보스 이름 or 게임 이름 검색"
        className="border p-2 w-full rounded"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <div className="flex gap-2">
        <select className="border p-2 rounded" value={filterRespawn} onChange={(e) => setFilterRespawn(e.target.value)}>
          <option value="all">리젠 시간 전체</option>
          <option value="under1">1시간 미만</option>
          <option value="over1">1시간 이상</option>
        </select>
      </div>
    </div>
  );
}
