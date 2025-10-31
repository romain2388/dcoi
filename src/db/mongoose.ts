import mongoose from "mongoose";

interface CachedConnection {
  conn: typeof mongoose | undefined;
  promise: Promise<typeof mongoose> | undefined;
}

// Modifier la déclaration globale pour utiliser globalThis
declare global {
  // eslint-disable-next-line no-var
  var mongoose:
    | {
        conn: typeof mongoose | undefined;
        promise: Promise<typeof mongoose> | undefined;
      }
    | undefined;
}

// Utiliser global au lieu de globalThis
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const cached: CachedConnection = globalThis.mongoose || {
  conn: undefined,
  promise: undefined,
};

if (!globalThis.mongoose) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  globalThis.mongoose = cached;
}

async function databaseConnect() {
  const MONGODB_URI = process.env.MONGODB_URI!;

  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local",
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
