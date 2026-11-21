(function () {
  'use strict';

  // This local list is the Mozilla Public Suffix List, stored with its MPL 2.0 notice.
  let suffixRules = null;
  let suffixLoading = null;
  function parseSuffixRules(source) {
    const rules = { exact: new Set(), wildcard: new Set(), exception: new Set() };
    for (const line of source.split(/\r?\n/)) {
      const rule = line.trim();
      if (!rule || rule.startsWith('//')) continue;
      const exception = rule.startsWith('!');
      const wildcard = rule.startsWith('*.');
      const name = rule.slice(exception ? 1 : wildcard ? 2 : 0);
      try {
        const ascii = new URL(`https://${name}`).hostname.replace(/\.$/, '').toLowerCase();
        rules[exception ? 'exception' : wildcard ? 'wildcard' : 'exact'].add(ascii);
      } catch (_) { /* Ignore malformed data rather than guessing a domain. */ }
    }
    return rules;
  }
  function registeredDomain(hostname, rules = suffixRules) {
    if (!rules || !hostname || hostname.startsWith('[') || /^\d+(?:\.\d+){3}$/.test(hostname)) return null;
    const labels = hostname.replace(/\.$/, '').toLowerCase().split('.');
    if (labels.length < 2) return null;
    let longest = 1;
    let exception = 0;
    for (let index = 0; index < labels.length; index += 1) {
      const suffix = labels.slice(index).join('.');
      const length = labels.length - index;
      if (rules.exact.has(suffix)) longest = Math.max(longest, length);
      if (index > 0 && rules.wildcard.has(suffix)) longest = Math.max(longest, length + 1);
      if (rules.exception.has(suffix)) exception = Math.max(exception, length);
    }
    const suffixLength = exception ? exception - 1 : longest;
    return labels.length > suffixLength ? labels.slice(-(suffixLength + 1)).join('.') : null;
  }
  function loadSuffixRules() {
    if (suffixRules) return Promise.resolve(suffixRules);
    if (!suffixLoading) suffixLoading = typeof fetch === 'function'
      ? fetch('vendor/public_suffix_list.dat').then((response) => {
        if (!response.ok) throw new Error('Domain list unavailable');
        return response.text();
      }).then((source) => { suffixRules = parseSuffixRules(source); return suffixRules; }).catch(() => null)
      : Promise.resolve(null);
    return suffixLoading;
  }

  // Bu araç yalnızca adresin yapısını açıklar; girilen adrese istek göndermez.
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
    if (url.port) {
      findings.push('Adreste özel bir bağlantı noktası (port) kullanılıyor. Bu tek başına tehlike anlamına gelmez; adresi bağımsız doğrulayın.');
    }

    const registered = registeredDomain(url.hostname);
    if (registered && registered !== url.hostname) {
      findings.push(`Bağlantı, ${registered} alan adının altındaki bir adrese gidiyor. Soldaki tanıdık kelimeler ayrı bir kurumun sitesi olduğunu kanıtlamaz.`);
    }
    const mainLabel = registered?.split('.')[0] || '';
    if (mainLabel.includes('-') || /[a-z]\d|\d[a-z]/i.test(mainLabel)) {
      findings.push('Ana alan adında tire veya harfle karışık rakam var. Bu tek başına zararlı olduğu anlamına gelmez; tanıdık bir adı taklit edip etmediğini bağımsız doğrula.');
    }
    if (mainLabel.length > 28) {
      findings.push('Ana alan adı uzun ve okunması güç. Adı dikkatle karşılaştır ve kuruma kendi bulduğun kanaldan ulaş.');
    }

    return {
      host: url.host,
      hostname: url.hostname,
      registered,
      subdomain: registered && url.hostname.endsWith(`.${registered}`) ? url.hostname.slice(0, -registered.length - 1) : '',
      summary: 'Bu işaretler tek başına bir bağlantının zararlı veya güvenli olduğunu belirlemez. Adresin kime ait olduğunu bağımsız kaynaktan doğrulayın.',
      findings
    };
  }

  window.TOD_URL_INSPECTOR = { analyzeAddress, parseSuffixRules, registeredDomain };
  const form = document.getElementById('inspector-form');
  if (!form) return;
  const input = document.getElementById('inspector-input');
  const result = document.getElementById('inspector-result');
  const summary = document.getElementById('inspector-summary');
  const host = document.getElementById('inspector-host');
  const findings = document.getElementById('inspector-findings');
  const qrInput = document.getElementById('inspector-qr');
  const qrStatus = document.getElementById('inspector-qr-status');
  const domainParts = document.getElementById('inspector-domain-parts');
  const liveButton = document.getElementById('live-check');
  const liveConsent = document.getElementById('live-consent');
  const liveStatus = document.getElementById('live-status');
  const liveAttribution = document.getElementById('live-google-attribution');
  let liveAvailable = false;
  let lastAnalyzed = null;

  function updateLiveButton() {
    if (liveButton) liveButton.disabled = !liveAvailable || !liveConsent.checked || lastAnalyzed !== input.value.trim();
  }
  if (liveButton && typeof fetch === 'function') {
    fetch('api/reputation/status', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        liveAvailable = data?.available === true;
        liveStatus.textContent = liveAvailable
          ? 'Canlı sorgu hazır. Önce adresi yerel olarak incele; ardından istersen ayrı onayla sorgula.'
          : 'Canlı sorgu yapılandırılmadı; yerel inceleme kullanılabilir.';
        updateLiveButton();
      }).catch(() => { /* Static hosting intentionally has no live service. */ });
    liveConsent.addEventListener('change', updateLiveButton);
    input.addEventListener('input', () => { lastAnalyzed = null; updateLiveButton(); });
    liveButton.addEventListener('click', async () => {
      if (!liveAvailable || !liveConsent.checked || lastAnalyzed !== input.value.trim()) return;
      liveButton.disabled = true;
      liveAttribution.hidden = true;
      liveStatus.textContent = 'Bilinen tehdit listesi sorgulanıyor…';
      try {
        const response = await fetch('api/reputation/check', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: lastAnalyzed })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Sorgu tamamlanamadı.');
        if (data.status === 'flagged') {
          liveStatus.textContent = 'Google Safe Browsing listelerinde olası bir tehdit eşleşmesi bulundu. Bağlantıyı açma; kurumu bağımsız kanaldan doğrula.';
          liveAttribution.hidden = false;
        } else {
          liveStatus.textContent = 'Google Safe Browsing listelerinde eşleşme bulunmadı. Bu, adresin güvenli olduğu anlamına gelmez.';
        }
      } catch (_) {
        liveStatus.textContent = 'Canlı sorgu şu anda tamamlanamadı. Yerel bulgulara bak ve adresi bağımsız doğrula.';
      }
      updateLiveButton();
    });
  }

  async function showAnalysis(value) {
    await loadSuffixRules();
    const analysis = analyzeAddress(value);
    summary.textContent = analysis.error || analysis.summary;
    host.textContent = analysis.host || '';
    host.hidden = !analysis.host;
    document.querySelector('.inspector-host-label').hidden = !analysis.host;
    byIdRegistered.textContent = analysis.registered ? `Kayıtlı alan adı: ${analysis.registered}` : analysis.host ? 'Kayıtlı alan adı belirlenemedi; tam adresi ayrıca kontrol edin.' : '';
    if (domainParts) {
      domainParts.replaceChildren();
      for (const [label, value, special] of [
        ['Alt alan adı', analysis.subdomain, false],
        ['Asıl alan adı', analysis.registered, true],
        ['Bağlantı noktası', analysis.host && analysis.host !== analysis.hostname ? analysis.host.slice(analysis.hostname.length + 1) : '', false]
      ]) {
        if (!value) continue;
        const part = document.createElement('span');
        const caption = document.createElement('small');
        caption.textContent = label;
        part.textContent = value;
        part.prepend(caption);
        if (special) part.className = 'domain-main';
        domainParts.append(part);
      }
    }
    findings.replaceChildren(...(analysis.findings || []).map((message) => {
      const item = document.createElement('li');
      item.textContent = message;
      return item;
    }));
    result.hidden = false;
    lastAnalyzed = analysis.error ? null : input.value.trim();
    if (liveConsent) liveConsent.checked = false;
    if (liveAttribution) liveAttribution.hidden = true;
    if (liveStatus) liveStatus.textContent = liveAvailable
      ? 'Yerel inceleme tamamlandı. Canlı sorgu için aşağıdaki seçeneği ayrıca onayla.'
      : 'Canlı sorgu yapılandırılmadı; yerel inceleme kullanılabilir.';
    updateLiveButton();
    document.getElementById('inspector-result-title').focus();
  }

  const byIdRegistered = document.getElementById('inspector-registered');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    qrStatus.textContent = '';
    await showAnalysis(input.value);
  });

  let jsQrLoading;
  function loadJsQr() {
    if (typeof window.jsQR === 'function') return Promise.resolve(window.jsQR);
    if (!jsQrLoading) {
      jsQrLoading = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'vendor/jsQR.js';
        script.onload = () => typeof window.jsQR === 'function' ? resolve(window.jsQR) : reject(new Error('QR çözücü yüklenemedi'));
        script.onerror = () => reject(new Error('QR çözücü yüklenemedi'));
        document.head.append(script);
      });
    }
    return jsQrLoading;
  }

  async function decodeLocally(file) {
    const scan = await loadJsQr();
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    try {
      image.src = objectUrl;
      await image.decode();
      const scale = Math.min(1, 1800 / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) throw new Error('Görsel işlenemedi');
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      return scan(pixels.data, canvas.width, canvas.height)?.data || null;
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }

  qrInput.addEventListener('change', async () => {
    const file = qrInput.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      qrStatus.textContent = 'PNG, JPG veya WebP biçiminde, 5 MB altı bir görsel seçin.';
      return;
    }
    try {
      qrStatus.textContent = 'QR kod cihazınızda okunuyor…';
      let rawValue;
      if ('BarcodeDetector' in window) {
        try {
          const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
          rawValue = (await detector.detect(file))[0]?.rawValue;
        } catch (_) { /* The local JavaScript decoder is used below. */ }
      }
      if (!rawValue) rawValue = await decodeLocally(file);
      if (!rawValue) {
        qrStatus.textContent = 'Bu görselde okunabilir bir QR kod bulunamadı. Adresi elle yazabilirsiniz.';
        return;
      }
      input.value = rawValue;
      qrStatus.textContent = 'QR kod okundu. İçeriği aşağıda inceleyin; bağlantı açılmadı.';
      await showAnalysis(input.value);
    } catch (_) {
      qrStatus.textContent = 'Bu tarayıcı görseldeki QR kodu okuyamadı. Adresi elle yazabilirsiniz.';
    }
  });
})();
