interface WeatherParams {
    city?: string;
    lat?: number;
    lon?: number;
}
interface FilteredWeatherData {
    location: {
        name: string;
        country: string;
        coordinates: {
            lat: number;
            lon: number;
        };
    };
    current: {
        temperature: number;
        feelsLike: number;
        humidity: number;
        pressure: number;
        description: string;
        icon: string;
        windSpeed: number;
        windDirection: number;
    };
    timestamp: number;
    timezone: number;
}
export declare const getWeather: (params: WeatherParams) => Promise<FilteredWeatherData>;
export {};
