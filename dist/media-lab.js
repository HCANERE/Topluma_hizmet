(function () {
  'use strict';
  const cases = [
    {
      title: 'Acil banka duyurusu gibi görünen video', channel: 'Sosyal medya videosu', source: 'Yeni açılmış “Finans Duyuru” hesabı',
      claim: 'Videodaki anlatıcı “Hesabın bugün kapanmaması için bağlantıdaki formu doldur” diyor.',
      clue: 'Paylaşımda kurumun doğrulanabilir resmî açıklaması yok; bağlantı ve acele baskısı var.',
      options: ['Videonun görüntüsü düzgünse formu doldururum.', 'Bankanın uygulamasını kendim açıp duyuruyu orada kontrol ederim.', 'Videonun altına şifremin bir kısmını yorum olarak yazarım.'], correct: 1,
      explanation: 'Gerçekçi görüntü ve düzgün konuşma kimliği kanıtlamaz. Bankanın uygulamasını veya önceden bildiğin resmî numarasını bağımsız açıp iddiayı kontrol et.'
    },
    {
      title: 'Eski görüntü, yeni olay iddiası', channel: 'Paylaşılan haber klibi', source: 'Tarihi görünmeyen bir yeniden paylaşım',
      claim: 'Gönderi, geçmişte çekilmiş bir görüntüyü bugün yaşanan bir olaymış gibi anlatıyor.',
      clue: 'Orijinal yayın tarihi ve ilk kaynak gösterilmiyor.',
      options: ['Başlığı görür görmez başkalarına iletirim.', 'İlk yayını, tarihini ve bağımsız kaynakları araştırırım.', 'Çok paylaşılmışsa bugüne ait olduğunu kabul ederim.'], correct: 1,
      explanation: 'Görüntü gerçek olsa bile tarih ve bağlam farklı olabilir. İlk kaynağı ve güncel resmî açıklamayı karşılaştırmadan iddiayı paylaşma.'
    },
    {
      title: 'Tanıdık sesle para isteği', channel: 'Sesli mesaj', source: 'Tanımadığın yeni numara',
      claim: 'Ses, aile üyen gibi geliyor ve hemen başka bir hesaba para göndermeni istiyor.',
      clue: 'Numara yeni; acil ödeme isteniyor. Sesin tanıdık olması yeterli kanıt değil.',
      options: ['Sesi tanıdığım için hemen para gönderirim.', 'Yeni numaradan bir sesli mesaj daha isterim.', 'Kişiyi önceden kayıtlı numarasından kendim ararım.'], correct: 2,
      explanation: 'Ses taklit edilebilir veya kayıt farklı bağlamda kullanılabilir. Yeni numarayı bırakıp önceden bildiğin kanaldan kişiye kendin ulaş.'
    }
  ];
  window.TOD_MEDIA_LAB = { cases };
  const title = document.getElementById('media-case-title');
  if (!title) return;
  let index = 0;
  let answered = false;
  const byId = (id) => document.getElementById(id);
  function render() {
    const item = cases[index];
    answered = false;
    byId('media-progress').textContent = `Örnek ${index + 1} / ${cases.length}`;
    title.textContent = item.title;
    byId('media-channel').textContent = item.channel;
    byId('media-source').textContent = item.source;
    byId('media-claim').textContent = item.claim;
    byId('media-clue').textContent = item.clue;
    const choices = byId('media-choices');
    choices.replaceChildren();
    item.options.forEach((label, choiceIndex) => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'decision-choice'; button.textContent = label;
      button.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        [...choices.children].forEach((option) => { option.disabled = true; });
        const correct = choiceIndex === item.correct;
        byId('media-feedback-title').textContent = correct ? '✓ Güvenli adım' : '✕ Birlikte gözden geçirelim';
        byId('media-feedback-text').textContent = item.explanation;
        byId('media-feedback').hidden = false;
        byId('media-next').textContent = index === cases.length - 1 ? 'Baştan dene' : 'Sonraki örnek';
        byId('media-feedback').focus();
      });
      choices.append(button);
    });
    byId('media-feedback').hidden = true;
  }
  byId('media-next').addEventListener('click', () => { index = (index + 1) % cases.length; render(); title.focus(); });
  render();
})();
