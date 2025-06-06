// Configuration settings for the application
// Following Cloudflare Workers best practices

export const config = {
  // API Configuration
  api: {
    // In development: uses Vite dev server with worker integration
    // In production: uses deployed Cloudflare Worker
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 10000, // 10 seconds
  },

  // Application settings
  app: {
    name: 'Candidate Page',
    version: '1.0.0',
    environment: import.meta.env.MODE || 'development',
  },

  // Development settings
  dev: {
    enableLogging: import.meta.env.DEV || false,
    showErrorDetails: import.meta.env.DEV || false,
  },

  // Production settings
  prod: {
    enableAnalytics: import.meta.env.PROD || false,
    enableServiceWorker: import.meta.env.PROD || false,
  }
};

// Helper function to log in development
export const devLog = (...args) => {
  if (config.dev.enableLogging) {
    console.log('[DEV]', ...args);
  }
};

// Helper function to get API endpoint
export const getApiUrl = (endpoint) => {
  return `${config.api.baseUrl}${endpoint}`;
};

export default config; 