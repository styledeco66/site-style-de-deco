const http = require('http');
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4'
};
http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const rel = urlPath === '/' ? 'index.html' : urlPath.slice(1);
  const filePath = path.join(root, rel.replace(/\//g, path.sep));
  if (!filePath.startsWith(root)) { res.writeHead(403); return res.end(); }
  const ext = path.extname(filePath).toLowerCase();
  const isHtml = ext === '.html';
  const readOptions = isHtml ? 'utf8' : undefined;
  fs.readFile(filePath, readOptions, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    const contentType = mime[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}).listen(8000, '0.0.0.0', () => console.log('Server on 8000'));
