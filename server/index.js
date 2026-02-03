require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');
const analyticsRoutes = require('./routes/analytics');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// ======================
// MIDDLEWARE
// ======================

// Enable CORS for frontend
app.use(cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Request logging (development)
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// ======================
// ROUTES
// ======================

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'CyberQuest API is running!',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/analytics', analyticsRoutes);

// ======================
// ERROR HANDLING
// ======================

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

// ======================
// START SERVER
// ======================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`
  ╔═══════════════════════════════════════════╗
  ║                                           ║
  ║   🛡️  CyberQuest Server Running!  🛡️      ║
  ║                                           ║
  ║   Port: ${PORT}                              ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}             ║
  ║                                           ║
  ╚═══════════════════════════════════════════╝
  `);
});

module.exports = app;
