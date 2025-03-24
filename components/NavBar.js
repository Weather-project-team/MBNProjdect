"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function NavBar() {
  const { data: session } = useSession(); // ✅ 로그인 상태 가져오기

  return (
    <nav className="w-full h-[150px] bg-gray-400 flex items-center justify-between p-4">
      <ul className="flex space-x-4">
        <li>
          <Link href="/">메인</Link>
        </li>
        <li>
          <Link href="/game">게임 페이지</Link>
        </li>
        <li>
          <Link href="/boss">보스 페이지</Link>
        </li>
      </ul>

      <div className="flex items-center space-x-4">
        {session ? (
          <>
            <span className="text-white">
              환영합니다, {session.user?.name || "사용자"}!
            </span>
            <Link href="/auth/mypage">마이페이지</Link>
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              로그아웃
            </button>
          </>
        ) : (
          <Link
            href="/auth/signin"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            로그인
          </Link>
        )}
      </div>
    </nav>
  );
}
