import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';

const assets = new URL('../dist/', import.meta.url);
const types = new Map([
  ['html', 'text/html; charset=utf-8'],
  ['css', 'text/css; charset=utf-8'],
  ['js', 'text/javascript; charset=utf-8'],
  ['svg', 'image/svg+xml'],
  ['txt', 'text/plain; charset=utf-8'],
  ['dat', 'text/plain; charset=utf-8'],
  ['vtt', 'text/vtt; charset=utf-8'],
  ['mp4', 'video/mp4'],
  ['gz', 'application/gzip'],
  ['webmanifest', 'application/manifest+json'],
]);

export async function serveStatic(request, response) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }

  const path = (request.url ?? '/').split('?', 1)[0];
  const file = path === '/' ? 'index.html' : path.slice(1);
  const parts = file.split('/');
  const safeDirectory = parts.length === 1 ||
    (parts[0] === 'media' && parts.length === 2) ||
    (parts[0] === 'vendor' && (parts.length === 2 ||
      (parts[1] === 'ocr' && (parts.length === 3 || (['core', 'lang'].includes(parts[2]) && parts.length === 4)))));
  const match = safeDirectory && /^[a-z0-9][a-z0-9._-]*\.([a-z0-9]+)$/i.exec(parts.at(-1));
  const type = match && types.get(match[1]);

  if (!type) {
    response.writeHead(404).end();
    return;
  }

  try {
    const content = await readFile(new URL(file, assets));
    const headers = { 'Content-Type': type, 'Accept-Ranges': 'bytes' };
    const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range ?? '');
    if (range) {
      let start = range[1] ? Number(range[1]) : Math.max(0, content.length - Number(range[2]));
      let end = range[2] && range[1] ? Number(range[2]) : content.length - 1;
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start >= content.length || start > end || end < 0) {
        response.writeHead(416, { 'Content-Range': `bytes */${content.length}` }).end();
        return;
      }
      start = Math.max(0, start);
      end = Math.min(content.length - 1, end);
      headers['Content-Range'] = `bytes ${start}-${end}/${content.length}`;
      headers['Content-Length'] = end - start + 1;
      response.writeHead(206, headers);
      response.end(request.method === 'HEAD' ? undefined : content.subarray(start, end + 1));
      return;
    }
    headers['Content-Length'] = content.length;
    response.writeHead(200, headers);
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
