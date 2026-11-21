import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const inputPath = process.argv[2];
const checkOnly = process.argv.includes('--check');
if (!inputPath || inputPath === '--check') {
  console.error('Kullanım: node scripts/add-scenarios.mjs DOSYA.json [--check]');
  process.exit(1);
}
const bankContext = { window: {} };
vm.createContext(bankContext);
vm.runInContext(fs.readFileSync(path.join(repo, 'dist/data.js'), 'utf8'), bankContext);
const bank = bankContext.window.TOD_DATA;
const existing = JSON.parse(fs.readFileSync(path.join(repo, 'content/extra-scenarios.json'), 'utf8'));
const incoming = JSON.parse(fs.readFileSync(path.resolve(inputPath), 'utf8'));
if (!Array.isArray(incoming) || !incoming.length || incoming.length > 30) throw new Error('JSON dosyası 1–30 senaryo içermeli.');
const ids = new Set(Object.values(bank).flatMap((group) => group.questions.map((item) => item.id)).concat(existing.map((item) => item.id)));
const limits = { topic: 90, from: 90, message: 900, explanation: 500, tip: 220, review: 160 };
function checkText(value, label, max) {
  if (typeof value !== 'string' || value.trim().length < 6 || value.length > max) throw new Error(`${label}: 6–${max} karakter gerekli.`);
  if (/https?:\/\//i.test(value)) throw new Error(`${label}: tıklanabilir tam bağlantı yerine example.com örneği yaz.`);
  for (const match of value.matchAll(/\b[a-z0-9][a-z0-9.-]*\.[a-z]{2,}\b/gi)) {
    if (match[0] !== 'example.com' && !match[0].endsWith('.example.com')) throw new Error(`${label}: yalnızca example.com örnek adresleri kullanılabilir.`);
  }
}
for (const item of incoming) {
  if (!item || !Object.hasOwn(bank, item.category)) throw new Error('Geçersiz kategori.');
  if (!/^custom-(youth|parents|seniors)-[a-z0-9-]+$/.test(item.id || '') || ids.has(item.id)) throw new Error(`Yinelenen veya geçersiz senaryo kimliği: ${item.id}`);
  ids.add(item.id);
  if (!['sms', 'email', 'social', 'call'].includes(item.kind)) throw new Error(`${item.id}: ileti türü geçersiz.`);
  for (const [field, max] of Object.entries(limits)) checkText(item[field], `${item.id} ${field}`, max);
  if (item.kind === 'email') checkText(item.subject, `${item.id} subject`, 100);
  if (!Array.isArray(item.choices) || item.choices.length !== 3 || !item.choices.every((text) => typeof text === 'string' && text.length <= 180)) throw new Error(`${item.id}: üç seçenek gerekli.`);
  item.choices.forEach((text, index) => checkText(text, `${item.id} seçenek ${index + 1}`, 180));
  if (![0, 1, 2].includes(item.correct)) throw new Error(`${item.id}: doğru seçenek geçersiz.`);
  if (!Array.isArray(item.clues) || item.clues.length !== 2) throw new Error(`${item.id}: iki işaret gerekli.`);
  item.clues.forEach((text, index) => checkText(text, `${item.id} işaret ${index + 1}`, 140));
}
if (checkOnly) { console.log(`${incoming.length} senaryo doğrulandı. Dosya değiştirilmedi.`); process.exit(0); }
const combined = [...existing, ...incoming];
fs.writeFileSync(path.join(repo, 'content/extra-scenarios.json'), `${JSON.stringify(combined, null, 2)}\n`);
fs.writeFileSync(path.join(repo, 'dist/extra-scenarios.js'), `(function () {\n  'use strict';\n  const scenarios = ${JSON.stringify(combined, null, 2)};\n  for (const { category, ...question } of scenarios) window.TOD_DATA[category].questions.push(question);\n})();\n`);
const workerFile = path.join(repo, 'dist/service-worker.js');
const worker = fs.readFileSync(workerFile, 'utf8');
fs.writeFileSync(workerFile, worker.replace(/(tod-training-v)(\d+)/, (_, prefix, version) => `${prefix}${Number(version) + 1}`));
console.log(`${incoming.length} senaryo eklendi. Toplam ek senaryo: ${combined.length}. npm test çalıştırın.`);
