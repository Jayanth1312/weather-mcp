/**
 * Get weather emoji based on weather condition and icon code
 * OpenWeatherMap icon codes: https://openweathermap.org/weather-conditions
 */
export const getWeatherEmoji = (description, iconCode) => {
    const desc = description.toLowerCase();
    // Check icon code first (more reliable)
    // Icon codes: 01d/01n = clear, 02d/02n = few clouds, 03d/03n = scattered clouds
    // 04d/04n = broken clouds, 09d/09n = shower rain, 10d/10n = rain
    // 11d/11n = thunderstorm, 13d/13n = snow, 50d/50n = mist
    const iconBase = iconCode.substring(0, 2);
    const isNight = iconCode.endsWith('n');
    switch (iconBase) {
        case '01': // Clear sky
            return isNight ? '🌙' : '☀️';
        case '02': // Few clouds
            return isNight ? '🌙☁️' : '🌤️';
        case '03': // Scattered clouds
            return '☁️';
        case '04': // Broken clouds / Overcast
            return '☁️';
        case '09': // Shower rain
            return '🌧️';
        case '10': // Rain
            return isNight ? '🌧️' : '🌦️';
        case '11': // Thunderstorm
            return '⛈️';
        case '13': // Snow
            return '❄️';
        case '50': // Mist / Fog
            return '🌫️';
        default:
            break;
    }
    // Fallback to description-based matching
    if (desc.includes('clear')) {
        return isNight ? '🌙' : '☀️';
    }
    if (desc.includes('thunder') || desc.includes('storm')) {
        return '⛈️';
    }
    if (desc.includes('drizzle') || desc.includes('shower')) {
        return '🌧️';
    }
    if (desc.includes('rain')) {
        return '🌧️';
    }
    if (desc.includes('snow') || desc.includes('sleet')) {
        return '❄️';
    }
    if (desc.includes('mist') || desc.includes('fog') || desc.includes('haze')) {
        return '🌫️';
    }
    if (desc.includes('cloud')) {
        if (desc.includes('few') || desc.includes('scattered')) {
            return isNight ? '🌙☁️' : '🌤️';
        }
        return '☁️';
    }
    if (desc.includes('dust') || desc.includes('sand')) {
        return '💨';
    }
    if (desc.includes('smoke')) {
        return '💨';
    }
    if (desc.includes('tornado')) {
        return '🌪️';
    }
    // Default
    return '🌡️';
};
/**
 * Get temperature emoji based on temperature value
 */
export const getTemperatureEmoji = (temp) => {
    if (temp >= 35)
        return '🥵'; // Very hot
    if (temp >= 30)
        return '🔥'; // Hot
    if (temp >= 25)
        return '☀️'; // Warm
    if (temp >= 20)
        return '😊'; // Pleasant
    if (temp >= 15)
        return '🌤️'; // Mild
    if (temp >= 10)
        return '🧥'; // Cool
    if (temp >= 5)
        return '🥶'; // Cold
    return '❄️'; // Very cold
};
export const getWindEmoji = (windSpeed) => {
    if (windSpeed >= 20)
        return '🌪️'; // Very strong wind
    if (windSpeed >= 10)
        return '💨'; // Strong wind
    if (windSpeed >= 5)
        return '🍃'; // Moderate wind
    return '🌬️'; // Light wind
};
export const getHumidityEmoji = (humidity) => {
    if (humidity >= 80)
        return '💧'; // Very humid
    if (humidity >= 60)
        return '💦'; // Humid
    return '💨'; // Dry
};
//# sourceMappingURL=weather-emoji.js.map