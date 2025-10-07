/**
 * Get weather emoji based on weather condition and icon code
 * OpenWeatherMap icon codes: https://openweathermap.org/weather-conditions
 */
export declare const getWeatherEmoji: (description: string, iconCode: string) => string;
/**
 * Get temperature emoji based on temperature value
 */
export declare const getTemperatureEmoji: (temp: number) => string;
export declare const getWindEmoji: (windSpeed: number) => string;
export declare const getHumidityEmoji: (humidity: number) => string;
