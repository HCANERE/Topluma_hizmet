(function () {
  'use strict';

  const byId = (id) => document.getElementById(id);
  const evidence = byId('lab-evidence');
  const hint = byId('lab-hint');
  const outcome = byId('lab-outcome');
  const decisions = byId('lab-decisions');

  const scenarios = window.TOD_LAB_SCENARIOS;
  const picker = byId('lab-scenarios');
  const checkList = byId('lab-checks');
  const tacticList = byId('lab-tactics');
  const scenarioLabels = {
    tanidik: 'Tanıdık hesap veya kurum',
    acele: 'Acele baskısı',
    para: 'Beklenmedik para isteği',
    kod: 'Doğrulama kodu',
    baglanti: 'Mesajdaki bağlantı'
  };
  const accept = byId('lab-accept');
  const hold = byId('lab-hold');
  const inspected = new Set();
  let currentScenario;
  let variantIndex = 0;
  let checkButtons = [];

  function addEntry(list, title, text) {
    const item = document.createElement('li');
    const label = document.createElement('strong');
    label.textContent = title;
    const note = document.createElement('p');
    note.textContent = text;
    item.append(label, note);
    list.append(item);
  }

  function resetLab(focusCheck = false) {
    inspected.clear();
    evidence.replaceChildren();
    hint.hidden = false;
    outcome.hidden = true;
    decisions.hidden = false;
    for (const button of checkButtons) {
      button.disabled = false;
      button.setAttribute('aria-pressed', 'false');
    }
    if (focusCheck) checkButtons[0].focus();
  }

  function selectScenario(scenario, moveFocus = false) {
    if (currentScenario === scenario) return;

    currentScenario = scenario;
    variantIndex = Math.floor(Math.random() * scenario.variants.length);
    const sender = byId('lab-sender');
    sender.textContent = scenario.sender;
    byId('lab-avatar').textContent = scenario.avatar;
    byId('lab-channel').textContent = scenario.channel;
    byId('lab-message').textContent = scenario.message;
    accept.textContent = scenario.acceptLabel;
    hold.textContent = scenario.holdLabel;

    checkButtons = scenario.checks.map((check) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = check.label;
      button.addEventListener('click', () => {
        if (inspected.has(check)) return;
        inspected.add(check);
        button.setAttribute('aria-pressed', 'true');
        hint.hidden = true;
        const note = check.verifies ? scenario.variants[variantIndex].evidence : check.note;
        addEntry(evidence, check.label, note);
      });
      return button;
    });
    checkList.replaceChildren(...checkButtons);
    for (const [index, button] of scenarioButtons.entries()) {
      button.setAttribute('aria-pressed', String(scenarios[index] === scenario));
    }
    resetLab();
    if (moveFocus) sender.focus();
  }

  function finishLab(decision) {
    const variant = currentScenario.variants[variantIndex];
    const feedback = variant[decision];
    const verified = [...inspected].some((check) => check.verifies);
    byId('lab-outcome-title').textContent = feedback.title;
    byId('lab-outcome-text').textContent = verified && feedback.afterCheck ? feedback.afterCheck : feedback.text;
    byId('lab-backstage').textContent = variant.backstage;
    tacticList.replaceChildren(...currentScenario.tactics.map((key) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.setAttribute('href', '#taktik-' + key);
      link.textContent = scenarioLabels[key];
      item.append(link);
      return item;
    }));
    outcome.querySelector('details').open = true;
    decisions.hidden = true;
    outcome.hidden = false;
    hint.hidden = true;
    for (const button of checkButtons) button.disabled = true;
    outcome.focus();
  }

  const scenarioButtons = scenarios.map((scenario) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'outline-button';
    button.textContent = scenario.title;
    button.addEventListener('click', () => selectScenario(scenario, true));
    return button;
  });
  picker.replaceChildren(...scenarioButtons);
  selectScenario(scenarios[0]);

  accept.addEventListener('click', () => finishLab('accept'));
  hold.addEventListener('click', () => finishLab('hold'));
  byId('lab-rewind').addEventListener('click', () => resetLab(true));
  byId('lab-variant').addEventListener('click', () => {
    variantIndex = (variantIndex + 1) % currentScenario.variants.length;
    resetLab(true);
  });

  const report = {
    label: 'Mesajı platforma bildir',
    note: 'Bildirime mesajın saatini ve gönderen bilgilerini ekledin. Giriş kodunu veya parolanı paylaşmadın.'
  };

  const incidents = {
    link: {
      title: 'Şüpheli bir sayfa açıldı',
      brief: 'Bir mesajdan açtığın sayfa senden giriş yapmanı istiyor. Henüz bilgi girmedin veya dosya indirmedin.',
      steps: [
        { label: 'Şüpheli sayfayı kapat', note: 'Sayfayı bilgi girmeden kapattın.' },
        { label: 'Bildiğin uygulamadan kontrol et', note: 'Uygulamayı kendin açtın. Mesajdaki isteğin hesabında görünmediğini kontrol ettin.' },
        report
      ],
      done: 'Sayfayı kapattın, isteği bağımsız kanaldan kontrol ettin ve mesajı bildirdin. Benzer bir mesaj gelirse aynı adımları hatırla.'
    },
    code: {
      title: 'Giriş kodu paylaşıldı',
      brief: 'Birisi hesabın için gelen giriş kodunu aldı. Kendi uygulamandan hesabına hâlâ erişebiliyorsun.',
      steps: [
        { label: 'Uygulamadan parolanı değiştir', note: 'Bildiğin uygulamadan güçlü ve benzersiz bir parola seçtin.' },
        { label: 'Açık oturumları incele', note: 'Hesabındaki tanımadığın cihazdan çıkış yaptın.' },
        { label: 'Hesap bilgilerini kontrol et', note: 'Kurtarma e-postası ve telefon numarasını kontrol ettin. Tanımadığın bir değişiklik görürsen uygulamanın resmî desteğine ulaşabilirsin.' },
        report
      ],
      done: 'Hesabını kontrol ettin ve şüpheli mesajı bildirdin. Hesaba erişimini kaybedersen uygulamanın resmî hesap kurtarma yolunu kullan.'
    },
    card: {
      title: 'Kart bilgileri paylaşıldı',
      brief: 'Şüpheli bir sayfaya kart bilgilerini girdin. Gerçek bir işlem olup olmadığını henüz bilmiyorsun.',
      steps: [
        { label: 'Bankayı bildiğim kanaldan ararım', note: 'Kartın arkasındaki veya bankanın kendi uygulamasındaki iletişim bilgisini kullandın; şüpheli sayfadaki numarayı aramadın.' },
        { label: 'Kartın kullanımını durdurmayı isterim', note: 'Bankayla birlikte kartı geçici olarak kapatma veya değiştirme seçeneğini değerlendirdin.' },
        { label: 'Hareketleri ve bildirimleri incelerim', note: 'Tanımadığın işlemleri bankaya bildirip itiraz sürecini bankadan öğrendin.' },
        { label: 'İlgili kayıtları saklarım', note: 'Mesajı ve işlem bilgilerini sakladın; şifre veya kart bilgisini başka biriyle paylaşmadın.' }
      ],
      done: 'Bankanla resmî kanaldan görüştün ve kart hareketlerini kontrol ettin. İşlem sonucunu banka belirler; burada para iadesi garantisi verilmez.'
    },
    money: {
      title: 'Şüpheli hesaba para gönderildi',
      brief: 'Acele bir isteğe inanıp para gönderdin. Mesajın sahte olabileceğini fark ettin.',
      steps: [
        { label: 'Bankamla hemen görüşürüm', note: 'Gönderdiğin bankanın kendi uygulamasındaki veya önceden bildiğin numarasındaki desteğe başvurdun.' },
        { label: 'İşlem bilgilerini saklarım', note: 'Tarih, tutar, alıcı ve görüşme kayıtlarını başvuru için sakladın.' },
        { label: 'Resmî başvuru yolunu öğrenirim', note: 'Bankadan sonraki adımları öğrendin; gerekiyorsa kolluk veya ilgili resmî makama başvurursun.' },
        { label: 'Aynı isteği çevreme bildiririm', note: 'Yakınlarına aynı yöntemle mesaj gelebileceğini söyledin; hassas bilgilerini paylaşmadın.' }
      ],
      done: 'Hızlı davranıp bankanla görüştün ve kayıtları korudun. Sonuç olayın koşullarına bağlıdır; bu alıştırma hukuki veya finansal sonuç garantisi vermez.'
    }
  };

  const simulator = byId('recovery-simulator');
  const recoveryActions = byId('recovery-actions');
  const log = byId('recovery-log');
  const count = byId('recovery-count');
  const completion = byId('recovery-complete');
  let currentIncident = null;

  function startIncident(key) {
    const incident = incidents[key];
    const completed = new Set();
    currentIncident = key;
    Object.keys(incidents).forEach((id) => {
      byId('recovery-' + id).setAttribute('aria-pressed', String(id === key));
    });
    byId('recovery-incident').textContent = incident.title;
    byId('recovery-brief').textContent = incident.brief;

    log.replaceChildren();
    completion.hidden = true;
    completion.textContent = '';
    simulator.hidden = false;

    function updateCount() {
      count.textContent = completed.size + ' / ' + incident.steps.length + ' adım tamamlandı';
    }

    recoveryActions.replaceChildren(...incident.steps.map((step) => {
      const action = document.createElement('button');
      action.type = 'button';
      action.textContent = step.label;
      action.setAttribute('aria-pressed', 'false');
      action.addEventListener('click', () => {
        if (completed.has(step)) return;
        completed.add(step);
        action.setAttribute('aria-pressed', 'true');
        addEntry(log, step.label, step.note);
        updateCount();
        if (completed.size === incident.steps.length) {
          completion.hidden = false;
          completion.textContent = incident.done;
        }
      });
      return action;
    }));

    updateCount();
    byId('recovery-incident').focus();
  }

  Object.keys(incidents).forEach((key) => {
    byId('recovery-' + key).addEventListener('click', () => startIncident(key));
  });
  byId('recovery-reset').addEventListener('click', () => startIncident(currentIncident));
})();
