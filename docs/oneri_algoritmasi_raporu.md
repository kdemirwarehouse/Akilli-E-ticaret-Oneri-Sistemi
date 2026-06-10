# Öneri Algoritması Araştırması ve Değerlendirme Raporu

**Proje:** Akıllı E-Ticaret Öneri Sistemi  
**Hazırlayan:** Abdulkadir Demir  
**Tarih:** 9 Nisan 2026  
**Veri Seti:** Amazon Product Reviews Dataset

---

## 1. Giriş

Bu rapor, akıllı e-ticaret öneri sistemi projesi kapsamında farklı öneri algoritmalarının araştırılması, karşılaştırılması ve proje gereksinimlerine en uygun algoritmanın belirlenmesi amacıyla hazırlanmıştır. Mevcut projemizde Amazon ürün yorumları veri seti (Reviews.csv) üzerinden kullanıcı-ürün etkileşim verisi ile item-based collaborative filtering yaklaşımı uygulanmaktadır. Bu rapor, mevcut altyapıya ek olarak içerik tabanlı bir öneri katmanı eklenmesi için algoritma seçimi ve değerlendirmesini ele almaktadır.

### 1.1 Mevcut Sistem Özeti

Mevcut notebook'ta şu adımlar gerçekleştirilmiştir:

- Veri keşfi ve ön işleme (EDA, outlier tespiti, kullanıcı/ürün filtreleme)
- Aktif kullanıcı filtrelemesi (en az 5 yorum yapan)
- Popüler ürün filtrelemesi (en az 10 yorum alan)
- User-Item matrisi oluşturma (pivot table: UserId × ProductId → Score)
- Item similarity matrisi (Pearson korelasyonu ile)
- `recommend_products()` ve `recommend_for_user()` fonksiyonları ile item-based collaborative filtering

---

## 2. Öneri Algoritması Türleri

### 2.1 İşbirlikçi Filtreleme (Collaborative Filtering)

İşbirlikçi filtreleme, kullanıcıların geçmiş davranışlarına ve benzer kullanıcıların tercihlerine dayanarak önerilerde bulunur.

**Kullanıcı Tabanlı (User-Based CF):** Hedef kullanıcıya benzer davranış gösteren diğer kullanıcıları bulur ve onların beğendiği ancak hedef kullanıcının henüz etkileşime girmediği ürünleri önerir. Benzerlik hesaplamasında cosine similarity, Pearson korelasyonu veya Jaccard benzerliği kullanılır.

**Ürün Tabanlı (Item-Based CF):** Kullanıcının daha önce etkileşime girdiği ürünlere benzer ürünleri önerir. Mevcut projemizde bu yaklaşım `user_item_matrix.corr()` ile uygulanmaktadır. Amazon'un "Bu ürünü alan müşteriler şunları da aldı" özelliği bu yaklaşımın klasik örneğidir.

| Tür | Avantajlar | Dezavantajlar |
|---|---|---|
| Genel | Alan bilgisi gerektirmez | Soğuk başlangıç problemi (yeni kullanıcı/ürün) |
| Genel | Beklenmedik keşifler üretebilir (serendipity) | Seyreklik problemi (sparse matrix) |
| Genel | Kullanıcı tercihleri değiştikçe adapte olur | Ölçeklenebilirlik sorunları |
| User-Based | Kişiselleştirme güçlü | Kullanıcı sayısı arttıkça yavaşlar |
| Item-Based | Ürün benzerliği daha stabil | Yeni ürünler için veri gerekli |

**Projemizdeki durumu:** Item-Based CF halihazırda uygulanmaktadır. Pearson korelasyonu ile ürün-ürün benzerlik matrisi oluşturulmuş ve her kullanıcı için etkileşim verdiği ürünlere benzer ürünler önerilmektedir.

---

### 2.2 İçerik Tabanlı Filtreleme (Content-Based Filtering)

İçerik tabanlı filtreleme, ürünlerin özelliklerine (açıklama, kategori, fiyat vb.) dayanarak benzer ürünleri önerir.

**Çalışma Prensibi:** Ürün açıklamaları veya yorumları TF-IDF ya da CountVectorizer ile vektörleştirilir, ardından cosine similarity ile ürünler arasındaki benzerlik hesaplanır.

**Projemize uygunluğu:** Amazon veri setimizde `Text` (yorum metni) ve `Summary` (yorum özeti) sütunları bulunmaktadır. Her ürün için tüm yorumlar birleştirilerek bir "ürün profili" oluşturulabilir ve bu profil üzerinden TF-IDF vektörleştirme yapılabilir.

| Avantajlar | Dezavantajlar |
|---|---|
| Yeni ürünler bile özellikleri bilindiğinde önerilebilir | Aşırı uzmanlaşma (over-specialization) riski |
| Önerilerin nedeni kolayca açıklanabilir | Kaliteli metin/özellik verisi gerektirir |
| Diğer kullanıcı verisine bağımlılık yok | Yeni kullanıcı soğuk başlangıcı devam eder |
| Niş ürünlerin keşfini kolaylaştırır | Özellik mühendisliği çabası gerekir |

