import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Exercise real event handlers without requiring a browser or dependencies.
class Node {
  constructor(tag = 'div') {
    this.tagName = tag; this.children = []; this.dataset = {}; this.attrs = {};
    this.handlers = {}; this.style = {}; this.hidden = false; this.disabled = false;
    this.className = ''; this.textContent = '';
    this.classList = {
      add: (value) => { this.className += ` ${value}`; },
      remove: (value) => { this.className = this.className.split(' ').filter((item) => item !== value).join(' '); },
      toggle: (value, enabled) => {
        const classes = new Set(this.className.split(' ').filter(Boolean));
        if (enabled) classes.add(value); else classes.delete(value);
        this.className = [...classes].join(' ');
      }
    };
  }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = children; }
  setAttribute(key, value) { this.attrs[key] = value; }
  getAttribute(key) { return this.attrs[key]; }
  removeAttribute(key) { delete this.attrs[key]; }
  addEventListener(event, handler) { this.handlers[event] = handler; }
  querySelector(tag) { return this.children.find((node) => node.tagName === tag); }
  focus() { this.focused = true; }
  scrollIntoView() { this.scrolled = true; }
  click() { this.handlers.click?.(); }
}
const html = fs.readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const scriptFiles = Array.from(html.matchAll(/<script src="([\w-]+\.js)" defer><\/script>/g), ([, file]) => file);
function launch(stored = {}, blocked = false, initialHash = '') {
  const ids = new Map();
  const views = [];
  const tactics = [];
  for (const [, tag, id, attributes] of html.matchAll(/<([\w-]+)\b[^>]*?\bid="([^"]+)"([^>]*)>/g)) {
    assert.ok(!ids.has(id), `Duplicate id: ${id}`);
    const node = new Node(tag);
    node.id = id;
    node.hidden = /\bhidden\b/.test(attributes);
    for (const [, key, value] of attributes.matchAll(/([\w-]+)="([^"]*)"/g)) node.setAttribute(key, value);
    if (/\bdata-practice-view\b/.test(attributes)) views.push(node);
    if (id.startsWith('taktik-') && tag === 'details') {
      node.append(new Node('summary'));
      tactics.push(node);
    }
    if (id === 'lab-outcome') node.append(new Node('details'));
    ids.set(id, node);
  }
  const practiceLinks = Array.from(html.matchAll(/<a href="(#[^"]+)" data-practice-link>/g), ([, href]) => {
    const node = new Node('a');
    node.setAttribute('href', href);
    assert.ok(ids.has(href.slice(1)));
    return node;
  });
  const starters = ['youth', 'parents', 'seniors'].map((category) => {
    const node = new Node('button'); node.dataset.category = category; return node;
  });
  const progress = starters.map((starter) => {
    const node = new Node('p'); node.dataset.progress = starter.dataset.category; return node;
  });
  const track = new Node();
  const document = {
    body: new Node('body'), documentElement: new Node('html'),
    createElement: (tag) => new Node(tag),
    getElementById: (id) => ids.get(id) ?? null,
    querySelector: (selector) => {
      const node = selector === '.progress-track' ? track : ids.get(selector.slice(1));
      assert.ok(node, `Missing DOM target: ${selector}`); return node;
    },
    querySelectorAll: (selector) => {
      if (selector === '[data-category]') return starters;
      if (selector === '[data-progress]') return progress;
      if (selector === '[data-practice-view]') return views;
      if (selector === '[data-practice-link]') return practiceLinks;
      if (selector === '.tactic-card') return tactics;
      if (selector === '.choice-button') return ids.get('choices').children;
      throw Error(`Unexpected selector: ${selector}`);
    }
  };
  let hash = initialHash;
  const windowEvents = {};
  const window = {
    scrollTo() {},
    addEventListener: (event, handler) => { windowEvents[event] = handler; },
    location: {
      get hash() { return hash; },
      set hash(value) {
        hash = value && !value.startsWith('#') ? '#' + value : value;
        windowEvents.hashchange?.();
      }
    }
  };
  const context = {document, window, localStorage: {
    getItem: (key) => { if (blocked) throw Error('Disabled'); return stored[key] ?? null; },
    setItem: (key, value) => { if (blocked) throw Error('Disabled'); stored[key] = value; },
    removeItem: (key) => { if (blocked) throw Error('Disabled'); delete stored[key]; }
  }};
  vm.createContext(context);
  for (const path of scriptFiles) vm.runInContext(fs.readFileSync(new URL(`../dist/${path}`, import.meta.url), 'utf8'), context);
  return {ids, starters, progress, bank: window.TOD_DATA, stored, document, window, views, practiceLinks};
}
function finish(game, category, correct = true) {
  game.starters.find((node) => node.dataset.category === category).click();
  const questions = game.bank[category].questions;
  const roundLength = 5;
  const seen = new Set();
  for (let index = 0; index < roundLength; index += 1) {
    const question = questions.find((item) => item.topic === game.ids.get('question-title').textContent);
    assert.ok(question);
    assert.ok(!seen.has(question.id), 'Each question appears once per round');
    seen.add(question.id);
    assert.equal(game.ids.get('progress-text').textContent, `Soru ${index + 1} / ${roundLength}`);
    const buttons = game.ids.get('choices').children;
    buttons[correct ? question.correct : (question.correct + 1) % 3].click();
    const score = game.ids.get('live-score').textContent;
    assert.equal(score, String(correct ? (index + 1) * 20 : 0));
    buttons[question.correct].click(); // Guard against duplicate answers.
    assert.equal(game.ids.get('live-score').textContent, score);
    assert.ok(buttons.every((node) => node.disabled));
    assert.equal(game.ids.get('feedback').hidden, false);
    game.ids.get('next-button').click();
  }
  assert.equal(game.ids.get('result-screen').hidden, false);
  assert.equal(game.ids.get('final-score').textContent, `${correct ? 100 : 0} / 100`);
}
const game = launch();
for (const category of ['youth', 'parents', 'seniors']) finish(game, category);
assert.ok(game.progress.every((node) => node.textContent.includes('100 / 100')));
finish(game, 'youth', false);
assert.equal(JSON.parse(game.stored['tod-progress-v1']).youth, 100);
assert.equal(game.ids.get('review-content').children[1].children.length, 5);
game.ids.get('replay-button').click();
assert.equal(game.ids.get('live-score').textContent, '0');
game.ids.get('leave-game').click();
assert.equal(game.ids.get('home-screen').hidden, false);
game.ids.get('text-size').click();
assert.equal(game.document.documentElement.className, 'large-text');
assert.equal(launch(game.stored).ids.get('text-size').getAttribute('aria-pressed'), 'true');
game.ids.get('clear-local-data').click();
assert.equal(game.stored['tod-progress-v1'], undefined);
assert.equal(game.stored['tod-large-text'], undefined);
assert.equal(game.ids.get('text-size').getAttribute('aria-pressed'), 'false');
assert.ok(game.progress.every((node) => node.textContent.includes('5 soruluk tur')));
assert.equal(game.ids.get('clear-local-status').textContent, 'Bu cihazdaki oyun kayıtları temizlendi.');
finish(launch({}, true), 'seniors');
finish(launch({'tod-progress-v1': '{invalid'}), 'parents');
finish(launch({'tod-progress-v1': 'null'}), 'youth');
console.log('Game flows passed: 3 categories, scoring, duplicate answers, review, replay, local progress, text size, unavailable and invalid storage.');

