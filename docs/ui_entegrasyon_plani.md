# 🛒 Kullanıcı Arayüzü Entegrasyon Planı
### Akıllı E-Ticaret Öneri Sistemi

**Hazırlayan:** İsmail Özdemir  
**Tarih:** Nisan 2026  
**Proje:** Akıllı E-Ticaret Öneri Sistemi

---

## 1. Entegrasyon Planı

Ürün öneri sistemi, mevcut e-ticaret platformuna **REST API** aracılığıyla entegre edilecektir. Kullanıcı arayüzü (frontend), backend'e istek gönderir; backend öneri algoritmasını çalıştırır ve sonuçları JSON formatında geri döndürür.

### 1.1 Entegrasyon Mimarisi

```
Kullanıcı Siteye Girer
        ↓
Frontend (HTML/CSS/JS)
        ↓
Flask REST API'ye İstek Gönderilir
        ↓
Öneri Algoritması Çalışır (Scikit-learn)
        ↓
PostgreSQL'den Veriler Çekilir
        ↓
JSON Formatında Sonuçlar Döner
        ↓
Kullanıcıya Öneriler Gösterilir
```

### 1.2 Kullanılacak Teknolojiler

| Katman | Teknoloji | Görev |
|--------|-----------|-------|
| Frontend | HTML, CSS, JavaScript | Kullanıcı arayüzü |
| Backend | Flask (Python) | REST API |
| Veritabanı | PostgreSQL | Veri depolama |
| Algoritma | Scikit-learn | Öneri üretme |

---

## 2. Önerilerin Görüntüleneceği Yerler

### 2.1 🏠 Ana Sayfa
- **Konum:** Sayfa ortasında "Size Özel Ürünler" bölümü
- **İçerik:** Kullanıcının geçmiş alışverişlerine göre 8 ürün önerisi
- **Görünüm:** Yatay kaydırmalı ürün kartları
- **Başlık:** "Sizin İçin Seçtik"

### 2.2 📦 Ürün Detay Sayfası
- **Konum:** Ürün açıklamasının altında
- **İçerik:** "Bunu Alanlar Şunu da Aldı" — 4 benzer ürün
- **Görünüm:** 2x2 ızgara (grid) düzeni
- **Başlık:** "Benzer Ürünler"

### 2.3 🛒 Sepet Sayfası
- **Konum:** Sepet listesinin sağında veya altında
- **İçerik:** Sepetteki ürünlerle uyumlu 4 ürün önerisi
- **Görünüm:** "Sepetinizi Tamamlayın" başlıklı yan panel
- **Başlık:** "Bunları da Beğenebilirsiniz"

### 2.4 🔍 Arama Sonuçları Sayfası
- **Konum:** Sonuç listesinin en üstünde
- **İçerik:** Arama geçmişine göre kişiselleştirilmiş 4 ürün
- **Görünüm:** Yatay banner bölümü
- **Başlık:** "Aradıklarınızla İlgili"

---

## 3. Kullanıcı Etkileşim Takibi

### 3.1 Takip Edilecek Olaylar (Events)

| Olay | Açıklama | Önemi |
|------|----------|-------|
| Ürün Tıklama | Kullanıcı ürüne tıkladı | İlgi tespiti |
| Sepete Ekleme | Ürün sepete eklendi | Satın alma niyeti |
| Satın Alma | Sipariş tamamlandı | Kesin tercih |
| Arama Yapma | Kullanıcı arama yaptı | İlgi alanı tespiti |
| Sayfada Geçirilen Süre | Kullanıcı sayfada ne kadar kaldı | İlgi derinliği |
| Öneri Tıklama | Önerilen ürüne tıklandı | Öneri başarısı |

### 3.2 Kullanılacak Araçlar

- **Google Analytics 4:** Genel kullanıcı davranışı takibi
- **Özel Event Logging:** Her tıklama PostgreSQL veritabanına kaydedilir
- **Session Tracking:** Kullanıcı oturumu boyunca davranış izlenir

### 3.3 Veri Akışı

```
Kullanıcı Bir Ürüne Tıklar
        ↓
JavaScript Event Tetiklenir
        ↓
Flask API'ye POST İsteği Gönderilir
        ↓
Olay PostgreSQL'e Kaydedilir
        ↓
Öneri Algoritması Güncellenir
        ↓
Bir Sonraki Ziyarette Daha İyi Öneriler Sunulur
```

---

## 4. A/B Testi Stratejisi

### 4.1 A/B Testi Nedir?

Kullanıcıları iki gruba ayırarak farklı arayüz versiyonlarını test etme yöntemidir. Hangi versiyonun daha iyi sonuç verdiği ölçülür ve kazanan versiyon tüm kullanıcılara açılır.

### 4.2 Test Senaryoları

#### 🧪 Test 1 — Öneri Konumu
| | Grup A | Grup B |
|-|--------|--------|
| **Gösterim** | Öneriler ürün sayfasının altında | Öneriler ürün sayfasının sağında |
| **Ölçüt** | Hangi konumda daha fazla tıklama alınıyor? | |

#### 🧪 Test 2 — Öneri Sayısı
| | Grup A | Grup B |
|-|--------|--------|
| **Gösterim** | 4 ürün önerisi | 8 ürün önerisi |
| **Ölçüt** | Hangi sayıda daha fazla satın alma oluyor? | |

#### 🧪 Test 3 — Öneri Başlığı
| | Grup A | Grup B |
|-|--------|--------|
| **Gösterim** | "Benzer Ürünler" başlığı | "Sizin İçin Seçtik" başlığı |
| **Ölçüt** | Hangi başlık daha fazla tıklama alıyor? | |

### 4.3 Test Süreci

1. Kullanıcılar rastgele iki gruba ayrılır
2. Her grup farklı versiyon görür
3. 2 hafta boyunca veri toplanır
4. Sonuçlar karşılaştırılır
5. Başarılı versiyon tüm kullanıcılara açılır

### 4.4 Başarı Kriterleri

| Metrik | Hedef |
|--------|-------|
| Tıklama Oranı (CTR) | %5 artış |
| Dönüşüm Oranı | %3 artış |
| Ortalama Sipariş Değeri | %10 artış |
| Öneri Tıklama Oranı | %8 artış |

---

## 5. Zaman Planı

| Hafta | Yapılacak İş |
|-------|-------------|
| 1. Hafta | Entegrasyon planı hazırlandı ✅ |
| 2. Hafta | API bağlantıları kurulacak |
| 3. Hafta | Arayüz bileşenleri eklenecek |
| 4. Hafta | A/B testleri başlatılacak |
| 5. Hafta | Sonuçlar analiz edilecek |

---

*Hazırlayan: İsmail Özdemir*  
*Proje: Akıllı E-Ticaret Öneri Sistemi*  
*Tarih: Nisan 2026*
