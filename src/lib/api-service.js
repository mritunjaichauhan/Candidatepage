// API Service for database operations
const API_URL = '/api'; // Updated to use relative path which will go through the Vite proxy

// Optional: Set a timeout for all fetch requests (in milliseconds)
const FETCH_TIMEOUT = 10000;

/**
 * Enhanced fetch function with timeout and better error handling
 */
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  
  try {
    console.log(`[API] Making request to: ${url}`);
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      // Add cache control to prevent caching issues
      headers: {
        ...options.headers,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        error: `HTTP error ${response.status}` 
      }));
      throw new Error(errorData.error || `Server responded with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your internet connection.');
    }
    
    if (error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please check if the backend is running on http://localhost:8080');
    }
    
    throw error;
  }
}

/**
 * Check if the server is healthy with retries
 */
export const checkServerHealth = async (retries = 3) => {
  let lastError = null;
  
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`[API] Attempting health check (attempt ${i + 1}/${retries})`);
      const response = await fetchWithTimeout(`${API_URL}/health`);
      console.log('[API] Health check response:', response);
      return response.status === 'ok';
    } catch (error) {
      console.error(`[API] Health check attempt ${i + 1} failed:`, error);
      lastError = error;
      // Wait for a short time before retrying
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  throw lastError || new Error('Server health check failed after multiple attempts');
};

/**
 * Fetch all available jobs from the database
 */
export const fetchJobs = async () => {
  try {
    return await fetchWithTimeout(`${API_URL}/jobs`);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

/**
 * Submit a candidate application to the database
 */
export const submitCandidate = async (candidateData) => {
  try {
    const isServerHealthy = await checkServerHealth().catch(() => false);
    if (!isServerHealthy) {
      throw new Error('Cannot connect to the server. Please check if it is running.');
    }

    // Log the data being sent to help with debugging
    console.log('Submitting candidate data:', candidateData);

    return await fetchWithTimeout(`${API_URL}/candidates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(candidateData),
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    throw error;
  }
};

/**
 * Fetch all candidates from the database (usually for admin dashboard)
 */
export const fetchCandidates = async () => {
  try {
    return await fetchWithTimeout(`${API_URL}/candidates`);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
};

/**
 * Fetch all influencers from the database
 */
export const fetchInfluencers = async () => {
  try {
    return await fetchWithTimeout(`${API_URL}/influencers`);
  } catch (error) {
    console.error('Error fetching influencers:', error);
    throw error;
  }
};

/**
 * Fetch a specific influencer by their unique code
 */
export const fetchInfluencerByCode = async (code) => {
  try {
    return await fetchWithTimeout(`${API_URL}/influencers/${code}`);
  } catch (error) {
    console.error(`Error fetching influencer with code ${code}:`, error);
    throw error;
  }
};

/**
 * Fetch all referrals for a specific influencer
 */
export const fetchInfluencerReferrals = async (code) => {
  try {
    return await fetchWithTimeout(`${API_URL}/influencers/${code}/referrals`);
  } catch (error) {
    console.error(`Error fetching referrals for influencer ${code}:`, error);
    throw error;
  }
};

/**
 * Create a new influencer
 */
export const createInfluencer = async (influencerData) => {
  try {
    return await fetchWithTimeout(`${API_URL}/influencers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(influencerData),
    });
  } catch (error) {
    console.error('Error creating influencer:', error);
    throw error;
  }
};