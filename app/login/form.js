"use client"; // Next.js 13+부터 App Router (app/ 디렉토리) 방식이 도입, 기본적으로 모든 컴포넌트는 서버 컴포넌트(Server Component) 가 되었음. 그래서 useState, useEffect, onClick 같은 클라이언트 관련 기능을 사용하려면 "use client";를 선언해야 함

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data: session } = useSession();
  const router = useRouter();  // useRouter 훅 사용
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false, // 페이지 리디렉션 방지 (Next.js에서 필요)
      email,
      password,
    });

    if (!result?.error) {
      alert("로그인 성공!");
      router.push("/dashboard"); // Next.js 라우터로 페이지 이동
    } else {
      alert("로그인 실패: " + result.error);
    }
  };

  return (
    <div>
      {session ? (
        <>
          <p>환영합니다, {session.user.email}!</p>
          <button onClick={() => signOut()}>로그아웃</button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>로그인</h2>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button type="submit">로그인</button>
        </form>
      )}
    </div>
  );
}