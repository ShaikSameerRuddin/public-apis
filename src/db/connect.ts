import mongoose, { ConnectOptions } from "mongoose";

const connectDB = (url: string): Promise<typeof mongoose> => {
  return mongoose.connect(url);
};

export { connectDB };
