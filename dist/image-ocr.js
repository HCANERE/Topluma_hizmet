(function () {
  'use strict';
  const fileInput = document.getElementById('message-image');
  if (!fileInput) return;
  const button = document.getElementById('message-ocr-start');
  const status = document.getElementById('message-ocr-status');
  const messageInput = document.getElementById('message-input');
  const allowed = new Set(['image/png', 'image/jpeg', 'image/webp']);
  const assetRoot = new URL('vendor/ocr/', document.baseURI).href;
  let loading;

  function loadEngine() {
    if (window.Tesseract?.createWorker) return Promise.resolve(window.Tesseract);
    if (!loading) loading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${assetRoot}tesseract.min.js`;
      script.onload = () => window.Tesseract?.createWorker ? resolve(window.Tesseract) : reject(new Error('OCR motoru açılamadı.'));
      script.onerror = () => reject(new Error('OCR dosyaları yüklenemedi.'));
      document.head.append(script);
    }).catch((error) => { loading = null; throw error; });
    return loading;
  }
  async function recognizeImage(file) {
    if (!file || !allowed.has(file.type)) throw new Error('PNG, JPG veya WebP görseli seç.');
    if (file.size > 8000000) throw new Error('Görsel 8 MB altında olmalı.');
    const engine = await loadEngine();
    const worker = await engine.createWorker('tur', 1, {
      workerPath: `${assetRoot}worker.min.js`, corePath: `${assetRoot}core/`, langPath: `${assetRoot}lang/`,
      workerBlobURL: false,
      logger: (progress) => {
        if (progress.status === 'recognizing text' && Number.isFinite(progress.progress)) status.textContent = `Türkçe metin okunuyor: %${Math.round(progress.progress * 100)}.`;
      }
    });
    try {
      const result = await worker.recognize(file);
      return String(result.data?.text || '').trim();
    } finally { await worker.terminate(); }
  }
  button.addEventListener('click', async () => {
    const file = fileInput.files?.[0];
    if (!file) { status.textContent = 'Önce bir ekran görüntüsü seç.'; return; }
    button.disabled = true;
    status.textContent = 'Görsel yalnızca bu cihazda okunuyor. İlk kullanımda Türkçe OCR dosyaları yüklenebilir.';
    try {
      const text = await recognizeImage(file);
      if (!text) throw new Error('Görselde okunabilir metin bulunamadı. Metni elle yazabilirsin.');
      messageInput.value = text.slice(0, 2000);
      status.textContent = text.length > 2000
        ? 'Metnin ilk 2000 karakteri aktarıldı. Kişisel bilgileri silip sonucu gözden geçir.'
        : 'Metin alana aktarıldı. OCR hatalarını düzelt, kişisel bilgileri sil, sonra “İşaretleri incele”ye bas.';
      messageInput.focus();
    } catch (error) { status.textContent = `Metin okunamadı: ${error.message}`; }
    finally { fileInput.value = ''; button.disabled = false; }
  });
  document.getElementById('message-clear').addEventListener('click', () => {
    fileInput.value = '';
    status.textContent = 'Seçilen görsel ve çıkarılmış metin temizlendi.';
  });
  window.TOD_OCR = { recognizeImage };
})();
