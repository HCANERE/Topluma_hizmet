import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../dist/', import.meta.url);
const context = { window: {}, document: { getElementById: () => null }, URL };
vm.createContext(context);
for (const file of ['decision-data.js', 'assessment.js', 'url-inspector.js']) {
  vm.runInContext(fs.readFileSync(new URL(file, root), 'utf8'), context);
}

const scenarios = context.window.TOD_DECISIONS;
assert.equal(scenarios.length, 7);
assert.equal(new Set(scenarios.map((item) => item.id)).size, scenarios.length);
for (const item of scenarios) {
  assert.equal(item.stages.length, 3, item.id);
  assert.ok(item.takeaway && item.message && item.sender);
  for (const stage of item.stages) {
    assert.equal(stage.options.length, 3, item.id);
    assert.equal(stage.options.filter((choice) => choice.correct).length, 1, item.id);
    assert.ok(stage.options.every((choice) => choice.text && choice.feedback), item.id);
  }
  const text = JSON.stringify(item);
  assert.ok(!/https?:\/\//.test(text), `${item.id}: no live scenario link`);
  for (const match of text.matchAll(/\b[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g)) {
    assert.ok(match[0].endsWith('.example.com') || match[0] === 'example.com', `${item.id}: fictional domains only`);
  }
}

const assessments = context.window.TOD_ASSESSMENT_QUESTIONS;
assert.equal(assessments.pre.length, 5);
assert.equal(assessments.post.length, 5);
for (const phase of ['pre', 'post']) assessments[phase].forEach((question, index) => {
  assert.equal(question.topic, index);
  assert.equal(question.options.length, 3);
  assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 3);
});

const psl = fs.readFileSync(new URL('vendor/public_suffix_list.dat', root), 'utf8');
assert.ok(psl.includes('Mozilla Public'));
const parser = context.window.TOD_URL_INSPECTOR;
const rules = parser.parseSuffixRules(psl);
assert.equal(parser.registeredDomain('portal.example.co.uk', rules), 'example.co.uk');
assert.equal(parser.registeredDomain('ogrenci.example.com.tr', rules), 'example.com.tr');
const special = parser.parseSuffixRules('*.ck\n!www.ck\n');
assert.equal(parser.registeredDomain('a.b.ck', special), 'a.b.ck');
assert.equal(parser.registeredDomain('a.www.ck', special), 'www.ck');

const html = fs.readFileSync(new URL('index.html', root), 'utf8');
const sources = [...html.matchAll(/<source src="(media\/[^"]+\.mp4)"/g)].map((match) => match[1]);
const captions = [...html.matchAll(/<track kind="captions" src="(media\/[^"]+\.vtt)"/g)].map((match) => match[1]);
assert.equal(sources.length, 7);
assert.equal(captions.length, 7);
for (const file of [...sources, ...captions]) assert.ok(fs.existsSync(new URL(file, root)), file);
for (const file of captions) assert.ok(fs.readFileSync(new URL(file, root), 'utf8').startsWith('WEBVTT'), file);
console.log('Learning content passed: 7 branched scenarios, paired test topics, domain rules, 7 local videos and captions.');
