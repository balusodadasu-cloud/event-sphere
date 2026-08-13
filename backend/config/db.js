const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.warn(`⚠️ Primary MongoDB connection failed: ${error.message}`);
        try {
            const fallbackUri = 'mongodb://127.0.0.1:27017/campus-connect';
            const conn = await mongoose.connect(fallbackUri);
            console.log(`✅ Fallback Local MongoDB Connected: ${conn.connection.host}`);
        } catch (fallbackErr) {
            console.error(`❌ MongoDB connection unavailable: ${fallbackErr.message}`);
            console.warn(`⚠️ Server continuing without DB persistence for API testing...`);
        }
    }
};

module.exports = connectDB;
