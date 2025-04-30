const express = require('express');
const path = require('path');
const app = require('./app');
const db = require('./config/database');
const influencerRoutes = require('./routes/influencerRoutes');

const PORT = process.env.PORT || 8080;

// Health check endpoint is now in app.js

// Create tables if they don't exist
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

  // Create influencers table if it doesn't exist
  db.run(`CREATE TABLE IF NOT EXISTS influencers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    unique_code TEXT UNIQUE NOT NULL,
    referral_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error creating influencers table:', err.message);
    } else {
      console.log('Influencers table created successfully');
    }
  });

  // Create influencer_referrals table
  db.run(`CREATE TABLE IF NOT EXISTS influencer_referrals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    influencer_id INTEGER NOT NULL,
    candidate_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (influencer_id) REFERENCES influencers(id),
    FOREIGN KEY (candidate_id) REFERENCES candidates(id),
    UNIQUE(influencer_id, candidate_id)
  )`, (err) => {
    if (err) {
      console.error('Error creating influencer_referrals table:', err.message);
    } else {
      console.log('Influencer referrals table created successfully');
    }
  });

  // Then create the candidates table
  db.run(`CREATE TABLE IF NOT EXISTS candidates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    job_id INTEGER,
    resume_path TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    /* Step 1 Fields */
    full_name TEXT,
    phone_number TEXT,
    phone_verified BOOLEAN DEFAULT 0,
    email_verified BOOLEAN DEFAULT 0,
    primary_city TEXT,
    additional_cities TEXT,
    work_radius TEXT,
    pincode TEXT,
    open_to_relocate BOOLEAN DEFAULT 0,
    calling_number TEXT,
    
    /* Step 2 Fields */
    age INTEGER,
    work_schedule TEXT,
    education TEXT,
    in_field_experience TEXT,
    experience TEXT,
    expected_ctc TEXT,
    open_to_gig BOOLEAN DEFAULT 1,
    open_to_full_time BOOLEAN DEFAULT 0,
    has_license BOOLEAN DEFAULT 0,
    license_types TEXT,
    additional_vehicle TEXT,
    additional_vehicle_type TEXT,
    commercial_vehicle_type TEXT,

    /* Step 3 Fields */
    languages TEXT,
    pan TEXT,
    pancard TEXT,
    aadhar TEXT,
    aadharcard TEXT,
    agree_terms BOOLEAN DEFAULT 0,
    
    /* Additional Information JSON field */
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
  // Extract basic required fields
  const { 
    name, 
    email, 
    phone, 
    job_id, 
    resume_path, 
    additional_info,
    influencerCode,
    // Add step1 fields
    full_name,
    phone_number,
    phone_verified,
    email_verified,
    primary_city,
    additional_cities,
    work_radius,
    pincode,
    open_to_relocate,
    calling_number,
    // Add step2 fields
    age,
    work_schedule,
    education,
    in_field_experience,
    experience,
    expected_ctc,
    open_to_gig,
    open_to_full_time,
    has_license,
    license_types,
    additional_vehicle,
    additional_vehicle_type,
    commercial_vehicle_type,
    // Add step3 fields
    languages,
    pan,
    pancard,
    aadhar,
    aadharcard,
    agree_terms
  } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  // Prepare fields for database - convert arrays/objects to strings
  const additionalCitiesString = Array.isArray(additional_cities) ? JSON.stringify(additional_cities) : additional_cities;
  const licenseTypesString = Array.isArray(license_types) ? JSON.stringify(license_types) : license_types;
  const languagesString = Array.isArray(languages) ? JSON.stringify(languages) : languages;

  console.log(`Processing candidate submission with influencer code: ${influencerCode}`);

  // Store the referral code directly in the initial insert
  const sql = `INSERT INTO candidates (
    name, email, phone, job_id, resume_path, additional_info,
    full_name, phone_number, phone_verified, email_verified, primary_city, 
    additional_cities, work_radius, pincode, open_to_relocate, calling_number,
    age, work_schedule, education, in_field_experience, experience, expected_ctc,
    open_to_gig, open_to_full_time, has_license, license_types, additional_vehicle,
    additional_vehicle_type, commercial_vehicle_type, languages, pan, pancard,
    aadhar, aadharcard, agree_terms, referral_code
  ) VALUES (
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?,
    ?, ?, ?, ?
  )`;

  db.run(sql, [
    name, email, phone, job_id, resume_path, additional_info,
    full_name || name, // use name as fallback
    phone_number || phone, // use phone as fallback
    phone_verified ? 1 : 0,
    email_verified ? 1 : 0,
    primary_city,
    additionalCitiesString,
    work_radius,
    pincode,
    open_to_relocate ? 1 : 0,
    calling_number,
    age,
    work_schedule,
    education,
    in_field_experience,
    experience,
    expected_ctc,
    open_to_gig ? 1 : 0,
    open_to_full_time ? 1 : 0,
    has_license ? 1 : 0,
    licenseTypesString,
    additional_vehicle,
    additional_vehicle_type,
    commercial_vehicle_type,
    languagesString,
    pan,
    pancard,
    aadhar,
    aadharcard,
    agree_terms ? 1 : 0,
    influencerCode
  ], function(err) {
    if (err) {
      // Check if error is due to duplicate email
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: "Email address already exists" });
      }
      return res.status(500).json({ error: err.message });
    }
    
    const candidateId = this.lastID;

    // If there's an influencer code, create the referral relationship
    if (influencerCode) {
      console.log(`Processing referral for influencer code: ${influencerCode}`);
      
      db.get('SELECT id FROM influencers WHERE unique_code = ?', [influencerCode], (err, influencer) => {
        if (err) {
          console.error('Error finding influencer:', err.message);
          // Still return success for the candidate addition
          return res.status(201).json({
            message: "Candidate added successfully but failed to process referral",
            candidateId: candidateId
          });
        }

        if (influencer) {
          console.log(`Found influencer with ID: ${influencer.id} for code: ${influencerCode}`);
          
          // First update the referral_code in the candidates table directly as a fallback
          db.run(
            'UPDATE candidates SET referral_code = ? WHERE id = ?',
            [influencerCode, candidateId],
            (updateErr) => {
              if (updateErr) {
                console.error('Error updating referral_code:', updateErr.message);
              } else {
                console.log(`Updated referral_code for candidate ${candidateId}`);
              }
            }
          );
          
          // Try to insert into influencer_referrals table
          db.run(
            'INSERT INTO influencer_referrals (influencer_id, candidate_id) VALUES (?, ?)',
            [influencer.id, candidateId],
            (insertErr) => {
              if (insertErr) {
                console.error('Error creating referral relationship:', insertErr.message);
              } else {
                console.log(`Created referral relationship between influencer ${influencer.id} and candidate ${candidateId}`);
                
                // Update influencer's referral count
                db.run(
                  'UPDATE influencers SET referral_count = referral_count + 1 WHERE id = ?',
                  [influencer.id],
                  (countErr) => {
                    if (countErr) {
                      console.error('Error updating referral count:', countErr.message);
                    } else {
                      console.log(`Updated referral count for influencer ${influencer.id}`);
                    }
                  }
                );
              }
            }
          );
        } else {
          console.log(`No influencer found with code: ${influencerCode}`);
          
          // Still update the referral_code in the candidates table
          db.run(
            'UPDATE candidates SET referral_code = ? WHERE id = ?',
            [influencerCode, candidateId],
            (updateErr) => {
              if (updateErr) {
                console.error('Error updating referral_code:', updateErr.message);
              } else {
                console.log(`Updated referral_code for candidate ${candidateId} (no matching influencer)`);
              }
            }
          );
        }
      });
    }
    
    // Return success response immediately without waiting for referral processing
    res.status(201).json({
      message: "Candidate added successfully",
      candidateId: candidateId
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

// Routes
app.use('/api/influencers', influencerRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server accessible at http://localhost:${PORT}`);
});