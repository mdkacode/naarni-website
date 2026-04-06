// Vite Plugin to handle GET requests with body via proxy
import type { Plugin } from 'vite';
import https from 'https';
import { URL } from 'url';

export function proxyGetWithBody(): Plugin {
  return {
    name: 'proxy-get-with-body',
    configureServer(server) {
      server.middlewares.use('/api/v1/vehicles/filter', async (req, res, next) => {
        // Only handle POST requests (browser sends POST, we convert to GET)
        if (req.method === 'POST') {
          try {
            const chunks: Buffer[] = [];
            
            // Read request body
            req.on('data', (chunk) => {
              chunks.push(chunk);
            });
            
            req.on('end', () => {
              const body = Buffer.concat(chunks).toString();
              const authHeader = req.headers.authorization || '';
              
              // Parse API URL
              const apiUrl = new URL('https://api.internal.naarni.com/api/v1/vehicles/filter');
              
              // Make GET request with body using Node.js https
              const options = {
                hostname: apiUrl.hostname,
                port: 443,
                path: apiUrl.pathname,
                method: 'GET',
                headers: {
                  'Authorization': authHeader,
                  'Content-Type': 'application/json',
                  'Content-Length': Buffer.byteLength(body),
                },
              };
              
              const proxyReq = https.request(options, (proxyRes) => {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = proxyRes.statusCode || 200;
                
                // Forward response
                proxyRes.on('data', (chunk) => {
                  res.write(chunk);
                });
                
                proxyRes.on('end', () => {
                  res.end();
                });
              });
              
              proxyReq.on('error', (error: any) => {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: error.message }));
              });
              
              // Write body to GET request
              proxyReq.write(body);
              proxyReq.end();
            });
          } catch (error: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: error.message }));
          }
        } else {
          next();
        }
      });
    },
  };
}

