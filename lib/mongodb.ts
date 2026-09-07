import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable",
  );
}

const cached = globalThis as typeof globalThis & {
  mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

const mongooseCache =
  cached.mongoose ?? {
    conn: null,
    promise: null,
  };

cached.mongoose = mongooseCache;

export default async function connectDB() {
  if (mongooseCache.conn) {
    return mongooseCache.conn;
  }

  if (!mongooseCache.promise) {
    mongooseCache.promise = mongoose.connect(MONGODB_URI);
  }

  mongooseCache.conn = await mongooseCache.promise;

  return mongooseCache.conn;
}