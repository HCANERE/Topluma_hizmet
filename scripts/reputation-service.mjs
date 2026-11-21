import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';
import { serveStatic } from './serve.mjs';

const endpoint = 'https://safebrowsing.googleapis.com/v5/urls:search';
const maxRequestBytes = 4096;

export function prepareAddress(value) {
  if (typeof value !== 'string' || !value.trim() || value.length > 2048 || /\s/.test(value)) throw new Error('Geçerli bir web adresi girin.');
  let url;
  try { url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`); }
  catch (_) { throw new Error('Adres çözümlenemedi.'); }
  if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.') || url.username || url.password || url.hostname.startsWith('[') || /^\d+(?:\.\d+){3}$/.test(url.hostname)) {
    throw new Error('Yalnızca kullanıcı bilgisi içermeyen HTTP veya HTTPS alan adları sorgulanabilir.');
  }
  // A message link may carry a personal token in its query or fragment.
  url.search = '';
  url.hash = '';
  return url.href;
}

export function createReputationHandler({ apiKey = process.env.SAFE_BROWSING_API_KEY, fetchImpl = fetch, now = Date.now } = {}) {
  const cache = new Map();
  const recent = [];
  function json(response, code, body) {
    response.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    response.end(JSON.stringify(body));
  }
  return async (request, response) => {
    const route = (request.url || '').split('?', 1)[0];
    if (route === '/api/reputation/status') {
      if (request.method !== 'GET') return json(response, 405, { message: 'Yöntem desteklenmiyor.' });
      return json(response, 200, { available: Boolean(apiKey) });
    }
    if (route !== '/api/reputation/check') return serveStatic(request, response);
    if (request.method !== 'POST') return json(response, 405, { message: 'Yöntem desteklenmiyor.' });
    if (!apiKey) return json(response, 503, { message: 'Canlı sorgu yapılandırılmadı.' });
    if (!/^application\/json(?:;|$)/i.test(request.headers['content-type'] || '')) return json(response, 415, { message: 'JSON gövdesi gerekli.' });

    const chunks = [];
    let bytes = 0;
    try {
      for await (const chunk of request) {
        bytes += chunk.length;
        if (bytes > maxRequestBytes) return json(response, 413, { message: 'İstek çok uzun.' });
        chunks.push(chunk);
      }
    } catch (_) { return json(response, 400, { message: 'İstek okunamadı.' }); }
    let address;
    try { address = prepareAddress(JSON.parse(Buffer.concat(chunks).toString('utf8')).address); }
    catch (error) { return json(response, 400, { message: error.message || 'Adres geçersiz.' }); }

    const cacheKey = createHash('sha256').update(address).digest('hex');
    for (const [key, entry] of cache) if (entry.expires <= now()) cache.delete(key);
    const cached = cache.get(cacheKey);
    if (cached && cached.expires > now()) return json(response, 200, cached.result);
    const cutoff = now() - 60_000;
    while (recent[0] < cutoff) recent.shift();
    if (recent.length >= 15) return json(response, 429, { message: 'Bir dakika sonra tekrar deneyin.' });
    recent.push(now());

    try {
      const target = new URL(endpoint);
      target.searchParams.set('urls', address);
      target.searchParams.set('key', apiKey);
      const upstream = await fetchImpl(target, { signal: AbortSignal.timeout(7000), headers: { Accept: 'application/json' } });
      if (!upstream.ok) throw new Error('Upstream unavailable');
      const payload = await upstream.json();
      const flagged = Array.isArray(payload.threats) && payload.threats.length > 0;
      const result = { status: flagged ? 'flagged' : 'no-match', checkedAt: new Date(now()).toISOString() };
      const seconds = Number.parseFloat(payload.cacheDuration || '0s');
      const ttl = Number.isFinite(seconds) ? Math.max(0, Math.min(seconds, flagged ? 1800 : 86400)) * 1000 : 0;
      if (ttl > 0) cache.set(cacheKey, { result, expires: now() + ttl });
      return json(response, 200, result);
    } catch (_) {
      return json(response, 502, { message: 'Tehdit listesine şu anda ulaşılamadı.' });
    }
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = createServer(createReputationHandler());
  server.on('error', (error) => { console.error('Yerel servis başlatılamadı.', error.message); process.exitCode = 1; });
  server.listen(Number(process.env.PORT ?? 8766), '127.0.0.1', () => {
    console.log('Tıklamadan Önce Düşün: http://127.0.0.1:' + server.address().port);
    console.log(process.env.SAFE_BROWSING_API_KEY ? 'İsteğe bağlı Safe Browsing sorgusu hazır.' : 'Safe Browsing anahtarı yok; yalnızca yerel analiz kullanılabilir.');
  });
}
