const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const rateLimit = require('express-rate-limit');
const { errors: celebrateErrors } = require('celebrate');
const jwt = require('jsonwebtoken');
const Auction = require('./models/Auction');
const errorHandler = require('./middleware/errorHandler');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const allowedOrigins = (process.env.CLIENT_ORIGINS || 'http://localhost:5173,http://localhost:3000').split(',');
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});
io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.headers['x-auth-token'];
  if (!token) return next(new Error('Unauthorized'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    socket.data = { token, user: decoded };
    if (decoded?.id) socket.join(`user:${decoded.id}`);
    next();
  } catch (e) {
    return next(new Error('Unauthorized'));
  }
});
app.set('io', io);
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use(limiter);

// MongoDB connection
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!MONGO_URI) {
  console.warn('⚠️  MONGODB_URI not set. Please add it to backend/.env');
}

// Connect to MongoDB with improved error handling
let dbConnected = false;
if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI, { 
      autoIndex: true,
      serverSelectionTimeoutMS: 15000, // 15 seconds
      socketTimeoutMS: 30000, // 30 seconds
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
      connectTimeoutMS: 15000,
      retryWrites: true,
      retryReads: true
    })
    .then(() => {
      dbConnected = true;
      console.log('✅ Connected to MongoDB');
    })
    .catch((err) => {
      dbConnected = false;
      console.error('❌ MongoDB connection error:', err.message);
      console.warn('⚠️  Continuing with database disabled. API will return demo responses.');
    });
} else {
  console.warn('⚠️  Starting in demo mode (no database)');
}

// Import routes
const authRoutes = require('./routes/auth');
const auctionRoutes = require('./routes/auctions');
const bidRoutes = require('./routes/bids');
const paymentRoutes = require('./routes/payments');
const transportRoutes = require('./routes/transport');
const transporterRoutes = require('./routes/transporters');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/uploads');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/transporters', transporterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'UP', 
    message: 'OnlyFarmers Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'OnlyFarmers Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      health: '/api/health'
    }
  });
});

// Celebrate validation error handler (before our handler)
app.use(celebrateErrors());
// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'NOT_FOUND',
    message: 'Endpoint not found' 
  });
});

io.on('connection', (socket) => {
  console.log('🔌 WebSocket client connected', socket.id);
  socket.on('disconnect', () => console.log('🔌 WebSocket client disconnected', socket.id));
});

server.listen(PORT, () => {
  console.log(`OnlyFarmers backend server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
// Scheduled job to auto-close auctions (only if DB connected)
setInterval(async () => {
  if (!dbConnected) return; // Skip if database not connected
  try {
    const now = new Date();
    const toClose = await Auction.find({ stage: 'bidding', 'timeline.biddingEndTime': { $lte: now } }).lean();
    for (const a of toClose) {
      const highest = a?.stageDetails?.bidding?.highestBidder;
      const update = { updatedAt: new Date() };
      if (highest) {
        update.stage = 'harvesting';
        update.winnerId = highest;
      } else {
        update.status = 'completed';
        update.stage = 'completed';
      }
      await Auction.updateOne({ _id: a._id }, { $set: update });
    }
  } catch (e) {
    console.error('Auto-close auctions job error:', e.message);
  }
}, 60 * 1000);
