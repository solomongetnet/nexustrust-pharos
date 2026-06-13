# Simple MCP Server

A simple Model Context Protocol (MCP) server with basic tools.

## Tools included

1. `greet` - Greet someone by name
2. `add` - Add two numbers together
3. `list-files` - List simulated files in directories

## Installation

```bash
npm install
```

## Running the server

### Development mode (with tsx):
```bash
npm run dev
```

### Build and run:
```bash
npm run build
npm start
```

## How to use with Claude Desktop

Add this to your Claude Desktop configuration file (usually `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "simple-mcp-server": {
      "command": "node",
      "args": ["path/to/your/mcp/dist/server.js"],
      "cwd": "path/to/your/mcp"
    }
  }
}
```

Or for development (using tsx):
```json
{
  "mcpServers": {
    "simple-mcp-server": {
      "command": "npx",
      "args": ["tsx", "src/server.ts"],
      "cwd": "path/to/your/mcp"
    }
  }
}
```

Then restart Claude Desktop to connect to the server!
