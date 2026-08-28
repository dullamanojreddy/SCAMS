import { AppError } from '../shared/errors/AppError.js';
import { ApiResponse } from '../shared/utils/response.js';
import { Logger } from '../config/logger.js';

export function errorMiddleware(err, req, res, next) {
  const requestId = req.id || 'unknown';

  if (err instanceof AppError) {
    Logger.warn(`AppError [${err.code}]: ${err.message}`, {
      statusCode: err.statusCode,
      requestId,
      path: req.originalUrl,
      userId: req.user?.id,
      details: err.details,
    });

    return ApiResponse.error(res, err.code, err.message, err.statusCode, err.details);
  }

  // Handle unexpected internal errors
  Logger.error(`Unhandled Error: ${err.message}`, {
    stack: err.stack,
    requestId,
    path: req.originalUrl,
    userId: req.user?.id,
  });

  return ApiResponse.error(
    res,
    'INTERNAL_SERVER_ERROR',
    'An unexpected error occurred on the server.',
    500,
    err.message
  );
}

export function notFoundMiddleware(req, res, next) {
  return ApiResponse.error(
    res,
    'ENDPOINT_NOT_FOUND',
    `Cannot ${req.method} ${req.originalUrl}`,
    404
  );
}
