import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  return NextResponse.json({ message: "✅ MongoDB 연결 성공!" });
}