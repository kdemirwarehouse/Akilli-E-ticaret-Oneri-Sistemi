Flask ile Temel REST API Endpoint Oluşturulması

Bu aşamada, ürün önerilerini sunacak olan API iskeleti **Flask Framework** kullanılarak geliştirilmiştir.

### Yapılan İşlemler:
* **Framework Seçimi:** Hafif ve esnek yapısı nedeniyle Flask tercih edilmiştir.
* **Endpoint Tasarımı:** `/api/v1/recommendations/<user_id>` uç noktası oluşturularak kullanıcı bazlı JSON yanıtları simüle edilmiştir.
* **Hata Yönetimi:** 404 (Bulunamadı) ve 500 (Sunucu Hatası) durumları için özel `errorhandler` mekanizmaları kurulmuştur.
* **Loglama:** API'ye gelen tüm istekler ve oluşan hatalar `api_logs.log` dosyasına anlık olarak kaydedilmektedir.

### API Test Sonucu:
API, Postman ve tarayıcı üzerinden test edilmiş; JSON formatında başarılı çıktılar alınmıştır.
