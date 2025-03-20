import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("⚠️ MONGODB_URI 환경 변수가 설정되지 않았습니다!");
}

let cached = global._mongoose;

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) {
    console.log("✅ 이미 MongoDB에 연결됨!");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: process.env.MONGODB_DB,
        authSource: process.env.MONGODB_AUTH,
        bufferCommands: false,
      })
      .then((mongoose) => {
        console.log("🚀 MongoDB 연결 성공!");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB 연결 실패:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
