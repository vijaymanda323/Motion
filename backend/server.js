const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.path}`);
    if (req.body && Object.keys(req.body).length > 0) {
        // Don't log password in plain text
        const logBody = { ...req.body };
        if (logBody.password) {
            logBody.password = '***HIDDEN***';
        }
        console.log('Request body:', JSON.stringify(logBody, null, 2));
    }
    next();
});

// MongoDB Connection URI (password @ is URL-encoded as %40)
const MONGODB_URI = 'mongodb+srv://vijaymanda323_db_user:Vijay%403369@cluster0.xhsvyzy.mongodb.net/?appName=Cluster0';

// Connect to MongoDB (removed deprecated options)
mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('✅ Connected to MongoDB successfully');
})
.catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('\n📋 To fix this issue:');
    console.error('1. Go to MongoDB Atlas: https://cloud.mongodb.com/');
    console.error('2. Navigate to your cluster → Network Access');
    console.error('3. Click "Add IP Address"');
    console.error('4. Click "Allow Access from Anywhere" (0.0.0.0/0) for development');
    console.error('   OR add your current IP address');
    console.error('5. Wait 1-2 minutes for changes to take effect');
    console.error('\n⚠️  Server will continue running but database operations will fail until MongoDB is connected.');
    // Don't exit - let the server run so API endpoints are still accessible
    // The API will return errors when trying to use the database
});

// Import routes
const routes = require('./routes/routes');

// Use routes
app.use('/api', routes);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Backend server is running' });
});

// Test endpoint to verify login route is accessible
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'API is working',
        timestamp: new Date().toISOString(),
        mongodbConnected: mongoose.connection.readyState === 1
    });
});

// Start server
const PORT = process.env.PORT || 5000;
// Listen on all network interfaces (0.0.0.0) to allow access from physical devices
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access from emulator: http://localhost:${PORT}`);
    console.log(`Access from physical device: http://YOUR_COMPUTER_IP:${PORT}`);
    console.log(`API endpoint: http://YOUR_COMPUTER_IP:${PORT}/api`);
});

