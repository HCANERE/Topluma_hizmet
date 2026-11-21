(function () {
  'use strict';
  const section = document.getElementById('guest-progress');
  if (!section) return;
  const keys = { scores: 'tod-progress-v1', review: 'tod-review-v1', steps: 'tod-learning-path-v1', largeText: 'tod-large-text' };
  const categories = new Set(['youth', 'parents', 'seniors']);
  const questionIds = new Set(Object.values(window.TOD_DATA).flatMap((group) => group.questions.map((question) => question.id)));
  const stepIds = new Set(['pre', 'message', 'video', 'decision', 'post']);
  const status = document.getElementById('guest-status');
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (_) { return fallback; } };
  function validate(input) {
    if (!input || input.version !== 1 || typeof input !== 'object') throw new Error('Bu dosya misafir ilerleme yedeği değil.');
    const scores = {};
    for (const [key, value] of Object.entries(input.scores || {})) {
      if (!categories.has(key) || !Number.isInteger(value) || value < 0 || value > 100) throw new Error('Oyun puanları geçersiz.');
      scores[key] = value;
    }
    const review = {};
    for (const [id, value] of Object.entries(input.review || {})) {
      if (!questionIds.has(id) || !Number.isSafeInteger(value?.due) || value.due < 0 || !Number.isInteger(value?.stage) || value.stage < 0 || value.stage > 3) throw new Error('Tekrar kaydı geçersiz.');
      review[id] = { due: value.due, stage: value.stage };
    }
    if (!Array.isArray(input.steps) || input.steps.some((id) => !stepIds.has(id))) throw new Error('Öğrenme adımları geçersiz.');
    if (typeof input.largeText !== 'boolean') throw new Error('Metin tercihi geçersiz.');
    return { scores, review, steps: [...new Set(input.steps)], largeText: input.largeText };
  }
  function current() {
    return validate({ version: 1, scores: read(keys.scores, {}), review: read(keys.review, {}), steps: read(keys.steps, []), largeText: read(keys.largeText, false) === true });
  }
  function download(content, filename) {
    const url = URL.createObjectURL(new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = filename;
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  document.getElementById('guest-export').addEventListener('click', () => {
    try {
      download({ version: 1, ...current() }, 'misafir-ilerleme.json');
      status.textContent = 'Yalnızca oyun ve öğrenme ilerlemesi indirildi. Testlerin toplu sonucu bu dosyada yok.';
    } catch (_) { status.textContent = 'İlerleme yedeği oluşturulamadı; tarayıcı depolamasını kontrol et.'; }
  });
  document.getElementById('guest-import').addEventListener('click', async () => {
    const file = document.getElementById('guest-file').files?.[0];
    if (!file) { status.textContent = 'Önce JSON yedeğini seç.'; return; }
    if (file.size > 50000 || !/\.json$/i.test(file.name)) { status.textContent = '50 KB altında bir JSON yedeği seç.'; return; }
    try {
      const incoming = validate(JSON.parse(await file.text()));
      const present = current();
      const scores = { ...present.scores };
      for (const [key, value] of Object.entries(incoming.scores)) scores[key] = Math.max(scores[key] || 0, value);
      const review = { ...present.review };
      for (const [id, item] of Object.entries(incoming.review)) {
        const prior = review[id];
        review[id] = prior ? { due: Math.min(prior.due, item.due), stage: Math.min(prior.stage, item.stage) } : item;
      }
      localStorage.setItem(keys.scores, JSON.stringify(scores));
      localStorage.setItem(keys.review, JSON.stringify(review));
      localStorage.setItem(keys.steps, JSON.stringify([...new Set([...present.steps, ...incoming.steps])]));
      localStorage.setItem(keys.largeText, String(present.largeText || incoming.largeText));
      try { sessionStorage.setItem('tod-guest-notice', 'Misafir ilerlemesi birleştirildi. Toplu test sonuçları değiştirilmedi.'); } catch (_) {}
      location.reload();
    } catch (error) { status.textContent = `Yedek alınamadı: ${error.message}`; }
  });
  document.getElementById('guest-clear').addEventListener('click', (event) => {
    if (event.currentTarget.dataset.confirm !== 'true') {
      event.currentTarget.dataset.confirm = 'true'; event.currentTarget.textContent = 'Misafir ilerlemesini silmek için tekrar bas';
      status.textContent = 'Oyun puanları, tekrar planı, öğrenme adımları ve metin tercihi bu cihazdan silinecek. Toplu test sonuçları kalacak.';
      return;
    }
    try {
      for (const key of Object.values(keys)) localStorage.removeItem(key);
      try { sessionStorage.setItem('tod-guest-notice', 'Bu cihazdaki misafir ilerlemesi temizlendi.'); } catch (_) {}
      location.reload();
    } catch (_) { status.textContent = 'Tarayıcı depolamasına erişilemedi; ilerleme temizlenemedi.'; }
  });
  try {
    const notice = sessionStorage.getItem('tod-guest-notice');
    if (notice) { status.textContent = notice; sessionStorage.removeItem('tod-guest-notice'); }
  } catch (_) {}
  window.TOD_GUEST_PROGRESS = { validate };
})();
