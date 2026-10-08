import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { logger } from '../../config/logger';
import { sendResponse } from '../utils/response';
import { env } from '../../config/env';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({ err, path: req.path, method: req.method }, 'Operational AppError 500+');
    }
    return sendResponse(res, err.statusCode, {
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // Unhandled internal errors
  logger.error({ err, path: req.path, method: req.method }, 'Unhandled Exception');

  const message = env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  return sendResponse(res, 500, {
    success: false,
    message,
  });
};
