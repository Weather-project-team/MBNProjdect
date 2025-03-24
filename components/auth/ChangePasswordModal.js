"use client";
import { useState } from "react";

export default function ChangePasswordModal({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 👁️ 비밀번호 보기 상태
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    const res = await fetch("/api/auth/mypage/change-password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (res.ok) {
      alert("비밀번호가 변경되었습니다.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    } else {
      const data = await res.json();
      alert(data.error || "비밀번호 변경 실패");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">비밀번호 변경</h2>

        {/* 현재 비밀번호 */}
        <div className="mb-3">
          <label className="block text-gray-700">현재 비밀번호</label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border rounded pr-10"
            />
            <button
              type="button"
              onMouseDown={() => setShowCurrent(true)}
              onMouseUp={() => setShowCurrent(false)}
              onMouseLeave={() => setShowCurrent(false)}
              className="absolute right-2 top-2 text-gray-500 cursor-pointer"
            >
              👁‍🗨
            </button>
          </div>
        </div>

        {/* 새 비밀번호 */}
        <div className="mb-3">
          <label className="block text-gray-700">새 비밀번호</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded pr-10"
            />
            <button
              type="button"
              onMouseDown={() => setShowNew(true)}
              onMouseUp={() => setShowNew(false)}
              onMouseLeave={() => setShowNew(false)}
              className="absolute right-2 top-2 text-gray-500 cursor-pointer"
            >
              👁‍🗨
            </button>
          </div>
        </div>

        {/* 새 비밀번호 확인 */}
        <div className="mb-4">
          <label className="block text-gray-700">새 비밀번호 확인</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded pr-10"
            />
            <button
              type="button"
              onMouseDown={() => setShowConfirm(true)}
              onMouseUp={() => setShowConfirm(false)}
              onMouseLeave={() => setShowConfirm(false)}
              className="absolute right-2 top-2 text-gray-500 cursor-pointer"
            >
              👁‍🗨
            </button>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
          >
            취소
          </button>
          <button
            onClick={handlePasswordChange}
            className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
          >
            변경하기
          </button>
        </div>
      </div>
    </div>
  );
}
