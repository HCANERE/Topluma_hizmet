import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const js = fs.readFileSync(new URL('./dist/data.js', import.meta.url), 'utf8');
const context = { window: {} };
vm.runInNewContext(js, context);
vm.runInNewContext(fs.readFileSync(new URL('./dist/extra-scenarios.js', import.meta.url), 'utf8'), context);
const bank = context.window.TOD_DATA;
assert.deepEqual(Object.keys(bank), ['youth', 'parents', 'seniors']);
const ids = new Set();
const kinds = new Set(['sms', 'email', 'social', 'call']);
for (const [category, group] of Object.entries(bank)) {
  assert.ok(group.questions.length >= 5, `${category}: at least five questions`);
  for (const [index, question] of group.questions.entries()) {
    assert.ok(!ids.has(question.id), `${question.id}: unique id`);
    ids.add(question.id);
    assert.ok(kinds.has(question.kind), `${question.id}: valid message frame`);
    assert.equal(question.choices.length, 3, `${question.id}: three choices`);
    assert.ok(Number.isInteger(question.correct) && question.correct >= 0 && question.correct < 3, `${question.id}: one correct choice`);
    for (const field of ['topic', 'from', 'message', 'explanation', 'tip', 'review']) {
      assert.ok(typeof question[field] === 'string' && question[field].trim(), `${question.id}: ${field}`);
    }
    assert.ok(question.clues.length >= 2, `${question.id}: clues`);
    if (question.kind === 'email') assert.ok(question.subject, `${question.id}: email subject`);
    const allText = JSON.stringify(question);
    assert.ok(!/https?:\/\//i.test(allText), `${question.id}: no live links`);
    for (const match of allText.matchAll(/\b[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g)) {
      assert.ok(match[0].endsWith('.example.com') || match[0] === 'example.com', `${question.id}: example domain only`);
    }
    assert.ok(index < group.questions.length);
  }
}
assert.ok(ids.size >= 18);
console.log(`${ids.size} scenarios, 3 categories, choices, explanations, and example domains verified.`);
