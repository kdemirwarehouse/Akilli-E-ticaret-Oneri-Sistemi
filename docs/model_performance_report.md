# Model Performans Analizi

Bu çalışmada geliştirilen Akıllı E-Ticaret Öneri Sistemi'nin performansı çeşitli makine öğrenmesi metrikleri kullanılarak değerlendirilmiştir. Modelin amacı, kullanıcıların satın alma davranışlarını analiz ederek doğru ürün önerileri sunmaktır.


---


# Kullanılan Metrikler

## Accuracy (Doğruluk)

Accuracy, modelin toplam tahminlerinin ne kadarının doğru olduğunu gösterir.

Örnek:
Model 100 tahminden 90 tanesini doğru yaptıysa accuracy değeri %90 olur.

Bu metrik modelin genel başarısını anlamak için kullanılmıştır.


---


## Precision (Kesinlik)

Precision, modelnin "satın alır" dediği kullanıcıların gerçekten satın alma oranını gösterir.

Yani:
Modelin verdiği pozitif tahminlerin ne kadarının doğru olduğunu ölçer.

Yüksek precision değeri, yanlış önerilerin az olduğunu gösterir.

---

## Recall (Duyarlılık)

Recall, gerçekten satın alma yapan kullanıcıların ne kadarının model tarafından doğru tahmin edildiğini gösterir.

Bu metrik özellikle öneri sistemleri için önemlidir çünkü, potansiyel müşterileri kaçırmamayı hedefler.

---

## F1 Score

F1 score, Precision ve Recall değerlerinin dengeli ortalamasıdır.

Tek başına accuracy yeterli olmadığı için F1 score metriği kullanılmıştır.

Özellikle dengesiz veri setlerinde model performansını daha doğru değerlendirmek için önemlidir.

---

# Model Sonuçları

Model üzerinde yapılan testler sonucunda aşağıdaki değerlere ulaşılmıştır:

| Metrik | Sonuç |
|--------|-------|
| Accuracy | 0.90 |
| Precision | 0.70 |
| Recall | 0.60 |
| F1 Score | 0.64 |

---

# Sonuçların Yorumu

Elde edilen sonuçlara göre model genel olarak başarılı çalışmaktadır.

-Accuracy değerinin yüksek olması modelin çoğu tahmini doğru yaptığını göstermektedir.
-Precision değerinin yüksek olması öneri sisteminin yanlış ürün önerilerini azaltabildiğini göstermektedir.
-Recall değerinin orta seviyede olması bazı potansiyel kullanıcıların hala kaçırıldığını göstermektedir.
-F1 score değeri ise modelin dengeli bir performans sergilediğini göstermektedir.

Model sonuçları değerlendirildiğinde XGBoost algoritmasının Logistic Regression modeline göre daha başarılı sonuç verdiği görülmüştür.

---

# Genel  Başarı Değerlendirmesi

Bu projede kullanıcı davranışlarını analiz eden ve kişiselleştirilmiş ürün önerileri sunabilen bir öneri sistemi geliştirilmiştir.

Sistem:
-PostgreSQL veritabanı ile çalışmaktadır.
-Flask API üzerinden önerileri kullanıcıya sunmaktadır.
-Kullanıcı etkileşimlerini analiz edebilmektedir.
-Öneri doğruluğunu artırmak için benzerlik skorları kullanmaktadır.

Ayrıca proje kapsamında:
-Veri ön işleme
-Eksik veri temizleme
-Özellik Mühendisliği
-API geliştirme
-Logging sistemi
-Performans analizi

başarıyla gerçekleştirilmiştir.

Genel olarak proje, gerçek bir e-ticaret öneri sisteminin temel bileşenlerini başarılı şekilde simüle eden işlevsel bir yapıya sahiptir.
