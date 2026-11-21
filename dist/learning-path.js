(function () {
  'use strict';
  const inputs = [...document.querySelectorAll('[data-path-step]')];
  if (!inputs.length) return;
  const storageKey = 'tod-learning-path-v1';
  const allowed = new Set(inputs.map((input) => input.dataset.pathStep));
  let completed = new Set();
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(stored)) completed = new Set(stored.filter((id) => allowed.has(id)));
  } catch (_) { /* The checklist still works in memory. */ }
  function persist() {
    try { localStorage.setItem(storageKey, JSON.stringify([...completed])); } catch (_) {}
  }
  function render() {
    inputs.forEach((input) => {
      input.checked = completed.has(input.dataset.pathStep);
      input.closest('li').classList.toggle('is-done', input.checked);
    });
    document.getElementById('path-count').textContent = `${completed.size} / ${inputs.length} adım işaretlendi`;
    const next = inputs.find((input) => !completed.has(input.dataset.pathStep));
    document.getElementById('path-next').textContent = next
      ? `Sıradaki öneri: ${next.closest('li').querySelector('h2').textContent}.`
      : 'Tüm adımları işaretledin. İstersen bir konuyu tekrar deneyebilirsin.';
  }
  inputs.forEach((input) => input.addEventListener('change', () => {
    if (input.checked) completed.add(input.dataset.pathStep);
    else completed.delete(input.dataset.pathStep);
    persist(); render();
  }));
  document.getElementById('path-reset').addEventListener('click', () => {
    completed.clear(); persist(); render();
    document.getElementById('path-reset-status').textContent = 'Bu cihazdaki öğrenme işaretleri temizlendi.';
  });
  render();
})();
