import express from 'express';
import { apiRouter } from './routes.js';

export function createExpressApp() {
  const app = express();

  // JSON Body Parser
  app.use(express.json());

  // API Health Route
  app.get(['/health', '/api/health'], (_req, res) => {
    res.json({
      status: 'ok',
      service: 'BuildCalc Engine v2',
      timestamp: new Date().toISOString(),
    });
  });

  // OAuth callback route for Google Sign-In popup flow
  app.get(['/auth/callback', '/auth/callback/', '/api/auth/callback'], (req, res) => {
    const code = req.query.code || '';
    const error = req.query.error || '';
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>Authenticating with Google...</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background-color: #0d0d0f;
              color: #f59e0b;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              text-align: center;
            }
            .box {
              background: #151518;
              border: 1px solid #272730;
              border-radius: 12px;
              padding: 24px;
              max-width: 380px;
            }
          </style>
        </head>
        <body>
          <div class="box">
            <p style="font-weight: 500; font-size: 15px; margin-bottom: 8px;">Google Authentication Complete</p>
            <p style="color: #90909c; font-size: 13px; margin: 0;">Closing popup and returning to BuildCalc...</p>
          </div>
          <script>
            if (window.opener) {
              window.opener.postMessage({
                type: 'OAUTH_AUTH_SUCCESS',
                provider: 'google',
                code: ${JSON.stringify(code)},
                error: ${JSON.stringify(error)}
              }, '*');
              setTimeout(() => {
                window.close();
              }, 400);
            } else {
              window.location.href = '/';
            }
          </script>
        </body>
      </html>
    `);
  });

  // Mount API Router under /api
  app.use('/api', apiRouter);

  // Fallback mount directly in case Vercel rewrite strips the /api prefix
  app.use(apiRouter);

  return app;
}

export const app = createExpressApp();
