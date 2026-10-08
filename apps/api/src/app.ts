import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import pinoHttp from 'pino-http';
import { env } from './config/env';
import { logger } from './config/logger';
import apiRouter from './routes';
import { errorHandler } from './common/middleware/error-handler';
import { NotFoundError } from './common/errors/app-error';
import { setupSwagger } from './config/swagger';

export const createApp = () => {
  const app = express();

  // Security & Utility Middleware
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGINS.split(',').map((o) => o.trim()),
      credentials: true,
    })
  );
  app.use(compression());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  if (env.NODE_ENV !== 'test') {
    app.use(
      pinoHttp({
        logger,
        autoLogging: {
          ignore: (req) => req.url?.includes('/health') || req.url?.includes('/docs'),
        },
      })
    );
  }

  // Swagger Documentation
  setupSwagger(app);

  // Mount API v1
  app.use('/api/v1', apiRouter);

  // 404 Route Handler
  app.use((req, _res, next) => {
    next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
  });

  // Central Error Handler
  app.use(errorHandler);

  return app;
};
