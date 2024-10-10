import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Helper function to ensure all required environment variables are defined
const getEnvVariable = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

// Define the structure of the environment variables
interface EnvConfig {
  PORT: string;
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  MYSTIFLY_API_URL: string;
  BEARER_TOKEN: string;
}

// Create a config object and throw errors for missing variables
const config: EnvConfig = {
  PORT: getEnvVariable('PORT', '4001'),
  DB_HOST: getEnvVariable('DB_HOST'),
  DB_USER: getEnvVariable('DB_USER'),
  DB_PASSWORD: getEnvVariable('DB_PASSWORD'),
  DB_NAME: getEnvVariable('DB_NAME'),
  MYSTIFLY_API_URL: getEnvVariable('MYSTIFLY_API_URL'),
  BEARER_TOKEN: getEnvVariable('BEARER_TOKEN'),
};

export default config;
