import mongoose from "mongoose";

interface CachedConnection {
  conn: typeof mongoose | undefined;
  promise: Promise<typeof mongoose> | undefined;
}

declare global {
  var mongoose:
    | {
        conn: typeof mongoose | undefined;
        promise: Promise<typeof mongoose> | undefined;
      }
    | undefined;
}

// @ts-ignore on en a besoin pour le cache de connexion
const cached: CachedConnection = globalThis.mongoose || {
  conn: undefined,
  promise: undefined,
};

if (!globalThis.mongoose) {
  // @ts-ignore pareil
  globalThis.mongoose = cached;
}

async function databaseConnect() {
  const MONGODB_URI = process.env.MONGODB_URI!;

  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env",
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGODB_URI, options);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = undefined;
    console.log(error);
  }

  return cached.conn;
}

export default databaseConnect;
