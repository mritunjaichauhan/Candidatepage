export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle API routes
    if (url.pathname.startsWith('/api/')) {
      return handleApiRoutes(request, env, ctx);
    }
    
    // For all other requests, serve static assets
    return env.ASSETS.fetch(request);
  },
};

async function handleApiRoutes(request, env, ctx) {
  const url = new URL(request.url);
  
  // Example API endpoint
  if (url.pathname === '/api/health') {
    return new Response(JSON.stringify({ 
      status: 'ok', 
      timestamp: new Date().toISOString() 
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Add more API routes here as needed
  
  // Return 404 for unmatched API routes
  return new Response('Not Found', { status: 404 });
} 