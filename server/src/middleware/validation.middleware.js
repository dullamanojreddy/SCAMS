import { validateSchema } from '../shared/validators/validator.js';

export function validateBody(schema) {
  return (req, res, next) => {
    try {
      req.body = validateSchema(schema, req.body || {});
      next();
    } catch (error) {
      next(error);
    }
  };
}
