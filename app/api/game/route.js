import { connectDB } from "@/lib/mongoose";
import Game from "@/models/game";

export async function POST(request) {
  await connectDB();
  try {
    const { title, description, category } = await request.json();

    if (!title || !description || !category) {
      return Response.json(
        { success: false, message: "필수값이 없습니다." },
        { status: 400 }
      );
    }

    const newGame = new Game({ title, description, category });
    const savedGame = await newGame.save();

    return Response.json({ success: true, data: savedGame });
  } catch (e) {
    return Response.json(
      { success: false, message: e.message },
      { status: 500 }
    );
  }
}
