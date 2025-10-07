interface GeolocationData {
    city: string;
    country: string;
    countryCode: string;
    lat: number;
    lon: number;
    timezone: string;
    isp: string;
}
export declare const getCurrentLocation: () => Promise<GeolocationData>;
export {};
