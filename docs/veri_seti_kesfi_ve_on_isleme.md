##### **Veri Seti Keşfi ve Ön İşleme Planlaması**

Bu çalışmada e-ticaret sistemine ait veri setleri incelenecek. Veri setinde müşteri bilgileri, ürün özellikleri ve satış geçmişi gibi farklı türde veriler bulunmalı. Bu verilerin analiz edilebilmesi için öncelikle veri keşfi ve ön işleme adımları uygulanacak.

1\. Veri Setini Tanıma

İlk olarak veri setinin genel yapısını anlamak için bazı temel Pandas komutları kullanılmıştır.  
 **\-** df.head() ile verinin ilk satırlarına bakıldı.  
 `-` df.info() ile veri tipleri ve eksik değerler incelendi.  
 **\-** df.describe() ile sayısal değerlerin ortalama, minimum ve maksimum değerleri görüldü.  
Bu aşamada bazı sütunlarda eksik değerler olduğu ve bazı veri tiplerinin yanlış olduğu fark edildi.

2\. Veri Kalitesi Kontrolü

Verinin ne kadar düzgün olduğunu anlamak için bazı kontroller yapıldı.

  **\-** df.isnull().sum() ile eksik veriler sayıldı  
  **\-**  value\_counts() ile kategorik verilerin dağılımına bakıldı    
Ayrıca bazı sayısal değerlerde çok büyük ya da çok küçük değerler olduğu görüldü. Bunların aykırı değer olabileceği düşünüldü.

### 3\. Veri Temizleme

Veri setini daha kullanışlı hale getirmek için temizleme işlemleri yapıldı.

* Eksik veriler için bazı sütunlarda ortalama değer kullanıldı:

  df\["yas"\].fillna(df\["yas"\].mean(), inplace=True)

* Çok fazla eksik veri içeren satırlar silindi:

df.dropna(inplace=True)

* Tekrarlayan veriler kaldırıldı:

df.drop\_duplicates(inplace=True)

* Gerekli yerlerde veri tipleri düzeltildi:

df\["tarih"\] \= pd.to\_datetime(df\["tarih"\])

### **4\. Veri Dönüştürme**

Makine öğrenmesi modellerinde kullanılabilmesi için bazı dönüşümler yapıldı.

* Kategorik veriler sayısal hale getirildi:

pd.get\_dummies(df)

* Tarih verileri düzenlendi ve analiz edilebilir hale getirildi  
* Gerekli durumlarda veriler ölçeklendirildi 

5\. Veri Birleştirme

Farklı veri setleri bir araya getirildi. Örneğin müşteri ve sipariş verileri birleştirildi:  
df \= pd.merge(musteri\_df, siparis\_df, on="musteri\_id")

6\. Son Kontroller

Tüm işlemler bittikten sonra veri tekrar kontrol edildi:  
 **\-** df.info() ile son durum incelendi  
 **\-** df.describe() ile değerlerin mantıklı olup olmadığına bakıldı  
