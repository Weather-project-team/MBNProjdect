import { auth } from "@/app/auth";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";

export async function GET(req) {
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
