import { RateLimitError } from '../shared/errors/AppError.js';
import { config } from '../config/env.js';

const requestCounts = new Map();

// Periodic cleanup
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of requestCounts.entries()) {
    if (now - record.startTime > config.rateLimit.windowMs) {
      requestCounts.delete(key);
    }
  }
}, 60000);

export function rateLimit(limit = config.rateLimit.maxRequests, windowMs = config.rateLimit.windowMs) {
  return (req, res, next) => {
    const key = `${req.ip || 'local'}_${req.user?.id || 'anonymous'}_${req.baseUrl}`;
    const now = Date.now();

    let record = requestCounts.get(key);
    if (!record || now - record.startTime > windowMs) {
      record = { count: 1, startTime: now };
      requestCounts.set(key, record);
    } else {
      record.count += 1;
    }

    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - record.count));

    if (record.count > limit) {
      return next(new RateLimitError(`Rate limit exceeded (${limit} req / ${windowMs / 1000}s). Please slow down.`));
    }

    next();
  };
}
