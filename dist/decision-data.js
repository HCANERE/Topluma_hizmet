(function () {
  'use strict';

  // All people, organizations and messages below are fictional training examples.
  window.TOD_DECISIONS = [
    {
      id: 'burs', title: 'Burs başvurusu', audience: 'Gençler', tag: 'para', channel: 'SMS',
      sender: 'Ada Öğrenim Desteği',
      message: 'Başvurunuz kabul edildi. Ödemenizi alabilmeniz için bugün 90 TL işlem ücreti yatırın. Form: burs.example.com',
      example: 'burs.example.com yalnızca eğitim amaçlı örnek adrestir; bağlantı açılmaz.',
      stages: [
        { prompt: 'İlk dikkat edeceğin işaret hangisi?', context: 'Mesajı okumak başvurunun gerçekten kabul edildiğini kanıtlamaz.', options: [
          { text: 'İşlem ücreti ve acele baskısı', correct: true, feedback: 'Ödeme ve süre baskısı birlikte dikkat gerektirir. Gerçek bir burs duyurusu olup olmadığını ayrıca doğrula.' },
          { text: 'Mesajın kısa ve anlaşılır olması', feedback: 'Düzgün yazılmış bir mesaj da sahte olabilir. Asıl isteğin ne olduğuna bak.' },
          { text: 'Gönderen adının kuruma benzemesi', feedback: 'Gönderen adı taklit edilebilir. Yalnızca görünen ada güvenme.' }
        ] },
        { prompt: 'Başvurunu nereden doğrularsın?', context: 'Ödemeden veya form doldurmadan önce kurumun gerçek kanalını bul.', options: [
          { text: 'Önceden bildiğim resmî başvuru kanalından', correct: true, feedback: 'Doğru. Mesajdaki yönlendirmeden bağımsız bir kaynaktan başvuru durumunu kontrol et.' },
          { text: 'SMS içindeki form ve iletişim numarasından', feedback: 'Mesaj sahteyse bağlantı ve numara da aynı kişiye ait olabilir.' },
          { text: 'Mesajı ileten tanımadığım kişiye sorarak', feedback: 'Tanımadığın bir kişinin sözü başvuru durumunu doğrulamaz.' }
        ] },
        { prompt: 'Şimdi hangi adımı atarsın?', verifiedContext: 'Resmî kanalda bu ödeme isteğini bulamadın.', unverifiedContext: 'Ödeme isteği henüz bağımsız bir kanaldan doğrulanmadı.', options: [
          { text: 'Ödemeyi durdurup kuruma bağımsız ulaşırım', correct: true, feedback: 'Güvenli adım bu. Para göndermeden önce iddiayı doğrula.' },
          { text: 'Küçük tutar olduğu için parayı gönderirim', feedback: 'Tutar küçük olsa da istek sahte olabilir; ödeme yapma.' },
          { text: 'Formu doldurup sonra durumu araştırırım', feedback: 'Formda kişisel bilgi istenebilir. Önce doğrulama yap.' }
        ] }
      ], takeaway: 'Burs veya iş fırsatı için beklenmedik işlem ücreti istenirse işlemi durdur ve ilanı resmî kanaldan kontrol et.'
    },
    {
      id: 'oyun', title: 'Ücretsiz oyun eşyası', audience: 'Gençler', tag: 'kod', channel: 'Sosyal medya mesajı',
      sender: 'Oyun Arkadaşı',
      message: 'Hesabına ücretsiz eşya yükletebilirim. Giriş kodun birazdan gelecek, bana yazman yeterli.',
      example: 'Bu mesaj gerçek bir oyun veya platformdan gönderilmedi.',
      stages: [
        { prompt: 'Mesajın en riskli isteği hangisi?', context: 'Hediye vaadi kulağa çekici gelebilir.', options: [
          { text: 'Tek kullanımlık giriş kodunu istemesi', correct: true, feedback: 'Giriş kodu hesabına erişim sağlayabilir; başka biriyle paylaşma.' },
          { text: 'Oyun içi eşya teklif etmesi', feedback: 'Teklif dikkat çekici, fakat asıl risk giriş kodunun istenmesi.' },
          { text: 'Sosyal medyadan yazılmış olması', feedback: 'Mesajın geldiği kanal tek başına karar verdirmez; istenen bilgiye bak.' }
        ] },
        { prompt: 'Teklifin gerçekliğini nasıl kontrol edersin?', context: 'Mesajdaki kişinin gönderdiği bağlantıyı kullanmak zorunda değilsin.', options: [
          { text: 'Oyunun kendi uygulamasındaki duyurulardan', correct: true, feedback: 'Doğru. Uygulamayı kendin aç ve kampanyayı orada ara.' },
          { text: 'Mesajdaki bağlantıdan giriş yaparak', feedback: 'Bağlantı sahte bir giriş ekranına gidebilir.' },
          { text: 'Kod geldiyse teklif gerçek sayarak', feedback: 'Kod gelmesi birinin hesabına giriş denediğini gösterebilir.' }
        ] },
        { prompt: 'Kod geldiğinde ne yaparsın?', verifiedContext: 'Oyunun resmî duyurularında böyle bir kampanya yok.', unverifiedContext: 'Teklif bağımsız bir kanaldan doğrulanmadı.', options: [
          { text: 'Kodu paylaşmam, oturumları kontrol ederim', correct: true, feedback: 'Güvenli seçim. Beklemediğin kodlar için hesap güvenliğini kontrol et.' },
          { text: 'Kod kısa süreli olduğu için gönderirim', feedback: 'Kısa süreli kodlar da hesabı ele geçirmek için kullanılabilir.' },
          { text: 'Yalnızca kodun bir kısmını iletirim', feedback: 'Kodun hiçbir bölümünü paylaşman gerekmez.' }
        ] }
      ], takeaway: 'Hediye veya destek bahanesiyle istenen giriş kodunu asla paylaşma.'
    },
    {
      id: 'okul', title: 'Okuldan acil ödeme', audience: 'Ebeveynler', tag: 'para', channel: 'E-posta',
      sender: 'Ada Okul İletişim Birimi',
      message: 'Gezi ödemesi bugün tamamlanmalı. Ücreti aşağıdaki kişisel hesaba gönderip dekontu yanıtlayın.',
      example: 'Bu okul ve ödeme talebi eğitim için kurgulanmıştır.',
      stages: [
        { prompt: 'Neyi özellikle sorgularsın?', context: 'Okul adının yazması tek başına yeterli değildir.', options: [
          { text: 'Kişisel hesaba acil ödeme istemesini', correct: true, feedback: 'Evet. Alıcı ve ödeme yöntemi kurumun bilinen süreciyle uyuşuyor mu kontrol et.' },
          { text: 'E-postanın düzgün Türkçe yazılmasını', feedback: 'Yazım kalitesi güvenilirlik kanıtı değildir.' },
          { text: 'Gezi konusunun tanıdık gelmesini', feedback: 'Tanıdık bir konu da kötüye kullanılabilir; ödeme ayrıntılarını doğrula.' }
        ] },
        { prompt: 'Ödeme duyurusunu nereden doğrularsın?', context: 'E-postaya yanıt vermek bağımsız doğrulama sağlamaz.', options: [
          { text: 'Okulun önceden bilinen numarası veya sistemiyle', correct: true, feedback: 'Doğru. İletişim bilgisini e-postadan alma.' },
          { text: 'E-postadaki yeni numarayı arayarak', feedback: 'Sahte e-postadaki numara da sahte olabilir.' },
          { text: 'Dekont gönderen başka bir veliye sorarak', feedback: 'Başka birinin ödeme yapması alıcının doğru olduğunu kanıtlamaz.' }
        ] },
        { prompt: 'Ödeme talebini nasıl ele alırsın?', verifiedContext: 'Okulun bilinen kanalında bu kişisel hesap doğrulanmadı.', unverifiedContext: 'Ödeme talebi hâlâ bağımsız doğrulanmadı.', options: [
          { text: 'Ödemeyi bekletip okuldan teyit alırım', correct: true, feedback: 'Doğru. Özellikle alıcı hesap değiştiyse dur ve doğrula.' },
          { text: 'Süre bitmesin diye hemen gönderirim', feedback: 'Acele baskısı yanlış hesaba ödeme yaptırabilir.' },
          { text: 'Önce küçük bir tutar gönderip denerim', feedback: 'Küçük deneme ödemesi bile doğru alıcıyı kanıtlamaz.' }
        ] }
      ], takeaway: 'Okul veya kurum adına gelen ödeme talebini, önceden bildiğin iletişim kanalından doğrula.'
    },
    {
      id: 'kargo', title: 'Teslim edilemeyen paket', audience: 'Ebeveynler', tag: 'baglanti', channel: 'SMS',
      sender: 'Yıldız Teslimat',
      message: 'Paketiniz adres eksikliği nedeniyle bekliyor. 14 TL yeniden teslim ücreti için kargo.example.com adresine girin.',
      example: 'Kargo adı ve adres kurgudur; örnek bağlantı tıklanamaz.',
      stages: [
        { prompt: 'Hangi ayrıntı dikkat gerektirir?', context: 'Beklediğin bir paket olsa bile mesajın kaynağını kontrol et.', options: [
          { text: 'Mesajdan ödeme sayfasına yönlendirmesi', correct: true, feedback: 'Beklenmedik ödeme bağlantısı önemli bir işarettir.' },
          { text: 'Paketin beklediğini söylemesi', feedback: 'Gerçek bir teslimat sorunu olabilir; asıl kritik nokta mesajdaki ödeme yönlendirmesidir.' },
          { text: 'Teslimat adının tanıdık görünmesi', feedback: 'Görünen gönderen adı taklit edilebilir.' }
        ] },
        { prompt: 'Paket durumunu nereden öğrenirsin?', context: 'Mesajdaki adrese tıklamadan da kontrol edebilirsin.', options: [
          { text: 'Satıcının veya kargonun bilinen uygulamasından', correct: true, feedback: 'Doğru. Sipariş numaranı kendi açtığın uygulamada kontrol et.' },
          { text: 'SMS bağlantısındaki takip ekranından', feedback: 'Bağlantı sahte bir ödeme ekranı gösterebilir.' },
          { text: 'SMS gönderenine kart bilgilerimi sorarak', feedback: 'Kart bilgilerini mesaj üzerinden verme.' }
        ] },
        { prompt: 'Şimdi ne yaparsın?', verifiedContext: 'Bilinen uygulamada ek ödeme görünmüyor.', unverifiedContext: 'Ek ücret henüz bağımsız doğrulanmadı.', options: [
          { text: 'Kart bilgisi girmeden isteği doğrularım', correct: true, feedback: 'Güvenli seçim. Şüpheli ödeme ekranını kullanma.' },
          { text: 'Küçük ücret için kartıma devam ederim', feedback: 'Küçük tutar bahanesi kart bilgisi toplamak için kullanılabilir.' },
          { text: 'Bağlantıyı aileme iletip tıklatırım', feedback: 'Şüpheli bağlantıyı başkasına yönlendirmek yerine doğrulama adımını anlat.' }
        ] }
      ], takeaway: 'Kargo bağlantısı veya QR kodu ödeme istiyorsa siparişi bildiğin uygulamada kendin kontrol et.'
    },
    {
      id: 'tanidik-ses', title: 'Tanıdık sesle yardım isteği', audience: 'İleri yaş', tag: 'tanidik', channel: 'Telefon görüşmesi metni',
      sender: 'Bilinmeyen numara',
      message: 'Ben torununum, telefonum değişti. Sesimden tanıdın mı? Acilen para göndermen gerekiyor; lütfen aileye söyleme.',
      example: 'Ses kaydı çalınmaz. Bu konuşma yapay ses taklidini anlatan kurgusal örnektir.',
      stages: [
        { prompt: 'Hangi istek seni durdurmalı?', context: 'Tanıdık ses duymak kişinin kimliğini tek başına kanıtlamaz.', options: [
          { text: 'Gizli ve acil para göndermemi istemesi', correct: true, feedback: 'Acele ve gizlilik isteği güçlü bir uyarıdır.' },
          { text: 'Yeni telefon kullandığını söylemesi', feedback: 'Numara değişebilir; fakat para isteği bağımsız doğrulama gerektirir.' },
          { text: 'Sesinin tanıdık gelmesi', feedback: 'Ses taklit edilebilir. Sesi tek başına kimlik kanıtı sayma.' }
        ] },
        { prompt: 'Kişiyi nasıl doğrularsın?', context: 'Arayanın verdiği yeni numaradan farklı bir kanal seç.', options: [
          { text: 'Önceden kayıtlı numarasını arayarak', correct: true, feedback: 'Doğru. Önceden bildiğin numarayı veya başka bir aile bireyini ara.' },
          { text: 'Yeni numarada sesi tekrar dinleyerek', feedback: 'Ses tekrar duyulsa da taklit ihtimali ortadan kalkmaz.' },
          { text: 'Mesaj attığı banka hesabına bakarak', feedback: 'Banka hesabı arayanın kimliğini doğrulamaz.' }
        ] },
        { prompt: 'Para isteğine ne dersin?', verifiedContext: 'Eski numaradan ulaştığın yakınınız bu isteği doğrulamadı.', unverifiedContext: 'Arayanın kimliği hâlâ doğrulanmadı.', options: [
          { text: 'Para göndermem, ailemle birlikte kontrol ederim', correct: true, feedback: 'Doğru. Baskı altında tek başına karar vermen gerekmez.' },
          { text: 'Gizli tutup bir miktar para yollarım', feedback: 'Gizlilik baskısı gerçek yakınından gelmeyebilir.' },
          { text: 'Önce hesap adını öğrenip sonra yollarım', feedback: 'Hesap adı arayanın gerçekten yakınınız olduğunu kanıtlamaz.' }
        ] }
      ], takeaway: 'Tanıdık ses veya video bile sahte olabilir. Para isteğini önceden bildiğin numaradan doğrula.'
    },
    {
      id: 'banka', title: 'Banka görevlisi araması', audience: 'İleri yaş', tag: 'kod', channel: 'Telefon görüşmesi metni',
      sender: 'Banka görevlisi olduğunu söyleyen kişi',
      message: 'Hesabınızda şüpheli işlem var. İşlemi durdurmak için telefonunuza gelen doğrulama kodunu bana okuyun.',
      example: 'Kurum ve görüşme eğitim amacıyla kurgulanmıştır.',
      stages: [
        { prompt: 'En önemli uyarı nedir?', context: 'Korkutucu bir iddia hemen işlem yapmaya zorlayabilir.', options: [
          { text: 'Tek kullanımlık doğrulama kodunu istemesi', correct: true, feedback: 'Bu kodlar başka biriyle paylaşılmamalıdır.' },
          { text: 'Banka çalışanı olduğunu söylemesi', feedback: 'Bu iddia doğrulanmalı; en kritik tehlike kodun istenmesidir.' },
          { text: 'Hesapta işlem olduğunu söylemesi', feedback: 'İşlemi kontrol etmelisin, fakat kodu arayana okumamalısın.' }
        ] },
        { prompt: 'İşlemi nasıl kontrol edersin?', context: 'Aramayı sonlandırmak doğrulama için zaman kazandırır.', options: [
          { text: 'Bankanın bildiğim uygulaması veya numarasıyla', correct: true, feedback: 'Doğru. Uygulamayı kendin aç veya kartındaki resmî numarayı ara.' },
          { text: 'Arayanın aktardığı başka bir görevliyle', feedback: 'Aktarılan kişi de aynı aramanın parçası olabilir.' },
          { text: 'Arayanın mesajla yolladığı sayfadan', feedback: 'Mesajdaki sayfa sahte olabilir.' }
        ] },
        { prompt: 'Arayana nasıl yanıt verirsin?', verifiedContext: 'Bilinen kanaldan kontrol ettiğinde bu arama doğrulanmadı.', unverifiedContext: 'Aramanın kaynağı bağımsız doğrulanmadı.', options: [
          { text: 'Kodu vermem, aramayı kapatıp kontrol ederim', correct: true, feedback: 'Doğru. Gerekirse bankanın resmî desteğine kendin ulaş.' },
          { text: 'İşlem dursun diye kodu okurum', feedback: 'Kod paylaşmak hesabındaki işlemi onaylayabilir.' },
          { text: 'Kodu mesajla göndermeyi teklif ederim', feedback: 'Kodu hangi yolla olursa olsun paylaşma.' }
        ] }
      ], takeaway: 'Şifre ve tek kullanımlık kodları paylaşma; bankana kendi açtığın kanaldan ulaş.'
    },
    {
      id: 'gercek-bildirim', title: 'Doğrulanmış teslimat', audience: 'Herkes', tag: 'baglanti', channel: 'Uygulama bildirimi',
      sender: 'Ada Sipariş Uygulaması',
      message: 'Siparişin teslimat aşamasına geçti. Durumu uygulamanın Siparişler bölümünde görebilirsin. Ek ödeme istenmiyor.',
      example: 'Bu örnekte kullanıcı uygulamayı kendisi açtı; olay kurgudur.',
      stages: [
        { prompt: 'Burada en yararlı ipucu hangisi?', context: 'Her bildirim dolandırıcılık değildir; doğrulama yolu önemlidir.', options: [
          { text: 'Uygulamayı kendim açıp siparişi görmem', correct: true, feedback: 'Doğru. Bilinen uygulamada aynı bilgiyi görmek iyi bir doğrulama adımıdır.' },
          { text: 'Bildirimin markaya benzer görünmesi', feedback: 'Görünüş tek başına yeterli değildir.' },
          { text: 'Mesajda yazım hatası bulunmaması', feedback: 'Yazım hatasının olmaması güvenilirlik kanıtı değildir.' }
        ] },
        { prompt: 'Teslimat bilgisini nasıl doğrularsın?', context: 'Bağımsız doğrulama burada da işe yarar.', options: [
          { text: 'Uygulamayı kendim açıp Siparişler bölümünde', correct: true, feedback: 'Doğru. Sipariş ve teslimat durumunu uygulamada kontrol ettin.' },
          { text: 'Bildirimden gelen her bağlantıyı açarak', feedback: 'Bağlantı olsa bile kendin açtığın uygulamayı tercih et.' },
          { text: 'Yalnızca bildirimin görseline bakarak', feedback: 'Görsel kurum kimliğini doğrulamaz.' }
        ] },
        { prompt: 'Sonraki adımın ne olur?', verifiedContext: 'Siparişin gerçekten uygulamada görünüyor ve ek ödeme yok.', unverifiedContext: 'Sipariş henüz bilinen uygulamada doğrulanmadı.', options: [
          { text: 'Gerekirse işlemi uygulamadan sürdürürüm', correct: true, feedback: 'Doğru. Kaynağı doğruladıktan sonra olağan işlemini uygulamada sürdür.' },
          { text: 'Bilmediğim ödeme sayfasına geçerim', feedback: 'Doğrulanmış bir sipariş, başka bir ödeme sayfasını güvenilir kılmaz.' },
          { text: 'Kart bilgimi bildirim yanıtında gönderirim', feedback: 'Kart bilgisini mesaj yanıtında paylaşma.' }
        ] }
      ], takeaway: 'Güvenli bir bildirimde de alışkanlık aynı: uygulamayı kendin aç, işlemi orada doğrula.'
    }
  ];
})();
