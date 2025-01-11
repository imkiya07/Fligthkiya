import dotenv from "dotenv";
import knex from "knex";
import { dbConfig as config } from "../config/knexfile";

dotenv.config();

const environment = process.env.NODE_ENV || "development";
const dbConfig = config[environment];

// Initialize Knex with the appropriate configuration
const db = knex(dbConfig);

// Test the database connection
db.raw("SELECT 1")
  .then(() => {
    console.log(`${process.env.DB_HOST} Database connected successfully!`);
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });

// Export the database connection
export default db;
