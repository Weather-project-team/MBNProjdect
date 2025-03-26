"use client";

import { useState } from "react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

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

  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'respawnTimeMinutes') {
      const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
      setProgress(val);
    }
  };

  const handleSubmit = async () => {
    if (!form.bossName || (!form.respawnTimeHours && !form.respawnTimeMinutes)) {
      alert("⚠️ 게임 이름, 보스 이름, 리젠 시간(시간 또는 분)은 필수 입력 항목입니다!");
      return;
    }

    let killTime = null;
    let nextSpawnTime = null;

    if (form.manualKillTime) {
      const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
      if (!timeRegex.test(form.manualKillTime)) {
        alert("처치 시간을 올바른 형식(예: 16:30)으로 입력해주세요.");
        return;
      }

      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];
      const [hour, minute] = form.manualKillTime.split(":" ).map(Number);
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

    await addTimer(newTimer);
    alert("✅ 타이머가 성공적으로 저장되었습니다!");

    setForm({
      gameName: "",
      bossName: "",
      respawnTimeHours: "",
      respawnTimeMinutes: "",
      location: "",
      manualKillTime: "",
    });
    setProgress(0);
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
    <div className="p-8 bg-gray-900 rounded-2xl shadow-lg max-w-md mx-auto border-4 border-green-500">
      <h2 className="text-2xl text-green-400 font-mono text-center mb-6 cursor-default">
        🕒 보스 젠 타이머 세팅 🕒
      </h2>

      {/* 원형 프로그레스 */}
      <div className="relative w-60 h-60 mx-auto cursor-default">
        <CircularProgressbar
          value={progress}
          text={`${progress}%`}
          styles={buildStyles({
            pathColor: progress > 70 ? "#ef4444" : "#22c55e",
            textColor: "#ffffff",
            trailColor: "#334155",
            textSize: '18px',
            pathTransitionDuration: 0.5
          })}
        />
      </div>

      {/* 입력 필드 */}
      <div className="mt-8 space-y-4">
        {visibleFields.gameName && (
          <div className="relative">
            <input
              type="text"
              name="gameName"
              placeholder="게임 이름"
              value={form.gameName}
              onChange={handleChange}
              className="w-full p-4 rounded-lg border border-green-500 bg-black text-green-400 text-center text-xl shadow-inner cursor-text"
            />
            <button onClick={() => removeField("gameName")} className="absolute right-3 top-3 text-red-500 cursor-pointer">X</button>
          </div>
        )}
        {visibleFields.bossName && (
          <div className="relative">
            <input
              type="text"
              name="bossName"
              placeholder="보스 이름"
              value={form.bossName}
              onChange={handleChange}
              className="w-full p-4 rounded-lg border border-green-500 bg-black text-green-400 text-center text-xl shadow-inner cursor-text"
            />
            <button onClick={() => removeField("bossName")} className="absolute right-3 top-3 text-red-500 cursor-pointer">X</button>
          </div>
        )}
        {visibleFields.respawnTimeHours && (
          <div className="relative">
            <input
              type="number"
              name="respawnTimeHours"
              placeholder="리젠 (시간)"
              value={form.respawnTimeHours}
              onChange={handleChange}
              className="w-full p-4 rounded-lg border border-green-500 bg-black text-green-400 text-center text-xl shadow-inner cursor-text"
            />
            <button onClick={() => removeField("respawnTimeHours")} className="absolute right-3 top-3 text-red-500 cursor-pointer">X</button>
          </div>
        )}
        {visibleFields.respawnTimeMinutes && (
          <div className="relative">
            <input
              type="number"
              name="respawnTimeMinutes"
              placeholder="리젠 (분)"
              value={form.respawnTimeMinutes}
              onChange={handleChange}
              className="w-full p-4 rounded-lg border border-green-500 bg-black text-green-400 text-center text-xl shadow-inner cursor-text"
            />
            <button onClick={() => removeField("respawnTimeMinutes")} className="absolute right-3 top-3 text-red-500 cursor-pointer">X</button>
          </div>
        )}
        {visibleFields.location && (
          <div className="relative">
            <input
              type="text"
              name="location"
              placeholder="보스 위치 (선택)"
              value={form.location}
              onChange={handleChange}
              className="w-full p-4 rounded-lg border border-green-500 bg-black text-green-400 text-center text-xl shadow-inner cursor-text"
            />
            <button onClick={() => removeField("location")} className="absolute right-3 top-3 text-red-500 cursor-pointer">X</button>
          </div>
        )}
        {visibleFields.manualKillTime && (
          <div className="relative">
            <input
              type="text"
              name="manualKillTime"
              placeholder="처치시간 입력 (예: 16:30)"
              value={form.manualKillTime}
              onChange={handleChange}
              className="w-full p-4 rounded-lg border border-green-500 bg-black text-green-400 text-center text-xl shadow-inner cursor-text"
            />
            <button onClick={() => removeField("manualKillTime")} className="absolute right-3 top-3 text-red-500 cursor-pointer">X</button>
          </div>
        )}
      </div>

      {/* 추가 버튼 영역 */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        {!visibleFields.gameName && (
          <button
            onClick={() => addField("gameName")}
            className="bg-black border border-green-500 text-green-400 font-mono p-3 shadow-inner hover:bg-green-700 cursor-pointer"
          >
            + 게임 이름
          </button>
        )}
        {!visibleFields.bossName && (
          <button
            onClick={() => addField("bossName")}
            className="bg-black border border-green-500 text-green-400 font-mono p-3 shadow-inner hover:bg-green-700 cursor-pointer"
          >
            + 보스 이름
          </button>
        )}
        {!visibleFields.respawnTimeHours && (
          <button
            onClick={() => addField("respawnTimeHours")}
            className="bg-black border border-green-500 text-green-400 font-mono p-3 shadow-inner hover:bg-green-700 cursor-pointer"
          >
            + 젠 (시간)
          </button>
        )}
        {!visibleFields.respawnTimeMinutes && (
          <button
            onClick={() => addField("respawnTimeMinutes")}
            className="bg-black border border-green-500 text-green-400 font-mono p-3 shadow-inner hover:bg-green-700 cursor-pointer"
          >
            + 젠 (분)
          </button>
        )}
        {!visibleFields.location && (
          <button
            onClick={() => addField("location")}
            className="bg-black border border-green-500 text-green-400 font-mono p-3 shadow-inner hover:bg-green-700 cursor-pointer"
          >
            + 보스 위치
          </button>
        )}
        {!visibleFields.manualKillTime && (
          <button
            onClick={() => addField("manualKillTime")}
            className="bg-black border border-green-500 text-green-400 font-mono p-3 shadow-inner hover:bg-green-700 cursor-pointer"
          >
            + 처치시간
          </button>
        )}
      </div>

      {/* 등록 버튼 */}
      <button
        onClick={handleSubmit}
        className="mt-8 w-full bg-gradient-to-r from-pink-500 to-red-500 text-white text-xl p-4 rounded-full shadow-lg hover:scale-105 transition cursor-pointer"
      >
        🔥 젠 타이머 추가 🔥
      </button>
    </div>
  );
}
