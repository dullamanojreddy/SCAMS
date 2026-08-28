export class AppError extends Error {
  constructor(code, statusCode, message, details = null) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details = null) {
    super('VALIDATION_ERROR', 400, message, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super('UNAUTHORIZED', 401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'You do not have permission to perform this action') {
    super('FORBIDDEN', 403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource', message = null) {
    super('RESOURCE_NOT_FOUND', 404, message || `${resource} not found`);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict or overlapping schedule') {
    super('BOOKING_CONFLICT', 409, message);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Rate limit exceeded. Please try again shortly.') {
    super('RATE_LIMITED', 429, message);
  }
}

export class InvalidStateTransitionError extends AppError {
  constructor(currentStatus, targetStatus) {
    super(
      'INVALID_STATE_TRANSITION',
      400,
      `Cannot transition status from ${currentStatus} to ${targetStatus}`
    );
  }
}
