(function () {
  'use strict';
  const content = window.TOD_CHAT_CONTENT || [];
  const stopWords = new Set(['acaba', 'bana', 'ben', 'benim', 'bir', 'bu', 'icin', 'ile', 'mi', 'miyim', 'midir', 'nasil', 'ne', 'nedir', 'olur', 'sence', 've', 'ya', 'yapmaliyim', 'yapmam', 'gerekir']);
  const normalize = (value) => String(value || '').toLocaleLowerCase('tr-TR').replace(/ı/g, 'i')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const terms = (value) => normalize(value).split(' ').filter((word) => word.length > 1 && !stopWords.has(word));
  const hasTerm = (queryTerms, word) => queryTerms.some((term) => term === word || (word.length >= 3 && term.startsWith(word)));
  const hasPhrase = (queryTerms, phrase) => terms(phrase).every((word) => hasTerm(queryTerms, word));

  function incidentMatch(query) {
    const candidates = [
      ['card-entered', /(?:kart|kredi karti)/, /(?:girdim|yazdim|paylastim|verdim)/],
      ['money-sent', /(?:para|iban|havale|eft|odeme)/, /(?:gonderdim|yatirdim|havale yaptim|eft yaptim|odeme yaptim)/],
      ['password-entered', /(?:sifre|parola)/, /(?:girdim|yazdim|paylastim|verdim|soyledim)/],
      ['code-shared', /(?:kod|dogrulama)/, /(?:paylastim|verdim|soyledim|ilettim|gonderdim)/],
      ['link-opened', /(?:link|baglanti|adres|qr|site)/, /(?:tikladim|bastim|actim|siteye girdim)/]
    ];
    return candidates.find(([, topic, action]) => topic.test(query) && action.test(query))?.[0];
  }

  function answerQuestion(value) {
    const raw = String(value || '').trim();
    if (!raw) return { type: 'empty', answer: 'Önce bir soru yaz veya örneklerden birini seç.' };
    if (raw.length > 400) return { type: 'empty', answer: 'Soruyu 400 karakterden kısa tut.' };
    const query = normalize(raw);
    const queryTerms = terms(raw);
    const incidentId = incidentMatch(query);
    if (incidentId) return { type: 'answer', ...content.find((item) => item.id === incidentId) };
    if (/https?:\/\/|www\./i.test(raw)) return { type: 'answer', ...content.find((item) => item.id === 'url') };

    let best = null;
    for (const item of content) {
      if (item.incident) continue;
      let score = 0;
      let hits = 0;
      for (const keyword of item.keywords) {
        if (!hasPhrase(queryTerms, keyword)) continue;
        hits += 1;
        score += 5 + (terms(keyword).length - 1);
      }
      if (!hits) continue;
      const exampleOverlap = Math.max(0, ...item.examples.map((example) => terms(example).filter((term) => hasTerm(queryTerms, term)).length));
      score += Math.min(4, exampleOverlap * 1.2);
      if (query.includes(normalize(item.title))) score += 3;
      if (!best || score > best.score) best = { item, score };
    }
    if (best && best.score >= 5) return { type: 'answer', ...best.item };
    return {
      type: 'unknown', title: 'Bu soruya hazır yanıt bulamadım',
      answer: 'Bu soruyla ilgili yeterince açık bir eşleşme bulamadım. Şüpheli bir mesajsa metindeki istekleri yerel araçla inceleyebilir, para veya hesap riski varsa ilgili kuruma kendi bildiğin resmî kanaldan ulaşabilirsin.',
      href: '#mesaj-incele', sourceTitle: 'Şüpheli mesaj inceleme'
    };
  }

  const log = document.getElementById('chat-log');
  const input = document.getElementById('chat-input');
  const status = document.getElementById('chat-status');
  const greeting = 'Merhaba. Oltalama, şüpheli mesajlar, hesap güvenliği veya bir olaydan sonra ne yapabileceğin hakkında sorabilirsin. Yanıtı sitedeki ilgili bölüme bağlayacağım.';
  const redactDisplay = (value) => String(value)
    .replace(/https?:\/\/\S+|www\.\S+/gi, '[bağlantı]')
    .replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, '[e-posta]')
    .replace(/\b\d{5,}\b/g, '[numara]');
  function addBubble(role, message, source) {
    const bubble = document.createElement('article');
    bubble.className = `chat-bubble chat-${role}`;
    const label = document.createElement('strong');
    label.textContent = role === 'bot' ? 'Dijital Güvenlik Rehberi' : 'Senin sorun';
    const body = document.createElement('p');
    body.textContent = message;
    bubble.append(label, body);
    if (source) {
      const link = document.createElement('a');
      link.href = source.href;
      link.textContent = `İlgili site içeriği: ${source.sourceTitle}`;
      bubble.append(link);
    }
    log.append(bubble);
    log.scrollTop = log.scrollHeight;
  }
  function clearConversation(focusInput = false) {
    if (!log) return;
    log.replaceChildren();
    input.value = '';
    status.textContent = '';
    addBubble('bot', greeting);
    if (focusInput) input.focus();
  }
  window.TOD_CHAT_GUIDE = { answerQuestion, normalize, clearConversation };
  if (!log) return;
  clearConversation();

  function submitQuestion(value) {
    const reply = answerQuestion(value);
    if (reply.type === 'empty') { status.textContent = reply.answer; input.focus(); return; }
    status.textContent = '';
    addBubble('user', redactDisplay(String(value).trim()));
    addBubble('bot', reply.answer, reply);
    input.value = '';
    input.focus();
  }
  document.getElementById('chat-form').addEventListener('submit', (event) => {
    event.preventDefault();
    submitQuestion(input.value);
  });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submitQuestion(input.value);
    }
  });
  document.getElementById('chat-clear').addEventListener('click', () => clearConversation(true));
  document.querySelectorAll('[data-chat-example]').forEach((button) => button.addEventListener('click', () => submitQuestion(button.dataset.chatExample)));
})();
