UI ve UX Wireframe Hazırlama


Bu doküman, "Akıllı E-ticaret Öneri Sistemi" projesinin kullanıcı arayüzü (UI) ve kullanıcı deneyimi (UX) taslaklarını, öneri bileşenlerinin yerleşim planını içerir.

---

## 1. Kullanıcı Deneyimi (UX) Stratejisi
Öneri sisteminin kullanıcı yolculuğuna entegrasyonu üç ana noktada gerçekleşecektir:
1.  **Ana Sayfa:** Genel popülerlik ve kullanıcı geçmişine dayalı geniş kapsamlı öneriler.
2.  **Ürün Detay Sayfası:** İncelenen ürünle ilgili "Benzer Ürünler" (İçerik Tabanlı).
3.  **Sepet/Ödeme Sayfası:** Tamamlayıcı ürün önerileri (İşbirlikçi Filtreleme).

---

## 2. Wireframe Taslakları (Bileşen Bazlı)

### **A. Ana Sayfa "Sizin İçin Seçtiklerimiz" Bloğu**
Kullanıcı giriş yaptığında karşısına çıkacak olan kişiselleştirilmiş bölümdür.
* **Yerleşim:** Slider (kaydırılabilir) yapıda, ilk ekranın (above the fold) hemen altında.
* **İçerik:** Ürün görseli, ürün adı, fiyat ve "Sepete Ekle" butonu.

### **B. Ürün Detay "Benzer Ürünler" Modülü**
Kullanıcı bir ürünü incelerken, o ürünün kategorisi ve özelliklerine benzer ürünlerin listelendiği alandır.
* **Yerleşim:** Ürün açıklamasının hemen altında.
* **Algoritma Bağlantısı:** Content-Based Filtering (İçerik Tabanlı Filtreleme).

### **C. Sepet Sayfası "Bunu Alanlar Şunu da Aldı" Bölümü**
Çapraz satış (cross-sell) odaklı, kullanıcının sepetindeki ürünle sık alınan ürünleri gösterir.
* **Yerleşim:** Sepet listesinin sağ tarafı veya alt kısmı.
* **Algoritma Bağlantısı:** Collaborative Filtering (İşbirlikçi Filtreleme).

---

## 3. Teknik Entegrasyon Detayları
* [cite_start]**Framework:** Arayüz için **Streamlit** veya basit bir **React** uygulaması tercih edilecektir[cite: 31, 70].
* [cite_start]**Veri Akışı:** Kullanıcı etkileşimleri (tıklama, sepete ekleme) PostgreSQL veritabanına kaydedilecek ve öneri motoru bu verileri gerçek zamanlı veya periyodik olarak işleyecektir[cite: 26, 27].
* [cite_start]**API:** Modelden gelen öneriler `GET /recommendations/{user_id}` uç noktası üzerinden FastAPI ile arayüze çekilecektir[cite: 30, 48].

---

## 4. Tasarım İlkeleri
* **Şeffaflık:** "Neden bu ürünü görüyorsunuz?" gibi küçük bilgi notları eklenecektir.
* **Hız:** Öneri motorunun yanıt süresi, UX kalitesi için 200ms altında tutulmaya çalışılacaktır.