const practice = launch({}, false, '#laboratuvar');
const { ids, views, practiceLinks, window: practiceWindow } = practice;
assert.equal(ids.get('home-screen').hidden, true);
assert.equal(ids.get('practice-screen').hidden, false);
assert.deepEqual(views.filter((view) => !view.hidden).map((view) => view.id), ['laboratuvar']);
assert.equal(practiceLinks[0].getAttribute('aria-current'), 'page');
assert.equal(ids.get('skip-link').getAttribute('href'), '#practice-screen');

const labChecks = ids.get('lab-checks');
const evidenceText = () => ids.get('lab-evidence').children[0].children[1].textContent;
labChecks.children.at(-1).click();
const initialCall = evidenceText();
ids.get('lab-hold').click();
assert.equal(ids.get('lab-outcome').hidden, false);
practiceWindow.location.hash = '#taktik-tanidik';
assert.deepEqual(views.filter((view) => !view.hidden).map((view) => view.id), ['taktik-rehberi']);
assert.equal(ids.get('taktik-tanidik').open, true);
assert.equal(practiceLinks[0].getAttribute('aria-current'), undefined);
assert.equal(practiceLinks[1].getAttribute('aria-current'), 'page');

practiceWindow.location.hash = '#laboratuvar';
assert.equal(ids.get('lab-outcome').hidden, false, 'Return from the guide preserves the scene');
ids.get('lab-rewind').click();
labChecks.children.at(-1).click();
assert.equal(evidenceText(), initialCall);
ids.get('lab-accept').click();
ids.get('lab-variant').click();
labChecks.children.at(-1).click();
assert.notEqual(evidenceText(), initialCall);

