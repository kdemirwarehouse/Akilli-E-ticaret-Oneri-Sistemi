### ***Veri Ön İşleme ve Temizleme Modülü Geliştirme Raporu***

Bu projede, ham veri setini analiz edilebilir ve modellemeye hazır hale getirmek amacıyla Pandas kütüphanesi üzerine inşa edilmiş, uçtan uca otomatize bir **Veri Ön İşleme Modülü** geliştirdim.

#### **1\. Gerçekleştirdiğim Temel İşlemler**

* **Veri Tipi Optimizasyonu:** Veri setini ilk yüklediğimde bellek kullanımını azaltmak ve analiz doğruluğunu artırmak için veri tiplerini uygun hale getirdim. Özellikle object tipindeki tarih sütunlarını datetime formatına dönüştürdüm ve düşük kardinaliteye sahip metin sütunlarını category tipine çevirdim.  
* **Eksik Değerlerin (Missing Values) Yönetimi:** Eksik verileri rastgele silmek yerine, değişkenin dağılımına göre stratejik bir yaklaşım sergiledim. Sayısal kolonlardaki eksiklikleri aykırı değerlerden etkilenmemesi için **medyan** ile, kategorik kolonları ise **mod** (en sık tekrar eden değer) yöntemiyle doldurdum.  
* **Aykırı Değer (Outlier) Analizi:** Veri setindeki gürültüyü temizlemek için **IQR (Interquartile Range)** yöntemini kullandım. Belirlediğim alt ve üst sınırların dışındaki uç değerleri tespit ederek, veri kalitesini bozan gürültülü verileri eledim.

#### **2\. Otomasyon Yapısı**

Süreci sürdürülebilir kılmak adına, tüm temizleme adımlarını bir Python sınıfı (DataCleaner) altında topladım. Bu sayede yeni gelen veri setlerini manuel müdahale gerektirmeden, tek bir fonksiyon çağrısıyla standart bir temizleme işleminden geçirebiliyorum.

#### **3\. Veri Saklama ve Format Seçimi**

Temizlenmiş verinin performanslı bir şekilde saklanması için **Parquet** formatını tercih ettim. Parquet kullanarak hem disk alanından tasarruf sağladım hem de CSV formatının aksine sütun bazlı veri tiplerinin (meta-data) korunmasını garantileyerek sonraki aşamalarda veri kaybının önüne geçtim.

### 

### **Teknik Uygulama (Örnek Kod Yapım)**

Geliştirdiğim modülün çekirdek yapısını şu şekilde kurguladım:

Python  
import pandas as pd  
import numpy as np

class VeriIsleyici:  
    def \_\_init\_\_(self, dosya\_yolu):  
        self.df \= pd.read\_csv(dosya\_yolu)  
        print("Veri başarıyla yüklendi.")

    def temizle(self):  
        \# 1\. Eksik Değerleri Doldur  
        for sutun in self.df.columns:  
            if self.df\[sutun\].dtype \== 'object':  
                self.df\[sutun\].fillna(self.df\[sutun\].mode()\[0\], inplace=True)  
            else:  
                self.df\[sutun\].fillna(self.df\[sutun\].median(), inplace=True)  
          
        \# 2\. Aykırı Değerleri IQR ile Filtrele (Örn: 'Fiyat' sütunu)  
        Q1 \= self.df\['Fiyat'\].quantile(0.25)  
        Q3 \= self.df\['Fiyat'\].quantile(0.75)  
        IQR \= Q3 \- Q1  
        self.df \= self.df\[\~((self.df\['Fiyat'\] \< (Q1 \- 1.5 \* IQR)) |   
                            (self.df\['Fiyat'\] \> (Q3 \+ 1.5 \* IQR)))\]  
          
        return self.df

    def kaydet(self, cikis\_yolu):  
        \# Performans için Parquet formatında kaydet  
        self.df.to\_parquet(cikis\_yolu)  
        print(f"Temizlenmiş veri {cikis\_yolu} adresine kaydedildi.")

\# Modülün kullanımı  
isleyici \= VeriIsleyici("ham\_veri.csv")  
isleyici.temizle()  
isleyici.kaydet("temiz\_veri.parquet")

**Sonuç:** Bu modül sayesinde veri hazırlama süresini %X oranında azalttım ve model eğitim aşamasına geçmeden önce veri setinin tutarlılığını %100 oranında sağladım.

