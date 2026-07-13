/**
 * server.js - Main Express application entry point
 * Connects to MongoDB, registers middleware & routes, and starts the server.
 */
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Route imports
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// Middleware imports
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore';

// ─── Core Middleware ──────────────────────────────────────────────────────────
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Serve static cover images from client/public/covers ─────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/covers', express.static(path.join(__dirname, '../client/public/covers')));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'BookStore API is running 📚' });
});

// ─── Serve React build in production ──────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// ─── Global Error Handler ─────────────────────────────────────────────────
app.use(errorHandler);

// ─── Database Connection, Fallback & Seeding ─────────────────────────────────
import { MongoMemoryServer } from 'mongodb-memory-server';
import { seedDatabase } from './seed.js';

async function startServer() {
  try {
    console.log(`🔌 Attempting to connect to MongoDB: ${MONGODB_URI}`);
    // Use 3 seconds timeout to quickly fail-over to memory server if no local db is running
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
    console.log('✅  MongoDB connected successfully');
  } catch (err) {
    console.warn(`⚠️  Connection to ${MONGODB_URI} failed: ${err.message}`);
    console.log('🚀  Spinning up in-memory MongoDB server as fallback...');
    try {
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      console.log(`✅  In-memory MongoDB started at: ${uri}`);
      await mongoose.connect(uri);
      console.log('✅  Connected to in-memory MongoDB');
      
      // Auto-seed in-memory DB since it starts empty
      console.log('🌱  Auto-seeding in-memory database...');
      await seedDatabase();
    } catch (memErr) {
      console.error('❌  Failed to start/seed in-memory MongoDB:', memErr.message);
      process.exit(1);
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀  Server running on http://localhost:${PORT}`);
  });
}

startServer();

export default app;
