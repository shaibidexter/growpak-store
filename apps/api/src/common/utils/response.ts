import { Response } from 'express';
import { ApiResponse } from '@growpak/shared';

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  payload: {
    success: boolean;
    message?: string;
    data?: T;
    meta?: Record<string, any>;
    errors?: Record<string, string[]>;
  }
) => {
  const body: ApiResponse<T> = {
    success: payload.success,
    message: payload.message,
    data: payload.data,
    meta: payload.meta,
    errors: payload.errors,
  };
  return res.status(statusCode).json(body);
};

export const sendSuccess = <T>(res: Response, data?: T, message = 'Success', statusCode = 200, meta?: Record<string, any>) => {
  return sendResponse<T>(res, statusCode, {
    success: true,
    message,
    data,
    meta,
  });
};
