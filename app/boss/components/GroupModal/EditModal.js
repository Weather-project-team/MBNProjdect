import { useState } from 'react';

export default function EditModal({ timer, onClose, saveEdit }) {
  const [editInputs, setEditInputs] = useState({
    gameName: timer.gameName,
    bossName: timer.bossName,
    location: timer.location,
    respawnTimeHours: timer.respawnTimeHours,
    respawnTimeMinutes: timer.respawnTimeMinutes,
    killTimeInput: '',
  });

  const handleSave = async () => {
    if (!editInputs.gameName || !editInputs.bossName) {
      return alert("게임 이름과 보스 이름은 반드시 입력해주세요!");
    }

    let killTime = timer.killTime;
    let nextSpawnTime = timer.nextSpawnTime;

    if (editInputs.killTimeInput) {
      const today = new Date();
      const [hour, minute] = editInputs.killTimeInput.split(":").map(Number);
      today.setHours(hour, minute, 0, 0);

      const respawnMs = (parseInt(editInputs.respawnTimeHours || 0) * 3600000) +
                        (parseInt(editInputs.respawnTimeMinutes || 0) * 60000);
      const nextSpawn = new Date(today.getTime() + respawnMs);

      killTime = today.toISOString();
      nextSpawnTime = nextSpawn.toISOString();
    }

    await saveEdit(timer._id, {
      ...editInputs,
      killTime,
      nextSpawnTime,
    });
    alert("✅ 수정이 완료되었습니다!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[400px]">
        <h2 className="text-lg font-bold mb-4">보스 수정</h2>

        {['게임 이름', '보스 이름', '위치', '리젠 시간 (시간)', '리젠 시간 (분)', '처치 시간 (예: 18:30)'].map((label, idx) => (
          <div key={idx} className="mb-3">
            <label className="text-sm font-medium">{label}</label>
            <input
              type={idx === 5 ? 'time' : (idx === 3 || idx === 4 ? 'number' : 'text')}
              placeholder={label}
              value={
                idx === 0 ? editInputs.gameName :
                idx === 1 ? editInputs.bossName :
                idx === 2 ? editInputs.location :
                idx === 3 ? editInputs.respawnTimeHours :
                idx === 4 ? editInputs.respawnTimeMinutes :
                editInputs.killTimeInput
              }
              onChange={(e) => setEditInputs((prev) => ({
                ...prev,
                [idx === 0 ? 'gameName' :
                 idx === 1 ? 'bossName' :
                 idx === 2 ? 'location' :
                 idx === 3 ? 'respawnTimeHours' :
                 idx === 4 ? 'respawnTimeMinutes' : 'killTimeInput']: e.target.value
              }))}
              className="border p-2 w-full rounded mt-1"
            />
          </div>
        ))}

        <div className="flex gap-2 mt-4">
          <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded w-full">저장</button>
          <button onClick={onClose} className="bg-gray-300 text-black p-2 rounded w-full">취소</button>
        </div>
      </div>
    </div>
  );
}
