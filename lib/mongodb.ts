import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smarthire';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  isMemoryFallback: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
  isMemoryFallback: false,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<{ isMemory: boolean }> {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return { isMemory: false };
  }

  if (cached.isMemoryFallback) {
    return { isMemory: true };
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2000, // fast timeout for local check
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        cached.isMemoryFallback = false;
        console.log('MongoDB connected successfully to:', MONGODB_URI.split('@')[1] || MONGODB_URI);
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        cached.isMemoryFallback = true;
        console.warn(
          'Notice: MongoDB connection failed (' +
            err.message +
            '). Activated in-memory database fallback for local dev. Set MONGODB_URI to your Atlas cluster in .env.local for production.'
        );
        return null as any;
      });
  }

  try {
    cached.conn = await cached.promise;
    return { isMemory: cached.isMemoryFallback };
  } catch {
    cached.isMemoryFallback = true;
    return { isMemory: true };
  }
}

export function isUsingMemoryFallback(): boolean {
  return cached.isMemoryFallback;
}

export default connectToDatabase;
