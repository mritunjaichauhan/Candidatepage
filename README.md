# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Candidate Dashboard - Hirecentive

A modern candidate dashboard application built with React, Vite, and TailwindCSS, deployable on Cloudflare Workers.

## 🛠️ Tech Stack

### Frontend
- **React 19.0.0** - Modern React with latest features
- **Vite 6.1.0** - Fast build tool and development server
- **TailwindCSS 4.0.7** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript

### UI Libraries
- **Material-UI** - React components library
- **Radix UI** - Headless UI primitives
- **shadcn/ui** - Modern React components
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Routing & State Management
- **React Router DOM 7.2.0** - Client-side routing

### Backend & API
- **Express.js** - Backend API server
- **CORS** - Cross-origin resource sharing
- **Axios** - HTTP client

### Deployment
- **Cloudflare Workers** - Serverless deployment platform
- **Wrangler** - Cloudflare CLI tool

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd candidatepage

# Install dependencies
npm install
# or
pnpm install
```

### Development

```bash
# Start the frontend development server
npm run dev

# Start the backend API server (in a separate terminal)
cd backend && npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:8080`.

### Building for Production

```bash
# Build the application
npm run build
```

This creates a `dist` directory with production-ready files.

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
```

## ☁️ Cloudflare Deployment

This application is configured for deployment on Cloudflare Workers with static assets.

### Deployment Commands

```bash
# Deploy to production
npm run deploy

# Deploy to staging environment
npm run deploy:staging

# Deploy to production environment
npm run deploy:production
```

### Environment Configuration

- **Local Development**: Configure variables in `.dev.vars`
- **Production**: Set environment variables in the Cloudflare dashboard

### Wrangler Configuration

The project includes a `wrangler.toml` file with:
- Static asset serving from `./dist`
- Single-page application routing
- Multiple environment support (staging/production)
- Cloudflare Pages Functions for API routes

## 📁 Project Structure

```
candidatepage/
├── src/                    # React application source
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── lib/               # Utilities and libraries
│   └── styles/            # CSS and styling
├── backend/               # Express.js API server
├── functions/             # Cloudflare Pages Functions
├── public/                # Static assets
├── dist/                  # Production build output
├── wrangler.toml          # Cloudflare configuration
├── .dev.vars              # Local environment variables
└── package.json           # Dependencies and scripts
```

## 🔧 Configuration Files

- `vite.config.js` - Vite build configuration
- `tailwind.config.js` - TailwindCSS configuration
- `wrangler.toml` - Cloudflare Workers configuration
- `components.json` - shadcn/ui configuration

## 🌐 Features

- **Multi-step Forms** - Dynamic form components
- **Responsive Design** - Mobile-first approach
- **Google Translate Integration** - Real-time translation support
- **Modern UI** - Beautiful and accessible components
- **Type Safety** - Full TypeScript support
- **Fast Development** - Hot module replacement
- **Production Ready** - Optimized builds
- **Serverless Deployment** - Cloudflare Workers

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to Cloudflare
- `npm run deploy:staging` - Deploy to staging
- `npm run deploy:production` - Deploy to production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
