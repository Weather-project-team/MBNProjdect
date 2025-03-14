import { MongoClient } from "mongodb";

export async function GET() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();

    return Response.json({ success: true, collections });
  } catch (error) {
    console.error("MongoDB 연결 오류:", error);
    return Response.json(
      { success: false, message: "서버 오류 발생" },
      { status: 500 }
    );
  }
}
