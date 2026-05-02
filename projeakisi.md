# Veri Vizyonerler - Proje Akışı ve Haftalık İlerleme .

Bu doküman ekip üyelerinin görev dağılımını ve haftalık proje ilerlemelerini içermektedir.

---

# Proje Adı

Akıllı E-Ticaret Öneri Sistemi

---

# Proje Amacı

E-ticaret platformlarında müşteri davranışlarını analiz ederek kullanıcılara kişiselleştirilmiş ürün önerileri sunan bir sistem geliştirmek.

Bu sistem kullanıcı deneyimini iyileştirmeyi ve satışları artırmayı hedeflemektedir.

---

# Kullanılacak Teknolojiler

- Python
- Pandas
- Scikit-learn
- Flask
- PostgreSQL

---

# Ekip Üyeleri 

| İsim |
|------|
| Sarya Su Toğyıldız |
| AbdulKadir Demir | 
| Elif Babürhan | 
| Sema Elmahmud | 
| İsmail Özdemir | 

---

# Haftalık İlerleme

## 1. Hafta

**Sarya Su Toğyıldız:**  # ✅ Görev 1 Tamamlandı: Teknoloji Araştırması ve Algoritma Karşılaştırması

Projenin akademik ve teknik altyapısını oluşturmak amacıyla yapılan kapsamlı teknoloji araştırması başarıyla tamamlanmıştır.

**Gerçekleştirilen Teknik Detaylar:**
- **Algoritma Analizi:** İçerik Tabanlı (Content-Based), İşbirlikçi (Collaborative) ve Hibrit modellerin e-ticaret üzerindeki verimlilikleri kıyaslandı.
- **Teknoloji Yığını:** Python'un veri analitiği gücünden yararlanmak için Pandas, NumPy ve Scikit-learn kütüphanelerinin kullanılmasına karar verildi.
- **Framework Seçimi:** API altyapısı için Flask ve FastAPI değerlendirildi; projenin ihtiyacına göre esnek ve hafif yapısıyla Flask üzerinde mutabık kalındı.
- **Veritabanı Mimari:** Yapısal verilerin saklanması için PostgreSQL şeması tasarlandı ve sisteme entegrasyonu planlandı.
- **Stratejik Seçim:** Projenin başlangıç aşamasında "İşbirlikçi Filtreleme" yönteminin temel alınması, ilerleyen aşamalarda ise "Cold Start" problemini aşmak için Hibrit modele geçilmesi hedeflendi.

**AbdulKadir Demir:**  
Projenin fonksiyonel ve teknik gereksinimleri analiz edildi ve dokümantasyon çalışmaları başlatıldı.  
Gereksinim toplandı ve belgeleme görevi tamamlandı.

**Elif Babürhan:**  
Geliştirme ortamı kurulumu için gerekli araçlar araştırıldı ve sistem gereksinimleri belirlendi. 

**Sema Elmahmud:**  
Projenin kapsamı analiz edildi ve benzer e-ticaret öneri sistemleri incelendi.

**İsmail Özdemir:**  
Proje için kullanılabilecek açık kaynak e-ticaret veri setleri araştırıldı ve veri setleri indirildi.

---

## 2. Hafta

**İsmail Özdemir:** 

**Sema Elmahmud:** ✅ Görev 2 Tamamlandı: Veri Seti Keşfi ve Ön İşleme Planlaması
Hatalı yazımları giderilmiş, veri tipleri düzeltilmiş ve farklı tabloları anlamlı bir şekilde birbirine bağlanmış, temiz bir veri seti yapısı oluşturmuş oldum.

**Elif Babürhan:**  

**Sarya Su Toğyıldız:** # ✅ Görev 2 Tamamlandı: UI ve UX Wireframe Tasarımı

E-ticaret öneri sisteminin kullanıcı arayüzü (UI) ve kullanıcı deneyimi (UX) planlaması başarıyla tamamlanmıştır.

**Gerçekleştirilen Teknik Detaylar:**
- **Kullanıcı Yolculuğu:** Önerilerin ana sayfa, ürün detay ve sepet sayfalarındaki yerleşimi planlandı.
- **Bileşen Tasarımı:** "Sizin İçin Seçtiklerimiz" ve "Benzer Ürünler" bölümleri için tel kafes (wireframe) yapıları oluşturuldu.
- **Strateji:** Kullanıcının alışveriş akışını bozmadan, sepet ortalamasını artırmaya yönelik çapraz satış (cross-sell) noktaları belirlendi.
- **Teknoloji Kararı:** Arayüzün geliştirilmesinde Python ile tam uyumlu çalışan Streamlit veya FastAPI/React ikilisinin kullanılması kararlaştırıldı.
- 
**AbdulKadir Demir:** 
---

## 3. Hafta

**İsmail Özdemir:** 

**Sema Elmahmud:**  ✅ Görev 3 Tamamlandı: Veri Ön İşleme ve Temizleme Modülünün Geliştirilmesi
Veri setindeki gürültüyü ve eksiklikleri gidermek için Pandas ile otomatik bir temizleme modülü yazdım. Bu modülle; eksik verileri tamamladım, aykırı değerleri (outliers) IQR yöntemiyle eledim ve veri tiplerini optimize ettim. Sonuç olarak, veriyi modellemeye hazır, yüksek performanslı Parquet formatında dışa aktardım.

**Elif Babürhan:**  

**Sarya Su Toğyıldız:** # ✅ Görev 3 Tamamlandı: REST API Tasarımı ve Spesifikasyonu

Öneri sonuçlarını sunacak olan sistemin teknik mimarisi ve API standartları belirlenmiştir.

**Gerçekleştirilen Teknik Detaylar:**
- **Endpoint Standartları:** `GET /recommendations` ve `GET /products/similar` uç noktaları tasarlandı.
- **Veri Formatı:** Tüm veri alışverişinin JSON formatında yapılması kararlaştırıldı ve örnek şemalar oluşturuldu.
- **Performans Planı:** Sistemin hızlı yanıt vermesi için Redis tabanlı önbellekleme (caching) stratejisi dokümante edildi.
- **Güvenlik:** API erişiminin JWT (JSON Web Token) ile korunması ve yetkilendirme basamakları planlandı.
- **Dokümantasyon:** API'nin Swagger/OpenAPI standartlarına uygun olarak sunulması sağlandı.

**AbdulKadir Demir:** 


---

## 4. Hafta

**İsmail Özdemir:** 

**Sema Elmahmud:** 

**Elif Babürhan:**  

**Sarya Su Toğyıldız:** # ✅ Görev 4 Tamamlandı: Flask API ve Logging

Ürün öneri sisteminin temel API uç noktaları Flask framework'ü ile başarıyla oluşturuldu.

**Gerçekleştirilen Teknik Detaylar:**
- **Framework:** Flask 3.x
- **Logging:** Tüm API trafiği `api_logs.log` dosyasına kaydediliyor.
- **Hata Yönetimi:** Geçersiz istekler için özel 404 JSON yanıtları tanımlandı.
- **Test:** Tarayıcı üzerinden endpoint testleri başarıyla gerçekleştirildi.

**AbdulKadir Demir:** 

---

