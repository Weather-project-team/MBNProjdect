"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function MyPage() {
  const { data: session, status } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [isEditing, setIsEditing] = useState(false); // ✅ 수정 모드 상태 추가

  useEffect(() => {
    if (session) {
      fetch("/api/auth/mypage")
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setName(data.user.name);
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
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      alert("정보가 업데이트되었습니다.");
      setIsEditing(false); // ✅ 업데이트 후 읽기 전용 상태로 변경
    } else {
      alert("업데이트 실패!");
    }
  };

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>로그인이 필요합니다.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold">마이페이지</h1>

      <div className="mt-4">
        <label className="block text-gray-700">이름</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          disabled={!isEditing} // ✅ 읽기 전용 모드
        />
      </div>

      {/* ✅ 버튼 추가: 수정하기 & 저장하기 */}
      <div className="mt-4 flex space-x-2">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)} // ✅ 수정 모드 활성화
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
