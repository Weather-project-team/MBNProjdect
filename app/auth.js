import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import KakaoProvider from "next-auth/providers/kakao";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const { auth, handlers } = NextAuth({
  providers: [
    // 🔑 일반 로그인
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB(); // ✅ MongoDB 연결

        // ✅ MongoDB에서 유저 찾기
        const user = await User.findOne({ email: credentials?.email });
        if (!user) throw new Error("이메일이 존재하지 않습니다.");

        // ✅ 비밀번호 검증
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) throw new Error("비밀번호가 틀렸습니다.");

        return { id: user._id.toString(), email: user.email, name: user.name, role: user.role, birthdate: user.birthdate, };
      },
    }),

     // 🗝️ 카카오 로그인
     KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    }),
  ],

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user, account, profile }) {
      // ✅ 1. 카카오 로그인 처리 우선
      // jwt 콜백 내 카카오 로그인 분기
      if (account?.provider === "kakao" && profile) {
        const kakaoId = profile.id?.toString();
        await connectDB();

        const existingUser = await User.findOne({ provider: "kakao", providerId: kakaoId });

        if (!existingUser) {
          // 등록되지 않은 사용자
          token.id = null;
          token.role = "USER";
          token.name = profile.properties?.nickname ?? "카카오유저";
          token.picture = profile.properties?.profile_image ?? null;
          token.needRegister = true;
        } else {
          // ✅ DB에서 불러온 최신 정보를 세션에 반영!
          token.id = existingUser._id.toString();
          token.email = existingUser.email ?? null;
          token.name = existingUser.name;
          token.role = existingUser.role || "USER";
          token.picture = existingUser.profileImage ?? null;
          token.birthdate = existingUser.birthdate ?? null;
          token.needRegister = false;
        }

        token.provider = "kakao";
        token.kakaoId = kakaoId;

        return token;
      }
    
      // ✅ 2. 일반 로그인 처리
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role || "USER";
        token.provider = "credentials";
        token.birthdate = user.birthdate;
      }
    
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.picture = token.picture;
        session.user.provider = token.provider;
        session.user.kakaoId = token.kakaoId ?? null;
        session.user.birthdate = token.birthdate ?? null;
        session.user.needRegister = token.needRegister ?? false;
      }
      return session;
    },
  },
});

export const GET = handlers.GET;
export const POST = handlers.POST;

// 참고 : NextAuth는 app/api/auth/[...nextauth]/route.js를 보고 자동으로 다음 API들을 생성해줌
//      API 엔드포인트	   ||           역할
// POST /api/auth/signin	||  로그인 (signIn("credentials"))
// POST /api/auth/signout ||  로그아웃 (signOut())
// GET /api/auth/session	||  현재 로그인된 유저 정보 가져오기

// nextAuth 횐갑은 없는듯