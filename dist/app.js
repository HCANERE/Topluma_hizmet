(function () {
  'use strict';

  const bank = window.TOD_DATA;
  const screens = {
    home: document.querySelector('#home-screen'),
    game: document.querySelector('#game-screen'),
    result: document.querySelector('#result-screen')
  };
  const labels = { sms: 'SMS konuşması', email: 'E-posta', social: 'Sosyal medya mesajı', call: 'Telefon görüşmesi' };
  const state = { category: null, index: 0, correct: 0, answered: false, missed: [] };

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function showScreen(name) {
    Object.entries(screens).forEach(([key, node]) => { node.hidden = key !== name; });
    document.body.classList.toggle('playing', name !== 'home');
    window.scrollTo(0, 0);
    const focusTarget = name === 'home' ? '#home-title' : name === 'game' ? '#question-title' : '#result-title';
    document.querySelector(focusTarget).focus();
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

  function renderQuestion() {
    const questions = bank[state.category].questions;
    const question = questions[state.index];
    state.answered = false;
    document.querySelector('#game-category').textContent = bank[state.category].title;
    document.querySelector('#progress-text').textContent = `Soru ${state.index + 1} / 5`;
    document.querySelector('#live-score').textContent = String(state.correct * 20);
    document.querySelector('#progress-fill').style.width = `${((state.index + 1) / 5) * 100}%`;
    document.querySelector('.progress-track').setAttribute('aria-valuenow', String(state.index + 1));
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
    const question = bank[state.category].questions[state.index];
    state.answered = true;
    const isCorrect = choiceIndex === question.correct;
    if (isCorrect) state.correct += 1;
    else state.missed.push({ topic: question.topic, review: question.review });
    document.querySelector('#live-score').textContent = String(state.correct * 20);

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
    document.querySelector('#next-button').textContent = state.index === 4 ? 'Sonucu Gör' : 'Sonraki Soru';
    feedback.hidden = false;
    feedback.focus();
  }

  function showResults() {
    document.querySelector('#result-category').textContent = `${bank[state.category].title} kategorisi`;
    document.querySelector('#final-score').textContent = `${state.correct * 20} / 100`;
    document.querySelector('#correct-count').textContent = `${state.correct} / 5 doğru cevap`;
    const review = document.querySelector('#review-content');
    review.replaceChildren();
    if (state.missed.length === 0) {
      review.append(el('p', '', 'Beş senaryoda da güvenli adımı seçtin. Farklı bir kategorideki örnekleri de deneyebilirsin.'));
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
    if (!bank || !bank[category] || bank[category].questions.length !== 5) return;
    state.category = category;
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
    document.body.classList.remove('senior-mode');
    showScreen('home');
  }

  document.querySelectorAll('[data-category]').forEach((button) => {
    button.addEventListener('click', () => start(button.dataset.category));
  });
  document.querySelector('#next-button').addEventListener('click', () => {
    if (!state.answered) return;
    if (state.index === 4) return showResults();
    state.index += 1;
    renderQuestion();
    showScreen('game');
  });
  document.querySelector('#leave-game').addEventListener('click', returnHome);
  document.querySelector('#return-button').addEventListener('click', returnHome);
  document.querySelector('#replay-button').addEventListener('click', () => start(state.category));
})();
