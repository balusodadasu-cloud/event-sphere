require('dotenv').config();

// Catch silent crashes
process.on('uncaughtException', (err) => {
    console.error('❌ UNCAUGHT EXCEPTION:', err.message, err.stack);
});
process.on('unhandledRejection', (reason) => {
    console.error('❌ UNHANDLED REJECTION:', reason);
});

console.log('🚀 Starting EventSphere server...');
console.log('📦 NODE_ENV:', process.env.NODE_ENV);
console.log('🔌 PORT:', process.env.PORT);
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Pre-register all Mongoose models
require('./models/User');
require('./models/Club');
require('./models/Event');
require('./models/Registration');
require('./models/Notification');
require('./models/Certificate');
require('./models/Result');
require('./models/Gallery');
require('./models/Bookmark');
require('./models/Attendance');

// Route files
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const clubRoutes = require('./routes/clubRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const resultRoutes = require('./routes/resultRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const userRoutes = require('./routes/userRoutes');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const allowedOrigins = (process.env.CLIENT_URL || '').split(',').map(s => s.trim()).filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (
            allowedOrigins.length === 0 || 
            allowedOrigins.includes('*') || 
            allowedOrigins.includes(origin) || 
            origin.endsWith('.ngrok-free.app') || 
            origin.endsWith('.ngrok.io') ||
            origin.includes('localhost') ||
            origin.includes('127.0.0.1')
        ) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Static files for uploads if local storage is used
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/users', userRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ success: true, message: 'EventSphere Backend API is running' });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Campus Connect API is running' });
});

// 404
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
console.log(`🔌 About to listen on PORT: ${PORT}`);

// Always listen — Render requires explicit port binding on 0.0.0.0
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ Listening on 0.0.0.0:${PORT}`);
});

server.on('error', (err) => {
    console.error('❌ Server listen error:', err.message);
    process.exit(1);
});

// Export for serverless environments (Vercel)
module.exports = app;

