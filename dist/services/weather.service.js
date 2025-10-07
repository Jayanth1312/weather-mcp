import axios from 'axios';
import NodeCache from 'node-cache';
// Simple console logging for MCP server compatibility
const logger = {
    info: (message, meta) => console.error(`[INFO] ${message}`, meta || ''),
    error: (error, message) => console.error(`[ERROR] ${message}`, error),
};
// Cache for 10 minutes
const cache = new NodeCache({ stdTTL: 600 });
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
// Helper function to get API key at runtime (not at module load time)
const getApiKey = () => {
    return process.env.OPENWEATHER_API_KEY || 'your_api_key_here';
};
const generateCacheKey = (params) => {
    if (params.city)
        return `weather:${params.city.toLowerCase()}`;
    return `weather:${params.lat},${params.lon}`;
};
export const getWeather = async (params) => {
    const cacheKey = generateCacheKey(params);
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        logger.info(`Cache hit for ${cacheKey}`);
        return cachedData;
    }
    try {
        // Get API key at runtime
        const OPENWEATHER_API_KEY = getApiKey();
        // Fail fast if API key is not configured
        if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'your_api_key_here') {
            throw new Error('OpenWeather API key not configured. Set OPENWEATHER_API_KEY in .env');
        }
        let url = `${BASE_URL}/weather?appid=${OPENWEATHER_API_KEY}&units=metric`;
        if (params.city) {
            url += `&q=${encodeURIComponent(params.city)}`;
        }
        else if (params.lat !== undefined && params.lon !== undefined) {
            url += `&lat=${params.lat}&lon=${params.lon}`;
        }
        else {
            throw new Error('Either city or both latitude and longitude must be provided');
        }
        // Redact API key in logs
        const redactedUrl = url.replace(/appid=[^&]+/, 'appid=***');
        logger.info(`Fetching weather data from OpenWeatherMap: ${redactedUrl}`);
        const response = await axios.get(url);
        if (response.status === 200 && response.data) {
            // Filter and transform the data
            const filteredData = {
                location: {
                    name: response.data.name,
                    country: response.data.sys.country,
                    coordinates: {
                        lat: response.data.coord.lat,
                        lon: response.data.coord.lon,
                    },
                },
                current: {
                    temperature: Math.round(response.data.main.temp),
                    feelsLike: Math.round(response.data.main.feels_like),
                    humidity: response.data.main.humidity,
                    pressure: response.data.main.pressure,
                    description: response.data.weather[0]?.description || 'Unknown',
                    icon: response.data.weather[0]?.icon || '01d',
                    windSpeed: response.data.wind?.speed || 0,
                    windDirection: response.data.wind?.deg || 0,
                },
                timestamp: response.data.dt,
                timezone: response.data.timezone,
            };
            cache.set(cacheKey, filteredData);
            return filteredData;
        }
        throw new Error('Invalid response from weather service');
    }
    catch (error) {
        logger.error({ error }, 'Error fetching weather data');
        // Provide more context if this is an HTTP error
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const detail = error.response?.data?.message || error.message;
            throw new Error(`Failed to fetch weather data (${status ?? 'unknown'}): ${detail}`);
        }
        throw new Error('Failed to fetch weather data');
    }
};
//# sourceMappingURL=weather.service.js.map