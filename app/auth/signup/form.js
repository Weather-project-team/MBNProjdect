"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(null); // ✅ 이메일 중복 여부
  const [name, setName] = useState("");
  const [nameValid, setNameValid] = useState(null); // ✅ 닉네임 중복 여부
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // ✅ 실시간 이메일 중복 확인 (debounce 방식)
  useEffect(() => {
    if (!email) {
      setEmailValid(null);
      return;
    }

    const timer = setTimeout(async () => {
      const res = await fetch(`/api/auth/check-duplicate?email=${email}`);
      const data = await res.json();
      if (data.type === "email") {
        setEmailValid(!data.exists);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [email]);

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
    <form onSubmit={handleSignup}>
      <label htmlFor="email">이메일:</label>
      <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
      {emailValid === null ? null : emailValid ? (
        <p style={{ color: "green" }}>사용 가능한 이메일입니다.</p>
      ) : (
        <p style={{ color: "red" }}>이미 사용 중인 이메일입니다.</p>
      )}

      <label htmlFor="name">닉네임:</label>
      <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required/>
      <button type="button" onClick={checkNickname}>
        닉네임 중복확인하기
      </button>
      {nameValid === null ? null : nameValid ? (
        <p style={{ color: "green" }}>사용 가능한 닉네임입니다.</p>
      ) : (
        <p style={{ color: "red" }}>이미 사용 중인 닉네임입니다.</p>
      )}

      <br/>

      <label htmlFor="password">비밀번호:</label>
      <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>

      <label htmlFor="confirmPassword">비밀번호 확인:</label>
      <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>

      <label htmlFor="birthdate">생년월일:</label>
      <input id="birthdate" type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} required/>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit">회원가입 하기</button>
    </form>
  );
}