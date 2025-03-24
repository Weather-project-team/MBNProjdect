"use client";
import { useState } from "react";

export default function TimerForm({ addTimer }) {
  const [form, setForm] = useState({
    gameName: "",
    bossName: "",
    respawnTimeHours: "",
    respawnTimeMinutes: "",
    location: "",
    manualKillTime: "",
  });

  const [visibleFields, setVisibleFields] = useState({
    gameName: false,
    bossName: false,
    respawnTimeHours: false,
    respawnTimeMinutes: false,
    location: false,
    manualKillTime: false,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.bossName || (!form.respawnTimeHours && !form.respawnTimeMinutes)) {
      alert("⚠️ 게임 이름, 보스 이름, 리젠 시간(시간 또는 분)은 필수 입력 항목입니다!");
      return;
    }

    let killTime = null;
    let nextSpawnTime = null;

    // ✅ 수기 처치 시간이 입력된 경우
    if (form.manualKillTime) {
      const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
      if (!timeRegex.test(form.manualKillTime)) {
        alert("처치 시간을 올바른 형식(예: 16:30)으로 입력해주세요.");
        return;
      }

      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];
      const [hour, minute] = form.manualKillTime.split(":").map(Number);
      killTime = new Date(`${formattedDate}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`);

      if (isNaN(killTime.getTime())) {
        alert("입력하신 처치 시간이 유효하지 않습니다.");
        return;
      }

      const respawnTimeMs =
        (parseInt(form.respawnTimeHours || 0) * 60 * 60 * 1000) +
        (parseInt(form.respawnTimeMinutes || 0) * 60 * 1000);
      nextSpawnTime = new Date(killTime.getTime() + respawnTimeMs).toISOString();
    }

    const newTimer = {
      gameName: form.gameName,
      bossName: form.bossName,
      location: form.location,
      respawnTimeHours: form.respawnTimeHours || "0",
      respawnTimeMinutes: form.respawnTimeMinutes || "0",
      killTime: killTime ? killTime.toISOString() : null,
      nextSpawnTime,
    };

    // ✅ BossPage에서 내려준 addTimer만 호출 (중복 저장 방지)
    await addTimer(newTimer);

    alert("✅ 타이머가 성공적으로 저장되었습니다!");

    // ✅ 입력 초기화
    setForm({
      gameName: "",
      bossName: "",
      respawnTimeHours: "",
      respawnTimeMinutes: "",
      location: "",
      manualKillTime: "",
    });
  };

  const addField = (field) => {
    if (field === "manualKillTime") {
      const confirmAdd = confirm("⚠️ 보스 처치시간을 수기로 추가할 때만 추가해주세요.\n기본적으로 처치 버튼을 누르면 처치 시간이 자동으로 기록됩니다.");
      if (!confirmAdd) return;
    }
    setVisibleFields({ ...visibleFields, [field]: true });
  };

  const removeField = (field) => {
    setVisibleFields({ ...visibleFields, [field]: false });
    setForm({ ...form, [field]: "" });
  };

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-lg font-bold text-center mb-4">보스 젠타이머 생성을 도와드리겠습니다</h2>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {visibleFields.gameName && (
          <div className="relative col-span-2">
            <input type="text" name="gameName" placeholder="게임 이름" value={form.gameName} onChange={handleChange} className="border p-2 rounded w-full" />
            <button onClick={() => removeField("gameName")} className="absolute right-2 top-2 text-red-500">X</button>
          </div>
        )}
        {visibleFields.bossName && (
          <div className="relative col-span-2">
            <input type="text" name="bossName" placeholder="보스 이름" value={form.bossName} onChange={handleChange} className="border p-2 rounded w-full" />
            <button onClick={() => removeField("bossName")} className="absolute right-2 top-2 text-red-500">X</button>
          </div>
        )}
        {visibleFields.respawnTimeHours && (
          <div className="relative col-span-2">
            <input type="number" name="respawnTimeHours" placeholder="리젠 (시간)" value={form.respawnTimeHours} onChange={handleChange} className="border p-2 rounded w-full" />
            <button onClick={() => removeField("respawnTimeHours")} className="absolute right-2 top-2 text-red-500">X</button>
          </div>
        )}
        {visibleFields.respawnTimeMinutes && (
          <div className="relative col-span-2">
            <input type="number" name="respawnTimeMinutes" placeholder="리젠 (분)" value={form.respawnTimeMinutes} onChange={handleChange} className="border p-2 rounded w-full" />
            <button onClick={() => removeField("respawnTimeMinutes")} className="absolute right-2 top-2 text-red-500">X</button>
          </div>
        )}
        {visibleFields.location && (
          <div className="relative col-span-2">
            <input type="text" name="location" placeholder="보스 위치 (선택)" value={form.location} onChange={handleChange} className="border p-2 rounded w-full" />
            <button onClick={() => removeField("location")} className="absolute right-2 top-2 text-red-500">X</button>
          </div>
        )}
        {!visibleFields.manualKillTime && (
          <button onClick={() => addField("manualKillTime")} className="bg-blue-500 text-white px-4 py-2 rounded mb-3">
            + 수기로 처치시간 입력하기
          </button>
        )}
        {visibleFields.manualKillTime && (
          <div className="relative col-span-2">
            <input
              type="text"
              name="manualKillTime"
              placeholder="처치시간을 입력해주세요 (예: 16:30)"
              value={form.manualKillTime}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <button onClick={() => removeField("manualKillTime")} className="absolute right-2 top-2 text-red-500">X</button>
          </div>
        )}
      </div>

      {/* ✅ 버튼 영역 */}
      <div className="flex flex-wrap gap-2 mb-3">
        {!visibleFields.gameName && <button onClick={() => addField("gameName")} className="bg-gray-300 px-3 py-1 rounded">+ 게임 이름</button>}
        {!visibleFields.bossName && <button onClick={() => addField("bossName")} className="bg-gray-300 px-3 py-1 rounded">+ 보스 이름</button>}
        {!visibleFields.respawnTimeHours && <button onClick={() => addField("respawnTimeHours")} className="bg-gray-300 px-3 py-1 rounded">+ 보스 젠 시간 (시간)</button>}
        {!visibleFields.respawnTimeMinutes && <button onClick={() => addField("respawnTimeMinutes")} className="bg-gray-300 px-3 py-1 rounded">+ 보스 젠 시간 (분)</button>}
        {!visibleFields.location && <button onClick={() => addField("location")} className="bg-gray-300 px-3 py-1 rounded">+ 보스 위치</button>}
      </div>

      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded w-full">젠 타이머 추가</button>
    </div>
  );
}
