// Vercel Serverless Function to handle GET request with body for vehicles/filter
import type { VercelRequest, VercelResponse } from '@vercel/node';
import https from 'https';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-device-id, x-platform');
    return res.status(200).end();
  }

  // Only allow POST (we'll convert to GET with body)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = JSON.stringify(req.body || {});
    const authHeader = req.headers.authorization || '';
    const deviceId = req.headers['x-device-id'] || '';
    const platform = req.headers['x-platform'] || '';

    // Make GET request with body to the actual API
    const options = {
      hostname: 'api.internal.naarni.com',
      port: 443,
      path: '/api/v1/vehicles/filter',
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        ...(deviceId && { 'x-device-id': deviceId as string }),
        ...(platform && { 'x-platform': platform as string }),
      },
    };

    return new Promise<void>((resolve, reject) => {
      const proxyReq = https.request(options, (proxyRes) => {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-device-id, x-platform');
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = proxyRes.statusCode || 200;

        // Forward response body
        proxyRes.on('data', (chunk) => {
          res.write(chunk);
        });

        proxyRes.on('end', () => {
          res.end();
          resolve();
        });

        proxyRes.on('error', (error: any) => {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: error.message }));
          reject(error);
        });
      });

      proxyReq.on('error', (error: any) => {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: error.message }));
        reject(error);
      });

      // Write body to GET request
      proxyReq.write(body);
      proxyReq.end();
    });
  } catch (error: any) {
    res.statusCode = 500;
    return res.json({ error: error.message || 'Internal server error' });
  }
}

