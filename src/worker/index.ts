/// <reference types="@cloudflare/workers-types" />

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { CandidateService } from './services/candidateService';
import { InfluencerService } from './services/influencerService';
import { validateInfluencerData, generateUniqueCode, sanitizeString } from './utils/validation';

export interface Env {
  ASSETS: Fetcher;
  DATABASE_URL: string;
}

const app = new Hono<{ Bindings: Env }>()

// Add CORS middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Health check endpoint
app.get('/api/health', async (c) => {
  try {
    // Check database connectivity
    const influencerService = new InfluencerService(c.env.DATABASE_URL);
    await influencerService.getAll(); // Simple query to test DB connection
    
    return c.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      message: 'Cloudflare Worker is running successfully',
      database: 'connected'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return c.json({ 
      status: 'error', 
      timestamp: new Date().toISOString(),
      message: 'Health check failed',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
})

// Candidates endpoints
app.get('/api/candidates', async (c) => {
  try {
    const candidateService = new CandidateService(c.env.DATABASE_URL);
    const candidates = await candidateService.getAll();
    return c.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return c.json({ error: 'Failed to fetch candidates' }, 500);
  }
})

app.post('/api/candidates', async (c) => {
  try {
    const candidateService = new CandidateService(c.env.DATABASE_URL);
    const candidateData = await c.req.json();
    
    if (!candidateData.name || !candidateData.email) {
      return c.json({ error: "Name and email are required" }, 400);
    }

    // Check for existing candidate
    const existingCandidate = await candidateService.findByEmail(candidateData.email);
    if (existingCandidate) {
      return c.json({ error: "Email address already exists" }, 400);
    }

    // Process arrays to JSON strings
    const processedData = {
      ...candidateData,
      additional_cities: Array.isArray(candidateData.additional_cities) 
        ? candidateData.additional_cities 
        : candidateData.additional_cities,
      license_types: Array.isArray(candidateData.license_types) 
        ? candidateData.license_types 
        : candidateData.license_types,
      languages: Array.isArray(candidateData.languages) 
        ? candidateData.languages 
        : candidateData.languages,
      full_name: candidateData.full_name || candidateData.name,
      phone_number: candidateData.phone_number || candidateData.phone,
      referral_code: candidateData.influencerCode || candidateData.referral_code
    };

    // Create candidate with referral handling
    const candidate = await candidateService.createWithReferral(
      processedData, 
      candidateData.influencerCode
    );
    
    return c.json({
      message: "Candidate added successfully",
      candidateId: candidate.id,
      referralCode: candidateData.influencerCode || null
    }, 201);
  } catch (error) {
    console.error('Error creating candidate:', error);
    return c.json({ error: 'Failed to create candidate' }, 500);
  }
})

// Influencers endpoints
app.get('/api/influencers', async (c) => {
  try {
    const influencerService = new InfluencerService(c.env.DATABASE_URL);
    const influencers = await influencerService.getAll();
    return c.json(influencers);
  } catch (error) {
    console.error('Error fetching influencers:', error);
    return c.json({ error: 'Failed to fetch influencers' }, 500);
  }
})

app.post('/api/influencers', async (c) => {
  try {
    const influencerService = new InfluencerService(c.env.DATABASE_URL);
    const influencerData = await c.req.json();
    
    // Validate input data
    const validation = validateInfluencerData(influencerData);
    if (!validation.isValid) {
      return c.json({ 
        error: "Validation failed", 
        details: validation.errors 
      }, 400);
    }

    // Check for existing influencer by email
    const existingInfluencer = await influencerService.findByEmail(influencerData.email);
    if (existingInfluencer) {
      return c.json({ error: "Email address already exists" }, 400);
    }

    // Generate unique code if not provided
    let uniqueCode = influencerData.unique_code;
    if (!uniqueCode) {
      uniqueCode = generateUniqueCode(influencerData.name);
      
      // Ensure the generated code is actually unique
      let codeExists = await influencerService.findByUniqueCode(uniqueCode);
      let counter = 1;
      while (codeExists) {
        uniqueCode = `${generateUniqueCode(influencerData.name)}${counter}`;
        codeExists = await influencerService.findByUniqueCode(uniqueCode);
        counter++;
      }
    } else {
      // Check if provided unique code already exists
      const existingCodeInfluencer = await influencerService.findByUniqueCode(uniqueCode);
      if (existingCodeInfluencer) {
        return c.json({ error: "Unique code already exists" }, 400);
      }
    }

    // Prepare the influencer data
    const processedInfluencerData = {
      name: sanitizeString(influencerData.name),
      email: influencerData.email.toLowerCase().trim(),
      phone: sanitizeString(influencerData.phone),
      unique_code: uniqueCode,
      referral_count: 0
    };

    const influencer = await influencerService.create(processedInfluencerData);
    
    return c.json({
      message: "Influencer created successfully",
      influencer: {
        id: influencer.id,
        name: influencer.name,
        email: influencer.email,
        phone: influencer.phone,
        unique_code: influencer.unique_code,
        referral_count: influencer.referral_count,
        created_at: influencer.created_at
      }
    }, 201);
  } catch (error) {
    console.error('Error creating influencer:', error);
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('unique constraint') || error.message.includes('already exists')) {
        return c.json({ 
          error: "Data conflict", 
          details: error.message 
        }, 409);
      }
      if (error.message.includes('not null constraint') || error.message.includes('Missing required')) {
        return c.json({ 
          error: "Missing required data", 
          details: error.message 
        }, 400);
      }
    }
    
    return c.json({ 
      error: 'Failed to create influencer',
      details: 'An unexpected error occurred. Please try again.'
    }, 500);
  }
})

// Validate influencer endpoint
app.get('/api/influencers/validate/:code', async (c) => {
  try {
    const influencerService = new InfluencerService(c.env.DATABASE_URL);
    const code = c.req.param('code');
    
    const influencer = await influencerService.findByCode(code);
    
    if (!influencer) {
      return c.json({ valid: false }, 404);
    }

    return c.json({ 
      valid: true, 
      influencer: {
        id: influencer.id,
        name: influencer.name,
        code: influencer.unique_code
      }
    });
  } catch (error) {
    console.error('Error validating influencer code:', error);
    return c.json({ error: 'Failed to validate influencer code' }, 500);
  }
})

// Individual candidate operations
app.get('/api/candidates/:id', async (c) => {
  try {
    const candidateService = new CandidateService(c.env.DATABASE_URL);
    const id = parseInt(c.req.param('id'));
    
    const candidate = await candidateService.findById(id);
    if (!candidate) {
      return c.json({ error: 'Candidate not found' }, 404);
    }
    
    return c.json(candidate);
  } catch (error) {
    console.error('Error fetching candidate:', error);
    return c.json({ error: 'Failed to fetch candidate' }, 500);
  }
})

app.put('/api/candidates/:id', async (c) => {
  try {
    const candidateService = new CandidateService(c.env.DATABASE_URL);
    const id = parseInt(c.req.param('id'));
    const updateData = await c.req.json();
    
    const candidate = await candidateService.update(id, updateData);
    return c.json({
      message: "Candidate updated successfully",
      candidate
    });
  } catch (error) {
    console.error('Error updating candidate:', error);
    return c.json({ error: 'Failed to update candidate' }, 500);
  }
})

app.delete('/api/candidates/:id', async (c) => {
  try {
    const candidateService = new CandidateService(c.env.DATABASE_URL);
    const id = parseInt(c.req.param('id'));
    
    await candidateService.delete(id);
    return c.json({ message: "Candidate deleted successfully" });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    return c.json({ error: 'Failed to delete candidate' }, 500);
  }
})

// Individual influencer operations
app.get('/api/influencers/:id', async (c) => {
  try {
    const influencerService = new InfluencerService(c.env.DATABASE_URL);
    const id = parseInt(c.req.param('id'));
    
    const influencer = await influencerService.findById(id);
    if (!influencer) {
      return c.json({ error: 'Influencer not found' }, 404);
    }
    
    return c.json(influencer);
  } catch (error) {
    console.error('Error fetching influencer:', error);
    return c.json({ error: 'Failed to fetch influencer' }, 500);
  }
})

app.put('/api/influencers/:id', async (c) => {
  try {
    const influencerService = new InfluencerService(c.env.DATABASE_URL);
    const id = parseInt(c.req.param('id'));
    const updateData = await c.req.json();
    
    const influencer = await influencerService.update(id, updateData);
    return c.json({
      message: "Influencer updated successfully",
      influencer
    });
  } catch (error) {
    console.error('Error updating influencer:', error);
    return c.json({ error: 'Failed to update influencer' }, 500);
  }
})

app.delete('/api/influencers/:id', async (c) => {
  try {
    const influencerService = new InfluencerService(c.env.DATABASE_URL);
    const id = parseInt(c.req.param('id'));
    
    await influencerService.delete(id);
    return c.json({ message: "Influencer deleted successfully" });
  } catch (error) {
    console.error('Error deleting influencer:', error);
    return c.json({ error: 'Failed to delete influencer' }, 500);
  }
})

// Serve static assets for all other routes
app.all('*', async (c) => {
  // In development, ASSETS might not be available
  if (c.env.ASSETS) {
    return c.env.ASSETS.fetch(c.req.raw)
  }
  
  // Fallback for development mode
  return new Response('Not Found', { status: 404 })
})

export default app 