import express, { Express, Request, Response } from 'express';
import { MongoDb } from './config/db';
import logger from './middleware/logger';
import router from './routes/users'

export function createApp(db: MongoDb): Express {
    const app = express();
    app.use(express.json());
    app.use(logger);
    app.use('/users', router);
    app.get('/health', async (_req, res) => {
    const ok = await db.ping();
    res.json({ ok });
  });

  return app;
};