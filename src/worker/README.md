# Worker Backend with Drizzle ORM and Neon

This directory contains the Cloudflare Worker backend that uses Drizzle ORM with Neon PostgreSQL database.

## Setup

1. **Create a Neon Database**
   - Go to [Neon](https://neon.tech) and create a new database
   - Copy the connection string from your Neon dashboard

2. **Set Environment Variables**
   - Create a `.env` file in the project root (copy from `env.example`)
   - Add your Neon database URL:
     ```
     DATABASE_URL=your_neon_connection_string_here
     ```

3. **Set Cloudflare Worker Secrets**
   ```bash
   wrangler secret put DATABASE_URL
   # Enter your Neon database URL when prompted
   ```

4. **Generate and Push Database Schema**
   ```bash
   # Generate migration files
   pnpm db:generate
   
   # Push schema to Neon database
   pnpm db:push
   ```

5. **Optional: Use Drizzle Studio**
   ```bash
   pnpm db:studio
   ```

## File Structure

- `schema.ts` - Database schema definitions using Drizzle ORM
- `db.ts` - Database connection configuration  
- `services/` - Business logic services
  - `candidateService.ts` - Candidate CRUD operations
  - `influencerService.ts` - Influencer CRUD operations
- `migrations/` - Generated migration files (auto-created)

## API Endpoints

### Candidates
- `GET /api/candidates` - Get all candidates
- `POST /api/candidates` - Create a new candidate with optional referral

### Influencers  
- `GET /api/influencers` - Get all influencers
- `POST /api/influencers` - Create a new influencer
- `GET /api/influencers/{code}` - Get influencer by unique code
- `GET /api/influencers/{code}/referrals` - Get all referrals for an influencer

### Health Check
- `GET /api/health` - Check if the worker is running

## Database Migration from Backend

The backend code has been successfully migrated from Express.js with SQLite to Cloudflare Workers with Drizzle ORM and Neon PostgreSQL. All existing functionality has been preserved including:

- Complete candidate form handling (3-step form)
- Influencer management
- Referral tracking system
- CORS support
- Error handling

## Development

The worker runs alongside the Vite frontend development server. API routes are handled by the worker while static assets are served by Vite in development mode. 