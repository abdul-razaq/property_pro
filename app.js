import dotenv from 'dotenv';

import express from "express";

import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import compression from 'compression';

import Response from './helpers/responses.js';

import Migration from "./config/database/migrations.js";
import globalErrorHandler from "./middlewares/error_handler.js";

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

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET POST PUT PATCH DELETE');
    return Response.OK(res);
  }
  next();
});

app.all('*', (req, res, next) => {
  return Response.routeNotImplemented(res, 'route not implemented on this server.');
});
app.use(globalErrorHandler);

export default app;
