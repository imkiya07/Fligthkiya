import dotenv from "dotenv";
import knex from "knex";
import { dbConfig as config } from "../config/knexfile";

dotenv.config();

// Set up the environment configuration (development/production)
const environment = process.env.NODE_ENV || "development";
const dbConfig = config[environment];

// Initialize Knex with the appropriate configuration
const db = knex(dbConfig);

// Export the database connection
export default db;
