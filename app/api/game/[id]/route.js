import { connectDB } from "@/lib/mongoose";
import { Game } from "@/models/game";
import { NextResponse } from "next/server";

export async function PUT(request, context) {
  await connectDB();
  const { id: gameId } = await context.params;

  const updateData = await request.json();

  try {
    const updated = await Game.findByIdAndUpdate(gameId, updateData, {
      new: true,
    }).lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "게임 없음" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: e.message },
      { status: 500 }
    );
  }
}

export async function DELETE(_, context) {
  await connectDB();
  const { id: gameId } = await context.params;

  try {
    const deleted = await Game.findByIdAndDelete(gameId);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "삭제할 글 없음" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: deleted });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: e.message },
      { status: 500 }
    );
  }
}
