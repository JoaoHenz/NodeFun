# NodeFun

A Node.js backend API with Model Context Protocol (MCP) capabilities for managing movie data.

## Features

- **Express API**: REST endpoints for movie data
- **MCP Server**: Exposes movie operations as tools for AI assistants ([Learn more](./MCP.md))
- **TypeScript**: Full type safety
- **Movie Database**: CSV-based movie data with search and filtering

## Roadmap
- Needs to be a Node backend [done]
- Needs MCP capabilities [done]
- Needs a React frontend (monorepo)

## Getting Started

### Installation

```bash
npm install
```

### Running the Express API

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

The API will be available at `http://localhost:3000` with these endpoints:

- `GET /` - Hello World
- `GET /health` - Health check
- `GET /movies/:id` - Get a movie by ID

### MCP Server

Want to integrate with AI assistants? See the **[MCP Server Documentation](./MCP.md)** for setup instructions.

## Development

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Format code
npm run format
```

## Tech Stack

- **Runtime**: Node.js 22.x
- **Framework**: Express 5
- **Language**: TypeScript
- **Testing**: Vitest
- **MCP**: Model Context Protocol SDK
