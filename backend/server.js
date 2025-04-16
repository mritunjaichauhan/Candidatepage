const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 8080;

// Simple CORS configuration
app.use(cors());

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add server health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Connect to SQLite database
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    // Create tables if they don't exist - Make sure tables are created sequentially
    db.serialize(() => {
      // First create the jobs table
      db.run(`CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('Error creating jobs table:', err.message);
        } else {
          // After jobs table is created, insert sample jobs
          db.run(`INSERT OR IGNORE INTO jobs (id, title, description) VALUES
            (1, 'Frontend Developer', 'React, Vue.js expertise required'),
            (2, 'Backend Developer', 'Node.js, Express, and database experience'),
            (3, 'Full Stack Developer', 'End-to-end web development skills')
          `, (err) => {
            if (err) {
              console.error('Error inserting sample jobs:', err.message);
            } else {
              console.log('Sample jobs inserted successfully');
            }
          });
        }
      });

      // Then create the candidates table that references jobs
      db.run(`CREATE TABLE IF NOT EXISTS candidates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        job_id INTEGER,
        resume_path TEXT,
        status TEXT DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        additional_info TEXT,
        FOREIGN KEY (job_id) REFERENCES jobs(id)
      )`, (err) => {
        if (err) {
          console.error('Error creating candidates table:', err.message);
        } else {
          console.log('Candidates table created successfully');
        }
      });
    });
  }
});

// API Routes

// Get all jobs
app.get('/api/jobs', (req, res) => {
  db.all('SELECT * FROM jobs', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Submit candidate application
app.post('/api/candidates', (req, res) => {
  const { name, email, phone, job_id, resume_path, additional_info } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const sql = 'INSERT INTO candidates (name, email, phone, job_id, resume_path, additional_info) VALUES (?, ?, ?, ?, ?, ?)';
  db.run(sql, [name, email, phone, job_id, resume_path, additional_info], function(err) {
    if (err) {
      // Check if error is due to duplicate email
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: "Email address already exists" });
      }
      return res.status(500).json({ error: err.message });
    }
    
    res.json({
      message: "Candidate added successfully",
      candidateId: this.lastID
    });
  });
});

// Get all candidates
app.get('/api/candidates', (req, res) => {
  db.all(`
    SELECT c.*, j.title AS job_title 
    FROM candidates c
    LEFT JOIN jobs j ON c.job_id = j.id
    ORDER BY c.created_at DESC
  `, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server accessible at http://localhost:${PORT}`);
});