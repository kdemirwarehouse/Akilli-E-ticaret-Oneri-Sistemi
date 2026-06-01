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

**AbdulKadir Demir:**  ✅ Görev 1 Tamamlandı: Projenin fonksiyonel ve teknik gereksinimleri analiz edildi ve dokümantasyon çalışmaları başlatıldı.  
Gereksinim toplandı ve belgeleme görevi tamamlandı.

**Elif Babürhan:**   ✅ Görev 1 Tamamlandı:Geliştirme ortamı kurulumu için gerekli araçlar araştırıldı ve sistem gereksinimleri belirlendi. 

**Sema Elmahmud:**  ✅ Görev 1 Tamamlandı: Projenin kapsamı analiz edildi ve benzer e-ticaret öneri sistemleri incelendi.

**İsmail Özdemir:**  ✅ Görev 1 Tamamlandı: Proje için kullanılabilecek açık kaynak e-ticaret veri setleri araştırıldı ve veri setleri indirildi.

**Sarya Su Toğyıldız:**  ✅ Görev 1 Tamamlandı: Teknoloji Araştırması ve Algoritma Karşılaştırması

Projenin akademik ve teknik altyapısını oluşturmak amacıyla yapılan kapsamlı teknoloji araştırması başarıyla tamamlanmıştır.

**Gerçekleştirilen Teknik Detaylar:**
- **Algoritma Analizi:** İçerik Tabanlı (Content-Based), İşbirlikçi (Collaborative) ve Hibrit modellerin e-ticaret üzerindeki verimlilikleri kıyaslandı.
- **Teknoloji Yığını:** Python'un veri analitiği gücünden yararlanmak için Pandas, NumPy ve Scikit-learn kütüphanelerinin kullanılmasına karar verildi.
- **Framework Seçimi:** API altyapısı için Flask ve FastAPI değerlendirildi; projenin ihtiyacına göre esnek ve hafif yapısıyla Flask üzerinde mutabık kalındı.
- **Veritabanı Mimari:** Yapısal verilerin saklanması için PostgreSQL şeması tasarlandı ve sisteme entegrasyonu planlandı.
- **Stratejik Seçim:** Projenin başlangıç aşamasında "İşbirlikçi Filtreleme" yönteminin temel alınması, ilerleyen aşamalarda ise "Cold Start" problemini aşmak için Hibrit modele geçilmesi hedeflendi.


---

## 2. Hafta

**AbdulKadir Demir:** ✅ Görev 2 Tamamlandı: Öneri Algoritması Araştırması ve Değerlendirmesi yapıldı.

**İsmail Özdemir:** 

**Sema Elmahmud:** ✅ Görev 2 Tamamlandı: Veri Seti Keşfi ve Ön İşleme Planlaması
Hatalı yazımları giderilmiş, veri tipleri düzeltilmiş ve farklı tabloları anlamlı bir şekilde birbirine bağlanmış, temiz bir veri seti yapısı oluşturmuş oldum.

**Elif Babürhan:** ✅ Görev 2 Tamamlandı: # PostgreSQL Veritabanı Tasarımı

Bu projede, e-ticaret sistemi için müşteri bilgileri, ürünler ve kullanıcı etkileşimlerini içeren ilişkisel bir veritabanı tasarlanmıştır.

## 📌 Yapılanlar

- Müşteri, ürün ve sipariş tabloları oluşturuldu
- Tablolar için sütunlar ve veri tipleri tanımlandı
- Tablolar arasında FOREIGN KEY ilişkileri kuruldu
- Veri bütünlüğü için PRIMARY KEY, UNIQUE, NOT NULL ve CHECK kısıtlamaları eklendi
- Performans için gerekli alanlara INDEX yapısı oluşturuldu

## 🔗 Veritabanı Yapısı

- users → müşteri bilgileri
- products → ürün bilgileri
- orders → siparişler
- order_items → sipariş detayları
- interactions → kullanıcı etkileşimleri

