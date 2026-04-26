import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { router } from './routes';
import { setupEventListeners } from './core/EventListeners';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Event Listeners
setupEventListeners();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Modular Routes
app.use('/api', router);

// Catch-all 404 for API
app.use('/api', (req, res) => {
  console.log(`[404] Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    app: 'TalentFlow-AI', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Root message
app.get('/', (req, res) => {
  res.send('TalentFlow-AI API is running. Use /api for endpoints.');
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n=== TalentFlow-AI Advanced Backend ===`);
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
  console.log(`📡 API Endpoints at http://localhost:${PORT}/api`);
  console.log(`======================================\n`);
});

export default app;
