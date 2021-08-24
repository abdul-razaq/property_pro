import dotenv from 'dotenv';
import { Pool } from 'node-postgres';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_CONN_STRING,
});

