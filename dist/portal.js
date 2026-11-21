(function () {
  'use strict';
  const menu = document.getElementById('menu-button');
  const sidebar = document.getElementById('site-sidebar');
  const scrim = document.getElementById('sidebar-scrim');
  const navLinks = [...document.querySelectorAll('[data-site-nav]')];
  const navGroups = [...document.querySelectorAll('[data-nav-group]')];
  const currentSectionLabel = document.getElementById('current-section-label');
  const videos = [...document.querySelectorAll('#videos-screen video')];
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
    scrim.hidden = !open;
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    setMenu(open);
    if (open) sidebar.querySelector('a').focus();
  });
  scrim.addEventListener('click', () => { setMenu(false); menu.focus(); });
  window.matchMedia('(max-width:900px)').addEventListener('change', () => setMenu(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menu.focus();
    }
  });

  const routeGroups = {
    'ana-sayfa': 'home', ozellikler: 'home', 'nasil-calisir': 'home', main: 'home',
    kategoriler: 'games', 'tekrar-turu': 'review', pratik: 'practice', laboratuvar: 'practice',
    'karar-simulatoru': 'decision', 'baglanti-incele': 'inspector',
    'mesaj-incele': 'message', 'rehber-asistani': 'chat', 'ogrenme-yolu': 'path',
    'egitim-videolari': 'videos', 'medya-laboratuvari': 'media', olcme: 'assessment', 'saha-raporu': 'reports',
    'taktik-rehberi': 'guide', 'zarar-kontrolu': 'recovery'
  };
  const navigationGroups = {
    path: 'learn', videos: 'learn', guide: 'learn',
    games: 'practice', decision: 'practice', practice: 'practice', media: 'practice', review: 'practice',
    message: 'analyze', inspector: 'analyze', chat: 'analyze', recovery: 'analyze',
    assessment: 'measure', reports: 'measure'
  };
  const sectionLabels = {
    home: 'Ana sayfa', path: 'Öğrenme yolu', videos: 'Eğitim videoları', guide: 'Taktik rehberi',
    games: 'Soru oyunları', decision: 'Karar simülatörü', practice: 'Tuzak laboratuvarı',
    media: 'Medya doğrulama', review: 'Kısa tekrar', message: 'Mesaj inceleme',
    inspector: 'Bağlantı ve QR', chat: 'Dijital güvenlik rehberi', recovery: 'Şimdi ne yapacağım?',
    assessment: 'Ön test / Son test', reports: 'Saha raporu'
  };
  function updateNavigation() {
    const hash = location.hash.slice(1);
    const section = routeGroups[hash] || (hash.startsWith('taktik-') ? 'guide' : 'home');
    navLinks.forEach((link) => {
      if (link.dataset.siteNav === section) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    const activeGroup = navigationGroups[section];
    if (activeGroup) navGroups.forEach((group) => { group.open = group.dataset.navGroup === activeGroup; });
    currentSectionLabel.textContent = sectionLabels[section];
    if (section !== 'videos') videos.forEach((video) => video.pause());
    if (section !== 'chat') window.TOD_CHAT_GUIDE?.clearConversation();
    setMenu(false);
  }
  navLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));
  window.addEventListener('hashchange', updateNavigation);
  updateNavigation();

  const filterButtons = [...document.querySelectorAll('[data-video-filter]')];
  const cards = [...document.querySelectorAll('[data-video-group]')];
  filterButtons.forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.videoFilter;
    filterButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    cards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.videoGroup.split(' ').includes(filter);
      card.hidden = !matches;
      if (!matches) card.querySelector('video')?.pause();
    });
  }));

  const status = document.getElementById('offline-status');
  function updateOnlineStatus() {
    if (!status) return;
    status.textContent = navigator.onLine
      ? 'Çevrimiçi · Eğitim araçları çevrimdışı da açılabilir.'
      : 'Çevrimdışı · Oyun, simülasyon ve test kullanılabilir.';
  }
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js').catch(() => {}));
  }
})();
