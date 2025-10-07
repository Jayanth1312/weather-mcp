import axios from 'axios';
const logger = {
    info: (message, meta) => console.error(`[INFO] ${message}`, meta || ''),
    error: (error, message) => console.error(`[ERROR] ${message}`, error),
};
export const getCurrentLocation = async () => {
    try {
        const manualCity = process.env['DEFAULT_LOCATION_CITY'];
        const manualLat = process.env['DEFAULT_LOCATION_LAT'];
        const manualLon = process.env['DEFAULT_LOCATION_LON'];
        const manualCountry = process.env['DEFAULT_LOCATION_COUNTRY'] || 'Unknown';
        const manualCountryCode = process.env['DEFAULT_LOCATION_COUNTRY_CODE'] || 'XX';
        const manualTimezone = process.env['DEFAULT_LOCATION_TIMEZONE'] || 'UTC';
        if (manualCity) {
            logger.info(`Using manual location override: ${manualCity}, ${manualCountry}`);
            return {
                city: manualCity,
                country: manualCountry,
                countryCode: manualCountryCode,
                lat: 0,
                lon: 0,
                timezone: manualTimezone,
                isp: 'Manual Override',
            };
        }
        if (manualLat && manualLon) {
            const lat = parseFloat(manualLat);
            const lon = parseFloat(manualLon);
            if (!isNaN(lat) && !isNaN(lon)) {
                logger.info(`Using manual coordinates override: ${lat}, ${lon}`);
                return {
                    city: process.env['DEFAULT_LOCATION_CITY'] || 'Custom Location',
                    country: manualCountry,
                    countryCode: manualCountryCode,
                    lat,
                    lon,
                    timezone: manualTimezone,
                    isp: 'Manual Override',
                };
            }
        }
        logger.info('Fetching current location based on IP address (Note: May be inaccurate by 50-200km)');
        const response = await axios.get('http://ip-api.com/json/?fields=status,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query');
        if (response.status === 200 && response.data && response.data.status === 'success') {
            const data = response.data;
            const locationData = {
                city: data.city,
                country: data.country,
                countryCode: data.countryCode,
                lat: data.lat,
                lon: data.lon,
                timezone: data.timezone,
                isp: data.isp,
            };
            logger.info(`IP-based location detected: ${locationData.city}, ${locationData.country} (ISP: ${locationData.isp})`);
            logger.info(`⚠️  Note: IP location may be inaccurate. Set DEFAULT_LOCATION_CITY in .env for better accuracy.`);
            return locationData;
        }
        throw new Error('Failed to get location data from IP API');
    }
    catch (error) {
        logger.error({ error }, 'Error fetching geolocation data');
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const detail = error.response?.data?.message || error.message;
            throw new Error(`Failed to fetch location data (${status ?? 'unknown'}): ${detail}`);
        }
        throw new Error('Failed to fetch location data');
    }
};
//# sourceMappingURL=geolocation.service.js.map