export function requestIdMiddleware(req, res, next) {
  const reqId = req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  req.id = reqId;
  res.setHeader('X-Request-ID', reqId);
  next();
}
