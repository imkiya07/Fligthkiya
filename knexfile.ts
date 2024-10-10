import dotenv from "dotenv";
import { Knex } from "knex";
import config from "./src/config/config";

dotenv.config();

const dbConfig: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    connection: {
      host: config.DB_HOST,
      user: config.DB_USER,
      password: config.DB_PASSWORD,
      database: config.DB_NAME,
    },
  },
};

export default dbConfig;
