# Oturumsuz kullanım ve ileride hesap desteği

## Bugünkü karar

Site statik ve herkese açık eğitim aracı olarak çalışır. Kullanıcı giriş yapmadan tüm oyunlara, inceleme araçlarına, videolara ve testlere ulaşır. Oyun puanı, tekrar planı, öğrenme adımları ve metin tercihi bu tarayıcıda kalır. Kullanıcı isterse yalnızca bu ilerlemeyi JSON dosyasına indirip başka cihazda birleştirir. Sohbet, OCR görseli, mesaj metni ve gerçek bağlantı bu yedeğe girmez. Saha ön/son testinin anonim toplu sonuçları da kişisel ilerlemeden ayrıdır.

Yerel senaryo atölyesi bir yönetici hesabı değildir; yalnızca ekip bilgisayarında açılan içerik hazırlama dosyasıdır. JSON'un sitede görünmesi için depo komutuyla doğrulanıp kod olarak eklenmesi ve ekipçe gözden geçirilmesi gerekir.

## Gerçek oturum açma gerektiğinde

Hesap açmanın somut gerekçesi, isteğe bağlı cihazlar arası eşitleme veya sunucuda yetki denetimli eğitmen içeriği yönetimi olmalıdır. Bunun için kimlik sağlayıcısı, sunucu/veri deposu, HTTPS, sunucuda rol denetimi ve veri yaşam döngüsü gerekir. Tarayıcıdaki bir “eğitmen” düğmesi ya da yerel parola gerçek yetkilendirme sağlamaz.

Hesaplı sürüm tasarlanırken:

1. Oturumsuz kullanım tam işlevli kalır; hesap açma zorunlu olmaz.
2. Hesaba yalnızca kullanıcı açıkça seçerse oyun ve öğrenme ilerlemesi aktarılır. Anonim saha ölçümü kullanıcı profiline bağlanmaz.
3. Eğitmen rolü istemcideki görünürlüğe değil, sunucudaki yetki kontrolüne dayanır.
4. İndirilebilir veri, hesap silme, saklama süresi ve erişim kayıtları uygulamadan önce belirlenir.
5. Servis anahtarları tarayıcı koduna veya açık GitHub deposuna konmaz.

Bu gereksinimler karşılanmadan arayüze çalışmayan bir “Oturum aç” düğmesi eklenmez.
