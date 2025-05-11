import * as dotenv from 'dotenv';

dotenv.config();

// Define a type for the environment variables
interface EnvConfig {
    DB_HOST: string;
    DB_PORT: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    JWT_SECRET: string;
    MAP_API_KEY: string;
    MAP_URL_COORDINATES: string;
    MAP_URL_CITY: string;
    MAP_FIELD_MASK: string;
}

// Ensure environment variables are defined and of the correct type
const requiredEnvVars: (keyof EnvConfig)[] = [
    'DB_HOST',
    'DB_PORT',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_NAME',
    'JWT_SECRET',
    'MAP_API_KEY',
    'MAP_URL_COORDINATES',
    'MAP_URL_CITY',
    'MAP_FIELD_MASK',
];

for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
    }
}

// Cast to the correct types and parse where necessary
export const EnvironmentConfig = {
    hostDB: process.env.DB_HOST!,
    portDB: parseInt(process.env.DB_PORT!, 10),
    usernameDB: process.env.DB_USERNAME!,
    passwordDB: process.env.DB_PASSWORD!,
    nameDB: process.env.DB_NAME!,
    jwtSecret: process.env.JWT_SECRET!,
    mapApiKey: process.env.MAP_API_KEY!,
    mapUrlCoordinates: process.env.MAP_URL_COORDINATES!,
    mapUrlCity: process.env.MAP_URL_CITY!,
    mapFieldMask: process.env.MAP_FIELD_MASK!,
};

if (isNaN(EnvironmentConfig.portDB)) {
    throw new Error('DB_PORT must be a valid number');
}
