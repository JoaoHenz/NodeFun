# NodeFun Monorepo

A full-stack movie database application with Node.js backend API, MCP capabilities, and React frontend.

## 🏗️ Project Structure

This is a monorepo containing:

- **`packages/backend`**: Node.js + Express API with Model Context Protocol (MCP) server
- **`packages/frontend`**: React + TypeScript + Vite web application

## Features

### Backend
- **Express API**: REST endpoints for movie data
- **MCP Server**: Exposes movie operations as tools for AI assistants ([Learn more](./MCP.md))
- **TypeScript**: Full type safety
- **Movie Database**: CSV-based movie data with search and filtering

### Frontend
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe frontend code
- **Vite**: Fast build tooling and HMR
- **Movie Browser**: Search, filter, and browse movies with a beautiful UI

## Getting Started

### Installation

Install all dependencies for both packages:

```bash
npm install
```

### Development

Run both frontend and backend in development mode:

```bash
# Start backend (http://localhost:3000)
npm run backend:dev

# In another terminal, start frontend (http://localhost:5173)
npm run frontend:dev
```

The frontend is configured to proxy API requests to the backend automatically.

### Building

Build both packages:

```bash
npm run build
```

Or build individually:

```bash
npm run backend:build
npm run frontend:build
```

## 🚀 Deployment

### Backend Deployment (Azure App Service)

The backend is deployed to **Azure App Service** and serves:
- REST API endpoints at `/movies/*`
- MCP endpoint at `/mcp`
- Health check at `/health`

**Deployment steps:**
1. Build the backend: `npm run backend:build`
2. Deploy the `packages/backend` folder to Azure App Service
3. Set environment variables as needed
4. The app will start with `node dist/index.js`

**Azure App Service URL**: `https://your-app.azurewebsites.net`

### Frontend Deployment (Azure Static Web Apps)

The React frontend should be deployed to **Azure Static Web Apps** for optimal performance:

**Deployment steps:**
1. Build the frontend: `npm run frontend:build`
2. Deploy the `packages/frontend/dist` folder to Azure Static Web Apps
3. Configure the backend API URL in environment variables if needed
4. Update the Vite proxy configuration for production

**Alternative**: You can also deploy the frontend to a separate Azure App Service.

### Environment Configuration

**Backend** (`packages/backend/.env`):
```env
PORT=3000
NODE_ENV=production
```

**Frontend** (Vite environment):
Create `packages/frontend/.env.production`:
```env
VITE_API_URL=https://your-backend.azurewebsites.net
```

Then update `packages/frontend/vite.config.ts` to use the environment variable in production.

## API Endpoints

### REST API
- `GET /` - Hello World
- `GET /health` - Health check
- `GET /movies` - List movies (supports `limit` and `offset` query params)
- `GET /movies/search` - Search movies (supports `query`, `genre`, `minRating`, `maxResults`)
- `GET /movies/stats` - Get movie database statistics
- `GET /movies/:id` - Get a specific movie by ID

### MCP Endpoint
- `POST /mcp` - Model Context Protocol endpoint for AI assistants

## Development Commands

### Root Level
```bash
npm run build              # Build all packages
npm run dev                # Run dev mode for all packages
npm run test               # Run tests in all packages
```

### Backend
```bash
npm run backend:build      # Build backend
npm run backend:dev        # Run backend in dev mode
npm run backend:start      # Run backend in production mode
npm run backend:mcp        # Run MCP server (stdio mode)
npm run backend:mcp:http   # Run MCP server (HTTP mode)
```

### Frontend
```bash
npm run frontend:build     # Build frontend for production
npm run frontend:dev       # Run frontend dev server
npm run frontend:preview   # Preview production build
```

## MCP Server

For detailed MCP setup and usage, see **[MCP Documentation](./MCP.md)**.

## Tech Stack

### Backend
- **Runtime**: Node.js 22.x
- **Framework**: Express 5
- **Language**: TypeScript
- **Testing**: Vitest
- **MCP**: Model Context Protocol SDK

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite 6
- **Styling**: CSS Modules

## Project Roadmap

- ✅ Node.js backend with Express
- ✅ MCP capabilities for AI integration
- ✅ React frontend in monorepo
- 🔄 Azure deployment configuration
- 📋 Add user authentication
- 📋 Add movie ratings and reviews
