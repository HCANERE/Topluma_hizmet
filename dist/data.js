/* Senaryolar burada tutulur. Her tur, ilgili kategoriden rastgele beş soru seçer. */
window.TOD_DATA = {
  youth: {
    title: 'Gençler',
    description: 'Burs, oyun, sosyal medya ve iş fırsatlarında güvenli kararlar.',
    questions: [
      {
        id: 'y-qr', topic: 'Kafedeki QR kod', kind: 'social', from: 'Masadaki menü kartının açıklaması',
        message: 'Menüyü görmek için masadaki QR kodu okuttun. Açılan menu.example.com sayfası, menüyü açmadan önce kart numaranı ve kartının arkasındaki güvenlik kodunu istiyor. QR etiketi başka bir etiketin üzerine yapıştırılmış görünüyor.',
        choices: [
          'Masanın üzerindeki kod olduğu için kart bilgilerimi girerim.',
          'Bilgi girmeden sayfayı kapatır, menüyü görevliye sorarım.',
          'Sayfada kilit işareti varsa kart bilgilerimi paylaşırım.'
        ], correct: 1,
        explanation: 'QR kodun masada olması veya sayfanın kilit işareti göstermesi güvenilirliği kanıtlamaz. Menü için kart bilgisi istenmesi ve üst üste yapıştırılan etiket, durup işletmeden doğrulamak için nedenlerdir.',
        clues: ['Menü görüntülemek için kart bilgisi istenmesi', 'Başka bir etiketin üzerine yapıştırılmış QR etiketi'],
        tip: 'QR kodla açılan sayfanın ne istediğine bak; beklenmedik ödeme veya giriş isteğini işletmeden doğrula.',
        review: 'QR kodla açılan sayfalarda beklenmedik bilgi taleplerini kontrol etme'
      },
      {
        id: 'y-burs', topic: 'Burs başvurusu hakkında bir mesaj', kind: 'sms', from: 'Kampüs Burs Birimi',
        message: 'Tebrikler! Burs aday listesine seçildin. Dosyanı bugün tamamlamak için 290 TL işlem ücreti yatırman gerekiyor.',
        choices: [
          'Süre dolmadan işlem ücretini gönderip dekontu saklarım.',
          'Önce mesajdaki numarayı arayıp ücretin nedenini sorarım.',
          'Burs duyurusunu kurumun kendi resmî kanalından kontrol ederim.'
        ], correct: 2,
        explanation: 'Burs vaadi karşılığında istenen ön ödeme şüphelidir. Mesajdaki numara yerine kurumun adresini veya iletişim bilgisini kendin bulup doğrula.',
        clues: ['Beklenmedik burs müjdesi', 'Bugün ödeme yapma baskısı'],
        tip: 'Başvurmadığın bir burs için ödeme yapmadan önce resmî duyuruyu ara.',
        review: 'Burs ve işlem ücreti tekliflerini bağımsız doğrulama'
      },
      {
        id: 'y-oyun', topic: 'Oyun hesabına bir hediye', kind: 'social', from: 'Arena Oyun Hediyeleri',
        message: 'Hesabına ücretsiz 5.000 oyun parası yükleyebiliriz. Kullanıcı adını ve parolanı bize özel mesajla gönder; ödül hemen tanımlansın.',
        choices: [
          'Parolamı paylaşmam; duyuruyu oyunun kendi uygulamasında ararım.',
          'Önce küçük bir ödül isteyip hesap bilgilerimi sonra veririm.',
          'Hesabımda az eşya varsa parolamı gönderip şansımı denerim.'
        ], correct: 0,
        explanation: 'Ücretsiz ödül vaadi, hesap bilgilerini almak için kullanılabilir. Parola hiçbir özel mesajda paylaşılmamalıdır.',
        clues: ['Gerçek dışı ücretsiz ödül', 'Parolanın özel mesajla istenmesi'],
        tip: 'Oyun kampanyalarını yalnızca uygulamanın kendi duyurularından kontrol et.',
        review: 'Oyun hesabı parolasını ve giriş bilgilerini koruma'
      },
      {
        id: 'y-kod', topic: 'Sosyal medya giriş kodu', kind: 'social', from: 'FotoPaylaş Destek',
        message: 'Hesabında sorun tespit ettik. Telefonuna gelen altı haneli doğrulama kodunu hemen yanıt olarak gönderirsen hesabını koruyabiliriz.',
        choices: [
          'Kodu gönderir, sonra hesabımın şifresini değiştiririm.',
          'Kodu paylaşmam; hesabımı uygulamanın içinden kontrol ederim.',
          'Kodun yalnızca son üç rakamını gönderip durumu sorarım.'
        ], correct: 1,
        explanation: 'Tek kullanımlık kod, hesabına girişte kullanılabilir. Gerçek destek görevlisi gibi görünen bir mesaj bile kodu isteme hakkı vermez.',
        clues: ['Giriş kodunun istenmesi', 'Hemen yanıt verme baskısı'],
        tip: 'Doğrulama kodunu arkadaşınla veya destek hesabıyla dahi paylaşma.',
        review: 'Tek kullanımlık doğrulama kodunu paylaşmama'
      },
      {
        id: 'y-is', topic: 'Evden çalışma teklifi', kind: 'email', from: 'İlk Adım İş Ekibi', subject: 'Evden çalışma başvurunuz',
        message: 'Haftada birkaç saat çalışarak yüksek gelir elde edebilirsiniz. Başvurunuzu açmak için 450 TL kayıt bedelini bugün yatırın.',
        choices: [
          'İlanı kaçırmamak için kayıt bedelini hemen yatırırım.',
          'E-postadaki hesaba küçük bir deneme ödemesi gönderirim.',
          'Şirketi bağımsız araştırır, para ödemeden başvuruyu doğrularım.'
        ], correct: 2,
        explanation: 'İş başvurusu için ön ödeme istenmesi ve hızlı karar baskısı önemli uyarılardır. Şirketi ve ilanı mesaj dışındaki kaynaklardan incele.',
        clues: ['İşe başlamadan ücret istenmesi', 'Kolay ve yüksek gelir vaadi'],
        tip: 'İş ilanı için para istenirse işlemi durdur ve şirketi bağımsız araştır.',
        review: 'İş ilanlarında ön ödeme ve kolay kazanç vaatleri'
      },
      {
        id: 'y-arkadas', topic: 'Arkadaş hesabından borç isteği', kind: 'social', from: 'Mert',
        message: 'Telefonum bozuldu, şu an çok sıkıştım. Bana hemen para yollar mısın? Akşama geri göndereceğim, kimseye söyleme.',
        choices: [
          'Mesajı görünce önce hesap fotoğrafına bakıp para gönderirim.',
          'Mert’i bildiğim numaradan arayıp isteği doğrudan doğrularım.',
          'Kısa bir sesli mesaj isteyip para gönderme kararını veririm.'
        ], correct: 1,
        explanation: 'Bir arkadaş hesabı ele geçirilmiş olabilir; profil ve ses de tek başına yeterli kanıt değildir. Bildiğin numaradan bağımsız ulaş.',
        clues: ['Acil para isteği', 'Kimseye söylememe talebi'],
        tip: 'Yakınından para isteği gelirse kayıtlı numarasından geri ara.',
        review: 'Tanıdık hesaptan gelen para isteğini doğrulama'
      }
    ]
  },
  parents: {
    title: 'Ebeveynler',
    description: 'Okul, alışveriş, aile ve kargo mesajlarında dikkat edilmesi gerekenler.',
    questions: [
      {
        id: 'p-teslimat', topic: 'Beklediğiniz paket geliyor', kind: 'sms', from: 'Sipariş verdiğiniz mağazanın teslimat bildirimi',
        message: 'Siparişiniz bugün dağıtıma çıkmıştır. Teslimat durumunu alışveriş uygulamanızdan takip edebilirsiniz. Mesajda bağlantı, ödeme veya bilgi talebi yok. Uygulamayı kendiniz açtığınızda sipariş numarası ve dağıtım durumu da eşleşiyor.',
        choices: [
          'Her teslimat mesajını dolandırıcılık sayar, siparişi iptal ederim.',
          'Gönderen adı aynıysa sonraki her mesajdaki isteği kabul ederim.',
          'Uygulamadaki eşleşen siparişi takip eder, teslimatı beklerim.'
        ], correct: 2,
        explanation: 'Bu örnekte bildirimi bağımsız açtığınız uygulamadaki gerçek siparişinizle doğruladınız. Teslimatı takip edebilirsiniz. Bu mesajın doğrulanmış olması, aynı adla gelen sonraki istekleri otomatik olarak güvenilir yapmaz.',
        clues: ['Bildirimin bağımsız açılan uygulamadaki siparişle eşleşmesi', 'Mesajda bağlantı, ödeme veya bilgi talebi olmaması'],
        tip: 'Her mesajı reddetmek yerine bilgiyi bağımsız kanaldan doğrulayın; yeni talepleri ayrıca değerlendirin.',
        review: 'Teslimat bildirimini bağımsız uygulamada doğrulayıp uygun davranışı seçme'
      },
      {
        id: 'p-okul', topic: 'Okul adına ödeme isteği', kind: 'sms', from: 'Okul Duyuru Hattı',
        message: 'Çocuğunuzun gezi katılımı için bugün 680 TL ödemeniz gerekiyor. Açıklamaya öğrencinin adını yazıp bu kişisel hesaba gönderin.',
        choices: [
          'Çocuğumun adı geçiyorsa ödemeyi hemen gönderirim.',
          'Okulu bildiğim resmî numaradan arayıp ödemeyi doğrularım.',
          'Mesajdaki numaraya dönüp hesap sahibinin adını sorarım.'
        ], correct: 1,
        explanation: 'Okul adı kullanılması ve çocuğunuzun bilinmesi mesajın gerçek olduğunu kanıtlamaz. Ödeme bilgisini okulun bağımsız resmî kanalından kontrol edin.',
        clues: ['Kişisel hesaba para istenmesi', 'Aynı gün ödeme baskısı'],
        tip: 'Okul ödemelerini mesajdaki numaradan değil okulun bilinen iletişim kanalından doğrulayın.',
        review: 'Okul adına gelen ödeme taleplerini doğrulama'
      },
      {
        id: 'p-alisveris', topic: 'Alışverişte büyük indirim', kind: 'social', from: 'AileSepeti Fırsatları',
        message: 'Bugüne özel yüzde 90 indirim! Ürün yalnızca firsat.example.com adresinde. Son on dakika; kart bilgilerinizi girip siparişi tamamlayın.',
        choices: [
          'İndirim bitmeden kart bilgilerimle sipariş veririm.',
          'Adres HTTPS ile açılıyorsa alışverişi tamamlarım.',
          'Satıcıyı ve ürünü bağımsız araştırıp acele etmem.'
        ], correct: 2,
        explanation: 'Aşırı indirim ve süre baskısı şüphe nedenidir. HTTPS veya iyi görünen tasarım tek başına satıcının güvenilirliğini kanıtlamaz.',
        clues: ['Gerçekçi olmayan indirim', 'Son dakika baskısı'],
        tip: 'Siparişten önce satıcıyı mesaj ve reklam dışındaki kaynaklarda araştırın.',
        review: 'Sahte alışveriş ilanlarında satıcıyı doğrulama'
      },
      {
        id: 'p-paylasim', topic: 'Çocuğun bilgilerinin paylaşılması', kind: 'social', from: 'Paylaşım taslağınız',
        message: 'Canım kızım Ece, Işık Okulu 4-A sınıfında! Okul çıkışı her gün 15.30’da alıyorum. Kimlik kartı fotoğrafını da anı olsun diye ekledim.',
        choices: [
          'Okul, konum ve kimlik ayrıntılarını çıkarıp paylaşımı sınırlarım.',
          'Yalnızca yüzünü kapatıp diğer bilgileri paylaşırım.',
          'Hesabım açıksa da yakınlarım görür diye paylaşırım.'
        ], correct: 0,
        explanation: 'Okul, düzenli saat ve kimlik görseli birlikte çocuğun mahremiyetini zedeler. Paylaşımın kimler tarafından görüleceğini ve içeriğini azaltın.',
        clues: ['Okul ve sınıfın açık yazılması', 'Düzenli saat ve kimlik görseli'],
        tip: 'Çocuğa ait okul ve kimlik bilgilerini herkese açık paylaşmayın.',
        review: 'Çocuğun kişisel bilgilerini çevrim içi koruma'
      },
      {
        id: 'p-aile', topic: 'Yeni numaradan aile isteği', kind: 'sms', from: 'Kızınız olduğunu söyleyen kişi',
        message: 'Anne, numaram değişti. Telefonum da bozuldu. Şimdi ödeme yapmam gerek; bu hesaba para gönderir misin? Sonra anlatırım.',
        choices: [
          'Yazışma biçimi tanıdık geliyorsa para gönderirim.',
          'Yeni numaradan bir fotoğraf isteyip sonra karar veririm.',
          'Aile bireyini eski kayıtlı numarasından veya yakınımdan doğrularım.'
        ], correct: 2,
        explanation: 'Yeni numara ve acil para talebi, aile bireyi taklidinde kullanılabilir. Mesajın içinden gelen kanıt yerine önceden bildiğiniz kanalı kullanın.',
        clues: ['Yeni numara iddiası', 'Hemen para gönderme isteği'],
        tip: 'Yakınınızın numarası değişti denirse eski kayıtlı numarayı veya başka aile bireyini arayın.',
        review: 'Yeni numaradan gelen aile içi para isteğini doğrulama'
      },
      {
        id: 'p-kargo', topic: 'Kargonuz hakkında bir mesaj', kind: 'sms', from: 'Paket Bilgilendirme',
        message: 'Paketiniz dağıtıma çıkamadı. Teslim için 24 TL fark ödeyin ve kart bilgilerinizi paket.example.com sayfasına girin.',
        choices: [
          'Ücret küçük olduğu için kart bilgilerimi girerim.',
          'Kargo durumunu şirketin kendi uygulamasından kontrol ederim.',
          'Mesajdaki adrese girip önce paket numarasını incelerim.'
        ], correct: 1,
        explanation: 'Küçük tutarlı ödeme ve kart bilgisi isteği de risklidir. Kargo durumunu mesajdaki bağlantıdan bağımsız kontrol edin.',
        clues: ['Kart bilgisi istenmesi', 'Mesaj içindeki ödeme adresine yönlendirme'],
        tip: 'Kargo için ödeme istenirse şirketin uygulamasını kendiniz açın.',
        review: 'Kargo mesajındaki ödeme bağlantılarını doğrulama'
      }
    ]
  },
  seniors: {
    title: 'İleri Yaştaki Kullanıcılar',
    description: 'Telefon, banka, emeklilik ve sağlık mesajlarında sakin doğrulama.',
    questions: [
      {
        id: 's-polis', topic: 'Bir soruşturma hakkında arama', kind: 'call', from: 'Kendisini polis olarak tanıtan kişi',
        message: 'Hesabınız bir soruşturmada geçiyor. Paranızı korumak için hemen vereceğim güvenli hesaba aktarın. Bu görüşmeyi kimseye söylemeyin.',
        choices: [
          'Görüşmeyi bitirip kuruma kendi bulduğum resmî kanaldan ulaşırım.',
          'Arayanın adını öğrenip söylediği hesaba parayı gönderirim.',
          'Önce paranın yarısını aktarır, sonra kurumu arayıp sorarım.'
        ], correct: 0,
        explanation: 'Resmî görevli olduğunu söylemek ve gizli para transferi istemek ciddi bir dolandırıcılık işaretidir. Görüşmeyi sonlandırıp kuruma bağımsız ulaşın.',
        clues: ['Güvenli hesaba para aktarımı isteği', 'Kimseye söylemeyin baskısı'],
        tip: 'Telefondaki kişinin verdiği numarayı değil resmî kanaldan bulduğunuz numarayı kullanın.',
        review: 'Polis veya savcı taklidiyle para transferi isteği'
      },
      {
        id: 's-banka', topic: 'Banka şifresi ve kodu', kind: 'call', from: 'Kendisini banka çalışanı olarak tanıtan kişi',
        message: 'Hesabınızda sorun var. İşlemi durdurmak için internet şifrenizi ve telefonunuza gelen doğrulama kodunu şimdi söyleyin.',
        choices: [
          'Kodun ilk yarısını söyler, hesabımın durumunu sorarım.',
          'Şifreyi ve kodu söylemem; bankayı kartımdaki numaradan ararım.',
          'Arayan kişi hesap bilgimi biliyorsa kodu söyleyebilirim.'
        ], correct: 1,
        explanation: 'Şifre ve tek kullanımlık kodu isteyen aramaya güvenmeyin. Arayan kişi bazı bilgilerinizi bilse bile bankaya kart üzerindeki numaradan kendiniz ulaşın.',
        clues: ['Şifre ve doğrulama kodu isteği', 'Hemen karar verme baskısı'],
        tip: 'Banka şifrenizi ve telefonunuza gelen kodu kimseyle paylaşmayın.',
        review: 'Banka şifresi ve doğrulama kodunu koruma'
      },
      {
        id: 's-emekli', topic: 'Emekli promosyonu bağlantısı', kind: 'sms', from: 'Emek Destek Duyuru',
        message: 'Yeni emekli promosyonunuz hazır. Hakkınızı kaybetmemek için bugün promosyon.example.com adresinden hesabınıza giriş yapın.',
        choices: [
          'Mesajdaki bağlantıyı açıp giriş bilgilerimi yazarım.',
          'Duyuruyu gönderen numarayı arayıp şifremi sorarım.',
          'Bankamın uygulamasını kendim açar veya şubeden doğrularım.'
        ], correct: 2,
        explanation: 'Promosyon hakkını kaybetme baskısıyla giriş bağlantısına yönlendirmek şüphelidir. Bankanın kendi uygulaması veya şubesi üzerinden kontrol edin.',
        clues: ['Hak kaybı korkusu', 'Mesaj içindeki giriş adresi'],
        tip: 'Banka bağlantılarını mesajdan açmak yerine uygulamayı kendiniz başlatın.',
        review: 'Promosyon mesajındaki bağlantıyı doğrulama'
      },
      {
        id: 's-saglik', topic: 'Sağlık randevunuz hakkında mesaj', kind: 'sms', from: 'Randevu Bilgilendirme',
        message: 'Sağlık randevunuz iptal edilmemesi için 39 TL onay ücreti gerekiyor. Ödemeyi bugün randevu.example.com adresinden yapın.',
        choices: [
          'Randevumu resmî sistemden veya sağlık kuruluşundan kontrol ederim.',
          'İptal olmasın diye mesajdaki sayfadan hemen ödeme yaparım.',
          'Ödeme öncesi mesajdaki numarayı arayıp bilgi isterim.'
        ], correct: 0,
        explanation: 'Randevu iptali korkusuyla ödeme istemek şüphelidir. Mesajdaki adres veya numara yerine resmî randevu kanalı üzerinden doğrulayın.',
        clues: ['İptal edilme baskısı', 'Mesajdaki adresten ödeme isteği'],
        tip: 'Sağlık randevusunu resmî sistemden veya doğrudan sağlık kuruluşundan kontrol edin.',
        review: 'Sağlık randevusu ve ödeme mesajlarını doğrulama'
      },
      {
        id: 's-odul', topic: 'Ödül için işlem ücreti', kind: 'call', from: 'Kendisini çekiliş görevlisi olarak tanıtan kişi',
        message: 'Büyük ödül kazandınız! Hediyeyi göndermemiz için önce küçük bir işlem ücreti yatırın. Bugün ödemezseniz hakkınız yanacak.',
        choices: [
          'Ödül büyükse küçük işlem ücretini ödeyebilirim.',
          'Ödeme yapmam; katıldığım bir çekilişse kaynağından doğrularım.',
          'Arayan kişiden belge isteyip sonra ücreti yatırırım.'
        ], correct: 1,
        explanation: 'Beklenmedik ödül karşılığında ücret istenmesi ve zaman baskısı dolandırıcılık işaretidir. Katıldığınız bir çekiliş varsa duyuruyu kendi kaynağından kontrol edin.',
        clues: ['Beklenmedik ödül vaadi', 'Ödül için peşin ücret isteği'],
        tip: 'Ödülü almak için para istenirse ödeme yapmadan görüşmeyi durdurun.',
        review: 'Ödül vaadiyle istenen işlem ücretini sorgulama'
      },
      {
        id: 's-yapay-video', topic: 'Aile grubundaki acil video', kind: 'social', from: 'Aile grubunda paylaşılan video',
        message: 'Videodaki kişi yeğeninize hem görüntü hem ses olarak çok benziyor. “Telefonum bozuldu, 20 dakika içinde bu yeni hesaba para göndermen gerekiyor; kimseyi arama” diyor.',
        choices: [
          'Yüzü ve sesi tanıdık geldiği için parayı yeni hesaba gönderirim.',
          'Videoyu paylaşan kişiye sorup hesap bilgisini doğrulanmış sayarım.',
          'Yeğenimi bildiğim numaradan veya başka bir yakınımdan doğrularım.'
        ], correct: 2,
        explanation: 'Yapay zekâ ile üretilen görüntü ve sesler tanıdığınız birini taklit edebilir. Video tek başına kanıt değildir; para isteğini önceden bildiğiniz, bağımsız bir yoldan doğrulayın.',
        clues: ['Çok kısa sürede para gönderme baskısı', 'Kimseyi aramama isteği ve yeni hesap bilgisi'],
        tip: 'Yakınınızdan acil para isteği gelirse kayıtlı numarasından geri arayın.',
        review: 'Yapay zekâ ile taklit edilen görüntü ve sesi bağımsız doğrulama'
      }
    ]
  }
};