## 📊 Diyagram

Veri modeli ER diyagramı ile görselleştirilmiştir ve tablolar arasındaki ilişkiler gösterilmiştir.

## ⚡ Amaç

Verimli, ölçeklenebilir ve veri bütünlüğü korunmuş bir e-ticaret veritabanı tasarlamak.

**Sarya Su Toğyıldız:** ✅ Görev 2 Tamamlandı: UI ve UX Wireframe Tasarımı

E-ticaret öneri sisteminin kullanıcı arayüzü (UI) ve kullanıcı deneyimi (UX) planlaması başarıyla tamamlanmıştır.


**Gerçekleştirilen Teknik Detaylar:**
- **Kullanıcı Yolculuğu:** Önerilerin ana sayfa, ürün detay ve sepet sayfalarındaki yerleşimi planlandı.
- **Bileşen Tasarımı:** "Sizin İçin Seçtiklerimiz" ve "Benzer Ürünler" bölümleri için tel kafes (wireframe) yapıları oluşturuldu.
- **Strateji:** Kullanıcının alışveriş akışını bozmadan, sepet ortalamasını artırmaya yönelik çapraz satış (cross-sell) noktaları belirlendi.
- **Teknoloji Kararı:** Arayüzün geliştirilmesinde Python ile tam uyumlu çalışan Streamlit veya FastAPI/React ikilisinin kullanılması kararlaştırıldı.


---

## 3. Hafta

**İsmail Özdemir:** 

**AbdulKadir Demir:** ✅ Görev 3 Tamamlandı: Modelin performansını değerlendirmek için kullanılan metrikler (kesinlik, doğruluk, F1 skoru vb.) analiz edildi  ve sonuçları raporlandı. 

**Sema Elmahmud:**  ✅ Görev 3 Tamamlandı: Veri Ön İşleme ve Temizleme Modülünün Geliştirilmesi
Veri setindeki gürültüyü ve eksiklikleri gidermek için Pandas ile otomatik bir temizleme modülü yazdım. Bu modülle; eksik verileri tamamladım, aykırı değerleri (outliers) IQR yöntemiyle eledim ve veri tiplerini optimize ettim. Sonuç olarak, veriyi modellemeye hazır, yüksek performanslı Parquet formatında dışa aktardım.

**Elif Babürhan:** ✅ Görev 3 Tamamlandı: # Flask + Scikit-learn Ürün Öneri Sistemi

## Amaç
Flask kullanarak REST API geliştirmek ve Scikit-learn ile ürün öneri sistemi oluşturmak.

## Yapılanlar
- Flask ile API kuruldu
- `/recommendations` endpoint’i oluşturuldu
- Kosinüs benzerliği ile öneri algoritması geliştirildi
- Model `.pkl` olarak kaydedildi ve API’ye entegre edildi
- Threshold ve top_n parametreleri eklendi
- Fallback (model yoksa statik veri) sistemi kuruldu

## Testler
- `/` ana sayfa çalıştı
- `/api/v1/recommendations/<user_id>` öneri döndürdü
- Parametreli sorgular test edildi

## Teknolojiler
Flask, Scikit-learn, Pandas, NumPy, Joblib

## Sonuç
Çalışan bir REST API tabanlı ürün öneri sistemi geliştirilmiştir. 

**Sarya Su Toğyıldız:** ✅ Görev 3 Tamamlandı: REST API Tasarımı ve Spesifikasyonu

Öneri sonuçlarını sunacak olan sistemin teknik mimarisi ve API standartları belirlenmiştir.


**Gerçekleştirilen Teknik Detaylar:**
- **Endpoint Standartları:** `GET /recommendations` ve `GET /products/similar` uç noktaları tasarlandı.
- **Veri Formatı:** Tüm veri alışverişinin JSON formatında yapılması kararlaştırıldı ve örnek şemalar oluşturuldu.
- **Performans Planı:** Sistemin hızlı yanıt vermesi için Redis tabanlı önbellekleme (caching) stratejisi dokümante edildi.
- **Güvenlik:** API erişiminin JWT (JSON Web Token) ile korunması ve yetkilendirme basamakları planlandı.
- **Dokümantasyon:** API'nin Swagger/OpenAPI standartlarına uygun olarak sunulması sağlandı.


