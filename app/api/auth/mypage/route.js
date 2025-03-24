import { auth } from "@/app/auth";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";

export async function GET(req) {
<<<<<<< HEAD
  const session = await auth(); // auth()를 직접 호출
  if (!session || !session.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findOne({ email: session.user.email }).select(
    "-password"
  );

  return Response.json(user);
}
=======
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
>>>>>>> 8b84b95c7797ac1953f91997909f010fb4dc4b3f
