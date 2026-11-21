import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createServer } from 'node:http';
import { serveStatic } from '../scripts/serve.mjs';

const root = new URL('../dist/', import.meta.url);
const context = { window: {}, document: { getElementById: () => null } };
vm.createContext(context);
for (const file of ['report-merge.js', 'media-lab.js', 'message-analyzer.js']) vm.runInContext(fs.readFileSync(new URL(file, root), 'utf8'), context);

const { parseExport, mergeReports, createCsv } = context.window.TOD_REPORT_MERGE;
const first = { count: 2, preTotal: 3, postTotal: 8, feedbackYes: 1, feedbackCount: 2, postMisses: [0, 1, 0, 0, 1] };
const second = { count: 3, preTotal: 7, postTotal: 12, feedbackYes: 2, feedbackCount: 3, postMisses: [1, 0, 0, 1, 0] };
assert.deepEqual(JSON.parse(JSON.stringify(parseExport(createCsv(first)))), first);
const total = mergeReports([parseExport(createCsv(first)), parseExport(createCsv(second))]);
assert.deepEqual(JSON.parse(JSON.stringify(total)), { count: 5, preTotal: 10, postTotal: 20, feedbackYes: 3, feedbackCount: 5, postMisses: [1, 1, 0, 1, 1] });
assert.throws(() => parseExport('"Ölçüt";"Değer"\n"Tamamlanan oturum";"1"'), /Eski CSV/);
assert.throws(() => parseExport(createCsv({ ...first, preTotal: 11 })), /tutarsız/);
assert.throws(() => parseExport(createCsv({ ...first, feedbackYes: 3 })), /tutarsız/);

const cases = context.window.TOD_MEDIA_LAB.cases;
assert.equal(cases.length, 3);
for (const item of cases) {
  assert.equal(item.options.length, 3);
  assert.ok([0, 1, 2].includes(item.correct));
  assert.ok(item.explanation.length > 40);
}
assert.ok(context.window.TOD_MESSAGE_ANALYZER.analyzeMessage('Hemen 14 TL odeme yapin').findings.some((item) => item.id === 'payment'));

const server = createServer(serveStatic);
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
try {
  const base = `http://127.0.0.1:${server.address().port}`;
  for (const asset of ['vendor/ocr/tesseract.min.js', 'vendor/ocr/worker.min.js', 'vendor/ocr/core/tesseract-core-lstm.wasm.js', 'vendor/ocr/lang/tur.traineddata.gz']) {
    assert.equal((await fetch(`${base}/${asset}`, { method: 'HEAD' })).status, 200, asset);
  }
  assert.equal((await fetch(`${base}/vendor/ocr/core/../secret.txt`)).status, 404);
} finally { await new Promise((resolve) => server.close(resolve)); }

const html = fs.readFileSync(new URL('index.html', root), 'utf8');
for (const id of ['review-screen', 'media-screen', 'reports-screen', 'guest-progress', 'message-image']) assert.ok(html.includes(`id="${id}"`), id);
const worker = fs.readFileSync(new URL('service-worker.js', root), 'utf8');
for (const asset of ['extra-scenarios.js', 'image-ocr.js', 'guest-progress.js', 'report-merge.js', 'media-lab.js']) assert.ok(worker.includes(`'${asset}'`), asset);
console.log('Expansion passed: adaptive review, OCR assets, report merging, media cases, and guest entry points.');
