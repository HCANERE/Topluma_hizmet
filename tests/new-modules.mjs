import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createServer } from 'node:http';
import { createReputationHandler, prepareAddress } from '../scripts/reputation-service.mjs';

const root = new URL('../dist/', import.meta.url);
const context = { window: {}, document: { getElementById: () => null } };
vm.createContext(context);
vm.runInContext(fs.readFileSync(new URL('message-analyzer.js', root), 'utf8'), context);
const analyze = context.window.TOD_MESSAGE_ANALYZER.analyzeMessage;
assert.ok(analyze('Paketiniz bugün bekliyor. 14 TL ücret ödeyin: kargo.example.com').findings.some((item) => item.id === 'payment'));
assert.ok(analyze('Giriş kodunu hemen bana yaz, kimseye söyleme.').findings.some((item) => item.id === 'secret'));
assert.equal(analyze('Yarın saat 14.00 için konuştuğumuz toplantı geçerli.').findings.length, 0);
assert.ok(analyze('Yarın saat 14.00 için konuştuğumuz toplantı geçerli.').summary.includes('güvenli olduğunu kanıtlamaz'));
assert.ok(analyze('').error);

assert.equal(prepareAddress('https://example.com/path?token=private#frag'), 'https://example.com/path');
assert.throws(() => prepareAddress('https://name:secret@example.com/'));
assert.throws(() => prepareAddress('file:///tmp/test'));
assert.throws(() => prepareAddress('http://127.0.0.1/test'));

async function withServer(handler, action) {
  const server = createServer(handler);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try { await action(`http://127.0.0.1:${server.address().port}`); }
  finally { await new Promise((resolve) => server.close(resolve)); }
}
await withServer(createReputationHandler({ apiKey: '' }), async (base) => {
  assert.deepEqual(await (await fetch(`${base}/api/reputation/status`)).json(), { available: false });
  assert.equal((await fetch(`${base}/api/reputation/check`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' })).status, 503);
});
let calls = 0;
await withServer(createReputationHandler({ apiKey: 'test-key', fetchImpl: async (target) => {
  calls += 1;
  assert.equal(target.origin, 'https://safebrowsing.googleapis.com');
  assert.equal(target.searchParams.get('key'), 'test-key');
  assert.equal(target.searchParams.get('urls'), 'https://example.com/bad');
  return { ok: true, json: async () => ({ threats: [{ threatTypes: ['SOCIAL_ENGINEERING'] }], cacheDuration: '60s' }) };
} }), async (base) => {
  const send = () => fetch(`${base}/api/reputation/check`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ address: 'https://example.com/bad?token=private' }) });
  assert.deepEqual((await (await fetch(`${base}/api/reputation/status`)).json()), { available: true });
  const first = await send();
  assert.equal(first.status, 200);
  assert.equal((await first.json()).status, 'flagged');
  assert.equal((await (await send()).json()).status, 'flagged');
  assert.equal(calls, 1, 'Google result is cached for the stated duration');
  const invalid = await fetch(`${base}/api/reputation/check`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ address: 'https://user:pass@example.com' }) });
  assert.equal(invalid.status, 400);
});

const html = fs.readFileSync(new URL('index.html', root), 'utf8');
for (const id of ['message-screen', 'path-screen', 'message-form', 'live-consent', 'live-check']) assert.ok(html.includes(`id="${id}"`), id);
const worker = fs.readFileSync(new URL('service-worker.js', root), 'utf8');
for (const file of ['message-analyzer.js', 'learning-path.js']) assert.ok(worker.includes(`'${file}'`), file);
console.log('New modules passed: local message analysis, optional reputation service, caching, privacy checks and navigation assets.');
