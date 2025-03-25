"use client";

import { useState, useEffect, useContext } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SessionContext } from "@/components/UserSessionProvider";
import Link from "next/link";
import { RiKakaoTalkFill } from "react-icons/ri";
import { SiNaver } from "react-icons/si";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const session = useContext(SessionContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (!result?.error) {
      alert("로그인 성공!");
      router.replace("/auth/mypage");
    } else {
      alert("로그인 실패: " + result.error);
    }
  };

  // ✅ 세션 변화 감지해서 소셜 로그인 리디렉션 처리
  useEffect(() => {
    if (!session) return; // 로그인 안 된 유저는 냅둬
  
    const { user } = session;
    if (!user) return;
  
    if (user.needRegister) {
      router.replace("/auth/social-register");
    } else {
      router.replace("/auth/mypage");
    }
  }, [session]);

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

      <div className="mt-5 text-center">👨‍💻 소셜로그인</div>

      <button
        type="button"
        onClick={() => signIn("kakao", { callbackUrl: "/auth/oauth-redirect" })}
        className="w-full h-10 flex items-center justify-center gap-2 bg-[#FEE500] text-black cursor-pointer font-medium rounded-md"
      >
        <RiKakaoTalkFill size={24} />
        <span>카카오로 로그인하기</span>
      </button>

      {/* <button
        type="button"
        onClick={() => signIn("naver")}
        className="w-full h-10 flex items-center justify-center gap-2 bg-[#03C75A] text-white cursor-pointer font-medium rounded-md"
      >
        <SiNaver size={20} />
        <span>네이버로 로그인하기</span>
      </button> */}

      <div className="text-center mt-10">
        <p className="text-sm">계정이 없으신가요?</p>
        <Link
          href="/auth/signup"
          className="text-blue-600 hover:underline text-sm">
          🪪 회원가입 하러가기
        </Link>
      </div>
    </form>
  );
}
