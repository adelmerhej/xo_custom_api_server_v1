import mongoose from 'mongoose';
import { MONGODB_URI } from './env';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI as string, {});
      console.log('MongoDB Connected...');
  } catch (err) {
      console.error('Error connecting to MongoDB:', (err as Error).message);
    process.exit(1);
  }
};

export default connectDB;