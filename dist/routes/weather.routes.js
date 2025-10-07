import { Router } from 'express';
import { getWeather } from '../services/weather.service';
import { logger } from '../server/app';
const router = Router();
// Validation middleware
const validateWeatherParams = (req, res, next) => {
    const { city, lat, lon } = req.query;
    // Check if city is provided and is a string
    if (city && (typeof city !== 'string' || city.trim().length === 0)) {
        return res.status(400).json({
            error: 'City name must be a non-empty string'
        });
    }
    // Check if lat/lon are provided and are valid numbers
    if (lat && (typeof lat !== 'string' || isNaN(parseFloat(lat)))) {
        return res.status(400).json({
            error: 'Latitude must be a valid number'
        });
    }
    if (lon && (typeof lon !== 'string' || isNaN(parseFloat(lon)))) {
        return res.status(400).json({
            error: 'Longitude must be a valid number'
        });
    }
    // Check if either city or both lat/lon are provided
    if (!city && (!lat || !lon)) {
        return res.status(400).json({
            error: 'Either city name or both latitude and longitude are required'
        });
    }
    // Check if both lat and lon are provided together
    if ((lat && !lon) || (!lat && lon)) {
        return res.status(400).json({
            error: 'Both latitude and longitude must be provided together'
        });
    }
    next();
};
router.get('/current', validateWeatherParams, async (req, res) => {
    try {
        const { city, lat, lon } = req.query;
        const weather = await getWeather({
            city: city,
            lat: lat ? parseFloat(lat) : undefined,
            lon: lon ? parseFloat(lon) : undefined
        });
        return res.json(weather);
    }
    catch (error) {
        if (error instanceof Error) {
            // Handle specific error types
            if (error.message.includes('city not found') || error.message.includes('Invalid API key')) {
                return res.status(404).json({ error: error.message });
            }
            logger.error({ error: error.message }, 'Weather API error');
            return res.status(500).json({ error: 'Failed to fetch weather data' });
        }
        logger.error('Unknown error in weather route');
        return res.status(500).json({ error: 'An unknown error occurred' });
    }
});
export const weatherRouter = router;
//# sourceMappingURL=weather.routes.js.map