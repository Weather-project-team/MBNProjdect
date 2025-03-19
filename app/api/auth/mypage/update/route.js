import { auth } from "@/app/auth";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  await connectDB();
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { name } = await req.json();
  const user = await User.findOneAndUpdate(
    { email: session.user.email },
    { name },
    { new: true }
  ).select("-password");

  if (!user) {
    return NextResponse.json({ error: "사용자 업데이트 실패" }, { status: 500 });
  }

  return NextResponse.json({ user });
}
