import mongoose from 'mongoose';

// Cached connection promise: reused across warm serverless invocations.
// A failed attempt clears the cache so the next request retries.
let connectionPromise = null;

export const connectDB = () => {
  if (connectionPromise) return connectionPromise;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('MONGO_URI not set - skipping database connection');
    return Promise.resolve(null);
  }

  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose.connection);
  }

  connectionPromise = mongoose
    .connect(uri, {
      serverSelectionTimeoutMS: 10_000,
      connectTimeoutMS: 10_000,
      socketTimeoutMS: 45_000,
      maxPoolSize: 10,
      autoIndex: false,
    })
    .then((conn) => {
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return conn;
    })
    .catch((err) => {
      console.error(`MongoDB connection error: ${err.message}`);
      connectionPromise = null;
      throw err;
    });

  return connectionPromise;
};
