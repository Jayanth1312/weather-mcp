# Weather MCP Server

A Model Context Protocol (MCP) server that provides weather information through Claude Desktop.

## Features

- 🌤️ **Get Current Weather** - Fetch weather for any city or coordinates
- 📍 **Auto-Location Weather** - Automatically detect your location (IP-based or manual)
- 🔄 **Caching** - 10-minute cache to reduce API calls
- 🌐 **OpenWeatherMap Integration** - Reliable weather data

## Quick Setup for Claude Desktop

### 1. Clone and Install
```bash
git clone https://github.com/Jayanth1312/weather-mcp.git
cd weather-mcp
npm install && npm run build
```

### 2. Get OpenWeatherMap API Key
Get a free API key at: https://openweathermap.org/api

### 3. Configure Environment
Create `.env` file:
```bash
# Required
OPENWEATHER_API_KEY=your_api_key_here

# Optional: For accurate "current location" weather (recommended)
# IP-based detection can be off by 50-200km
DEFAULT_LOCATION_CITY=YourCity
DEFAULT_LOCATION_COUNTRY=YourCountry
DEFAULT_LOCATION_COUNTRY_CODE=US
DEFAULT_LOCATION_TIMEZONE=America/New_York
```

### 4. Add to Claude Desktop Config

**Config file location:**
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

**Add this configuration:**
```json
{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": ["/path/to/weather-mcp/dist/mcp/mcp-server.js"]
    }
  }
}
```

Replace `/absolute/path/to/weather-mcp` with your actual path (e.g., `C:/Users/YourName/weather-mcp` on Windows).

### 5. Restart Claude Desktop

Close and reopen Claude Desktop completely.

## Usage

Ask Claude:
- "What's the weather in London?"
- "Get weather for New York"
- "What's the weather in my location?" (uses your configured city or IP detection)
- "How's the weather here?"

## Available Tools

### `get_current_weather`
Get weather for a specific location.
- **Parameters:** `city` (optional), `lat` (optional), `lon` (optional)

### `get_current_location_weather`
Get weather for your current location (auto-detected or from `.env`).
- **Parameters:** None

**Note:** IP-based geolocation points to your ISP's hub city. Set `DEFAULT_LOCATION_CITY` in `.env` for accuracy.
