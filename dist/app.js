(function () {
  'use strict';

  const bank = window.TOD_DATA;
  const screens = {
    home: document.querySelector('#home-screen'),
    practice: document.querySelector('#practice-screen'),
    message: document.querySelector('#message-screen'),
    path: document.querySelector('#path-screen'),
    decision: document.querySelector('#decision-screen'),
    videos: document.querySelector('#videos-screen'),
    assessment: document.querySelector('#assessment-screen'),
    game: document.querySelector('#game-screen'),
    result: document.querySelector('#result-screen')
  };
  const screenHeadings = { home: '#home-title', practice: '#practice-title', message: '#message-title', path: '#path-title', decision: '#decision-title', videos: '#videos-title', assessment: '#assessment-title', game: '#question-title', result: '#result-title' };
  const siteShell = document.querySelector('#site-shell');
  const skipLink = document.querySelector('#skip-link');
  const practiceViews = new Map(Array.from(document.querySelectorAll('[data-practice-view]'), (view) => [view.id, view]));
  const practiceLinks = document.querySelectorAll('[data-practice-link]');
  const tacticCards = new Map(Array.from(document.querySelectorAll('.tactic-card'), (card) => [card.id, card]));
  const labels = { sms: 'SMS konuşması', email: 'E-posta', social: 'Sosyal medya mesajı', call: 'Telefon görüşmesi' };
  const questionsPerRound = 5;
  const state = { category: null, index: 0, correct: 0, answered: false, missed: [], questions: [] };

  // Local preferences contain only display settings and category scores.
  const storageKey = 'tod-progress-v1';
  let progress = {};
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) progress = saved;
  } catch (_) { /* The game also works when browser storage is unavailable. */ }

  function updateProgress() {
    document.querySelectorAll('[data-progress]').forEach((node) => {
      const score = progress[node.dataset.progress];
      node.textContent = Number.isInteger(score) && score >= 0 && score <= 100
        ? `✓ Tamamlandı · En iyi puan: ${score} / 100`
        : `5 soruluk tur · ${bank[node.dataset.progress].questions.length} farklı örnek`;
    });
  }
  const textToggle = document.querySelector('#text-size');
  function setLargeText(enabled) {
    document.documentElement.classList.toggle('large-text', enabled);
    textToggle.setAttribute('aria-pressed', String(enabled));
    textToggle.setAttribute('aria-label', enabled ? 'Normal metne dön' : 'Büyük metni aç');
  }
  try { setLargeText(localStorage.getItem('tod-large-text') === 'true'); } catch (_) {}
  textToggle.addEventListener('click', () => {
    const enabled = textToggle.getAttribute('aria-pressed') !== 'true';
    setLargeText(enabled);
    try { localStorage.setItem('tod-large-text', String(enabled)); } catch (_) {}
  });
  document.querySelector('#clear-local-data').addEventListener('click', () => {
    progress = {};
    try {
      localStorage.removeItem(storageKey);
      localStorage.removeItem('tod-large-text');
    } catch (_) { /* The in-memory state is cleared even without storage access. */ }
    setLargeText(false);
    updateProgress();
    document.querySelector('#clear-local-status').textContent = 'Bu cihazdaki oyun kayıtları temizlendi.';
  });
  updateProgress();

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function showScreen(name, focusTarget = document.querySelector(screenHeadings[name])) {
    Object.entries(screens).forEach(([key, node]) => { node.hidden = key !== name; });
    const playing = name === 'game' || name === 'result';
    siteShell.hidden = playing;
    document.body.classList.toggle('playing', playing);
    if (!playing) document.body.classList.remove('senior-mode');
    skipLink.setAttribute('href', {
      practice: '#practice-screen', message: '#message-screen', path: '#path-screen', decision: '#decision-screen', videos: '#videos-screen', assessment: '#assessment-screen'
    }[name] || '#main');
    window.scrollTo(0, 0);
    focusTarget.focus({ preventScroll: true });
  }

  function syncLocation() {
    const id = window.location.hash.slice(1);
    const moduleRoutes = { 'mesaj-incele': 'message', 'ogrenme-yolu': 'path', 'karar-simulatoru': 'decision', 'egitim-videolari': 'videos', olcme: 'assessment' };
    if (moduleRoutes[id]) {
      showScreen(moduleRoutes[id]);
      return;
    }
    const tactic = tacticCards.get(id);
    const view = practiceViews.get(tactic ? 'taktik-rehberi' : id);
    if (view) {
      practiceViews.forEach((panel) => { panel.hidden = panel !== view; });
      practiceLinks.forEach((link) => {
        if (link.getAttribute('href') === '#' + view.id) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
      if (tactic) tactic.open = true;
      const target = tactic?.querySelector('summary') ?? document.getElementById(view.getAttribute('aria-labelledby'));
      showScreen('practice', target);
      if (tactic) tactic.scrollIntoView({ block: 'start' });
      return;
    }

    const anchors = new Map([['kategoriler', 'category-title'], ['pratik', 'practice-home-title'], ['nasil-calisir', 'how-title'], ['ozellikler', 'features-title'], ['main', 'main']]);
    const target = document.getElementById(anchors.get(id));
    showScreen('home', target ?? undefined);
    if (target) target.scrollIntoView({ block: 'start' });
  }

  function renderFrame(question) {
    const frame = document.querySelector('#scenario-frame');
    frame.className = `scenario-frame ${question.kind}`;
    frame.replaceChildren();

    const top = el('div', 'frame-top');
    top.append(el('span', 'frame-kind', labels[question.kind]));
    top.append(el('span', 'frame-decoration', question.kind === 'call' ? '● ● ●' : '•••'));
    frame.append(top);

    if (question.kind === 'email') {
      const head = el('div', 'email-head');
      const from = el('p', '', `Kimden: ${question.from}`);
      const subject = el('p', '', `Konu: ${question.subject}`);
      head.append(from, subject);
      frame.append(head);
      frame.append(el('p', 'frame-message email-message', question.message));
    } else if (question.kind === 'call') {
      const caller = el('div', 'caller');
      caller.append(el('span', 'caller-icon', '☎'));
      caller.append(el('strong', '', question.from));
      caller.append(el('span', 'caller-caption', 'Görüşme metni'));
      frame.append(caller);
      frame.append(el('p', 'frame-message call-message', `“${question.message}”`));
    } else {
      const sender = el('div', 'sender');
      sender.append(el('span', 'sender-icon', question.kind === 'sms' ? 'M' : 'S'));
      sender.append(el('strong', '', question.from));
      frame.append(sender);
      frame.append(el('p', 'frame-message bubble', question.message));
    }
  }

  function score() {
    return Math.round(state.correct * 100 / state.questions.length);
  }

  function shuffle(questions) {
    const result = questions.slice();
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function renderQuestion() {
    const questions = state.questions;
    const question = questions[state.index];
    state.answered = false;
    document.querySelector('#game-category').textContent = bank[state.category].title;
    document.querySelector('#progress-text').textContent = `Soru ${state.index + 1} / ${questions.length}`;
    document.querySelector('#live-score').textContent = String(score());
    document.querySelector('#progress-fill').style.width = `${((state.index + 1) / questions.length) * 100}%`;
    document.querySelector('.progress-track').setAttribute('aria-valuenow', String(state.index + 1));
    document.querySelector('.progress-track').setAttribute('aria-valuemax', String(questions.length));
    document.querySelector('#question-title').textContent = question.topic;
    renderFrame(question);

    const choiceList = document.querySelector('#choices');
    choiceList.replaceChildren();
    question.choices.forEach((choice, index) => {
      const button = el('button', 'choice-button', choice);
      button.type = 'button';
      button.addEventListener('click', () => answer(index));
      choiceList.append(button);
    });
    document.querySelector('#feedback').hidden = true;
  }

  function answer(choiceIndex) {
    if (state.answered) return;
    const question = state.questions[state.index];
    state.answered = true;
    const isCorrect = choiceIndex === question.correct;
    if (isCorrect) state.correct += 1;
    else state.missed.push({ topic: question.topic, review: question.review });
    document.querySelector('#live-score').textContent = String(score());

    document.querySelectorAll('.choice-button').forEach((button, index) => {
      button.disabled = true;
      if (index === question.correct) {
        button.classList.add('is-correct');
        button.append(el('span', 'choice-label', index === choiceIndex ? '✓ Doğru seçim' : '✓ Doğru seçenek'));
      } else if (index === choiceIndex) {
        button.classList.add('is-incorrect');
        button.append(el('span', 'choice-label', '✕ Seçimin'));
      }
    });

    const feedback = document.querySelector('#feedback');
    feedback.className = `feedback ${isCorrect ? 'success' : 'retry'}`;
    document.querySelector('#feedback-icon').textContent = isCorrect ? '✓' : '✕';
    document.querySelector('#feedback-title').textContent = isCorrect ? 'Doğru cevap' : 'Yanlış cevap; birlikte bakalım';
    document.querySelector('#feedback-explanation').textContent = question.explanation;
    const clues = document.querySelector('#clue-list');
    clues.replaceChildren(...question.clues.map((clue) => el('li', '', clue)));
    document.querySelector('#tip-text').textContent = question.tip;
    document.querySelector('#next-button').textContent = state.index === state.questions.length - 1 ? 'Sonucu Gör' : 'Sonraki Soru';
    feedback.hidden = false;
    feedback.focus();
  }

  function showResults() {
    const previous = progress[state.category];
    progress[state.category] = Math.max(Number.isInteger(previous) && previous >= 0 && previous <= 100 ? previous : 0, score());
    try { localStorage.setItem(storageKey, JSON.stringify(progress)); } catch (_) {}
    updateProgress();
    document.querySelector('#result-category').textContent = `${bank[state.category].title} kategorisi`;
    document.querySelector('#final-score').textContent = `${score()} / 100`;
    document.querySelector('#correct-count').textContent = `${state.correct} / ${state.questions.length} doğru cevap`;
    const review = document.querySelector('#review-content');
    review.replaceChildren();
    if (state.missed.length === 0) {
      review.append(el('p', '', 'Bu turdaki tüm senaryolarda güvenli adımı seçtin. Farklı bir kategorideki örnekleri de deneyebilirsin.'));
    } else {
      review.append(el('p', '', 'Bu konulardaki güvenli adımları bir kez daha gözden geçir:'));
      const list = el('ul', 'review-list');
      state.missed.forEach((item) => {
        const row = el('li', '');
        row.append(el('strong', '', item.topic));
        row.append(el('span', '', item.review));
        list.append(row);
      });
      review.append(list);
    }
    showScreen('result');
  }

  function start(category) {
    if (!bank || !bank[category] || bank[category].questions.length === 0) return;
    state.category = category;
    state.questions = shuffle(bank[category].questions).slice(0, questionsPerRound);
    state.index = 0;
    state.correct = 0;
    state.answered = false;
    state.missed = [];
    document.body.classList.toggle('senior-mode', category === 'seniors');
    renderQuestion();
    showScreen('game');
  }

  function returnHome() {
    state.category = null;
    state.answered = false;
    if (window.location.hash === '#kategoriler') syncLocation();
    else window.location.hash = 'kategoriler';
  }

  document.querySelectorAll('[data-category]').forEach((button) => {
    button.addEventListener('click', () => start(button.dataset.category));
  });
  document.querySelector('#next-button').addEventListener('click', () => {
    if (!state.answered) return;
    if (state.index === state.questions.length - 1) return showResults();
    state.index += 1;
    renderQuestion();
    showScreen('game');
  });
  document.querySelector('#leave-game').addEventListener('click', returnHome);
  document.querySelector('#return-button').addEventListener('click', returnHome);
  document.querySelector('#replay-button').addEventListener('click', () => start(state.category));
  skipLink.addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector(skipLink.getAttribute('href')).focus();
  });
  window.addEventListener('hashchange', syncLocation);
  if (window.location.hash) syncLocation();
})();
