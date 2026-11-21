window.TOD_LAB_SCENARIOS = [
  {
    title: 'Deniz’den mesaj',
    sender: 'Deniz',
    avatar: 'D',
    channel: 'Kurgusal mesaj kutusu',
    message: 'Selam, bugün bana para gönderebilir misin? Şimdi lazım, akşam konuşuruz.',
    checks: [
      { label: 'Eski mesajları aç', note: 'Dünkü sohbetiniz tanıdık görünüyor. Eski yazışmalar, bugünkü mesajı kimin yazdığını göstermez.' },
      { label: 'Profile bak', note: 'Fotoğraf ve kullanıcı adı aynı. Bu bilgiler, şu anda hesabı kimin kullandığını göstermez.' },
      { label: 'Rehberden ara', verifies: true }
    ],
    acceptLabel: 'İsteği kabul et',
    holdLabel: 'Ödemeyi beklet',
    tactics: ['tanidik', 'acele', 'para'],
    variants: [
      {
        evidence: 'Deniz kayıtlı numaradan açtı ve isteği kendisinin gönderdiğini söyledi. İsteğin nedenini de konuşarak doğruladın.',
        backstage: 'Bu kurguda mesajı Deniz yazdı. Acele etmesi tek başına dolandırıcılık kanıtı değildi. Kayıtlı numarasından arayarak mesajın kime ait olduğunu doğrulayabilirsin.',
        accept: {
          title: 'İstek Deniz’e aitti',
          text: 'Bu kez istek gerçekten Deniz’den geldi. Ödeme kararı vermeden önce kayıtlı numaradan konuşarak isteğin kime ait olduğunu kontrol edebilirsin.',
          afterCheck: 'İsteğin Deniz’e ait olduğunu kayıtlı numarasından konuşarak doğruladıktan sonra karar verdin.'
        },
        hold: {
          title: 'Karar vermek için zaman kazandın',
          text: 'İstek gerçekten Deniz’e aitti. Beklemek, para göndermeden önce durumu kontrol etmen için zaman kazandırdı.'
        }
      },
      {
        evidence: 'Deniz kayıtlı numaradan açtı ve para istemediğini söyledi. Mesaj hesabına erişemediğini de belirtti.',
        backstage: 'Bu kurguda hesaba başkası erişti. Tanıdık isim ve eski sohbetler yüzünden gelen mesaj Deniz’denmiş gibi göründü.',
        accept: {
          title: 'Para yanlış kişiye gidebilirdi',
          text: 'Deniz’in hesabını o sırada başka biri kullanıyordu. Mesajın içeriğine güvenerek ilerlemek yanlış kişiye ödeme yapmana yol açabilirdi.',
          afterCheck: 'Deniz telefonda isteğin kendisine ait olmadığını söyledi. Bu durumda para göndermeden durmak daha güvenliydi.'
        },
        hold: {
          title: 'Ödemeyi durdurdun',
          text: 'Hesap başkasının elindeydi. Ödemeyi beklettin ve bağımsız bir kanaldan kontrol etme fırsatını korudun.',
          afterCheck: 'Deniz isteği telefonda reddetti. Ödemeyi durdurarak yanlış kişiye para gitmesini önledin.'
        }
      }
    ]
  },
  {
    title: 'Kargo bildirimi',
    sender: 'Ada Teslimat',
    avatar: 'K',
    channel: 'Kurgusal SMS',
    message: 'Paketinizin teslim saatinde değişiklik var. Ayrıntıları öğrenmek için siparişinizi kontrol edin.',
    checks: [
      { label: 'Sipariş geçmişine bak', note: 'Gerçekten yolda olan bir siparişin var. Bir paket bekliyor olman, gelen her mesajı doğrulamaz.' },
      { label: 'Mesajı incele', note: 'Mesaj bir teslimat değişikliğinden söz ediyor. Güncel saat ve sipariş bilgisi için bağımsız bir kaynağa bakabilirsin.' },
      { label: 'Kargo uygulamasını aç', verifies: true }
    ],
    acceptLabel: 'Bildirime güven',
    holdLabel: 'Kararı ertele',
    tactics: ['tanidik', 'baglanti'],
    variants: [
      {
        evidence: 'Kargo uygulamasını kendin açtın. Beklediğin siparişte teslimatın bugünden yarına alındığını gördün.',
        backstage: 'Bu kurguda taşıyıcı teslimatı gerçekten erteledi. Doğru teslim saatini uygulamada kendi siparişinden gördün.',
        accept: {
          title: 'Teslimat gerçekten değişmişti',
          text: 'Bildirimin anlattığı değişiklik gerçekti. Güncel saati doğrudan kargo uygulamasından takip edebilirsin.',
          afterCheck: 'Beklediğin siparişin yeni teslim saatini kargo uygulamasından doğruladın.'
        },
        hold: {
          title: 'Paketini kontrol etmek için bekledin',
          text: 'Teslimat gerçekten ertelenmişti. Uygulamadaki güncel bilgiye bakıp planını ona göre yapabilirsin.'
        }
      },
      {
        evidence: 'Kargo uygulamasını kendin açtın. Beklediğin sipariş bugün dağıtımda ve herhangi bir saat değişikliği yok.',
        backstage: 'Bu kurguda mesaj taşıyıcıdan gelmedi. Gerçekten paket bekliyor olman bildirimi inandırıcı gösterdi.',
        accept: {
          title: 'Bildirime erken güvendin',
          text: 'Teslimat saatinin değiştiği iddiası, siparişindeki güncel bilgiyle uyuşmuyordu. Bir sonraki adımı uygulamadaki bilgiye göre seçebilirsin.',
          afterCheck: 'Uygulamada teslim saati değişmemişti. Bu uyuşmazlık, mesaja göre işlem yapmadan durmak için yeterliydi.'
        },
        hold: {
          title: 'Siparişini doğrulamak için durdun',
          text: 'Mesajdaki iddiaya göre işlem yapmadın. Kargo durumunu uygulamadaki siparişinden takip edebilirsin.',
          afterCheck: 'Mesajın kargo uygulamasındaki bilgilerle uyuşmadığını gördün ve kararını buna göre verdin.'
        }
      }
    ]
  },
  {
    title: 'Hesaba giriş uyarısı',
    sender: 'Ada Hesap',
    avatar: 'H',
    channel: 'Kurgusal güvenlik bildirimi',
    message: 'Hesabınızda yeni bir oturum bildirildi. Ayrıntıları güvenlik bölümünden kontrol edin.',
    checks: [
      { label: 'Son girişini düşün', note: 'Bugün dizüstü bilgisayarından hesabına giriş yaptın. Cihaz ve saat bilgisi, uyarının hangi oturuma ait olduğunu anlamana yardımcı olabilir.' },
      { label: 'Gönderen bilgisini incele', note: 'Görünen ad kullandığın hizmetin adıyla aynı. Böyle bir uyarının kaynağını uygulamadaki güvenlik bölümünden kontrol edebilirsin.' },
      { label: 'Uygulamada oturumları aç', verifies: true }
    ],
    acceptLabel: 'Uyarıya güven',
    holdLabel: 'Mesajı beklet',
    tactics: ['tanidik', 'baglanti', 'kod'],
    variants: [
      {
        evidence: 'Bildiğin uygulamayı kendin açtın. Güvenlik ekranındaki cihaz ve saat, bugün yaptığın girişle eşleşiyor.',
        backstage: 'Uyarıyı bu kurguda uygulama üretti. Oturumun sana ait olduğunu cihaz ve saati inceleyerek anladın.',
        accept: {
          title: 'Bildirim kendi girişine aitti',
          text: 'Bu turdaki bildirim gerçekti. Güvenlik ekranındaki cihazı ve saati kontrol ederek uyarının hangi oturumla ilgili olduğunu anlayabilirsin.',
          afterCheck: 'Cihazı ve giriş saatini kendi uygulamanda doğruladın. Bu oturum sana aitti.'
        },
        hold: {
          title: 'Uyarıyı incelemek için zaman ayırdın',
          text: 'Kendi uygulamandaki güvenlik ekranı bu bildirimi doğruluyor. Cihaz ve saati inceleyerek karar verebilirsin.'
        }
      },
      {
        evidence: 'Bildiğin uygulamayı kendin açtın. Güvenlik ekranında mesajla eşleşen bir uyarı görünmüyor. Dizüstü bilgisayarındaki önceki oturum kayıtlı.',
        backstage: 'Bu kurguda mesaj hizmetten gelmedi. Güvenlik uyarısı gibi görünmesi, kaynağını kontrol etmeni zorlaştırabilecek bir ayrıntıydı.',
        accept: {
          title: 'Uyarının kaynağı doğrulanmadı',
          text: 'Bu turda mesaj sahteydi. Hesabınla ilgili işlemleri açtığın resmî uygulamanın güvenlik bölümünden yönetebilirsin.',
          afterCheck: 'Uygulamada mesajla eşleşen bir uyarı bulamadın. Bu durumda mesajdaki iddiaya göre işlem yapmadan beklemek daha güvenliydi.'
        },
        hold: {
          title: 'Güvenli kanaldan kontrol etmeyi seçtin',
          text: 'Bu kurguda mesaj sahteydi. Hesap durumunu öğrenmek için uygulamadaki güvenlik ekranını kullanabilirsin.',
          afterCheck: 'Uygulamada eşleşen uyarı olmadığını inceledin ve şüpheli mesaj üzerinden işlem yapmadın.'
        }
      }
    ]
  }
];
