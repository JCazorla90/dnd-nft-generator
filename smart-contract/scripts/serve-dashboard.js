const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const server = http.createServer((req, res) => {
  const dashboardPath = path.join(__dirname, '../gas-dashboard.html');
  
  if (!fs.existsSync(dashboardPath)) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>Dashboard no encontrado</h1><p>Ejecuta: npm run test:gas && npm run dashboard</p>');
    return;
  }
  
  const html = fs.readFileSync(dashboardPath, 'utf8');
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
});

server.listen(PORT, () => {
  console.log(`🌐 Dashboard disponible en: http://localhost:${PORT}`);
  console.log(`📊 Ctrl+C para detener el servidor`);
  
  // Abrir automáticamente en el navegador
  const open = require('open');
  open(`http://localhost:${PORT}`);
});
