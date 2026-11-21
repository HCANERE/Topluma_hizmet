import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../dist/', import.meta.url);
const context = { window: {}, document: { getElementById: () => null } };
vm.createContext(context);
for (const file of ['chatbot-data.js', 'chatbot.js']) vm.runInContext(fs.readFileSync(new URL(file, root), 'utf8'), context);

const entries = context.window.TOD_CHAT_CONTENT;
const answer = context.window.TOD_CHAT_GUIDE.answerQuestion;
assert.ok(entries.length >= 15);
assert.equal(new Set(entries.map((item) => item.id)).size, entries.length);
const html = fs.readFileSync(new URL('index.html', root), 'utf8');
const router = fs.readFileSync(new URL('app.js', root), 'utf8');
for (const item of entries) {
  assert.ok(item.answer && item.title && item.sourceTitle, item.id);
  assert.match(item.href, /^#[a-z0-9-]+$/);
  assert.ok(html.includes(`id="${item.href.slice(1)}"`) || router.includes(`'${item.href.slice(1)}'`), `${item.id}: source route exists`);
}

const cases = [
  ['Giriş kodumu paylaştım, şimdi ne yapmalıyım?', 'code-shared'],
  ['Kart bilgilerimi şüpheli sayfaya girdim', 'card-entered'],
  ['Dolandırıcıya para gönderdim', 'money-sent'],
  ['Şüpheli linke tıkladım', 'link-opened'],
  ['Şifremi sahte siteye yazdım', 'password-entered'],
  ['Biri doğrulama kodumu istiyor', 'code-request'],
  ['Giriş kodumu paylaşmadım ama istiyorlar', 'code-request'],
  ['Bana kargo mesajı geldi, nasıl doğrularım?', 'package'],
  ['Oltalama nedir?', 'phishing'],
  ['Gördüğüm video gerçek mi?', 'fake-video'],
  ['Tanıdık sesle arayıp para istiyorlar', 'fake-voice'],
  ['QR kodu okutmalı mıyım?', 'qr'],
  ['Bu bağlantı güvenli mi?', 'url'],
  ['https://example.com/path?token=do-not-send', 'url'],
  ['Burs için işlem ücreti istiyorlar', 'scholarship'],
  ['Birinden yeni IBAN ile para isteği geldi', 'payment-request'],
  ['Polis olduğunu söyleyen biri aradı', 'authority'],
  ['Hastane randevusu için ödeme mesajı geldi', 'health'],
  ['Büyük indirimli alışveriş sitesi buldum', 'shopping'],
  ['Okul gezi ödemesi için hesap verdi', 'school'],
  ['İki aşamalı doğrulama hesabımı korur mu?', 'account'],
  ['Ekranımı paylaşmamı isteyen teknik destek aradı', 'remote-support'],
  ['Şüpheli mesajı nasıl teyit ederim?', 'verify'],
  ['Bu site virüslü mü?', 'url'],
  ['Şüpheli linke tıklamadım, nasıl incelerim?', 'url']
];
for (const [question, expected] of cases) assert.equal(answer(question).id, expected, question);
assert.equal(answer('Bugün matematik dersinde integral konusunu anlatır mısın?').type, 'unknown');
assert.equal(answer('').type, 'empty');
assert.equal(answer('x'.repeat(401)).type, 'empty');
assert.ok(html.includes('id="chat-screen"') && html.includes('id="chat-input"'));
assert.ok(html.includes('data-site-nav="chat"'));
const worker = fs.readFileSync(new URL('service-worker.js', root), 'utf8');
for (const file of ['chatbot-data.js', 'chatbot.js']) assert.ok(worker.includes(`'${file}'`), file);
assert.ok(!fs.readFileSync(new URL('chatbot.js', root), 'utf8').includes('localStorage'));
console.log('Chatbot passed: Turkish topic routing, incident priority, uncertainty, source routes, no persisted chat.');
