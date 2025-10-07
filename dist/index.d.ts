import 'dotenv/config';
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT?: string;
            NODE_ENV?: 'development' | 'production' | 'test';
            OPENWEATHER_API_KEY?: string;
        }
    }
}
