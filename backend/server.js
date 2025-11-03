// HARUS DI LINE PALING ATAS!
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables FIRST

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db.js');

// Route imports
const authRoutes = require('./routes/authRoutes.js');
const documentRoutes = require('./routes/documentRoutes.js');
const commentRoutes = require('./routes/commentRoutes.js');
const categoryRoutes = require('./routes/categoryRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const examRoutes = require('./routes/examRoutes.js');
const aiRoutes = require('./routes/aiRoutes.js');

// Initialize database
connectDB();

// Debug: Check API key
console.log('API Key yang terbaca dari .env:', process.env.GOOGLE_API_KEY);
console.log('GOOGLE_API_KEY exists:', !!process.env.GOOGLE_API_KEY);

const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/ai', aiRoutes);

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        services: {
            database: 'Connected',
            ai: process.env.GOOGLE_API_KEY ? 'Configured' : 'Not Configured'
        }
    });
});

// Server configuration
const PORT = process.env.PORT || 5000;
const environment = process.env.NODE_ENV || 'development';

// Start server
app.listen(PORT, () => {
    console.log(`
🚀 Server running in ${environment} mode
📍 Port: ${PORT}
🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}
🔗 Backend URL: ${process.env.BACKEND_URL || 'http://localhost:5000'}
🗄️  MongoDB: Connected
🤖 Google AI: ${process.env.GOOGLE_API_KEY ? '✅ Configured' : '❌ Not Configured'}
    `);
});

module.exports = app;

