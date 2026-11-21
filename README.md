# Tıklamadan Önce Düşün

Türkçe, mobil uyumlu ve tamamen statik bir dijital dolandırıcılık farkındalık oyunu. Üyelik, veritabanı, kişisel veri toplama ve sunucu kodu yoktur. Yalnızca kategori bazında en iyi puan ve metin boyutu tercihi bu tarayıcıda saklanır; herhangi bir sunucuya gönderilmez.

Bu oyun, dersin **Güvenli Dijital Toplum: Toplum Geneli Siber Güvenlik Farkındalık Projesi** için hazırlanan etkileşimli eğitim aracıdır. Dersin diğer çıktıları ve ölçüm hedefleri için [ders belgelerine uyum planına](docs/ders-uyum-plani.md) bakın. Oyundaki puan, dersin ön test/son test etki ölçümü değildir.

## Çalıştırma

Node.js 18 veya üstüyle proje dizininde çalıştırın.

```sh
npm start
```

Tarayıcıda http://127.0.0.1:8766 adresini açın. Projenin harici paket bağımlılığı yoktur. Npm kullanmadan aynı yerel sunucuyu `node scripts/serve.mjs` ile başlatabilirsiniz. Statik barındırma için yayın dizini `dist/` olarak kalır.

Etkileşimli Pratik menüsünde **Tuzak Laboratuvarı**, **Taktik Rehberi** ve **Şimdi Ne Yapacağım?** ekranları bulunur. Her ekran doğrudan bir bağlantıyla açılabilir (`#laboratuvar`, `#taktik-rehberi`, `#zarar-kontrolu`).

Tuzak Laboratuvarı’nda bir arkadaşın para isteği, bir kargo bildirimi ve bir hesap oturumu uyarısı var. Her sahnenin iki sürümü aynı mesajla başlar. Farkı bağımsız bir kanaldan kontrol ettiğinde görebilirsin.

Kod değişikliklerini `npm test` ile doğrulayın.

## Dosyalar

- `dist/index.html`: Ana sayfa, oyun ve sonuç ekranları.
- `dist/style.css`: Görünüm ve mobil/erişilebilir düzen.
- `dist/data.js`: Üç kategorideki 17 kurgusal senaryo ve açıklamaları. Soruları düzenlemek için bu dosyayı kullanın.
- `dist/app.js`: Ekranlar arası gezinme, kategori seçimi, cevap kontrolü ve puanlama.
- `dist/lab-scenarios.js`: Laboratuvarın sahneleri, inceleme adımları ve her sürümün sonuçları.
- `dist/practice.js` ve `dist/practice.css`: Laboratuvar, taktik rehberi ve kurtarma alıştırmalarının davranışı ve stili.

Senaryolardaki kurum ve kişiler kurgusaldır. Örnek alan adları tıklanabilir değildir.


## Arayüz yenilemesi

Mor, mercan ve mint renklerinden oluşan arayüz; kurgusal mesaj görselli açılış alanı, kategori kartları, oyun ekranı ve sonuç ekranında ortak bir görsel dil kullanır. Yeni font veya görsel için dış servise istek atmaz.

- Büyük metin düğmesi, metni büyütür ve tercihi bu tarayıcıda hatırlar. İleri yaş kategorisinin ek okunabilirlik ayarı da korunur.
- Tamamlanan kategoriler ve en iyi puanları bu tarayıcıda görünür. Tarayıcı depolaması kapalıysa oyun çalışmaya devam eder.
- Klavye odağı, ekran okuyucu açıklamaları ve azaltılmış hareket tercihi desteklenir.

Kontroller: `node checks.mjs`, `node tests/game-flow.mjs` ve `node --check dist/app.js`. Oyun akışı testi tarayıcı yerine küçük bir DOM benzetimi kullanır; gerçek tarayıcıda masaüstü ve mobil görünüm ayrıca kontrol edilmelidir.

## Sonraki geliştirmeler

1. **Karışık senaryolar:** Üç kategoriden rastgele beş soru seçen bir tekrar modu; kategori odaklı ilk öğrenmenin ardından kullanılabilir.
2. **Mesajda işaret bulma:** Oyuncunun acele ettirme, para isteme ve kod paylaşma gibi şüpheli ifadeleri işaretlediği ikinci bir oyun türü.
3. **Saha uygulaması için ölçüm:** Dersin ön test ve son testini oyun puanından ayrı tutan anonim değerlendirme akışı. Önce soru ve veri saklama kuralları belirlenmelidir.
4. **Kolay içerik yönetimi:** Eğitim ekibinin yeni soruları ekleyebilmesi için veri doğrulaması ve yerel JSON içe aktarma aracı.

## Yeni senaryolar ve tur akışı

Gençler kategorisine menü görüntülemek için kart bilgisi isteyen bir QR sayfası, ebeveynler kategorisine bağımsız uygulamada doğrulanmış bir teslimat bildirimi eklendi. Gençler ve ebeveynler altışar, ileri yaş kategorisi beş senaryo içerir. Her turda seçilen kategorinin tüm soruları karıştırılır; aynı soru tur içinde tekrarlanmaz. Puan ve ilerleme soru sayısına göre hesaplanır.

Başlıklardaki cevabı ele veren ifadeler kaldırıldı. Geri bildirimde kullanılan “Dikkat edilecek noktalar” başlığı hem riskli hem de doğrulanmış örnekleri kapsar.