const labButtons = ids.get('lab-scenarios').children;
assert.deepEqual(labButtons.map((button) => button.textContent), ['Deniz’den mesaj', 'Kargo bildirimi', 'Hesaba giriş uyarısı']);
for (const [index, sender, check, theme] of [
  [1, 'Ada Teslimat', 'Kargo uygulamasını aç', 'baglanti'],
  [2, 'Ada Hesap', 'Uygulamada oturumları aç', 'kod']
]) {
  labButtons[index].click();
  assert.deepEqual(labButtons.map((button) => button.getAttribute('aria-pressed')), labButtons.map((_, i) => String(i === index)));
  assert.equal(ids.get('lab-sender').textContent, sender);
  assert.equal(ids.get('lab-evidence').children.length, 0);
  assert.equal(ids.get('lab-outcome').hidden, true);
  assert.equal(labChecks.children.at(-1).textContent, check);
  const opening = ids.get('lab-message').textContent;
  labChecks.children.at(-1).click();
  labChecks.children.at(-1).click();
  assert.equal(ids.get('lab-evidence').children.length, 1);
  const firstEvidence = evidenceText();
  ids.get('lab-accept').click();
  const firstOutcome = ids.get('lab-outcome-title').textContent;
  assert.equal(ids.get('lab-outcome').hidden, false);
  assert.ok(labChecks.children.every((button) => button.disabled));
  const links = ids.get('lab-tactics').children.map((item) => item.children[0].getAttribute('href'));
  assert.ok(links.includes('#taktik-' + theme));
  assert.ok(links.every((link) => ids.has(link.slice(1))));

  ids.get('lab-variant').click();
  assert.equal(ids.get('lab-message').textContent, opening);
  assert.equal(ids.get('lab-evidence').children.length, 0);
  assert.ok(labChecks.children.every((button) => !button.disabled));
  labChecks.children.at(-1).click();
  assert.notEqual(evidenceText(), firstEvidence);
  ids.get('lab-accept').click();
  assert.notEqual(ids.get('lab-outcome-title').textContent, firstOutcome);
}

practiceWindow.location.hash = '#zarar-kontrolu';
assert.deepEqual(views.filter((view) => !view.hidden).map((view) => view.id), ['zarar-kontrolu']);
for (const [incident, steps] of [['link', 3], ['code', 4]]) {
  ids.get('recovery-' + incident).click();
  const actions = ids.get('recovery-actions').children;
  assert.equal(actions.length, steps);
  actions[0].click();
  actions[0].click();
  assert.equal(ids.get('recovery-log').children.length, 1);
  actions.slice(1).forEach((action) => action.click());
  assert.equal(ids.get('recovery-complete').hidden, false);
  ids.get('recovery-reset').click();
  assert.equal(ids.get('recovery-complete').hidden, true);
}

practiceWindow.location.hash = '#kategoriler';
assert.equal(ids.get('practice-screen').hidden, true);
assert.equal(ids.get('home-screen').hidden, false);
assert.equal(ids.get('category-title').focused, true);
assert.equal(launch({}, false, '#taktik-kod').ids.get('taktik-kod').open, true);
console.log('Practice flows passed: section links, tactic links, three scenarios with two variants each, and recovery exercises.');
