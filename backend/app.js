const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const influencerRoutes = require('./routes/influencerRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const db = require('./config/database');

const app = express();

// Debugging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint - moved here to ensure it gets proper CORS handling
app.get('/api/health', (req, res) => {
  // Check database connection
  db.get('SELECT 1', [], (err) => {
    if (err) {
      console.error('Database health check failed:', err);
      res.status(500).json({ status: 'error', message: 'Database connection failed' });
      return;
    }
    res.json({ status: 'ok', message: 'Server and database are running' });
  });
});

// Routes
app.use('/api/influencers', influencerRoutes);
app.use('/api/candidates', candidateRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Something broke!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

module.exports = app;