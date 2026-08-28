import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import app from './server/src/app.js';
import { errorMiddleware, notFoundMiddleware } from './server/src/middleware/error.middleware.js';

async function startServer() {
  const PORT = 3000;

  // === Vite Middleware Integration for React SPA ===
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global Error Handlers (after routes)
  app.use(errorMiddleware);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Campus OS Server running at http://localhost:${PORT}`);
  });
}

startServer();
