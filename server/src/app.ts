import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import sessionRoutes from './routes/sessionRoutes';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB with URI:", process.env.MONGO_URI || 'mongodb://localhost:27017/scheduling-app');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/scheduling-app');
    console.log('MongoDB connected successfully');
  } catch (error:any) {
    console.error('MongoDB connection error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

connectDB();

export default app;