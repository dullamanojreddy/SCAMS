export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'campus-os-access-secret-2026',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'campus-os-refresh-secret-2026',
    accessExpiresIn: '15m',
    refreshExpiresIn: '7d',
  },
  ai: {
    provider: process.env.AI_PROVIDER || 'gemini',
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.AI_MODEL || 'gemini-3.7-flash',
    maxTokens: 1024,
    temperature: 0.2,
  },
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 120, // default endpoints
    aiMaxRequests: 30, // AI specific rate limit
  },
};
