import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "../../../../lib/mongoose";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";

export const { auth, handlers } = NextAuth({
  providers: [
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

        return { id: user._id.toString(), email: user.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },
});

export const GET = handlers.GET;
export const POST = handlers.POST;

// 참고 : NextAuth는 app/api/auth/[...nextauth]/route.js를 보고 자동으로 다음 API들을 생성해줌
//      API 엔드포인트	   ||       역할
// POST /api/auth/signin	||  로그인 (signIn("credentials"))
// POST /api/auth/signout ||  로그아웃 (signOut())
// GET /api/auth/session	||  현재 로그인된 유저 정보 가져오기

// nextAuth 횐갑은 없는듯
