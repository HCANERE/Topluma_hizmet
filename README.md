# Tıklamadan Önce Düşün

Türkçe, mobil uyumlu ve tamamen statik bir dijital dolandırıcılık farkındalık oyunu. Üyelik, veritabanı, kişisel veri toplama ve sunucu kodu yoktur.

Canlı site: https://tiklamadan-once-dusun.mustafakarademir1011.chatgpt.site

## Çalıştırma

`dist/index.html` dosyasını tarayıcıda açın. İsterseniz proje klasöründe `python -m http.server 8766 --directory dist` komutunu çalıştırıp `http://localhost:8766/` adresine gidin. Bu komut yalnızca yerel önizleme içindir; siteyi yayınlamak için statik dosyaları barındıran herhangi bir hizmet yeterlidir.

## Dosyalar

- `dist/index.html`: Ana sayfa, oyun ve sonuç ekranları.
- `dist/style.css`: Görünüm ve mobil/erişilebilir düzen.
- `dist/data.js`: Üç kategorideki 15 kurgusal senaryo ve açıklamaları. Soruları düzenlemek için bu dosyayı kullanın.
- `dist/app.js`: Kategori seçimi, cevap kontrolü, puanlama ve ekran geçişleri.

Değişikliklerden sonra `node checks.mjs` ile senaryo yapısını kontrol edin. GitHub'a yapılan push canlı Site sürümünü kendiliğinden güncellemez; yayın için yeni sürüm ayrıca dağıtılır.

Senaryolardaki kurum ve kişiler kurgusaldır. Örnek alan adları tıklanabilir değildir.
