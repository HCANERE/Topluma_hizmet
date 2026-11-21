(function () {
  'use strict';
  // Every answer is curated from this project's educational material.
  window.TOD_CHAT_CONTENT = [
    {
      id: 'code-shared', title: 'Giriş kodu paylaşıldı', incident: true,
      answer: 'Kodu paylaştıysan ilgili hesabı kendi açtığın uygulamadan kontrol et. Şifreni değiştir, tanımadığın açık oturumları kapat ve iki aşamalı doğrulamayı gözden geçir. Yardım için mesajdaki numarayı değil, hizmetin resmî destek kanalını kullan.',
      href: '#zarar-kontrolu', sourceTitle: 'Şimdi Ne Yapacağım? · Kod paylaştım'
    },
    {
      id: 'card-entered', title: 'Kart bilgisi girildi', incident: true,
      answer: 'Kart bilgilerini şüpheli bir sayfaya girdiysen bankana kendi bildiğin resmî numaradan veya uygulamadan hemen ulaş. Kartı durdurma ve işlemleri kontrol etme seçeneklerini bankanla görüş. Mesajdaki numarayı arama.',
      href: '#zarar-kontrolu', sourceTitle: 'Şimdi Ne Yapacağım? · Kart bilgisi girdim'
    },
    {
      id: 'money-sent', title: 'Para gönderildi', incident: true,
      answer: 'Şüpheli bir isteğe para gönderdiysen bankana resmî kanaldan gecikmeden haber ver. İşlem bilgilerini ve yazışmaları sakla; durumu ilgili resmî başvuru kanallarına bildir. Geri ödeme sözü veren yeni kişilere yeniden para gönderme.',
      href: '#zarar-kontrolu', sourceTitle: 'Şimdi Ne Yapacağım? · Para gönderdim'
    },
    {
      id: 'link-opened', title: 'Şüpheli bağlantı açıldı', incident: true,
      answer: 'Yalnızca bağlantıyı açtıysan sayfayı kapat ve cihazını güncel tut. Şifre, giriş kodu veya kart bilgisi de girdiysen ilgili hesabı ya da bankanı kendi bildiğin resmî kanaldan kontrol et. Bağlantıyı başkalarına iletme.',
      href: '#zarar-kontrolu', sourceTitle: 'Şimdi Ne Yapacağım? · Bağlantı açtım'
    },
    {
      id: 'password-entered', title: 'Şifre şüpheli sayfaya girildi', incident: true,
      answer: 'Şifreni şüpheli bir sayfaya girdiysen gerçek hizmetin uygulamasını kendin açıp şifreni değiştir. Aynı şifreyi kullandığın diğer hesapları da kontrol et, açık oturumları incele ve iki aşamalı doğrulamayı etkinleştir.',
      href: '#zarar-kontrolu', sourceTitle: 'Şimdi Ne Yapacağım? · Hesabımı koru'
    },
    {
      id: 'phishing', title: 'Oltalama nedir?',
      keywords: ['oltalama', 'phishing', 'sahte e posta', 'sahte mesaj', 'eposta', 'email'],
      examples: ['Oltalama nedir?', 'Sahte e-posta ile bilgi isteme nasıl olur?'],
      answer: 'Oltalama, sahte mesaj, arama veya sayfayla kişiyi kandırıp bilgi ya da para alma girişimidir. Gönderen adı, düzgün yazım ve HTTPS tek başına güven kanıtı değildir. İddia edilen kuruma mesajın içindeki bağlantı veya numara yerine bağımsız bulduğun resmî kanaldan ulaş.',
      href: '#egitim-videolari', sourceTitle: 'Eğitim videoları · Oltalama nedir?'
    },
    {
      id: 'url', title: 'Bağlantıyı nasıl incelerim?',
      keywords: ['link', 'baglanti', 'adres', 'url', 'web sitesi', 'site guvenli', 'viruslu site', 'zararli site'],
      examples: ['Bu bağlantı güvenli mi?', 'Linkin gerçek alan adı nasıl anlaşılır?'],
      answer: 'Bir adresin görünüşünden veya HTTPS işaretinden kesin güvenlik sonucu çıkarılamaz. Bağlantıyı açmadan gerçek alan adını inceleyebilirsin; gerekirse kurumu kendi bulduğun resmî site veya uygulamadan doğrula. Bu rehber virüs taraması yapmaz.',
      href: '#baglanti-incele', sourceTitle: 'Bağlantı ve QR incele'
    },
    {
      id: 'qr', title: 'QR kodu nasıl kontrol ederim?',
      keywords: ['qr', 'karekod', 'barkod'],
      examples: ['QR kodu okutmak güvenli mi?', 'Karekod nereye gidiyor?'],
      answer: 'QR kodu bir web adresi veya başka bir işlem içerebilir. Adresi açmadan önce gösterilen alan adını incele; ödeme veya giriş bilgisi isteniyorsa ilgili kurumu bağımsız kanaldan doğrula. Sitemizdeki QR inceleme, seçtiğin görseli cihazında okur.',
      href: '#baglanti-incele', sourceTitle: 'Bağlantı ve QR incele'
    },
    {
      id: 'code-request', title: 'Şifre veya giriş kodu isteniyor',
      keywords: ['dogrulama kodu', 'giris kodu', 'sms kodu', 'tek kullanimlik kod', 'kod', 'kod istiyor', 'kod istedi', 'sifre istiyor', 'sifre istedi'],
      examples: ['Biri doğrulama kodumu istiyor', 'Giriş kodunu vermeli miyim?'],
      answer: 'Şifreni veya tek kullanımlık giriş kodunu kimseyle paylaşma. İsteyen kişi destek görevlisi gibi konuşsa bile isteği mesajdaki numaradan doğrulama. Beklemediğin bir kod geldiyse hesabını kendi uygulamandan kontrol et.',
      href: '#egitim-videolari', sourceTitle: 'Eğitim videoları · Doğrulama kodunu paylaşma'
    },
    {
      id: 'package', title: 'Kargo mesajı geldi',
      keywords: ['kargo', 'paket', 'teslimat', 'gonderi'],
      examples: ['Bana kargo mesajı geldi, nasıl doğrularım?', 'Kargo teslim ücreti isteniyor'],
      answer: 'Beklediğin bir paket olsa bile mesajdaki bağlantıdan ödeme yapma. Sipariş veya kargo durumunu satıcının ya da taşıyıcının kendi açtığın uygulamasından kontrol et. Küçük bir ücret istenmesi de doğrulama ihtiyacını ortadan kaldırmaz.',
      href: '#egitim-videolari', sourceTitle: 'Eğitim videoları · Kargo mesajına dikkat'
    },
    {
      id: 'payment-request', title: 'Beklenmedik para isteği',
      keywords: ['para istiyor', 'odeme istiyor', 'havale', 'iban', 'islem ucreti'],
      examples: ['Biri benden para istiyor, göndermeli miyim?', 'Yeni IBAN ile ödeme isteniyor'],
      answer: 'Beklenmedik para isteğinde, özellikle acele baskısı veya yeni hesap bilgisi varsa işlemi durdur. Kişiyi ya da kurumu mesajdaki numaradan değil, önceden bildiğin başka bir kanaldan doğrula. Küçük bir deneme ödemesi de alıcının gerçek olduğunu kanıtlamaz.',
      href: '#karar-simulatoru', sourceTitle: 'Karar simülatörü · Ödeme kararları'
    },
    {
      id: 'fake-video', title: 'Video gerçek mi?',
      keywords: ['video', 'goruntu', 'deepfake', 'yapay zeka videosu'],
      examples: ['Gördüğüm video gerçek mi, nasıl anlarım?', 'Yapay zekâ videosu nasıl doğrulanır?'],
      answer: 'Gerçekçi görünmesi bir videodaki iddianın doğru olduğunu kanıtlamaz. Özellikle para, bilgi veya acil işlem isteniyorsa dur; iddiayı ilgili kişinin önceden bildiğin kanalı ve resmî kaynaklarla karşılaştır. Tek bir görüntüden kesin karar verme.',
      href: '#egitim-videolari', sourceTitle: 'Eğitim videoları · Gördüğün video gerçek mi?'
    },
    {
      id: 'fake-voice', title: 'Tanıdık sesle gelen istek',
      keywords: ['ses', 'ses taklidi', 'telefon aramasi', 'tanidik ses', 'yapay ses'],
      examples: ['Tanıdık bir ses para istiyor', 'Telefondaki ses gerçekten ailem mi?'],
      answer: 'Bir ses tanıdık gelse de para veya bilgi isteği gerçek olmayabilir. Görüşmeyi bitirip kişiyi önceden kayıtlı numarasından kendin ara. Yeni numaranın verdiği iletişim bilgilerini doğrulama için kullanma.',
      href: '#egitim-videolari', sourceTitle: 'Eğitim videoları · Tanıdık ses, şüpheli istek'
    },
    {
      id: 'scholarship', title: 'Burs veya iş fırsatı',
      keywords: ['burs', 'staj', 'is ilani', 'basvuru ucreti', 'on odeme'],
      examples: ['Burs için işlem ücreti isteniyor', 'İş başvurusu için para yatırmalı mıyım?'],
      answer: 'Burs veya iş başvurusu için beklenmedik ücret ve acele baskısı varsa işlemi durdur. İlanı ve başvuru durumunu kurumun önceden bildiğin resmî kanalı üzerinden kontrol et; mesajdaki formu doldurmadan önce doğrula.',
      href: '#karar-simulatoru', sourceTitle: 'Karar simülatörü · Burs başvurusu'
    },
    {
      id: 'shopping', title: 'Sahte alışveriş sitesi',
      keywords: ['alisveris', 'indirim', 'magaza', 'urun', 'satis sitesi'],
      examples: ['Çok ucuz alışveriş sitesi güvenilir mi?', 'İndirimli ürün sayfasını nasıl kontrol ederim?'],
      answer: 'Çok büyük indirim, tek ödeme yöntemi veya acele baskısı dikkat gerektirir. HTTPS ve logo tek başına güvenilirlik kanıtı değildir. Satıcıyı bağımsız kaynaklardan araştır ve ödeme bilgisi girmeden önce gerçek alan adını kontrol et.',
      href: '#kategoriler', sourceTitle: 'Soru oyunları · Ebeveynler'
    },
    {
      id: 'school', title: 'Okul adına ödeme isteği',
      keywords: ['okul', 'gezi ucreti', 'veli', 'ogretmen'],
      examples: ['Okuldan kişisel hesaba para isteniyor', 'Gezi ödemesi mesajını nasıl doğrularım?'],
      answer: 'Okul adına gelen ödeme talebini e-postadaki veya mesajdaki numaradan doğrulama. Okulun önceden bildiğin iletişim kanalına kendin ulaş ve alıcı hesap bilgisini sor. Kişisel hesaba acil ödeme isteğinde durup kontrol et.',
      href: '#karar-simulatoru', sourceTitle: 'Karar simülatörü · Okuldan acil ödeme'
    },
    {
      id: 'authority', title: 'Kendini yetkili olarak tanıtan kişi',
      keywords: ['polis', 'savci', 'kamu gorevlisi', 'banka gorevlisi', 'yetkiliyim'],
      examples: ['Polis olduğunu söyleyen biri para istiyor', 'Banka görevlisi arayıp şifre istedi'],
      answer: 'Bir kişinin polis, savcı veya banka çalışanı olduğunu söylemesi kimliğini kanıtlamaz. Para, şifre veya doğrulama kodu istenirse işlemi durdur; ilgili kuruma kendi bildiğin resmî numaradan ulaş. Görüşmedeki numarayı doğrulama için kullanma.',
      href: '#kategoriler', sourceTitle: 'Soru oyunları · İleri yaş'
    },
    {
      id: 'health', title: 'Sağlık randevusu mesajı',
      keywords: ['randevu', 'hastane', 'saglik', 'muayene'],
      examples: ['Sağlık randevusu için ödeme mesajı geldi', 'Hastane bağlantısı gerçek mi?'],
      answer: 'Beklemediğin randevu veya ödeme mesajındaki bağlantıyı açmadan önce işlemi kendi kullandığın resmî randevu kanalı üzerinden kontrol et. Sağlık ve kimlik bilgilerini mesajdaki sayfaya yazma.',
      href: '#kategoriler', sourceTitle: 'Soru oyunları · İleri yaş'
    },
    {
      id: 'account', title: 'Hesabımı nasıl korurum?',
      keywords: ['parola', 'sifre', '2fa', 'iki asamali', 'hesap guvenligi'],
      examples: ['Hesabımı nasıl korurum?', 'Güçlü parola ve iki aşamalı doğrulama nedir?'],
      answer: 'Her önemli hesapta farklı ve güçlü bir parola kullan, mümkünse iki aşamalı doğrulamayı aç. Giriş kodunu paylaşma. Hesabınla ilgili uyarıyı mesajdaki bağlantıdan değil, kendi açtığın uygulamadan kontrol et.',
      href: '#taktik-rehberi', sourceTitle: 'Taktik Rehberi · Hesap güvenliği'
    },
    {
      id: 'verify', title: 'Bir mesajı nasıl doğrularım?',
      keywords: ['dogrula', 'teyit', 'resmi kanal', 'gercek mi'],
      examples: ['Şüpheli bir mesajı nasıl doğrularım?', 'Kurumun gerçekten yazdığını nasıl anlarım?'],
      answer: 'Önce işlemi durdur. Mesajdaki bağlantı ve numarayı kullanmadan, kurumu kendi bildiğin resmî site, uygulama veya numaradan bul. İddia edilen ödeme ya da hesap işleminin orada görünüp görünmediğini kontrol et.',
      href: '#mesaj-incele', sourceTitle: 'Şüpheli mesaj inceleme'
    },
    {
      id: 'remote-support', title: 'Sahte teknik destek',
      keywords: ['teknik destek', 'uzaktan erisim', 'ekran paylas', 'program indir'],
      examples: ['Destek görevlisi uzaktan erişim istiyor', 'Ekranımı paylaşmalı mıyım?'],
      answer: 'Beklenmedik uyarı veya arama üzerine uzaktan erişim verme ve program kurma. Gerçek bir sorun olabileceğini düşünüyorsan cihazın veya hizmetin kendi resmî destek kanalına bağımsız ulaş.',
      href: '#egitim-videolari', sourceTitle: 'Eğitim videoları · Sahte teknik destek'
    }
  ];
})();
