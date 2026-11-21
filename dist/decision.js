(function () {
  'use strict';
  const scenarios = window.TOD_DECISIONS;
  const byId = (id) => document.getElementById(id);
  const picker = byId('decision-picker');
  if (!picker || !Array.isArray(scenarios)) return;

  const state = { scenario: null, stage: 0, answered: false, choices: [], verified: false, visited: new Set() };
  const buttons = scenarios.map((scenario) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'outline-button';
    button.textContent = `${scenario.title} · ${scenario.audience}`;
    button.addEventListener('click', () => start(scenario));
    picker.append(button);
    return button;
  });

  function start(scenario) {
    state.scenario = scenario;
    state.stage = 0;
    state.answered = false;
    state.choices = [];
    state.verified = false;
    state.visited.add(scenario.id);
    byId('decision-screen').classList.toggle('decision-senior', scenario.audience === 'İleri yaş');
    buttons.forEach((button, index) => button.setAttribute('aria-pressed', String(scenarios[index] === scenario)));
    byId('decision-channel').textContent = scenario.channel;
    byId('decision-from').textContent = scenario.sender;
    byId('decision-message').textContent = scenario.message;
    byId('decision-example').textContent = scenario.example;
    byId('decision-activity').hidden = false;
    byId('decision-summary').hidden = true;
    renderStage();
    byId('decision-scene-title').focus();
  }

  function renderStage() {
    const stage = state.scenario.stages[state.stage];
    state.answered = false;
    byId('decision-step').textContent = `Adım ${state.stage + 1} / ${state.scenario.stages.length}`;
    byId('decision-scene-title').textContent = stage.prompt;
    byId('decision-context').textContent = state.stage === 2
      ? (state.verified ? stage.verifiedContext : stage.unverifiedContext)
      : stage.context;
    const list = byId('decision-choices');
    list.replaceChildren();
    stage.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'decision-choice';
      button.textContent = option.text;
      button.addEventListener('click', () => choose(index));
      list.append(button);
    });
    byId('decision-feedback').hidden = true;
    byId('decision-next').textContent = state.stage === state.scenario.stages.length - 1 ? 'Sonucu gör' : 'Sonraki adım';
  }

  function choose(index) {
    if (state.answered) return;
    const option = state.scenario.stages[state.stage].options[index];
    state.answered = true;
    state.choices[state.stage] = { correct: Boolean(option.correct), text: option.text };
    if (state.stage === 1) state.verified = Boolean(option.correct);
    [...byId('decision-choices').children].forEach((button, i) => {
      button.disabled = true;
      if (i === index) button.classList.add(option.correct ? 'is-correct' : 'is-incorrect');
      if (state.scenario.stages[state.stage].options[i].correct) button.setAttribute('data-correct', 'true');
    });
    byId('decision-feedback-title').textContent = option.correct ? '✓ Güvenli seçim' : '○ Birlikte tekrar bakalım';
    byId('decision-feedback-text').textContent = option.feedback;
    byId('decision-feedback').hidden = false;
    byId('decision-feedback').focus();
  }

  function nextRecommendation() {
    const current = state.scenario;
    const missed = state.choices.some((choice) => !choice.correct);
    return (missed && scenarios.find((item) => item.tag === current.tag && !state.visited.has(item.id)))
      || scenarios.find((item) => !state.visited.has(item.id))
      || scenarios[(scenarios.indexOf(current) + 1) % scenarios.length];
  }

  function showSummary() {
    const scenario = state.scenario;
    const correct = state.choices.filter((answer) => answer.correct).length;
    const lastSafe = state.choices.at(-1).correct;
    byId('decision-activity').hidden = true;
    byId('decision-summary').hidden = false;
    byId('decision-summary-title').textContent = `${scenario.title}: ${correct} / ${scenario.stages.length} güvenli adım`;
    byId('decision-summary-text').textContent = `${lastSafe ? 'Son kararın güvenliydi. ' : 'Son kararın risk taşıyabilirdi. '}${scenario.takeaway}`;
    const list = document.createElement('ol');
    state.choices.forEach((choice, index) => {
      const item = document.createElement('li');
      const right = scenario.stages[index].options.find((option) => option.correct);
      item.textContent = `${scenario.stages[index].prompt} ${choice.correct ? 'Doğru adım:' : 'Önerilen adım:'} ${right.text}`;
      list.append(item);
    });
    byId('decision-recap').replaceChildren(list);
    byId('decision-next-scenario').textContent = `Sıradaki öneri: ${nextRecommendation().title}`;
    byId('decision-summary').focus();
  }

  byId('decision-next').addEventListener('click', () => {
    if (!state.answered) return;
    if (state.stage === state.scenario.stages.length - 1) return showSummary();
    state.stage += 1;
    renderStage();
    byId('decision-scene-title').focus();
  });
  byId('decision-retry').addEventListener('click', () => start(state.scenario));
  byId('decision-next-scenario').addEventListener('click', () => start(nextRecommendation()));

  window.TOD_DECISION_ENGINE = { nextRecommendation };
})();
