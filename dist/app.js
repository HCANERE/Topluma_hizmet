(function () {
  'use strict';

  const bank = window.TOD_DATA;
  const screens = {
    home: document.querySelector('#home-screen'),
    practice: document.querySelector('#practice-screen'),
    message: document.querySelector('#message-screen'),
    chat: document.querySelector('#chat-screen'),
    review: document.querySelector('#review-screen'),
    reports: document.querySelector('#reports-screen'),
    media: document.querySelector('#media-screen'),
    path: document.querySelector('#path-screen'),
    decision: document.querySelector('#decision-screen'),
    gameguide: document.querySelector('#gameguide-screen'),
    videos: document.querySelector('#videos-screen'),
    assessment: document.querySelector('#assessment-screen'),
    game: document.querySelector('#game-screen'),
    result: document.querySelector('#result-screen')
  };
  const screenHeadings = { home: '#home-title', practice: '#practice-title', message: '#message-title', chat: '#chat-title', review: '#review-screen-title', reports: '#reports-title', media: '#media-title', path: '#path-title', decision: '#decision-title', gameguide: '#gameguide-title', videos: '#videos-title', assessment: '#assessment-title', game: '#question-title', result: '#result-title' };
  const siteShell = document.querySelector('#site-shell');
  const skipLink = document.querySelector('#skip-link');
  const practiceViews = new Map(Array.from(document.querySelectorAll('[data-practice-view]'), (view) => [view.id, view]));
  const practiceLinks = document.querySelectorAll('[data-practice-link]');
  const tacticCards = new Map(Array.from(document.querySelectorAll('.tactic-card'), (card) => [card.id, card]));
  const labels = { sms: 'SMS konuşması', email: 'E-posta', social: 'Sosyal medya mesajı', call: 'Telefon görüşmesi' };
  const questionsPerRound = 5;
  const state = { category: null, mode: 'normal', index: 0, correct: 0, answered: false, missed: [], questions: [] };
  const reviewKey = 'tod-review-v1';
  const allQuestions = Object.values(bank).flatMap((category) => category.questions);
  const questionsById = new Map(allQuestions.map((question) => [question.id, question]));
  let reviewSchedule = {};
  try {
    const saved = JSON.parse(localStorage.getItem(reviewKey) || '{}');
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      for (const [id, item] of Object.entries(saved)) {
        if (questionsById.has(id) && Number.isSafeInteger(item?.due) && item.due >= 0 && Number.isInteger(item?.stage) && item.stage >= 0 && item.stage <= 3) reviewSchedule[id] = item;
      }
    }
  } catch (_) { /* The review tour also works without local storage. */ }
  const reviewIntervals = [1, 3, 7];
  function dueQuestions(now = Date.now()) {
    return Object.entries(reviewSchedule).filter(([, item]) => item.due <= now)
      .sort((a, b) => a[1].due - b[1].due).map(([id]) => questionsById.get(id)).filter(Boolean);
  }
  function updateReviewSummary() {
    const count = dueQuestions().length;
    const label = count ? `${count} konu tekrar için hazır.` : 'Şu anda tekrar bekleyen konu yok. Oyun oynadıkça yanlış yanıtlanan konular burada görünür.';
    document.querySelector('#review-due-count').textContent = label;
    document.querySelector('#review-start').disabled = !count;
  }
  function scheduleReview(question, correct) {
    const current = reviewSchedule[question.id];
    if (!correct) reviewSchedule[question.id] = { due: Date.now(), stage: 0 };
    else if (state.mode === 'review' && current) {
      if (current.stage >= reviewIntervals.length) delete reviewSchedule[question.id];
      else reviewSchedule[question.id] = { due: Date.now() + reviewIntervals[current.stage] * 86400000, stage: current.stage + 1 };
    }
    try { localStorage.setItem(reviewKey, JSON.stringify(reviewSchedule)); } catch (_) {}
    updateReviewSummary();
  }
  window.TOD_REVIEW = { dueQuestions, getSchedule: () => ({ ...reviewSchedule }) };

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
    reviewSchedule = {};
    try {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(reviewKey);
      localStorage.removeItem('tod-large-text');
    } catch (_) { /* The in-memory state is cleared even without storage access. */ }
    setLargeText(false);
    updateProgress();
    updateReviewSummary();
    document.querySelector('#clear-local-status').textContent = 'Bu cihazdaki oyun kayıtları temizlendi.';
  });
  updateProgress();
  updateReviewSummary();

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
      practice: '#practice-screen', message: '#message-screen', chat: '#chat-screen', review: '#review-screen', reports: '#reports-screen', media: '#media-screen', path: '#path-screen', decision: '#decision-screen', gameguide: '#gameguide-screen', videos: '#videos-screen', assessment: '#assessment-screen'
    }[name] || '#main');
    window.scrollTo(0, 0);
    focusTarget.focus({ preventScroll: true });
  }

  function syncLocation() {
    const id = window.location.hash.slice(1);
    const moduleRoutes = { 'mesaj-incele': 'message', 'rehber-asistani': 'chat', 'tekrar-turu': 'review', 'saha-raporu': 'reports', 'medya-laboratuvari': 'media', 'ogrenme-yolu': 'path', 'karar-simulatoru': 'decision', 'dijital-oyun-secimi': 'gameguide', 'egitim-videolari': 'videos', olcme: 'assessment' };
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
    document.querySelector('#game-category').textContent = state.mode === 'review' ? 'Kısa tekrar' : bank[state.category].title;
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
    scheduleReview(question, isCorrect);
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
    if (state.mode !== 'review') {
      const previous = progress[state.category];
      progress[state.category] = Math.max(Number.isInteger(previous) && previous >= 0 && previous <= 100 ? previous : 0, score());
      try { localStorage.setItem(storageKey, JSON.stringify(progress)); } catch (_) {}
      updateProgress();
    }
    document.querySelector('#result-category').textContent = state.mode === 'review' ? 'Kısa tekrar turu' : `${bank[state.category].title} kategorisi`;
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
    document.querySelector('#replay-button').hidden = state.mode === 'review' && dueQuestions().length === 0;
    document.querySelector('#return-button').textContent = state.mode === 'review' ? 'Tekrar bölümüne dön' : 'Kategori Seçimine Dön';
    showScreen('result');
  }

  function start(category) {
    if (!bank || !bank[category] || bank[category].questions.length === 0) return;
    state.mode = 'normal';
    state.category = category;
    state.questions = shuffle(bank[category].questions).slice(0, questionsPerRound);
    state.index = 0;
    state.correct = 0;
    state.answered = false;
    state.missed = [];
    document.body.classList.toggle('senior-mode', category === 'seniors');
    document.querySelector('#leave-game').textContent = 'Kategori Seçimine Dön';
    renderQuestion();
    showScreen('game');
  }

  function startReview() {
    const due = dueQuestions().slice(0, questionsPerRound);
    if (!due.length) { document.querySelector('#review-status').textContent = 'Şu anda tekrar için hazır soru yok.'; return; }
    state.mode = 'review'; state.category = null; state.questions = due;
    state.index = 0; state.correct = 0; state.answered = false; state.missed = [];
    document.body.classList.add('senior-mode');
    document.querySelector('#leave-game').textContent = 'Tekrar bölümüne dön';
    renderQuestion(); showScreen('game');
  }

  function returnHome() {
    const destination = state.mode === 'review' ? 'tekrar-turu' : 'kategoriler';
    state.category = null;
    state.answered = false;
    if (window.location.hash === `#${destination}`) syncLocation();
    else window.location.hash = destination;
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
  document.querySelector('#replay-button').addEventListener('click', () => state.mode === 'review' ? startReview() : start(state.category));
  document.querySelector('#review-start').addEventListener('click', startReview);
  skipLink.addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector(skipLink.getAttribute('href')).focus();
  });
  window.addEventListener('hashchange', syncLocation);
  if (window.location.hash) syncLocation();
})();
