# Influencer Referral System Documentation

## Overview

The Influencer Referral System allows tracking of user signups that come from influencer referrals. Each influencer gets a unique code that they can share (e.g., `7UTT5`). When a user signs up through an influencer's unique link (e.g., `http://localhost:5173/7UTT5`), the system tracks this referral and credits the influencer.

## System Components

### 1. Database Schema

The system uses three main database tables:

#### Influencers Table
```sql
CREATE TABLE influencers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    unique_code TEXT UNIQUE NOT NULL,
    referral_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Candidates Table (includes referral_code column)
```sql
-- Among other columns, the candidates table includes:
referral_code TEXT
```

#### Influencer Referrals Table (junction table for many-to-many relationship)
```sql
CREATE TABLE influencer_referrals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    influencer_id INTEGER NOT NULL,
    candidate_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (influencer_id) REFERENCES influencers(id),
    FOREIGN KEY (candidate_id) REFERENCES candidates(id),
    UNIQUE(influencer_id, candidate_id)
);
```

### 2. URL-Based Referral System

- Each influencer has a unique URL: `http://localhost:5173/{unique_code}`
- When a user visits this URL, the frontend captures the influencer code from the URL
- The code is stored alongside the candidate's information when they submit the form

### 3. Frontend Implementation

The frontend extracts the influencer code from the URL using React Router's `useParams` hook:

```jsx
// In CandidateForm.jsx
const { influencerCode } = useParams();

// Initialize form state with the influencer code
const [formData, setFormData] = useState({
  // ...other fields
  influencerCode: influencerCode || null
});

// When submitting the form, include the influencer code
const candidateData = {
  // ...other fields
  influencerCode: influencerCode
};
```

### 4. Backend Implementation

The backend processes the referral in several ways:

1. **Main Storage Method**: The `referral_code` column in the `candidates` table directly stores the influencer's unique code
2. **Relationship Tracking**: The `influencer_referrals` junction table tracks the relationship between influencers and candidates
3. **Referral Count**: The `referral_count` column in the `influencers` table keeps track of how many referrals each influencer has made

**How Referrals Are Processed**:

1. When a candidate submission includes an influencer code:
   ```js
   if (influencerCode) {
     // Look up the influencer by their code
     db.get('SELECT id FROM influencers WHERE unique_code = ?', [influencerCode], (err, influencer) => {
       if (influencer) {
         // Create the relationship in the junction table
         db.run('INSERT INTO influencer_referrals (influencer_id, candidate_id) VALUES (?, ?)',
           [influencer.id, candidateId]);
           
         // Update the influencer's referral count
         db.run('UPDATE influencers SET referral_count = referral_count + 1 WHERE id = ?',
           [influencer.id]);
       }
     });
   }
   ```

2. **Fallback Mechanism**: If the junction table insertion fails, the system still ensures the `referral_code` column in the `candidates` table is updated:
   ```js
   db.run('UPDATE candidates SET referral_code = ? WHERE id = ?',
     [influencerCode, candidateId]);
   ```

### 5. API Endpoints

#### Create an Influencer
```
POST /api/influencers
```

**Request Body:**
```json
{
  "name": "Influencer Name",
  "email": "influencer@example.com",
  "phone": "1234567890"
}
```

#### Get All Influencers
```
GET /api/influencers
```

#### Get Influencer by Code
```
GET /api/influencers/{code}
```

#### Get Referrals for an Influencer
```
GET /api/influencers/{code}/referrals
```

## How to Test the Referral System

1. **Create an Influencer**:
   ```bash
   curl -X POST http://localhost:8080/api/influencers \
     -H "Content-Type: application/json" \
     -d '{"name":"Test Influencer","email":"influencer@example.com","phone":"1234567890"}'
   ```

2. **Get the Influencer's Unique Code**:
   ```bash
   curl http://localhost:8080/api/influencers | json_pp
   ```

3. **Open the Candidate Form with the Influencer's Code**:
   ```
   http://localhost:5173/{influencer_code}
   ```

4. **Submit the Form** with candidate information

5. **Verify Referral Tracking**:
   ```bash
   curl http://localhost:8080/api/influencers/{influencer_code}/referrals | json_pp
   ```

## Debugging Referrals

If referrals aren't being tracked correctly, check the following:

1. **Database Schema**:
   - Ensure the `referral_code` column exists in the `candidates` table
   - Verify the `influencers` and `influencer_referrals` tables exist

2. **Form Submission**:
   - Check browser console to ensure the influencer code is being extracted from the URL
   - Verify that the code is included in the submission data

3. **Backend Processing**:
   - Review server logs for any errors related to influencer lookup or referral creation
   - Directly query the database to check if records are being created

4. **Dual Tracking System**:
   - The system uses two methods to track referrals:
     - Direct storage of the influencer code in the `referral_code` column
     - Junction table relationships in `influencer_referrals`
   - Either method can be used to retrieve referrals

## Future Improvements

1. **Referral Dashboard**: Create a dashboard for influencers to track their referrals and earnings
2. **Commission System**: Implement a system to calculate and track commissions based on referrals
3. **Expiration System**: Add the ability to set expiration dates for referral links
4. **Referral Analytics**: Implement detailed analytics for tracking conversion rates and effectiveness
5. **Multi-level Referrals**: Support for tiered referral structures (e.g., sub-influencers)

## Security Considerations

1. **Validation**: Ensure all influencer codes are validated before processing referrals
2. **Rate Limiting**: Implement rate limiting to prevent abuse of the referral system
3. **Fraud Detection**: Add mechanisms to detect and prevent fraudulent referrals
4. **Access Control**: Restrict access to referral data to authorized users only 