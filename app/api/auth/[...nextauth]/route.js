import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import connectDB from "@/lib/mongodb";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // 📌 DB 없이 테스트용 하드코딩된 사용자 정보
        const user = { id: "123", email: "test@example.com", password: "1234" };

        if (credentials.email !== user.email || credentials.password !== user.password) {
          throw new Error("이메일 또는 비밀번호가 틀렸습니다.");
        }

        return { id: user.id, email: user.email };
      },
    }),
  ],

//       async authorize(credentials) {
//         await connectDB();
//         const user = await User.findOne({ email: credentials.email });

//         if (!user) {
//           throw new Error("이메일이 존재하지 않습니다.");
//         }

//         const isValid = await bcrypt.compare(credentials.password, user.password);
//         if (!isValid) {
//           throw new Error("비밀번호가 틀려먹었습니다.");
//         }

//         return { id: user._id.toString(), email: user.email };
//       },
//     }),
//   ],

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

};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
