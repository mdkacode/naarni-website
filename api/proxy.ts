// Vercel Serverless Function to proxy all API requests
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

  try {
    // Extract the path from the query parameter or URL
    const path = req.url?.replace('/api/proxy', '') || req.query.path as string || '';
    const targetPath = path.startsWith('/') ? path : `/${path}`;
    
    // Get request body if present
    let body: string | undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    // Forward all headers
    const headers: Record<string, string> = {
      'Authorization': req.headers.authorization || '',
      ...(req.headers['content-type'] && { 'Content-Type': req.headers['content-type'] as string }),
      ...(req.headers['x-device-id'] && { 'x-device-id': req.headers['x-device-id'] as string }),
      ...(req.headers['x-platform'] && { 'x-platform': req.headers['x-platform'] as string }),
    };

    if (body) {
      headers['Content-Length'] = Buffer.byteLength(body).toString();
    }

    // Make request to the actual API
    const options = {
      hostname: 'api.internal.naarni.com',
      port: 443,
      path: `/api/v1${targetPath}`,
      method: req.method || 'GET',
      headers,
    };

    return new Promise<void>((resolve, reject) => {
      const proxyReq = https.request(options, (proxyRes) => {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-device-id, x-platform');
        
        // Forward response headers
        Object.keys(proxyRes.headers).forEach((key) => {
          const value = proxyRes.headers[key];
          if (value && !['content-encoding', 'transfer-encoding'].includes(key.toLowerCase())) {
            res.setHeader(key, value);
          }
        });
        
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

      // Write body if present
      if (body) {
        proxyReq.write(body);
      }
      proxyReq.end();
    });
  } catch (error: any) {
    res.statusCode = 500;
    return res.json({ error: error.message || 'Internal server error' });
  }
}

