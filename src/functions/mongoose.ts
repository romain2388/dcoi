import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/yourdb";

async function connectToDatabase() {
  if (mongoose.connections[0].readyState) {
    return mongoose;
  }
  await mongoose.connect(MONGODB_URI);
  return mongoose;
}

export default connectToDatabase;