---

### 2.3 Hibrit Yaklaşımlar (Hybrid Methods)

Hibrit yaklaşımlar, işbirlikçi ve içerik tabanlı filtrelemeyi birleştirir:

**Ağırlıklı Hibrit:** Her iki yöntemin çıktıları belirli ağırlıklarla birleştirilir. Örneğin: `final_score = α × CF_score + (1-α) × CB_score`

**Geçişli (Switching) Hibrit:** Duruma göre algoritmalar arasında geçiş yapılır. Yeni kullanıcılar için içerik tabanlı, mevcut kullanıcılar için işbirlikçi filtreleme.

**Basamaklı (Cascade) Hibrit:** Bir yöntemin çıktısı diğerinin girdisi olarak kullanılır.

**Özellik Birleştirme:** İşbirlikçi filtrelemenin çıktısı, içerik tabanlı modele ek özellik olarak eklenir.

| Avantajlar | Dezavantajlar |
|---|---|
| Her iki yöntemin güçlü yönlerini birleştirir | Tasarım ve uygulama karmaşıklığı yüksek |
| Soğuk başlangıcı daha iyi yönetir | Parametre ayarlaması (α ağırlığı) zor |
| Daha yüksek doğruluk potansiyeli | Hesaplama maliyeti daha yüksek |

---

### 2.4 Matris Çarpanlarına Ayırma (Matrix Factorization)

SVD (Singular Value Decomposition), NMF (Non-negative Matrix Factorization) ve ALS (Alternating Least Squares) gibi yöntemler, kullanıcı-ürün etkileşim matrisini düşük boyutlu gizli faktör matrislerine ayrıştırır.

| Avantajlar | Dezavantajlar |
|---|---|
| Seyrek matrislerde etkili, gizli kalıpları keşfeder | Gizli faktörlerin yorumlanması zor |
| Ölçeklenebilir (özellikle ALS ile) | Soğuk başlangıç problemi devam eder |
| Boyut indirgeme ile gürültüyü azaltır | Yeni veri gelince yeniden eğitim gerekir |

---

### 2.5 Derin Öğrenme Tabanlı Yaklaşımlar

**Neural Collaborative Filtering (NCF):** Matris çarpanlarına ayırmayı sinir ağları ile genelleştirir; doğrusal olmayan kullanıcı-ürün etkileşimlerini öğrenebilir.

**Autoencoder Tabanlı:** Kullanıcı-ürün vektörünü sıkıştırıp yeniden oluşturarak eksik etkileşimleri tahmin eder.

**Sequence-Aware (GRU4Rec, Transformer):** Oturum bazlı öneriler üretir.

| Avantajlar | Dezavantajlar |
|---|---|
| Karmaşık doğrusal olmayan ilişkileri modeller | Büyük miktarda eğitim verisi gerekir |
| Çoklu veri kaynağını birleştirebilir | Eğitim süresi ve hesaplama maliyeti yüksek |
| Oturum bazlı önerilerde başarılı | Model açıklanabilirliği düşük (kara kutu) |

---

## 3. Değerlendirme Matrisi

Aşağıdaki tablo, her bir algoritma türünü proje gereksinimleri açısından karşılaştırmaktadır. Puanlama: 1 (düşük) – 5 (yüksek).

| Kriter | İşbirlikçi Filtreleme (Item-Based) | İçerik Tabanlı (TF-IDF) | Hibrit | Matris Çarpanlarına Ayırma | Derin Öğrenme |
|---|---|---|---|---|---|
| **Uygulama Kolaylığı** | 4 *(zaten mevcut)* | 4 | 2 | 3 | 1 |
| **Soğuk Başlangıç Yönetimi** | 1 | 4 | 4 | 1 | 2 |
| **Ölçeklenebilirlik** | 2 | 4 | 3 | 4 | 5 |
| **Doğruluk Potansiyeli** | 3 | 3 | 5 | 4 | 5 |
| **Açıklanabilirlik** | 3 | 5 | 3 | 2 | 1 |
| **Veri Gereksinimi** | 4 *(çok etkileşim)* | 2 *(metin yeterli)* | 3 | 4 | 5 |
| **Scikit-learn Uyumluluğu** | 4 | 5 | 3 | 4 | 1 |
| **Mevcut Projeye Entegrasyon** | 5 *(zaten var)* | 5 | 3 | 3 | 2 |
| **TOPLAM** | **26** | **32** | **26** | **25** | **22** |

---

## 4. Performans Metrikleri ve Test Yöntemleri

### 4.1 Doğruluk Metrikleri

**Precision@K:** Önerilen K ürün içinde kullanıcının gerçekten beğendiği ürünlerin oranı. Projemizde "beğenme" eşiği olarak Score ≥ 4 kullanılabilir.

