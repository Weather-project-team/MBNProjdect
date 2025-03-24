"use client";

import { useContext, useEffect, useState } from "react";
import { SessionContext } from "@/components/UserSessionProvider";
import ChangePasswordModal from "@/components/auth/ChangePasswordModal";

export default function MyPage() {
  const { session, setSession } = useContext(SessionContext);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    if (session) {
      fetch("/api/auth/mypage")
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setEmail(data.user.email || "");
            setName(data.user.name || "");
            setBirthdate(data.user.birthdate || "");
          }
        });
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/mypage/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, birthdate }),
    });

    if (res.ok) {
      const updated = await res.json();
      alert("정보가 업데이트되었습니다.");
      setIsEditing(false);
    
      // ✅ 세션 클라이언트 상태 업데이트 → NavBar 자동 반영
      setSession({
        ...session,
        user: {
          ...session.user,
          name: updated.user.name,
        },
      });
    } else {
      alert("업데이트 실패!");
    }
  };

  if (!session) return <p className="text-center text-gray-600">로그인이 필요합니다.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6">마이페이지</h1>

      <div className="mb-4">
        <label className="block text-gray-700">이메일</label>
        <input
          type="text"
          value={email}
          disabled
          className="w-full p-2 border rounded bg-gray-100"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">비밀번호</label>
        <input
          type="password"
          value="********"
          disabled
          className="w-full p-2 border rounded bg-gray-100"
        />
        <button onClick={() => setShowPasswordModal(true)} className="w-full bg-yellow-500 text-white p-2 rounded cursor-pointer">
          비밀번호 변경
        </button>
        {showPasswordModal && ( <ChangePasswordModal onClose={() => setShowPasswordModal(false)} /> )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">이름</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          disabled={!isEditing}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">생년월일</label>
        <input
          type="date"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          className="w-full p-2 border rounded"
          disabled={!isEditing}
        />
      </div>

      <div className="flex space-x-2">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-gray-500 text-white p-2 rounded cursor-pointer"
          >
            내 정보 수정하기
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white p-2 rounded cursor-pointer"
          >
            저장하기
          </button>
        )}
      </div>
    </div>
  );
}
