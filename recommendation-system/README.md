# Recommendation System (Öneri Sistemi)

Akıllı E-Ticaret Öneri Sistemi projesi kapsamında geliştirilen ürün öneri modülüdür. Amazon Product Reviews veri seti üzerinde çalışmaktadır.

## Klasör Yapısı

- **docs/** — Araştırma raporları ve teknik dokümanlar
  - `oneri_algoritmasi_arastirma_raporu.md` — Farklı öneri algoritmalarının karşılaştırmalı analizi, değerlendirme matrisi ve algoritma seçim gerekçesi
- **notebooks/** — Jupyter notebook'ları
  - `recommendation-system-with-amazon.ipynb` — Item-Based CF ve içerik tabanlı (TF-IDF / CountVectorizer) öneri sistemlerinin uygulaması ve performans değerlendirmesi

## Uygulanan Yöntemler

- **Item-Based Collaborative Filtering:** Pearson korelasyonu ile ürün-ürün benzerlik matrisi
- **İçerik Tabanlı Filtreleme (TF-IDF):** Ürün yorumlarından oluşturulan metin profilleri üzerinden cosine similarity
- **İçerik Tabanlı Filtreleme (CountVectorizer):** Karşılaştırma amacıyla alternatif vektörleştirme

## Veri Seti

[Amazon Product Reviews](https://www.kaggle.com/datasets/arhamrumi/amazon-product-reviews) — Kullanıcı yorumları, puanlamalar ve ürün bilgileri içeren veri seti.

## Gereksinimler

```
numpy, pandas, scikit-learn, matplotlib, seaborn
```
