import mongoose from 'mongoose';

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_DB,
  MONGO_HOST,
  MONGO_PORT,
} = process.env;

const connectDB = async () => {
  try {
    const uri = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('MongoDB connected ✅');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;