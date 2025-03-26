"use client";

import { useContext, useEffect, useState } from "react";
import { SessionContext } from "@/components/UserSessionProvider";
import { useRouter } from "next/navigation";

export default function SocialRegisterPage() {
  const { session, setSession } = useContext(SessionContext);
  const [name, setName] = useState("");
  const [nameValid, setNameValid] = useState(null);
  const [birthdate, setBirthdate] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name); // 카카오에서 받아온 닉네임
    }
  }, [session]);

  const checkNickname = async () => {
    if (!name) {
      setNameValid(null);
      return;
    }

    const res = await fetch(`/api/auth/check-duplicate?name=${name}`);
    const data = await res.json();
    if (data.type === "name") {
      setNameValid(!data.exists);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (nameValid === false) {
      alert("이미 사용 중인 닉네임입니다.");
      return;
    }

    const res = await fetch("/api/auth/social-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, birthdate }),
    });
    
    if (!res.ok) {
      const data = await res.json().catch(() => ({})); // 비어있어도 안전
      alert(data.error || "가입 실패");
      return;
    }
    
    const data = await res.json();
    alert("가입이 완료되었습니다!");
    
    setSession({
      ...session,
      user: {
        ...session.user,
        name,
        birthdate,
        needRegister: false,
      },
    });
    
    router.replace("/");
  }

  if (!session?.user?.needRegister) {
    return <p className="text-center mt-20 text-gray-500">잘못된 접근입니다.</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">추가 정보를 입력해 주세요.</h2>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">닉네임</label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value);
              setNameValid(null); // 값이 바뀌면 중복 결과 초기화
            }}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
          <button
            type="button"
            onClick={checkNickname}
            className="mt-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm cursor-pointer"
          >
            닉네임 중복확인하기
          </button>
          {nameValid !== null && (
            <p className={`text-sm mt-1 ${nameValid ? "text-green-600" : "text-red-500"}`}>
              {nameValid ? "사용 가능한 닉네임입니다." : "이미 사용 중인 닉네임입니다."}
            </p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">생년월일</label>
          <input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-md font-semibold cursor-pointer"
        >
          가입 완료
        </button>
      </form>
    </div>
  );
}