---

## 4. Hafta

**İsmail Özdemir:** 

**AbdulKadir Demir:** ✅ Görev 4 Tamamlandı: Basit İçerik Tabanlı Öneri Algoritmasının Uygulanması --> Scikit-learn kütüphanesi kullanılarak ürün açıklamaları ve özelliklerine göre basit bir içerik tabanlı öneri algoritması geliştirildi. TF-IDF veya CountVectorizer gibi yöntemlerle ürün açıklamaları vektörleştirildi ve benzerlik matrisi oluşturuldu.

**Sema Elmahmud:** 

**Elif Babürhan:** ✅ Görev 4 Tamamlandı: # E-Ticaret Veri Çekme ve Analiz Projesi

Bu projede PostgreSQL veritabanına Python ile bağlantı kurulmuş, kullanıcı ve ürün verileri çekilmiş ve Pandas ile analiz edilmiştir. Ayrıca basit bir ürün öneri sistemi geliştirilmiştir.

## Kullanılan Teknolojiler
- Python
- PostgreSQL
- Pandas
- psycopg2

## Özellikler
- Veritabanına güvenli bağlantı
- SQL sorguları ile veri çekme
- Veri analizi
- Basit ürün öneri sistemi

## Çalıştırma
python main.p

**Sarya Su Toğyıldız:** ✅ Görev 4 Tamamlandı: Flask API ve Logging

Ürün öneri sisteminin temel API uç noktaları Flask framework'ü ile başarıyla oluşturuldu.

**Gerçekleştirilen Teknik Detaylar:**
- **Framework:** Flask 3.x
- **Logging:** Tüm API trafiği `api_logs.log` dosyasına kaydediliyor.
- **Hata Yönetimi:** Geçersiz istekler için özel 404 JSON yanıtları tanımlandı.
- **Test:** Tarayıcı üzerinden endpoint testleri başarıyla gerçekleştirildi.


---

## 5. Hafta

**İsmail Özdemir:** 

**AbdulKadir Demir:** ✅ Görev 5 Tamamlandı: Model Performansını Artırmak İçin Yeni Özellikler Geliştirildi. 

**Sema Elmahmud:** ✅ Görev 5 Tamamlandı: Proje Sunumu için Veri Görselleştirme ve Raporlama

Bu hafta proje sunumu için veri görselleştirme çalışmaları tamamlandı ve kullanıcı davranışlarını analiz eden grafikler oluşturuldu. Elde edilen sonuçlar düzenlenerek raporlama süreci tamamlandı ve sunuma hazır hale getirildi.

**Elif Babürhan:**  

**Sarya Su Toğyıldız:**  ✅ Görev 5 Tamamlandı: Öneri Algoritmasının Hassasiyet ve Doğruluğunu Artırma

Bu hafta, kişiselleştirilmiş ürün önerileri sunan temel algoritmanın performansını artırmak ve daha isabetli sonuçlar üretmesini sağlamak amacıyla çeşitli optimizasyon teknikleri uygulanmıştır.

###  Uygulanan İyileştirme Teknikleri

#### 1. Özellik Mühendisliği (Feature Engineering)
* **Ağırlıklandırma:** Kullanıcıların ürünlere verdiği puanlar veya tıklama oranları, zaman bazlı bir ağırlıklandırma sistemine (Time Decay) tabi tutularak güncel trendlerin önerilerde daha baskın çıkması sağlandı.
* **Metin Analitiği (TF-IDF):** Ürün kategorileri ve açıklamaları TF-IDF (Term Frequency-Inverse Document Frequency) yöntemiyle vektörleştirilerek içerik tabanlı önerilerin hassasiyeti artırıldı.