**Recall@K:** Kullanıcının beğendiği tüm ürünler içinde sistemin yakalayabildiği oran.

**F1@K:** Precision ve Recall'ın harmonik ortalaması.

**NDCG@K (Normalized Discounted Cumulative Gain):** Önerilerin sıralamasını dikkate alır; üst sıralardaki doğru öneriler daha fazla puan alır.

**MAP (Mean Average Precision):** Tüm kullanıcılar üzerinden ortalama kesinlik.

### 4.2 Çeşitlilik ve Kapsama Metrikleri

**Katalog Kapsamı (Coverage):** Sistemin önerebileceği benzersiz ürünlerin toplam kataloğa oranı.

**Çeşitlilik (Diversity):** Bir kullanıcıya önerilen ürünler arasındaki ortalama farklılık.

### 4.3 Offline Test Yöntemleri

**Hold-Out Doğrulama:** Veri setinin %80'i eğitim, %20'si test olarak ayrılır. Basit ve hızlıdır.

**K-Fold Çapraz Doğrulama:** Veri K parçaya bölünür, her seferinde bir parça test seti olarak kullanılır. Daha güvenilir sonuçlar verir.

**Leave-One-Out:** Her kullanıcı için bir etkileşim test amaçlı ayrılır. Küçük veri setlerinde doğrudur ancak hesaplama maliyeti yüksektir.

**A/B Testi (Online):** Gerçek kullanıcılar üzerinde farklı algoritmalar karşılaştırılır. Canlı ortam gerektirir.

---

## 5. Proje İçin Algoritma Seçimi ve Gerekçe

### 5.1 Mevcut Durum: Item-Based Collaborative Filtering ✅

Projede halihazırda Pearson korelasyonu tabanlı item-based CF uygulanmaktadır. Bu yöntem, yeterli etkileşim verisi olan ürünler ve kullanıcılar için iyi çalışmaktadır.

### 5.2 Eklenmesi Gereken: İçerik Tabanlı Filtreleme (TF-IDF)

Değerlendirme matrisinde en yüksek puanı alan içerik tabanlı filtreleme, mevcut sisteme ek olarak uygulanmalıdır. Gerekçeler:

**Veri seti uygunluğu:** Amazon Reviews veri setinde `Text` ve `Summary` sütunları mevcuttur. Her ürün için yorumlar birleştirilerek zengin bir metin profili oluşturulabilir. Bu profil TF-IDF ile vektörleştirilerek ürün-ürün benzerliği hesaplanabilir.

**Soğuk başlangıç çözümü:** Item-based CF, yeni ürünler için yeterli etkileşim verisi olmadığında çalışamaz. İçerik tabanlı yaklaşım, ürünün yorum metni bilindiği sürece öneri üretebilir.

**Scikit-learn uyumluluğu:** `TfidfVectorizer` ve `CountVectorizer` doğrudan scikit-learn'de mevcuttur.

**Mevcut sisteme kolay entegrasyon:** İçerik tabanlı benzerlik matrisi, mevcut `item_similarity` matrisinin yanına ek bir benzerlik katmanı olarak eklenebilir.

### 5.3 Uygulama Planı

1. Her ürün için yorum metinlerini birleştirerek "ürün profili" oluştur
2. TF-IDF vektörleştirme uygula
3. Cosine Similarity ile içerik tabanlı benzerlik matrisi hesapla
4. Mevcut CF sonuçlarıyla karşılaştır
5. Performans metriklerini (Precision@K, Recall@K, F1@K) hesapla

### 5.4 Gelecek Aşama Önerisi

Sistem olgunlaştıkça, CF ve içerik tabanlı sonuçları birleştiren **ağırlıklı hibrit yaklaşıma** geçiş yapılması önerilir:

```
final_score = α × CF_score + (1 - α) × CB_score
```

Burada α parametresi A/B testi veya çapraz doğrulama ile optimize edilebilir.

---

## 6. Sonuç

Bu raporda beş ana öneri algoritması türü detaylı olarak incelenmiştir. Değerlendirme matrisi ve proje gereksinimleri doğrultusunda, mevcut item-based CF sistemine ek olarak **içerik tabanlı filtreleme (TF-IDF)** algoritmasının uygulanmasına karar verilmiştir. Performans değerlendirmesi için Precision@K, Recall@K, F1@K metrikleri ile hold-out doğrulama yöntemi kullanılacaktır.

---

## Referanslar

- Ricci, F., Rokach, L., & Shapira, B. (2015). *Recommender Systems Handbook*, Springer.
- Aggarwal, C. C. (2016). *Recommender Systems: The Textbook*, Springer.
- Koren, Y., Bell, R., & Volinsky, C. (2009). Matrix Factorization Techniques for Recommender Systems. *IEEE Computer*, 42(8), 30-37.
- Scikit-learn Documentation: https://scikit-learn.org/stable/
- Amazon Product Reviews Dataset: https://www.kaggle.com/datasets/arhamrumi/amazon-product-reviews
