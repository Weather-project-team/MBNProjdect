"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();

    // ✅ 비밀번호와 비밀번호 확인 비교
    if (password !== confirmPassword) {
      setError("입력한 비밀번호가 일치하지 않습니다.");
      return;
    }

    // ✅ 회원가입 요청
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      alert("회원가입 성공!");
      // ✅ 회원가입 후 자동 로그인
      await signIn("credentials", { email, password, redirect: false });
      router.push("/");
    } else {
      const errorData = await res.json();
      setError(errorData.error || "회원가입 실패.");
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <br/>
      <label htmlFor="email">이메일:</label>
      <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

      <label htmlFor="password">비밀번호:</label>
      <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

      <label htmlFor="confirmPassword">비밀번호 확인:</label>
      <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

      {/* 에러 메시지 출력 */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <br/>
      <br/>
      <br/>
      <button type="submit">회원가입 하기</button>
    </form>
  );
}