#### 2. Benzerlik Metriklerinin Optimizasyonu
* **Cosine Similarity:** Ürünler arasındaki benzerlik hesaplamasında kullanılan metrikler optimize edilerek, sadece kategorik benzerlik değil, kullanıcı davranışsal benzerliği de modele dahil edildi.
* **Veri Normalizasyonu:** Fiyat ve stok bilgileri gibi sayısal veriler normalize edilerek modelin bu özellikler üzerindeki yanlılığı giderildi.

#### 3. Analiz ve İyileştirme Alanları
Yapılan testler sonucunda şu iyileştirme alanları belirlenmiştir:
* **Cold Start Problemi:** Hiç etkileşim almamış ürünler için "Popüler Ürünler" yedeği oluşturularak boş sonuç dönme hatası giderildi.
* **Performans:** Büyük veri setlerinde benzerlik hesaplamalarının yavaşlamaması için matris işlemleri NumPy vektörizasyonu ile optimize edildi.

### 📊 Sonuç
Bu optimizasyonlar neticesinde öneri motorunun isabet oranı (Hit Rate) ve kullanıcı etkileşim tahminleme başarısı gözle görülür bir artış göstermiştir.

---

## 6. Hafta

**İsmail Özdemir:** 

**AbdulKadir Demir:** ✅ Görev 6 Tamamlandı: Modelin performansını değerlendirmek için kullanılan metrikler (kesinlik, doğruluk, F1 skoru vb.) analiz edildi ve sonuçlar raporlandı. 

**Sema Elmahmud:** ✅ Görev 6 Tamamlandı: REST API Tasarımı Ve Belgelendirme

Bu projede, bir ürün öneri sisteminin dış dünya ile iletişimini sağlayan REST API yapısını tasarlayıp JSON formatlarını ve uç noktalarını belirledim. Sistemin güvenliğini JWT ve rol tabanlı yetkilendirme ile sağlarken, yüksek hız ve performans için Redis önbellekleme ve veritabanı indeksleme tekniklerini kullandım.

**Elif Babürhan:**  

**Sarya Su Toğyıldız:**  ✅ Görev 6 Tamamlandı: Dokümantasyon ve Final Kontroller

###  Yapılan Teknik İşlemler

#### 1. Modüler Dokümantasyon Entegrasyonu
Ekip arkadaşlarım tarafından geliştirilen farklı modüller analiz edilerek sistem genelindeki yerleri netleştirilmiştir:
* **Veri Analizi:** Jupyter Notebook üzerindeki veri temizleme süreçleri incelendi.
* **Veritabanı:** PostgreSQL şemasının API ile veri tutarlılığı kontrol edildi.
* **Frontend:** UI entegrasyon planının backend uç noktalarıyla uyumu doğrulandı.

#### 2. API Son Kontrolleri ve Hata Yönetimi
Geliştirilen Flask API üzerinde stres ve hata testleri yapılmıştır:
* **404 Hata Yönetimi:** Geçersiz bir endpoint isteği gönderildiğinde sistemin standart JSON hata mesajı döndüğü teyit edildi.
* **Parametre Kontrolü:** Kullanıcı ve ürün ID'lerinin API tarafından doğru şekilde işlendiği doğrulandı.

#### 3. Logging (Kayıt) Mekanizması Doğrulaması
`api_logs.log` dosyası üzerinden yapılan incelemelerde:
* Her bir API isteğinin zaman damgası (timestamp) ve işlem detayları ile kaydedildiği görüldü.
* Hataların log dosyasına "ERROR" seviyesinde doğru şekilde işlendiği onaylandı.

### 📊 Projenin Güncel Durumu
* **Backend:** Flask tabanlı REST API çalışır durumda.
* **Veri:** Temizlenmiş ve işlenmiş veri seti analizi hazır.
* **Dokümantasyon:** Proje akışı ve haftalık raporlar eksiksiz tamamlandı.

---
