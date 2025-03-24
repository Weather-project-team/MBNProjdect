"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OAuthRedirectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user?.needRegister) {
      router.replace("/auth/social-register");
    } else {
      router.replace("/auth/mypage");
    }
  }, [session, status]);

  return <p className="text-center mt-20 text-gray-600">로그인 처리 중입니다...</p>;
}
