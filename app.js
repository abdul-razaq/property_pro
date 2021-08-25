import dotenv from 'dotenv';

import express from "express";
import Migration from "./config/database/migrations.js";

import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import compression from 'compression';

dotenv.config();

const basePath = '/api/v1';

await Migration.createTables();
const app = express();

app.enable('trust proxy');
app.use(cors());
app.use(helmet());
app.use('/api', rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'too many requests from this IP address. Please try again in an hour.',
}));
app.use(xss());
app.use(compression());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.json({
  limit: '10kb',
}));
process.env.APP_MODE === "DEVELOPMENT" && app.use(morgan('dev'));

export default app;
