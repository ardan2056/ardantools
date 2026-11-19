const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 4000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8'
};

function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);

  // API Route: Translate proxy
  if (reqPath === '/api/translate') {
    const translateHandler = require('./api/translate.js');
    return translateHandler(req, res);
  }

  if (reqPath === '/') reqPath = '/index.html';

  let filePath = path.join(ROOT, reqPath);

  // Security: prevent directory traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    // If not found or is directory without index, rewrite to index.html (SPA routing)
    if (err || stats.isDirectory()) {
      filePath = path.join(ROOT, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500);
        res.end('Server Error');
        return;
      }
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
      });
      res.end(content);
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIP();
  console.log('\n=============================================');
  console.log('   Ardan Tools Server Berhasil Dijalankan!   ');
  console.log('=============================================');
  console.log(`> Akses di PC kamu   : http://localhost:${PORT}`);
  console.log(`> Akses di HP / LAN  : http://${ip}:${PORT}`);
  console.log(`> Tool RNG langsung  : http://localhost:${PORT}/tools/rng`);
  console.log('=============================================\n');
});
