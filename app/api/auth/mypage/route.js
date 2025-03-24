import { auth } from "@/app/auth";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";

export async function GET(req) {
    const session = await auth();
    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    await connectDB();
    const user = await User.findOne({ email: session.user.email }).select("email name birthdate");
  
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
  
    return Response.json({ user }); // ✅ user를 key로 감싸줌
  }