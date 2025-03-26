import { auth } from "@/app/auth";
import { connectDB } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { Comment } from "@/models/Comment";

export async function POST(request) {
  await connectDB();
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }
  const { name, email, id } = session.user;

  try {
    const body = await request.json();

    const { comment, postId, mentions } = body;

    if (!comment || !postId) {
      return NextResponse.json(
        { success: false, message: "댓글 내용과 게시글 ID는 필수입니다." },
        { status: 400 }
      );
    }

    const newComment = new Comment({
      comment,
      postId,
      author: id,
      mentions,
    });
    const savedComment = await newComment.save();

    return NextResponse.json({ success: true, data: savedComment });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { success: false, message: e.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json(
      { success: false, message: "postId가 필요합니다" },
      { status: 400 }
    );
  }

  try {
    const comments = await Comment.find({ postId }).populate("author", "name");
    return NextResponse.json({ success: true, data: comments });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: e.message },
      { status: 500 }
    );
  }
}
