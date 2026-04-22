REST API Tasarımı ve Spesifikasyonu

Bu doküman, öneri sistemimizin sonuçlarını dış dünyaya (web/mobil arayüz) sunacak olan API'nin teknik tasarımıdır.

---

## 1. Kullanılacak Teknolojiler
* [cite_start]**Framework:** FastAPI (Hızlı ve modern bir Python web framework'ü)[cite: 30, 88].
* [cite_start]**Veri Formatı:** JSON (Tüm veri alışverişi bu formatta yapılacaktır)[cite: 83, 87].
* [cite_start]**Dokümantasyon:** Swagger / OpenAPI (API'yi test etmek için otomatik arayüz)[cite: 84, 100].

---

## 2. API Uç Noktaları (Endpoints)

### **A. Kişiselleştirilmiş Öneriler**
Kullanıcının geçmişine göre ürün listesi döner.
* [cite_start]**Adres:** `GET /recommendations/{user_id}`.
* [cite_start]**Yanıt:** Kullanıcıya özel seçilmiş ürünlerin listesi.

### **B. Benzer Ürünler**
Bakılan bir ürüne benzeyen diğer ürünleri döner.
* [cite_start]**Adres:** `GET /products/{product_id}/similar`[cite: 90].
* [cite_start]**Yöntem:** İçerik tabanlı filtreleme kullanılır.

---

## 3. Güvenlik ve Hız
* [cite_start]**Güvenlik:** API erişimi **JWT** (Token) ile korunacak; sadece yetkili kullanıcılar veri çekebilecektir[cite: 96].
* [cite_start]**Hız (Caching):** Öneriler her seferinde yeniden hesaplanmak yerine **Redis** üzerinde 1 saat saklanacaktır (Performans artışı için)[cite: 98].

---

## 4. Hata Yönetimi
API hatalı durumlarda şu standart kodları kullanacaktır:
* [cite_start]**401:** Yetkisiz erişim (Giriş yapmamış kullanıcı)[cite: 94].
* [cite_start]**404:** Ürün veya kullanıcı bulunamadı[cite: 94].
* [cite_start]**500:** Sunucu hatası[cite: 95].
