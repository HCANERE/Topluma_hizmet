(function () {
  'use strict';

  // The rules identify teaching points. They do not classify a message as fraud.
  const rules = [
    { id: 'urgency', title: 'Acele ettirme', pattern: /(?:hemen|acil|bugün|son saat|son gün|derhal|gecikmeden|beklemeden)/iu, reason: 'Süre baskısı, doğrulama yapmadan karar vermeni sağlayabilir.' },
    { id: 'payment', title: 'Para veya kart bilgisi isteği', pattern: /(?:ödeme|ücret|havale|iban|para gönder|para yatır|kart bilg|hesaba gönder|işlem bedeli|ön ödeme)/iu, reason: 'Ödeme yöntemini ve alıcıyı mesajdan bağımsız bir kanaldan doğrula.' },
    { id: 'secret', title: 'Şifre veya giriş kodu isteği', pattern: /(?:şifre|parola|doğrulama kod|giriş kod|tek kullanımlık kod|sms kodu|onay kodu)/iu, reason: 'Şifreleri ve tek kullanımlık kodları başka biriyle paylaşma.' },
    { id: 'reward', title: 'Ödül veya fırsat vaadi', pattern: /(?:kazandınız|kazandın|hediye|ücretsiz|promosyon|çekiliş|burs kazand)/iu, reason: 'Cazip bir teklif gerçek olabilir; işlem yapmadan önce duyuruyu resmî kanaldan kontrol et.' },
    { id: 'pressure', title: 'Gizlilik veya korku baskısı', pattern: /(?:kimseye söyleme|gizli tut|hesabın kapanacak|hesabınız kapanacak|ceza uygulanacak|hakkınızda işlem)/iu, reason: 'Korkutma veya gizli tutma isteğinde durup güvendiğin bir kişiyle ve resmî kanalla doğrula.' },
    { id: 'remote', title: 'Cihaza erişim isteği', pattern: /(?:uzaktan erişim|ekran paylaş|program indir|uygulama yükle)/iu, reason: 'Tanımadığın birinin yönlendirmesiyle cihazına erişim verme veya yazılım kurma.' },
    { id: 'identity', title: 'Yetkili kişi iddiası', pattern: /(?:ben (?:polis|savcı|banka çalışanı|okul yönetimi)|(?:polis|savcı|banka görevlisi|okul yönetimi) olarak arıyorum)/iu, reason: 'Unvan veya kurum adı kimliği kanıtlamaz; önceden bildiğin numaradan kendin ulaş.' },
    { id: 'link', title: 'Bağlantı veya alan adı', pattern: /(?:https?:\/\/|\b[a-z0-9-]+\.(?:com|net|org|tr|edu|gov)(?:\b|\/))/iu, reason: 'Mesajdaki adresi açmadan önce gerçek alan adını incele; kuruma ayrıca kendi bulduğun kanaldan ulaş.' }
  ];

  function analyzeMessage(value) {
    const text = String(value ?? '').trim();
    if (!text) return { error: 'İncelemek için bir mesaj yaz veya kurgusal örnek seç.' };
    if (text.length > 2000) return { error: 'Mesaj 2000 karakterden kısa olmalı.' };
    const findings = rules.filter((rule) => rule.pattern.test(text)).map(({ id, title, reason }) => ({ id, title, reason }));
    return {
      findings,
      summary: findings.length
        ? `${findings.length} dikkat işareti bulundu. Bunlar tek başına mesajın sahte olduğunu kanıtlamaz.`
        : 'Bu kurallarla belirgin bir işaret bulunmadı. Bu, mesajın güvenli olduğunu kanıtlamaz.',
      advice: findings.some((finding) => finding.id === 'secret')
        ? 'Giriş kodunu veya şifreni paylaşma. Hesabını kendi açtığın uygulamadan kontrol et.'
        : findings.some((finding) => finding.id === 'payment')
          ? 'Ödemeyi durdur. Alıcıyı ve işlemi önceden bildiğin resmî numara veya uygulamadan doğrula.'
          : 'Mesajdaki bağlantı veya numarayı kullanmadan, ilgili kişi ya da kuruma bağımsız bir kanaldan ulaş.'
    };
  }

  window.TOD_MESSAGE_ANALYZER = { analyzeMessage, rules };
  const form = document.getElementById('message-form');
  if (!form) return;
  const input = document.getElementById('message-input');
  const result = document.getElementById('message-result');
  const list = document.getElementById('message-findings');
  const samples = {
    kargo: 'Yıldız Teslimat: Paketiniz bekliyor. Bugün 14 TL yeniden teslim ücreti ödeyin: kargo.example.com',
    kod: 'Oyun arkadaşın: Ücretsiz eşyan hazır. Giriş kodunu hemen bana yaz, kimseye söyleme.',
    normal: 'Merhaba, yarın saat 14.00 için konuştuğumuz toplantı planı geçerli. Görüşmek üzere.'
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const analysis = analyzeMessage(input.value);
    document.getElementById('message-summary').textContent = analysis.error || analysis.summary;
    document.getElementById('message-advice').textContent = analysis.error ? '' : analysis.advice;
    list.replaceChildren();
    for (const finding of analysis.findings || []) {
      const item = document.createElement('li');
      const heading = document.createElement('strong');
      const explanation = document.createElement('span');
      heading.textContent = finding.title;
      explanation.textContent = finding.reason;
      item.append(heading, explanation);
      list.append(item);
    }
    result.hidden = false;
    result.querySelector('h2').focus();
  });
  document.getElementById('message-clear').addEventListener('click', () => {
    input.value = '';
    result.hidden = true;
    input.focus();
  });
  document.querySelectorAll('[data-message-example]').forEach((button) => button.addEventListener('click', () => {
    input.value = samples[button.dataset.messageExample];
    result.hidden = true;
    input.focus();
  }));
})();
