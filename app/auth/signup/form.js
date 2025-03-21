"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupForm() {
  const [emailId, setEmailId] = useState("");
  const [domain, setDomain] = useState("gmail.com");
  const [customDomain, setCustomDomain] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [emailValid, setEmailValid] = useState(null); // ✅ 이메일 중복 여부
  const [name, setName] = useState("");
  const [nameValid, setNameValid] = useState(null); // ✅ 닉네임 중복 여부
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const cleanCustomDomain = customDomain.startsWith("@") ? customDomain.slice(1) : customDomain; // 맨 앞의 @ 제거
  const email = `${emailId}@${isCustom ? cleanCustomDomain : domain}`;

  useEffect(() => {
    if (!emailId || (isCustom && !customDomain)) {
      setEmailValid(null);
      return;
    }
  
    const cleanCustomDomain = customDomain.replace(/^@/, "");
    const emailToCheck = `${emailId}@${isCustom ? cleanCustomDomain : domain}`;

    const timer = setTimeout(async () => {
      const res = await fetch(`/api/auth/check-duplicate?email=${emailToCheck}`);
      const data = await res.json();
      if (data.type === "email") {
        setEmailValid(!data.exists);
      }
    }, 500);
  
    return () => clearTimeout(timer);
  }, [emailId, domain, customDomain, isCustom]);  

  // ✅ 닉네임 중복 검사 버튼 클릭 시 실행
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

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !password || !name || !birthdate || !confirmPassword) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    // if (password.length < 6) {
    //   setError("비밀번호는 최소 6자 이상이어야 합니다.");
    //   return;
    // }

    if (password !== confirmPassword) {
      setError("입력한 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (emailValid === false || nameValid === false) {
      setError("중복된 이메일 또는 닉네임이 있습니다.");
      return;
    }

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, birthdate }),
    });

    if (res.ok) {
      alert("회원가입 성공!");
      await signIn("credentials", { email, password, redirect: false });
      router.push("/");
    } else {
      const errorData = await res.json();
      setError(errorData.error || "회원가입 실패.");
    }
  };

  return (
    <form
      onSubmit={handleSignup}
      className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg space-y-4"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">회원가입</h2>
  
      <div>
        <label className="block font-medium mb-1">이메일</label>
        <div className="flex space-x-2 items-start">
        {/* 이메일 아이디 입력 */}
          <input
            type="text"
            placeholder="이메일 아이디"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            className="w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            required
          />

          {/* 도메인 선택 */}
          <div className="w-1/2">
            <select
              value={isCustom ? "custom" : domain}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "custom") {
                  setIsCustom(true);
                  setCustomDomain("");
                } else {
                  setIsCustom(false);
                  setDomain(value);
                }
              }}
              className="w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="gmail.com">@gmail.com</option>
              <option value="naver.com">@naver.com</option>
              <option value="daum.net">@daum.net</option>
              <option value="kakao.com">@kakao.com</option>
              <option value="custom">직접 입력</option>
            </select>

            {/* 직접 입력창은 선택한 경우에만 아래에 표시 */}
            {isCustom && (
              <input
                type="text"
                placeholder="@ex.com"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="mt-2 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            )}
          </div>
        </div>
        {emailValid !== null && (
          <p className={`text-sm mt-1 ${emailValid ? "text-green-600" : "text-red-500"}`}>
            {emailValid ? "사용 가능한 이메일입니다." : "이미 사용 중인 이메일입니다."}
          </p>
        )}
      </div>

  
      <div>
        <label htmlFor="name" className="block font-medium mb-1">
          닉네임
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          type="button"
          onClick={checkNickname}
          className="mt-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm cursor-pointer"
        >
          닉네임 중복확인하기
        </button>
        {nameValid !== null && (
          <p className={`text-sm mt-1 ${nameValid ? 'text-green-600' : 'text-red-500'}`}>
            {nameValid ? "사용 가능한 닉네임입니다." : "이미 사용 중인 닉네임입니다."}
          </p>
        )}
      </div>
  
      <div>
        <label htmlFor="password" className="block font-medium mb-1">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
  
      <div>
        <label htmlFor="confirmPassword" className="block font-medium mb-1">
          비밀번호 확인
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
  
      <div>
        <label htmlFor="birthdate" className="block font-medium mb-1">
          생년월일
        </label>
        <input
          id="birthdate"
          type="date"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
  
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
  
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold cursor-pointer"
      >
        회원가입 하기
      </button>
  
      <div className="text-center mt-4">
        <p className="text-sm">이미 계정이 있으신가요?</p>
        <Link href="/auth/signin" className="text-blue-600 hover:underline text-sm">
        🔐 로그인하러가기
        </Link>
      </div>
    </form>
  );
  
}