// Vercel Serverless Function — EventSphere Backend
// Handles MongoDB connection caching for serverless environment

const mongoose = require('mongoose');

// Cache DB connection across serverless invocations (prevents cold-start timeout)
let cachedConnection = null;

async function connectDB() {
  // Return existing connection if available
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not set in Vercel!');
  }

  cachedConnection = await mongoose.connect(process.env.MONGO_URI, {
    bufferCommands: false,     // Don't buffer — fail fast if not connected
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });

  console.log('✅ MongoDB connected (serverless)');
  return cachedConnection;
}

// Load Express app
const app = require('../backend/server.js');

// Vercel serverless handler — wait for DB before handling request
module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed. Check MONGO_URI in Vercel env vars.',
      error: err.message
    });
  }

  return app(req, res);
};
