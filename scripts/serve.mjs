import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';

const assets = new URL('../dist/', import.meta.url);
const types = new Map([
  ['html', 'text/html; charset=utf-8'],
  ['css', 'text/css; charset=utf-8'],
  ['js', 'text/javascript; charset=utf-8'],
  ['svg', 'image/svg+xml'],
]);

export async function serveStatic(request, response) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }

  const path = (request.url ?? '/').split('?', 1)[0];
  const file = path === '/' ? 'index.html' : path.slice(1);
  const match = /^([a-z0-9-]+)\.([a-z]+)$/i.exec(file);
  const type = match && types.get(match[2]);

  if (!type) {
    response.writeHead(404).end();
    return;
  }

  try {
    const content = await readFile(new URL(file, assets));
    response.writeHead(200, { 'Content-Type': type });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch (error) {
    if (error.code === 'ENOENT') response.writeHead(404).end();
    else response.writeHead(500).end();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT ?? 8766);
  const host = '127.0.0.1';
  const server = createServer(serveStatic);
  server.on('error', (error) => {
    console.error('Yerel sunucu başlatılamadı.', error.message);
    process.exitCode = 1;
  });
  server.listen(port, host, () => {
    console.log('Tıklamadan Önce Düşün: http://' + host + ':' + server.address().port);
  });
}
