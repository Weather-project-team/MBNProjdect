"use client";

import { useContext, useEffect, useState } from "react";
import { SessionContext } from "@/components/UserSessionProvider";
import ChangePasswordModal from "@/components/auth/ChangePasswordModal";

export default function MyPage() {
  const { session, setSession } = useContext(SessionContext);
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const isSocial = session?.user?.provider === "kakao";

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setBirthdate(session.user.birthdate || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/mypage/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, birthdate }),
    });

    if (res.ok) {
      const updated = await res.json();
      alert("정보가 업데이트되었습니다.");
      setIsEditing(false);

      setSession({
        ...session,
        user: {
          ...session.user,
          name: updated.user.name,
          birthdate: updated.user.birthdate,
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

      {/* ✅ 이메일 */}
      <div className="mb-4">
        <label className="block text-gray-700">이메일</label>
        <input
          type="text"
          value={isSocial ? "카카오 로그인" : email}
          disabled
          className="w-full p-2 border rounded bg-gray-100"
        />
      </div>

      {/* ✅ 일반 로그인 사용자만 비밀번호 입력란 표시 */}
      {!isSocial && (
        <div className="mb-4">
          <label className="block text-gray-700">비밀번호</label>
          <input
            type="password"
            value="********"
            disabled
            className="w-full p-2 border rounded bg-gray-100"
          />
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full mt-2 bg-yellow-500 text-white p-2 rounded"
          >
            비밀번호 변경
          </button>
        </div>
      )}

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}

      {/* ✅ 이름 */}
      <div className="mb-4">
        <label className="block text-gray-700">이름</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={!isEditing}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* ✅ 생년월일 */}
      <div className="mb-4">
        <label className="block text-gray-700">생년월일</label>
        <input
          type="date"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          disabled={!isEditing}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* ✅ 버튼 */}
      <div className="flex space-x-2">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-gray-500 text-white p-2 rounded"
          >
            내 정보 수정하기
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            저장하기
          </button>
        )}
      </div>
    </div>
  );
}
