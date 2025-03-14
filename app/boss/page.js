"use client";
import { useState } from "react";
import TimerForm from "./components/TimerForm";
import TimerList from "./components/TimerList";
import BossGuide from "./components/BossGuide";
import { v4 as uuidv4 } from "uuid"; // ✅ UUID 라이브러리 사용

export default function BossPage() {
  const [timers, setTimers] = useState([]);

  // ✅ 타이머 추가 (killTime은 초기 상태에서 null)
  const addTimer = (form) => {
    let nextSpawnTime = form.nextSpawnTime || null;

    const newTimer = {
      id: uuidv4(),
      ...form,
      killTime: form.killTime || null, // ✅ killTime을 form에서 가져오도록 변경
      nextSpawnTime: nextSpawnTime,
      respawnTimeHours: form.respawnTimeHours || "0",
      respawnTimeMinutes: form.respawnTimeMinutes || "0",
      isEditing: false,
    };

    setTimers((prevTimers) =>
      [...prevTimers, newTimer].sort((a, b) => {
        const timeA = a.nextSpawnTime ? new Date(a.nextSpawnTime).getTime() : Infinity;
        const timeB = b.nextSpawnTime ? new Date(b.nextSpawnTime).getTime() : Infinity;
        return timeA - timeB;
      })
    );

    console.log("✅ 새로운 타이머 추가됨:", newTimer);
  };

  // ✅ 처치 버튼 클릭 시 개별 타이머 업데이트
  const handleKill = (timerId) => {
    console.log("🔥 처치 버튼 클릭됨! 타이머 ID:", timerId);

    setTimers((prevTimers) =>
      prevTimers.map((timer) => {
        if (timer.id !== timerId) return timer; // ✅ ID가 일치하는 타이머만 업데이트

        const now = new Date();
        const respawnTimeHours = parseInt(timer.respawnTimeHours || 0, 10);
        const respawnTimeMinutes = parseInt(timer.respawnTimeMinutes || 0, 10);
        const respawnTimeMs = (respawnTimeHours * 60 * 60 * 1000) + (respawnTimeMinutes * 60 * 1000);
        const nextSpawnTime = new Date(now.getTime() + respawnTimeMs);

        console.log("🕒 새로운 처치 시간:", now.toISOString());
        console.log("⏳ 다음 젠 시간:", nextSpawnTime.toISOString());

        return {
          ...timer,
          killTime: now.toISOString(),
          nextSpawnTime: nextSpawnTime.toISOString(),
        };
      })
    );
  };

  // ✅ 수정 모드 전환
  const toggleEditMode = (timerId) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        timer.id === timerId ? { ...timer, isEditing: !timer.isEditing } : timer
      )
    );
  };

  // ✅ 타이머 삭제 (index가 아니라 id 기반으로 삭제)
  const removeTimer = (timerId) => {
    setTimers((prevTimers) => prevTimers.filter((timer) => timer.id !== timerId));
  };

  // ✅ 타이머 업데이트 (ID 기반)
  const updateTimer = (timerId, field, value) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        timer.id === timerId ? { ...timer, [field]: value } : timer
      )
    );

    console.log(`🟢 업데이트됨 → ID: ${timerId}, 필드: ${field}, 값: ${value}`);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <BossGuide />
      <TimerForm addTimer={addTimer} />
      <TimerList
        timers={timers}
        handleKill={handleKill}
        toggleEditMode={toggleEditMode}
        removeTimer={removeTimer}
        updateTimer={updateTimer}
      />
    </div>
  );
}
