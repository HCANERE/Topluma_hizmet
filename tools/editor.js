(function () {
  'use strict';
  const form = document.getElementById('scenario-form');
  const drafts = [];
  const status = document.getElementById('status');
  const slug = (value) => value.toLocaleLowerCase('tr-TR').replace(/ı/g, 'i').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
  function scenarioFromForm() {
    const data = new FormData(form);
    const get = (key) => String(data.get(key) || '').trim();
    const category = get('category');
    const topic = get('topic');
    const id = `custom-${category}-${slug(topic)}`;
    if (id.endsWith('-') || !slug(topic)) throw new Error('Başlıkta en az bir harf olmalı.');
    const item = {
      category, id, topic, kind: get('kind'), from: get('from'),
      message: get('message'), choices: [get('choice0'), get('choice1'), get('choice2')],
      correct: Number(get('correct')), explanation: get('explanation'),
      clues: [get('clue0'), get('clue1')], tip: get('tip'), review: get('review')
    };
    if (item.kind === 'email') item.subject = get('subject');
    const fields = [topic, item.from, item.message, ...item.choices, item.explanation, ...item.clues, item.tip, item.review];
    if (fields.some((value) => value.length < 6)) throw new Error('Açıklama ve seçenekler en az altı karakter olmalı.');
    if (item.kind === 'email' && !item.subject) throw new Error('E-posta için konu satırı yaz.');
    if (drafts.some((draft) => draft.id === id)) throw new Error('Bu başlıkla bir senaryo zaten eklendi.');
    return item;
  }
  function render() {
    const list = document.getElementById('draft-list');
    list.replaceChildren();
    drafts.forEach((draft, index) => {
      const item = document.createElement('li');
      const label = document.createElement('span');
      label.textContent = `${draft.topic} · ${draft.category} · doğru seçenek ${draft.correct + 1}`;
      const remove = document.createElement('button');
      remove.type = 'button'; remove.textContent = 'Çıkar';
      remove.addEventListener('click', () => { drafts.splice(index, 1); render(); });
      item.append(label, remove); list.append(item);
    });
    document.getElementById('download').disabled = drafts.length === 0;
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      if (!form.reportValidity()) return;
      const item = scenarioFromForm();
      drafts.push(item); render();
      status.textContent = `${item.topic} listeye eklendi. JSON indirmeden önce diğer senaryoları da ekleyebilirsin.`;
      form.reset();
    } catch (error) { status.textContent = error.message; }
  });
  document.getElementById('download').addEventListener('click', () => {
    if (!drafts.length) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(drafts, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'yeni-senaryolar.json';
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = `${drafts.length} senaryo JSON dosyası olarak indirildi.`;
  });
})();
