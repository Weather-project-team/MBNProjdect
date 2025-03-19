import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const name = searchParams.get("name");

  if (!email && !name) {
    return NextResponse.json({ error: "이메일 또는 닉네임을 입력해주세요." }, { status: 400 });
  }

  if (email) {
    const existingUser = await User.findOne({ email });
    return NextResponse.json({ type: "email", exists: !!existingUser });
  }

  if (name) {
    const existingUser = await User.findOne({ name });
    return NextResponse.json({ type: "name", exists: !!existingUser });
  }
}