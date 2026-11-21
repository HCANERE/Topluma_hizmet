# Tıklamadan Önce Düşün

Selçuk Üniversitesi Topluma Hizmet Uygulamaları dersi için geliştirilen, Türkçe ve mobil uyumlu dijital güvenlik eğitim platformu. Resmî proje adı **Güvenli Dijital Toplum: Toplum Geneli Siber Güvenlik Farkındalık Projesi**. Dersin kapsamı ve saha uygulaması için [uyum planına](docs/ders-uyum-plani.md) bakın.

## Bölümler

- **Ana sayfa:** Platformun bölümlerini ve öğrenme yolunu tanıtan giriş. Masaüstünde yan menü, telefonda açılır menü kullanılır.
- **Senaryo oyunları:** Gençler, ebeveynler ve ileri yaştaki kullanıcılar için 18 kurgusal durumdan kategori başına rastgele seçilen beş soruluk turlar. Oyun puanı sadece o turu anlatır.
- **Kısa tekrar:** Yanlış cevaplanan senaryoları bu cihazda yeniden sunar; doğru tekrarları 1, 3 ve 7 gün arayla önerir. Tekrar puanı ön/son teste katılmaz.
- **Karar simülatörü:** Yedi olayda işareti fark etme, bağımsız doğrulama ve güvenli eylem seçimini üç adımda prova etme.
- **Tuzak Laboratuvarı ve Taktik Rehberi:** Aynı görünen mesajların farklı sonuçlarını karşılaştırma ve sık kullanılan dolandırıcılık yöntemlerini öğrenme.
- **Bağlantı ve QR inceleme:** Girilen adresi açmadan ana alan adını, alt alan adını ve dikkat gerektiren yapısal işaretleri açıklama. QR görseli cihazda okunur. Varsayılan akışta canlı sorgu yapılmaz; isteğe bağlı yardımcı servis bilinen tehdit listesi sorgusu ekler. Hiçbir sonuç güvenlik garantisi vermez.
- **Şüpheli mesaj ve ekran görüntüsü inceleme:** SMS veya e-postadaki acele, ödeme, kod ve bağlantı gibi işaretleri açıklayan cihaz içi kural motoru. Seçilen ekran görüntüsünden Türkçe yazı yerel OCR ile alana aktarılabilir; kullanıcı metni gözden geçirip incelemeyi kendisi başlatır. Metin ve görsel gönderilmez veya saklanmaz; sonuç dolandırıcılık hükmü değildir.
- **Dijital Güvenlik Rehberi:** Türkçe soruları küratörlü konu bankasıyla eşleştiren, ilgili site içeriğini kaynak gösteren yerel chatbot. Konu bulunamazsa bunu söyler. Üretken yapay zekâ veya canlı virüs tarayıcısı değildir.
- **Öğrenme yolu:** Ön test, mesaj inceleme, video, karar simülatörü ve son test için isteğe bağlı ilerleme listesi.
- **Eğitim videoları:** Tanıtım filmi ve altı kısa eğitim videosu. Türkçe altyazı, konu filtresi ve dikey videolar için uygun oynatıcı vardır.
- **Medya doğrulama laboratuvarı:** Üç kurgusal video/ses iddiasında kaynak, tarih ve bağımsız kanıtı sorgulatır. Content Credentials kavramını açıklar; dosya imzası doğrulaması veya kesin sahte içerik tespiti yapmaz.
- **Ön test / Son test:** Aynı beş kazanımı eğitim öncesi ve sonrası kısa sorularla ölçme; cihazdaki anonim toplu sonucu ve geri bildirimi CSV olarak dışa aktarma. Oyun puanları bu ölçüme katılmaz.
- **Saha raporu:** Farklı cihazlardan indirilen yeni biçimli toplu CSV dosyalarını tarayıcıda birleştirir; katılımcı bazında kayıt tutmaz. Eski CSV'ler ham toplamları içermediğinden güncel siteden yeniden dışa aktarılmalıdır.
- **Oturumsuz ilerleme:** Hesap gerektirmez. Oyun puanı, tekrar planı, öğrenme adımları ve metin tercihi JSON yedeğiyle cihazlar arasında kullanıcı tarafından taşınabilir. Gerçek giriş ve otomatik eşitleme henüz yoktur.
- **Şimdi Ne Yapacağım?:** Bağlantı açma, kod paylaşma, kart bilgisi girme veya para gönderme gibi durumlarda ilk güvenli adımları gösterme.

