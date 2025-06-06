# Candidate Page

A React application with Vite, Hono, and Cloudflare Workers for managing candidate and influencer data.

## 🚀 Features

- **React Frontend** with modern UI components
- **Cloudflare Workers** backend with Hono framework
- **Database Integration** with Neon PostgreSQL via Drizzle ORM
- **Full CRUD Operations** for candidates and influencers
- **Referral System** linking candidates to influencers
- **Validation** and error handling
- **Auto-generated unique codes** for influencers

## 📋 API Endpoints

### Health Check
- `GET /api/health` - Check application and database status

### Candidates
- `GET /api/candidates` - Get all candidates
- `POST /api/candidates` - Create a new candidate
- `GET /api/candidates/:id` - Get candidate by ID
- `PUT /api/candidates/:id` - Update candidate
- `DELETE /api/candidates/:id` - Delete candidate

### Influencers
- `GET /api/influencers` - Get all influencers
- `POST /api/influencers` - Create a new influencer (with validation and auto-generated codes)
- `GET /api/influencers/:id` - Get influencer by ID
- `PUT /api/influencers/:id` - Update influencer
- `DELETE /api/influencers/:id` - Delete influencer
- `GET /api/influencers/validate/:code` - Validate influencer code

## 🛠️ Development

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)

### Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.dev.vars.example` to `.dev.vars` and configure your database URL
4. Run migrations: `npm run db:push`
5. Start development server: `npm run dev`

### Database Operations
- `npm run db:generate` - Generate migration files
- `npm run db:migrate` - Run migrations
- `npm run db:push` - Push schema changes
- `npm run db:studio` - Open Drizzle Studio

## 🚀 Deployment

### Build and Deploy
- `npm run build` - Build for production
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm run preview` - Preview production build locally

## 🔧 Troubleshooting

### Frontend Not Connecting to Backend
If you see `net::ERR_CONNECTION_REFUSED` errors:

1. **Check the development server**: Ensure `npm run dev` is running
2. **Verify the port**: The application runs on `http://localhost:5173`
3. **API configuration**: All API calls use relative paths (`/api/*`) which are handled by the Cloudflare Worker
4. **Health check**: Visit `http://localhost:5173/api/health` to verify the backend is running

### Common Issues
- ❌ **Hardcoded localhost:8080**: Fixed by using centralized API service
- ❌ **Database connection errors**: Check your `.dev.vars` file has the correct `DATABASE_URL`
- ❌ **CORS errors**: The application has proper CORS configuration
- ✅ **Auto-generated unique codes**: Influencers get codes like "JOH4289" automatically

### API Testing
You can test the API endpoints directly:
```bash
# Health check
curl http://localhost:5173/api/health

# Create influencer
curl -X POST http://localhost:5173/api/influencers \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "phone": "1234567890"}'

# List influencers
curl http://localhost:5173/api/influencers
```

## 📝 Recent Improvements

### Influencer Creation Fix
- ✅ **Fixed validation errors** - Now provides specific error messages for missing fields
- ✅ **Auto-generation of unique codes** - Automatically creates unique codes if not provided
- ✅ **Enhanced error handling** - Better database error detection and reporting
- ✅ **Email validation** - Validates email format before processing
- ✅ **Phone validation** - Basic phone number format validation
- ✅ **Duplicate detection** - Checks for existing emails and unique codes
- ✅ **Data sanitization** - Trims and normalizes input data
- ✅ **Improved health check** - Now includes database connectivity status

### Code Quality Improvements
- 🔧 **Validation utilities** - Centralized validation functions
- 🔧 **Response utilities** - Standardized API responses
- 🔧 **Better TypeScript types** - Improved type safety
- 🔧 **Error categorization** - Specific error types with appropriate HTTP status codes

## 🗄️ Database Schema

### Candidates Table
- Personal information (name, email, phone)
- Location preferences (city, radius, pincode)
- Professional details (experience, education, CTC)
- Vehicle and license information
- Document references (PAN, Aadhar)
- Referral tracking

### Influencers Table
- Basic information (name, email, phone)
- Unique referral code
- Referral count tracking

### Referral Tracking
- Links candidates to influencers
- Tracks referral relationships
- Maintains referral counts

## 🔧 Configuration

The application uses standard Cloudflare Workers configuration:
- `wrangler.json` - Worker configuration
- `vite.config.ts` - Build configuration
- `drizzle.config.ts` - Database configuration
- `.dev.vars` - Development environment variables

For production, set environment variables in your Cloudflare dashboard.

## 📚 Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Hono, Cloudflare Workers
- **Database**: PostgreSQL (Neon), Drizzle ORM
- **Build Tools**: Vite, TypeScript
- **Deployment**: Cloudflare Workers
