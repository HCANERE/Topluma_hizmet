(function () {
  'use strict';
  const topics = ['Ödeme baskısı', 'Doğrulama kodu', 'Bağımsız doğrulama', 'Bağlantı ve QR', 'Yapay ses / video'];
  const questions = {
    pre: [
      { topic: 0, text: 'Beklemediğin bir burs mesajı “işlem ücreti” istiyor. İlk ne yaparsın?', options: ['Ücreti yatırıp sonra araştırırım', 'Duyuruyu resmî kanaldan kontrol ederim', 'Mesajdaki numarayı arayıp sorarım'], answer: 1 },
      { topic: 1, text: 'Bir kişi hesabına gelen giriş kodunu istiyor. Ne yaparsın?', options: ['Kodu kimseyle paylaşmam', 'Yalnızca ilk rakamları söylerim', 'Görevliyse kodu iletirim'], answer: 0 },
      { topic: 2, text: 'Kurum adına gelen acil ödeme isteğini nasıl doğrularsın?', options: ['E-postadaki numarayı ararım', 'Logoya ve yazıma bakarım', 'Önceden bildiğim kanala ulaşırım'], answer: 2 },
      { topic: 3, text: 'Beklenmedik bir QR kodu ödeme sayfası açacak gibi görünüyor. Ne yaparsın?', options: ['Önce adresi görür ve işlemi ayrı kanaldan kontrol ederim', 'HTTPS görürsem kart bilgilerimi girerim', 'Kodu hemen açıp çıkan ekrana güvenirim'], answer: 0 },
      { topic: 4, text: 'Tanıdık bir ses yeni numaradan acil para istiyor. Ne yaparsın?', options: ['Sesini tanıdıysam para gönderirim', 'Önceden kayıtlı numaradan geri ararım', 'Yeni numaradan tekrar konuşup karar veririm'], answer: 1 }
    ],
    post: [
      { topic: 0, text: 'İş ilanı başvurusu için ön ödeme ve hemen karar vermen istendi. En güvenli adım hangisi?', options: ['Önce küçük bir tutar gönderirim', 'Bağlantıdaki bilgileri doldururum', 'Ödemeyi durdurup ilanı resmî kanaldan doğrularım'], answer: 2 },
      { topic: 1, text: '“Hesabını kurtarıyorum” diyen biri tek kullanımlık kodu soruyor. Ne yaparsın?', options: ['Kodu paylaşmam, hesabı kendi uygulamamdan incelerim', 'Kodu yalnızca telefonda okurum', 'Mesajın bir kısmını iletirim'], answer: 0 },
      { topic: 2, text: 'Okul adına gelen bir e-posta kişisel hesaba ödeme istiyor. Nereden kontrol edersin?', options: ['E-postanın yanıt adresinden', 'Okulun önceden bildiğim numarasından', 'E-postadaki hızlı yardım bağlantısından'], answer: 1 },
      { topic: 3, text: 'Kargo QR kodu seni yeni bir ödeme adresine götürüyor. Hangi bilgi yeterli değildir?', options: ['Siparişin bilinen uygulamada görünmesi', 'Kurumun resmî kanaldan yanıt vermesi', 'Sayfanın HTTPS kullanması'], answer: 2 },
      { topic: 4, text: 'Bir videoda tanıdığın kişi para göndermeni istiyor. Güvenli karar hangisi?', options: ['Videonun gerçekçi görünmesine güvenirim', 'İsteği bildiğim başka bir kanaldan doğrularım', 'Acele etmem söylendiyse hemen gönderirim'], answer: 1 }
    ]
  };
  window.TOD_ASSESSMENT_QUESTIONS = questions;
  const byId = (id) => document.getElementById(id);
  if (!byId('assessment-screen')) return;
  const storageKey = 'tod-assessment-aggregate-v1';
  const empty = () => ({ count: 0, preTotal: 0, postTotal: 0, feedbackYes: 0, feedbackCount: 0, postMisses: [0, 0, 0, 0, 0] });
  let aggregate = empty();
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (value && Number.isSafeInteger(value.count) && value.count >= 0 &&
        ['preTotal', 'postTotal', 'feedbackYes', 'feedbackCount'].every((key) => Number.isSafeInteger(value[key]) && value[key] >= 0) &&
        Array.isArray(value.postMisses) && value.postMisses.length === topics.length && value.postMisses.every((n) => Number.isSafeInteger(n) && n >= 0)) {
      aggregate = value;
    }
  } catch (_) { /* Continue with an empty in-memory summary. */ }
  const state = { phase: null, index: 0, selected: null, pre: [], post: [], saved: false };

  function score(phase) {
    return state[phase].reduce((sum, answer, index) => sum + Number(answer === questions[phase][index].answer), 0);
  }
  function percent(total, count) { return count ? `${Math.round(total * 20 / count)}%` : '—'; }
  function renderReport() {
    byId('report-count').textContent = String(aggregate.count);
    byId('report-pre').textContent = percent(aggregate.preTotal, aggregate.count);
    byId('report-post').textContent = percent(aggregate.postTotal, aggregate.count);
    byId('report-change').textContent = aggregate.count
      ? `${Math.round((aggregate.postTotal - aggregate.preTotal) * 20 / aggregate.count)} yüzde puan`
      : '—';
    byId('report-positive').textContent = aggregate.feedbackCount
      ? `${Math.round(aggregate.feedbackYes * 100 / aggregate.feedbackCount)}%`
      : '—';
    byId('report-feedback-count').textContent = `${aggregate.feedbackCount} yanıt`;
    const missed = aggregate.postMisses.map((count, index) => ({ count, topic: topics[index] })).filter((row) => row.count > 0).sort((a, b) => b.count - a.count);
    byId('report-topics').textContent = missed.length
      ? `Son testte tekrar gerektiren konular: ${missed.map((row) => `${row.topic} (${row.count})`).join(', ')}.`
      : aggregate.count ? 'Son testte bu beş konuda yanlış yanıt kaydedilmedi.' : 'Konu özeti, tamamlanan oturumlardan sonra görünecek.';
  }
  function persist() {
    try { localStorage.setItem(storageKey, JSON.stringify(aggregate)); return true; }
    catch (_) { return false; }
  }
  function start() {
    state.phase = 'pre'; state.index = 0; state.selected = null; state.pre = []; state.post = []; state.saved = false;
    document.querySelectorAll('input[name="helpful"]').forEach((input) => { input.checked = false; });
    byId('assessment-start').hidden = true;
    byId('assessment-between').hidden = true;
    byId('assessment-finished').hidden = true;
    byId('assessment-quiz').hidden = false;
    byId('assessment-save-status').textContent = '';
    renderQuestion();
  }
  function renderQuestion() {
    const question = questions[state.phase][state.index];
    state.selected = null;
    byId('assessment-progress').textContent = `${state.phase === 'pre' ? 'Ön test' : 'Son test'} · Soru ${state.index + 1} / ${questions[state.phase].length}`;
    byId('assessment-question').textContent = question.text;
    byId('assessment-error').textContent = '';
    const options = byId('assessment-options');
    options.replaceChildren();
    question.options.forEach((label, index) => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'decision-choice'; button.textContent = label;
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => {
        state.selected = index;
        [...options.children].forEach((item, itemIndex) => item.setAttribute('aria-pressed', String(index === itemIndex)));
        byId('assessment-next').disabled = false;
      });
      options.append(button);
    });
    byId('assessment-next').disabled = true;
    byId('assessment-next').textContent = state.index === questions[state.phase].length - 1 ? 'Testi tamamla' : 'Sonraki soru';
    byId('assessment-question').focus();
  }
  function advance() {
    if (state.selected === null) return;
    state[state.phase][state.index] = state.selected;
    if (state.index < questions[state.phase].length - 1) {
      state.index += 1; renderQuestion(); return;
    }
    byId('assessment-quiz').hidden = true;
    if (state.phase === 'pre') {
      byId('assessment-between').hidden = false;
      byId('assessment-between').querySelector('h3').focus();
      return;
    }
    const pre = score('pre') * 20;
    const post = score('post') * 20;
    byId('assessment-personal-result').textContent = `Ön test: ${pre} / 100 · Son test: ${post} / 100 · Değişim: ${post - pre} yüzde puan. Bu sonuç yalnızca bu iki kısa teste aittir.`;
    byId('assessment-finished').hidden = false;
    byId('assessment-finished').querySelector('h3').focus();
  }
  function save() {
    if (state.phase !== 'post' || state.post.length !== questions.post.length || state.saved) return;
    aggregate.count += 1;
    aggregate.preTotal += score('pre');
    aggregate.postTotal += score('post');
    state.post.forEach((answer, index) => { if (answer !== questions.post[index].answer) aggregate.postMisses[questions.post[index].topic] += 1; });
    const feedback = document.querySelector('input[name="helpful"]:checked');
    if (feedback) {
      aggregate.feedbackCount += 1;
      if (feedback.value === 'yes') aggregate.feedbackYes += 1;
    }
    state.saved = true;
    const stored = persist();
    byId('assessment-save').disabled = true;
    byId('assessment-save-status').textContent = stored
      ? 'Bu oturumun yalnızca toplu sonucu bu cihazda kaydedildi.'
      : 'Sonuç bu oturumun belleğine eklendi; tarayıcı depolaması kapalı olduğu için sayfa kapanınca silinir.';
    renderReport();
  }
  function exportCsv() {
    if (!aggregate.count) { byId('report-status').textContent = 'İndirilecek tamamlanmış oturum yok.'; return; }
    const rows = [
      ['Ölçüt', 'Değer'], ['Biçim sürümü', 2], ['Tamamlanan oturum', aggregate.count],
      ['Ön test doğru toplamı', aggregate.preTotal], ['Son test doğru toplamı', aggregate.postTotal],
      ['Ön test ortalaması (%)', (aggregate.preTotal * 20 / aggregate.count).toFixed(1)],
      ['Son test ortalaması (%)', (aggregate.postTotal * 20 / aggregate.count).toFixed(1)],
      ['Fark (yüzde puan)', ((aggregate.postTotal - aggregate.preTotal) * 20 / aggregate.count).toFixed(1)],
      ['Olumlu geri bildirim', aggregate.feedbackYes], ['Geri bildirim yanıtı', aggregate.feedbackCount],
      ...topics.map((topic, index) => [`Son test yanlış: ${topic}`, aggregate.postMisses[index]])
    ];
    const csv = '\ufeff' + rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(';')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'tiklamadan-once-dusun-toplu-sonuc.csv';
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    byId('report-status').textContent = 'Yalnızca toplu değerleri içeren CSV indirildi.';
  }

  byId('assessment-start').addEventListener('click', start);
  byId('assessment-next').addEventListener('click', advance);
  byId('assessment-post-start').addEventListener('click', () => {
    state.phase = 'post'; state.index = 0;
    byId('assessment-between').hidden = true;
    byId('assessment-quiz').hidden = false;
    renderQuestion();
  });
  byId('assessment-save').addEventListener('click', save);
  byId('assessment-new').addEventListener('click', () => { byId('assessment-save').disabled = false; start(); });
  byId('report-export').addEventListener('click', exportCsv);
  byId('report-clear').addEventListener('click', (event) => {
    if (event.currentTarget.dataset.confirm !== 'true') {
      event.currentTarget.dataset.confirm = 'true';
      event.currentTarget.textContent = 'Temizlemek için tekrar bas';
      byId('report-status').textContent = 'Bu cihazdaki tüm toplu ölçüm sonucunu silmek için düğmeye tekrar bas.';
      return;
    }
    aggregate = empty();
    try { localStorage.removeItem(storageKey); } catch (_) {}
    event.currentTarget.dataset.confirm = 'false';
    event.currentTarget.textContent = 'Bu cihazdaki toplu sonucu temizle';
    byId('report-status').textContent = 'Toplu ölçüm sonucu bu cihazdan temizlendi.';
    renderReport();
  });
  renderReport();
})();
