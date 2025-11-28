# Model Context Protocol (MCP) Server

This project includes an MCP server that exposes movie database operations as tools for AI assistants.

## Running the MCP Server

The MCP server supports two transport modes:

### Local Mode (stdio)
For use with Claude Desktop and other local MCP clients:

```bash
# Build and run in stdio mode (default)
npm run mcp

# Development mode
npm run mcp:dev
```

### HTTP Mode (for Azure/Cloud)
For remote access and cloud deployment:

```bash
# Run in HTTP mode locally
npm run mcp:http

# Or set environment variable
MCP_TRANSPORT=http npm run mcp
```

The HTTP server will run on port 3001 (or `PORT` env var) with SSE endpoint at `/sse`.

## Configuration

### 1. Local Mode (stdio) - Claude Desktop

Add to your Claude Desktop config file:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "nodefun-movies": {
      "command": "node",
      "args": [
        "c:\\Repos\\NodeFun\\dist\\mcp-server.js"
      ],
      "cwd": "c:\\Repos\\NodeFun"
    }
  }
}
```

**Note**: Make sure to run `npm run build` first to compile the TypeScript files.

### 2. HTTP Mode - Cloud/Remote Access

**For Azure App Service deployment**, the MCP server is integrated into the main Express app:

**Endpoint**: `https://your-app.azurewebsites.net/sse`

The main application (`src/app.ts`) automatically includes the MCP server and exposes the `/sse` endpoint for remote MCP clients.

**Azure App Service Setup:**
1. Build the project: `npm run build`
2. Deploy to Azure App Service (deployment uses `src/index.ts` which starts the Express app)
3. The `/sse` endpoint will be available automatically at your Azure URL
4. Configure your MCP client to connect to: `https://your-app.azurewebsites.net/sse`

**Standalone MCP Server (optional):**
If you want to run only the MCP server without the REST API:

```bash
# Run in HTTP mode locally
npm run mcp:http

# Or set environment variable
MCP_TRANSPORT=http npm run mcp
```

This runs a dedicated MCP server on port 3001 (or `PORT` env var) with SSE endpoint at `/sse`.

## Available Tools

Once configured, the following tools will be available to AI assistants:

### `get_movie`
Get a specific movie by its ID.

**Parameters:**
- `id` (number, required): The movie ID

**Example:**
```json
{
  "id": 1
}
```

### `search_movies`
Search for movies by title, genre, or rating.

**Parameters:**
- `query` (string, optional): Search query for movie titles
- `genre` (string, optional): Filter by genre
- `minRating` (number, optional): Minimum rating threshold
- `maxResults` (number, optional): Maximum results to return (default: 10)

**Example:**
```json
{
  "query": "inception",
  "minRating": 8.0,
  "maxResults": 5
}
```

### `list_movies`
List all movies with pagination support.

**Parameters:**
- `limit` (number, optional): Number of movies to return (default: 20)
- `offset` (number, optional): Number of movies to skip (default: 0)

**Example:**
```json
{
  "limit": 10,
  "offset": 0
}
```

### `get_movie_stats`
Get statistics about the movie database.

**Parameters:** None

**Returns:**
- Total number of movies
- Unique genres
- Budget and gross totals
- Average rating and runtime

## How It Works

The MCP server uses the [Model Context Protocol](https://modelcontextprotocol.io/) to expose structured tools that AI assistants can discover and invoke. It supports:

- **stdio transport**: For local integration with desktop applications
- **HTTP/SSE transport**: For remote access and cloud deployment
- **Type-safe tool definitions**: Using JSON Schema for parameters
- **Error handling**: Structured error responses

## Architecture

```
AI Assistant
     ↓
MCP Client (stdio or HTTP/SSE)
     ↓
MCP Server (src/mcp-server.ts)
     ↓
Movie Service (src/services/movieService.ts)
     ↓
CSV Data (src/data/movies.csv)
```

The MCP server acts as a bridge between AI assistants and your movie database, providing a standardized interface for tool invocation.
