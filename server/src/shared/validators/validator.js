import { ValidationError } from '../errors/AppError.js';

export function validateSchema(schema, data) {
  const errors = [];
  const sanitized = {};

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push({ field, message: `${field} is required` });
      continue;
    }

    if (value !== undefined && value !== null && value !== '') {
      if (rules.type === 'string' && typeof value !== 'string') {
        errors.push({ field, message: `${field} must be a string` });
      } else if (rules.type === 'number' && typeof value !== 'number' && isNaN(Number(value))) {
        errors.push({ field, message: `${field} must be a number` });
      } else if (rules.type === 'array' && !Array.isArray(value)) {
        errors.push({ field, message: `${field} must be an array` });
      } else if (rules.enum && !rules.enum.includes(value)) {
        errors.push({ field, message: `${field} must be one of [${rules.enum.join(', ')}]` });
      } else if (rules.min && value.length !== undefined && value.length < rules.min) {
        errors.push({ field, message: `${field} must be at least ${rules.min} characters` });
      } else if (rules.max && value.length !== undefined && value.length > rules.max) {
        errors.push({ field, message: `${field} must be at most ${rules.max} characters` });
      } else {
        sanitized[field] = rules.type === 'number' ? Number(value) : value;
      }
    } else if (rules.default !== undefined) {
      sanitized[field] = rules.default;
    }
  }

  if (errors.length > 0) {
    throw new ValidationError('Validation failed for request payload', errors);
  }

  return sanitized;
}
