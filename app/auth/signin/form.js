"use client"; // Next.js 13+부터 App Router (app/ 디렉토리) 방식이 도입, 기본적으로 모든 컴포넌트는 서버 컴포넌트(Server Component) 가 되었음. 그래서 useState, useEffect, onClick 같은 클라이언트 관련 기능을 사용하려면 "use client";를 선언해야 함

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'; // Next.js 15
import Link from "next/link";
import { RiKakaoTalkFill } from "react-icons/ri";
import { SiNaver } from "react-icons/si";

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
      router.push("/"); // Next.js 라우터로 페이지 이동
    } else {
      alert("로그인 실패: " + result.error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-lg space-y-4"
    >
      <h2 className="text-2xl font-bold text-center">로그인</h2>

      <div>
        <label className="block font-medium mb-1">이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold cursor-pointer"
      >
        로그인
      </button>
      <div className="mt-5">
        <p className="text-center m-auto">👨‍💻소셜로그인</p>
      </div>

      <button
        type="button"
        onClick={() => signIn("kakao")}
        className="w-full h-10 flex items-center justify-center gap-2 bg-[#FEE500] text-black cursor-pointer font-medium rounded-md"
        >
        <RiKakaoTalkFill size={24} />
        <span>카카오로 로그인하기</span>
      </button>

      <button
        type="button"
        onClick={() => signIn("naver")}
        className="w-full h-10 flex items-center justify-center gap-2 bg-[#03C75A] text-white cursor-pointer font-medium rounded-md"
        >
        <SiNaver size={20} />
        <span>네이버로 로그인하기</span>
      </button>

      <div className="text-center mt-10">
        <p className="text-sm">계정이 없으신가요?</p>
        <Link href="/auth/signup" className="text-blue-600 hover:underline text-sm">
           🪪 회원가입 하러가기
        </Link>
      </div>
    </form>
  );
}