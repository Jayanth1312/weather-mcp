import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ErrorCode, McpError, ListToolsRequestSchema, ListResourcesRequestSchema, ReadResourceRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { getWeather } from '../services/weather.service.js';
import { getCurrentLocation } from '../services/geolocation.service.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');
console.error(`[DEBUG] Loading .env from: ${envPath}`);
console.error(`[DEBUG] .env exists: ${fs.existsSync(envPath)}`);
try {
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        console.error(`[DEBUG] .env content length: ${envContent.length}`);
        const lines = envContent.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
                const [key, ...valueParts] = trimmed.split('=').filter(part => part !== undefined);
                if (key && valueParts.length > 0) {
                    const value = valueParts.join('=');
                    console.error(`[DEBUG] Setting env var: ${key}`);
                    process.env[key] = value;
                }
            }
        }
        console.error(`[DEBUG] OPENWEATHER_API_KEY set: ${!!process.env.OPENWEATHER_API_KEY}`);
    }
    else {
        console.error(`[DEBUG] .env file not found at: ${envPath}`);
    }
}
catch (err) {
    console.error(`[DEBUG] Error loading .env: ${err instanceof Error ? err.message : String(err)}`);
}
const server = new Server({
    name: "weather-mcp-server",
    version: "0.1.0",
}, {
    capabilities: {
        tools: {},
        resources: {},
    },
});
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "get_current_weather",
                description: "Get current weather information for a city or coordinates",
                inputSchema: {
                    type: "object",
                    properties: {
                        city: {
                            type: "string",
                            description: 'City name (e.g., "London", "New York")',
                        },
                        lat: {
                            type: "number",
                            description: "Latitude coordinate",
                        },
                        lon: {
                            type: "number",
                            description: "Longitude coordinate",
                        },
                    },
                    required: [],
                },
            },
            {
                name: "get_current_location_weather",
                description: "Get current weather information for your current location (automatically detected based on IP address)",
                inputSchema: {
                    type: "object",
                    properties: {},
                    required: [],
                },
            },
        ],
    };
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    if (name === "get_current_weather") {
        try {
            const params = {};
            if (args?.["city"]) {
                params.city = args["city"];
            }
            if (args?.["lat"] !== undefined && args?.["lon"] !== undefined) {
                params.lat = args["lat"];
                params.lon = args["lon"];
            }
            // Validate that we have either city or coordinates
            if (!params.city && (!params.lat || !params.lon)) {
                throw new McpError(ErrorCode.InvalidParams, "Either city name or both latitude and longitude must be provided");
            }
            const weatherData = await getWeather(params);
            return {
                content: [
                    {
                        type: "text",
                        text: `Current weather in ${weatherData.location.name}, ${weatherData.location.country}:\n` +
                            `Temperature: ${weatherData.current.temperature}°C\n` +
                            `Feels like: ${weatherData.current.feelsLike}°C\n` +
                            `Humidity: ${weatherData.current.humidity}%\n` +
                            `Pressure: ${weatherData.current.pressure} hPa\n` +
                            `Conditions: ${weatherData.current.description}\n` +
                            `Wind: ${weatherData.current.windSpeed} m/s, ${weatherData.current.windDirection}°`,
                    },
                ],
            };
        }
        catch (error) {
            if (error instanceof McpError) {
                throw error;
            }
            throw new McpError(ErrorCode.InternalError, `Failed to get weather data: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    if (name === "get_current_location_weather") {
        try {
            const location = await getCurrentLocation();
            const weatherData = await getWeather(location.lat === 0 && location.lon === 0
                ? { city: location.city }
                : { lat: location.lat, lon: location.lon });
            return {
                content: [
                    {
                        type: "text",
                        text: `📍 Detected Location: ${location.city}, ${location.country}\n\n` +
                            `Current weather:\n` +
                            `Temperature: ${weatherData.current.temperature}°C\n` +
                            `Feels like: ${weatherData.current.feelsLike}°C\n` +
                            `Humidity: ${weatherData.current.humidity}%\n` +
                            `Pressure: ${weatherData.current.pressure} hPa\n` +
                            `Conditions: ${weatherData.current.description}\n` +
                            `Wind: ${weatherData.current.windSpeed} m/s, ${weatherData.current.windDirection}°\n\n` +
                            `Timezone: ${location.timezone}`,
                    },
                ],
            };
        }
        catch (error) {
            if (error instanceof McpError) {
                throw error;
            }
            throw new McpError(ErrorCode.InternalError, `Failed to get location or weather data: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
});
// Resource: Current weather data (JSON format)
server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
        resources: [
            {
                uri: "weather://current",
                name: "Current Weather Data",
                description: "Current weather information in structured JSON format",
                mimeType: "application/json",
            },
            {
                uri: "weather://current-location",
                name: "Current Location Weather Data",
                description: "Weather information for your current location (auto-detected) in JSON format",
                mimeType: "application/json",
            },
        ],
    };
});
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    if (request.params.uri === "weather://current") {
        try {
            const weatherData = await getWeather({ city: "London" });
            return {
                contents: [
                    {
                        uri: request.params.uri,
                        mimeType: "application/json",
                        text: JSON.stringify(weatherData, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            throw new McpError(ErrorCode.InternalError, `Failed to read weather resource: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    if (request.params.uri === "weather://current-location") {
        try {
            const location = await getCurrentLocation();
            const weatherData = await getWeather(location.lat === 0 && location.lon === 0
                ? { city: location.city }
                : { lat: location.lat, lon: location.lon });
            const combinedData = {
                location: {
                    ...weatherData.location,
                    detectedCity: location.city,
                    detectedCountry: location.country,
                    timezone: location.timezone,
                    isp: location.isp,
                },
                current: weatherData.current,
                timestamp: weatherData.timestamp,
            };
            return {
                contents: [
                    {
                        uri: request.params.uri,
                        mimeType: "application/json",
                        text: JSON.stringify(combinedData, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            throw new McpError(ErrorCode.InternalError, `Failed to read location weather resource: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    throw new McpError(ErrorCode.InvalidRequest, `Resource not found: ${request.params.uri}`);
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch((error) => {
    process.exit(1);
});
export { server };
//# sourceMappingURL=mcp-server.js.map