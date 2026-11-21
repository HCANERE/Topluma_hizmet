(function () {
  'use strict';
  const topics = ['Ödeme baskısı', 'Doğrulama kodu', 'Bağımsız doğrulama', 'Bağlantı ve QR', 'Yapay ses / video'];
  const fields = ['Tamamlanan oturum', 'Ön test doğru toplamı', 'Son test doğru toplamı', 'Olumlu geri bildirim', 'Geri bildirim yanıtı'];
  const empty = () => ({ count: 0, preTotal: 0, postTotal: 0, feedbackYes: 0, feedbackCount: 0, postMisses: [0, 0, 0, 0, 0] });

  function parseRows(source) {
    const text = String(source).replace(/^\ufeff/, '');
    const rows = [];
    let row = [], field = '', quoted = false;
    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      if (quoted) {
        if (char === '"' && text[i + 1] === '"') { field += '"'; i += 1; }
        else if (char === '"') quoted = false;
        else field += char;
      } else if (char === '"') quoted = true;
      else if (char === ';') { row.push(field); field = ''; }
      else if (char === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
      else field += char;
    }
    if (quoted) throw new Error('CSV dosyasında kapanmamış tırnak var.');
    if (field || row.length) { row.push(field.replace(/\r$/, '')); rows.push(row); }
    return rows;
  }
  function parseExport(source) {
    const rows = parseRows(source);
    if (!rows.length || rows[0][0] !== 'Ölçüt' || rows[0][1] !== 'Değer') throw new Error('Dosya beklenen toplu sonuç biçiminde değil.');
    const values = new Map();
    for (const row of rows.slice(1)) {
      if (row.length !== 2 || values.has(row[0])) throw new Error('CSV satırları eksik veya yinelenmiş.');
      values.set(row[0], row[1]);
    }
    if (values.get('Biçim sürümü') !== '2') throw new Error('Eski CSV ham toplamları içermiyor. Güncel siteden yeniden dışa aktar.');
    const numbers = [...fields, ...topics.map((topic) => `Son test yanlış: ${topic}`)].map((key) => {
      const value = values.get(key);
      if (!/^(0|[1-9]\d*)$/.test(value || '')) throw new Error(`${key} değeri geçersiz.`);
      const number = Number(value);
      if (!Number.isSafeInteger(number)) throw new Error(`${key} değeri çok büyük.`);
      return number;
    });
    const [count, preTotal, postTotal, feedbackYes, feedbackCount, ...postMisses] = numbers;
    if (!count || preTotal > count * 5 || postTotal > count * 5 || feedbackCount > count || feedbackYes > feedbackCount || postMisses.some((n) => n > count)) {
      throw new Error('Toplam değerler birbiriyle tutarsız.');
    }
    return { count, preTotal, postTotal, feedbackYes, feedbackCount, postMisses };
  }
  function mergeReports(reports) {
    return reports.reduce((total, report) => {
      for (const key of ['count', 'preTotal', 'postTotal', 'feedbackYes', 'feedbackCount']) {
        total[key] += report[key];
        if (!Number.isSafeInteger(total[key])) throw new Error('Birleşik toplam çok büyük.');
      }
      report.postMisses.forEach((value, index) => { total.postMisses[index] += value; });
      return total;
    }, empty());
  }
  function createCsv(report) {
    const rows = [
      ['Ölçüt', 'Değer'], ['Biçim sürümü', 2], ['Tamamlanan oturum', report.count],
      ['Ön test doğru toplamı', report.preTotal], ['Son test doğru toplamı', report.postTotal],
      ['Ön test ortalaması (%)', (report.preTotal * 20 / report.count).toFixed(1)],
      ['Son test ortalaması (%)', (report.postTotal * 20 / report.count).toFixed(1)],
      ['Fark (yüzde puan)', ((report.postTotal - report.preTotal) * 20 / report.count).toFixed(1)],
      ['Olumlu geri bildirim', report.feedbackYes], ['Geri bildirim yanıtı', report.feedbackCount],
      ...topics.map((topic, index) => [`Son test yanlış: ${topic}`, report.postMisses[index]])
    ];
    return '\ufeff' + rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(';')).join('\r\n');
  }
  window.TOD_REPORT_MERGE = { parseExport, mergeReports, createCsv };

  const input = document.getElementById('merge-files');
  if (!input) return;
  const accepted = [];
  const byId = (id) => document.getElementById(id);
  const status = byId('merge-status');
  function render() {
    const list = byId('merge-file-list');
    list.replaceChildren();
    for (const [index, item] of accepted.entries()) {
      const row = document.createElement('li');
      const label = document.createElement('span');
      label.textContent = `${item.name} · ${item.report.count} oturum`;
      const remove = document.createElement('button');
      remove.type = 'button'; remove.className = 'outline-button'; remove.textContent = 'Çıkar';
      remove.setAttribute('aria-label', `${item.name} dosyasını çıkar`);
      remove.addEventListener('click', () => { accepted.splice(index, 1); render(); });
      row.append(label, remove); list.append(row);
    }
    const summary = byId('merge-summary');
    summary.hidden = accepted.length === 0;
    byId('merge-export').disabled = !accepted.length;
    if (!accepted.length) return;
    const total = mergeReports(accepted.map((item) => item.report));
    byId('merge-count').textContent = String(total.count);
    byId('merge-pre').textContent = `${(total.preTotal * 20 / total.count).toFixed(1)}%`;
    byId('merge-post').textContent = `${(total.postTotal * 20 / total.count).toFixed(1)}%`;
    byId('merge-change').textContent = `${((total.postTotal - total.preTotal) * 20 / total.count).toFixed(1)} yüzde puan`;
    byId('merge-feedback').textContent = total.feedbackCount ? `${(total.feedbackYes * 100 / total.feedbackCount).toFixed(1)}% (${total.feedbackCount} yanıt)` : 'Yanıt yok';
    const topicsList = byId('merge-topics');
    topicsList.replaceChildren();
    topics.forEach((topic, index) => {
      const row = document.createElement('li');
      row.textContent = `${topic}: ${total.postMisses[index]} yanlış / ${total.count} son test`;
      topicsList.append(row);
    });
  }
  input.addEventListener('change', async () => {
    const files = [...input.files];
    const messages = [];
    for (const file of files) {
      try {
        if (accepted.length >= 30) throw new Error('En fazla 30 dosya eklenebilir.');
        if (file.size > 100000 || !/\.csv$/i.test(file.name)) throw new Error('100 KB altında bir CSV seç.');
        const source = await file.text();
        if (accepted.some((item) => item.source === source)) throw new Error('Aynı içerik zaten eklendi.');
        const report = parseExport(source);
        accepted.push({ name: file.name, source, report });
        messages.push(`${file.name} eklendi.`);
      } catch (error) { messages.push(`${file.name}: ${error.message}`); }
    }
    input.value = '';
    status.textContent = messages.join(' ');
    render();
  });
  byId('merge-export').addEventListener('click', () => {
    if (!accepted.length) return;
    const text = createCsv(mergeReports(accepted.map((item) => item.report)));
    const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'birlesik-toplu-sonuc.csv';
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = 'Birleşik toplu CSV indirildi.';
  });
  render();
})();
