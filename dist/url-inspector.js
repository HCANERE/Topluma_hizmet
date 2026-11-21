(function () {
  'use strict';

  // Bu araç yalnızca adresin yapısını açıklar; siteye istek göndermez.
  function analyzeAddress(value) {
    const input = String(value || '').trim();
    if (!input) return { error: 'Önce bir web adresi girin.' };
    if (input.length > 2048 || /\s/.test(input)) return { error: 'Tek bir web adresi girin; boşluk veya satır sonu kullanmayın.' };

    const hasScheme = /^[a-z][a-z\d+.-]*:\/\//i.test(input);
    const bareHostWithPort = /^[^/:]+\.[^/:]+:\d{1,5}(?:\/|$)/.test(input);
    if ((!hasScheme && /^[a-z][a-z\d+.-]*:/i.test(input) && !bareHostWithPort) || (hasScheme && !/^https?:\/\//i.test(input))) {
      return { error: 'Bu içerik bir HTTP veya HTTPS web adresi değil. QR kodlar başka işlemler de başlatabilir; açmadan önce ne istediğini kontrol edin.' };
    }

    let url;
    try { url = new URL(hasScheme ? input : `https://${input}`); }
    catch (_) { return { error: 'Bu adres çözümlenemedi. Alan adını kontrol edip yeniden deneyin.' }; }
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname || (!url.hostname.includes('.') && !url.hostname.startsWith('['))) {
      return { error: 'Geçerli bir web alan adı girin. Örnek: https://ornek.example.com' };
    }

    const findings = [];
    if (url.username || url.password) {
      findings.push('Adreste @ işaretiyle ayrılan bir bölüm var. @ işaretinden önceki ad, gerçek alan adı değildir; bağlantı sağda gösterilen alan adına gider.');
    }
    if (url.hostname.includes('xn--')) {
      findings.push('Alan adında uluslararası karakter kodlaması (xn--) var. Bazı harfler tanıdık bir adı taklit edebilir; kurumu bağımsız doğrulayın.');
    }
    if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(url.hostname) || url.hostname.startsWith('[')) {
      findings.push('Adres bir alan adı yerine sayısal IP adresi kullanıyor. Hangi kuruma ait olduğu bu adresten anlaşılamaz.');
    }
    if (url.protocol === 'http:') {
      findings.push('Adres HTTP kullanıyor; bağlantı şifreli değil. Şifre, giriş kodu veya kart bilgisi girmeyin.');
    } else {
      findings.push('Adres HTTPS kullanıyor. Bu, bağlantının şifrelendiğini gösterir; sitenin gerçek veya güvenilir olduğunu kanıtlamaz.');
    }
    if (url.hostname.split('.').length >= 4) {
      findings.push('Alan adında birden fazla alt bölüm var. Tanıdık kurum adı yalnızca alt bölümde geçebilir; gerçek alan adının tamamını kontrol edin.');
    }
    if (url.search || url.hash) {
      findings.push('Adreste ek parametreler veya sayfa içi bölüm var. Bunlar burada gösterilmez; adresi başkalarıyla paylaşmadan önce kişisel bilgi içerip içermediğine bakın.');
    }

    return {
      host: url.host,
      summary: 'Bu işaretler tek başına bir bağlantının zararlı veya güvenli olduğunu belirlemez. Adresin kime ait olduğunu bağımsız kaynaktan doğrulayın.',
      findings
    };
  }

  window.TOD_URL_INSPECTOR = { analyzeAddress };
  const form = document.getElementById('inspector-form');
  if (!form) return;
  const input = document.getElementById('inspector-input');
  const result = document.getElementById('inspector-result');
  const summary = document.getElementById('inspector-summary');
  const host = document.getElementById('inspector-host');
  const findings = document.getElementById('inspector-findings');
  const qrInput = document.getElementById('inspector-qr');
  const qrStatus = document.getElementById('inspector-qr-status');

  function showAnalysis(value) {
    const analysis = analyzeAddress(value);
    summary.textContent = analysis.error || analysis.summary;
    host.textContent = analysis.host || '';
    host.hidden = !analysis.host;
    document.querySelector('.inspector-host-label').hidden = !analysis.host;
    findings.replaceChildren(...(analysis.findings || []).map((message) => {
      const item = document.createElement('li');
      item.textContent = message;
      return item;
    }));
    result.hidden = false;
    document.getElementById('inspector-result-title').focus();
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    qrStatus.textContent = '';
    showAnalysis(input.value);
  });

  qrInput.addEventListener('change', async () => {
    const file = qrInput.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      qrStatus.textContent = 'PNG, JPG veya WebP biçiminde, 5 MB altı bir görsel seçin.';
      return;
    }
    if (!('BarcodeDetector' in window)) {
      qrStatus.textContent = 'Bu tarayıcı QR görselini okuyamıyor. QR kodda görünen adresi yukarıya elle yazın.';
      return;
    }
    try {
      qrStatus.textContent = 'QR kod cihazınızda okunuyor…';
      const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
      const codes = await detector.detect(file);
      if (!codes.length) {
        qrStatus.textContent = 'Bu görselde okunabilir bir QR kod bulunamadı. Adresi elle yazabilirsiniz.';
        return;
      }
      input.value = codes[0].rawValue;
      qrStatus.textContent = 'QR kod okundu. İçeriği aşağıda inceleyin; bağlantı açılmadı.';
      showAnalysis(input.value);
    } catch (_) {
      qrStatus.textContent = 'Bu tarayıcı görseldeki QR kodu okuyamadı. Adresi elle yazabilirsiniz.';
    }
  });
})();