Gerçek hesap desteğinin hangi koşullarda ekleneceği [oturum stratejisinde](docs/oturum-stratejisi.md) açıklanır.

## Çalıştırma

Node.js 18 veya üstü yeterlidir; harici npm paketi, üyelik, veritabanı ve backend gerekmez.

```sh
npm start
```

Tarayıcıda <http://127.0.0.1:8766> adresini açın. `npm test` içerik ve temel akış kontrollerini çalıştırır. Statik yayın dizini `dist/` klasörüdür. Bu depodaki kaynak kodu güncellemek siteyi kendiliğinden yayına almaz.

### Canlı yayın

Site [sibertoplum.omeratici.com](https://sibertoplum.omeratici.com/) adresinde Plesk üzerinden statik olarak yayımlanır. HTTP istekleri HTTPS'ye 301 ile yönlendirilir. Yeni sürüm için `npm test` çalıştırın, ardından `dist/` içeriğini alt alan adının web köküne yükleyin. `dist/web.config`, Windows/IIS sunucusunda video, altyazı, SVG ve yerel OCR dosyalarının doğru içerik türüyle sunulmasını sağlar. Yükleme arşivini web kökünde bırakmayın. GitHub'a gönderim otomatik yayın yapmaz.

OCR akışını gerçek mesaj kullanmadan denemek için `tests/ocr-sample.png` içindeki kurgusal metni seçebilirsiniz.

Yeni senaryo hazırlamak için `tools/senaryo-editoru.html` dosyasını ekip bilgisayarında açın. JSON'u indirdikten sonra `node scripts/add-scenarios.mjs DOSYA.json --check` ile doğrulayın, ardından `--check` olmadan depoya ekleyin ve `npm test` çalıştırın. Bu yerel içerik aracı bir oturum açma veya yetki sistemi değildir; dışa aktarılan senaryolar yayımlanmadan önce ekipçe incelenmelidir.

### İsteğe bağlı canlı tehdit sorgusu

Varsayılan `npm start` yalnızca statik siteyi çalıştırır. Canlı sorgu bölümü devre dışı kalır. Ders kapsamında kullanılacak ayrı bir Google Safe Browsing API anahtarı edinildiğinde, yerel yardımcı servis `SAFE_BROWSING_API_KEY` ortam değişkeniyle `npm run start:reputation` komutuyla başlatılabilir. Anahtarı kaynak koda veya GitHub deposuna koymayın. Bu servis yalnızca `127.0.0.1` adresinde dinler; genel internete açık yayın için hazırlanmış bir sunucu değildir.

Kullanıcı önce adresi cihazında inceler. Canlı sorgu için ayrıca onay verir ve ayrı düğmeye basar. Yardımcı servis kullanıcı adresini **açmaz**; yalnızca sabit Google API adresine sorgu gönderir. `?` parametreleri ve `#` bölümü çıkarılır, ancak yol bölümünde kişisel bilgi varsa kullanıcı bunu da silmelidir. Google'ın listesinde eşleşme olmaması güvenlik garantisi değildir. [Safe Browsing kullanım koşulları](https://developers.google.com/safe-browsing/terms) ve [API açıklaması](https://developers.google.com/safe-browsing/reference/rest/v5/urls/search) kurulumdan önce gözden geçirilmelidir. Mevcut projede anahtar bulunmadığı için canlı sorgu etkin değildir.

## Veri ve çevrimdışı kullanım

İsim, e-posta, telefon veya yaş bilgisi istenmez. Oyunların en iyi puanı, tekrar planı, metin boyutu tercihi, öğrenme yolu işaretleri ve tamamlanmış testlerin **yalnızca toplu sayıları** bu tarayıcının yerel depolamasında tutulur. Mesaj metni, OCR için seçilen görsel, chatbot soruları, bağlantı/QR içeriği ve bireysel test yanıtları kalıcı olarak saklanmaz. Chatbot konuşması bölümden ayrılınca temizlenir; adresler ve uzun sayılar soru balonunda gizlenir. Varsayılan akışta kullanıcı girdileri sunucuya gönderilmez; isteğe bağlı canlı sorgu açılırsa yalnızca kullanıcının ayrıca onayladığı adres Google'a gönderilir. Toplu CSV dışa aktarma ve toplu sonucu temizleme, ölçme ekranındadır. Farklı cihazların toplu CSV dosyaları saha raporu bölümünde elle birleştirilebilir. Misafir yedeği toplu test sonuçlarını içermez.

İlk çevrimiçi açılıştan sonra temel sayfalar, oyunlar ve testler servis çalışanı ile çevrimdışı kullanılabilir. OCR motoru ve Türkçe dil dosyası yaklaşık 14 MB'tır; ilk kez kullanılınca yüklenir ve sonraki çevrimdışı kullanım için önbelleğe alınır. MP4 videolar boyutları nedeniyle otomatik önbelleğe alınmaz; çevrimdışı saha gösterimi için önceden indirilmeleri gerekir. Tarayıcıda servis çalışanı için HTTPS veya localhost gerekir.

## Kod yapısı

| Dosya | Görev |
| --- | --- |
| `dist/index.html`, `dist/style.css`, `dist/portal.css`, `dist/portal.js` | Sayfalar, platform görünümü, menü ve video filtresi |
| `dist/data.js`, `dist/app.js` | Kategori oyununun içerik ve akışı |
| `dist/extra-scenarios.js`, `content/extra-scenarios.json`, `tools/` | Ekipçe hazırlanıp doğrulanan ek senaryolar ve yerel senaryo atölyesi |
| `dist/decision-data.js`, `dist/decision.js` | Karar simülatörü |
| `dist/assessment.js`, `dist/report-merge.js` | Anonim ön/son test, toplu CSV ve cihaz içinde rapor birleştirme |
| `dist/message-analyzer.js`, `dist/image-ocr.js`, `dist/vendor/ocr/` | Cihaz içi mesaj açıklaması ve yerel Türkçe OCR |
| `dist/learning-path.js`, `dist/guest-progress.js` | Öğrenme adımları ve oturumsuz ilerleme yedeği |
| `dist/media-lab.js` | Kurgusal medya doğrulama örnekleri |
| `dist/chatbot-data.js`, `dist/chatbot.js` | Türkçe rehberin düzenlenebilir yanıt bankası ve yerel soru eşleştirmesi |
| `dist/lab-scenarios.js`, `dist/practice.js`, `dist/practice.css` | Laboratuvar, taktik rehberi ve eylem önerileri |
| `dist/url-inspector.js` | Adres ayrıştırma ve cihaz içinde QR okuma |
| `dist/service-worker.js`, `dist/manifest.webmanifest` | Temel çevrimdışı kullanım |
| `dist/media/` | Yerel MP4 videolar, WebVTT altyazılar ve posterler |
| `scripts/serve.mjs` | MP4 aralık isteklerini de destekleyen yerel sunucu |
| `scripts/reputation-service.mjs` | Anahtar varsa, yerelde isteğe bağlı Safe Browsing sorgusu |

İçerikteki kişi ve kurumlar kurgusaldır; örnek adresler tıklanabilir değildir. Harici yazılım olarak [jsQR 1.4.0](https://github.com/cozmo/jsQR) (Apache-2.0), [Mozilla Public Suffix List](https://publicsuffix.org/list/) (MPL 2.0), [Tesseract.js 7.0.0](https://github.com/naptha/tesseract.js) ve core (Apache-2.0) ile Türkçe dil verisi kullanılır. Dil paketinin bildirilen lisansı MIT, kaynak modelin lisansı Apache-2.0'dır. OCR lisans metinleri `dist/vendor/ocr/` içindedir. İçerikte yararlanılan kurumsal kaynaklar sitenin alt bölümünde bağlantılıdır. Eğitim videoları bu proje kapsamında daha önce üretilen yerel dosyalardır. Saha uygulaması için [pilot kontrol planı](docs/saha-pilotu.md) hazırdır.
