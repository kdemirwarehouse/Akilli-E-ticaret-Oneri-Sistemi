# Software Requirements Specification (SRS)

## Smart E-Commerce Recommendation System

**Course:** Software Engineering  
**Document Type:** Software Requirements Specification  
**Version:** 1.0  
**Year:** 2026


# Table of Contents

1. Purpose  
2. Scope  
3. Intended Audience  
4. Project Overview  
5. Stakeholders  
6. Business Requirements  
7. Functional Requirements  
8. Non-Functional Requirements  
9. Technical Requirements  
10. Data Requirements  
11. Use Case Scenarios  
12. Acceptance Criteria  
13. Assumptions and Constraints  
14. Use Case Diagrams  


# Glossary

|Terim|Açıklama|
|---|---|
|Recommendation System|Kullanıcı davranışlarını analiz ederek ürün önerileri üreten sistem|
|User Behavior|Kullanıcının web sitesi içindeki gezinme ve etkileşim hareketleri|
|Bounce Rate|Kullanıcının tek sayfa görüntüleyip siteden ayrılma oranı|
|Exit Rate|Belirli bir sayfadan sonra siteden çıkma oranı|
|Machine Learning|Verilerden öğrenerek tahmin veya öneri üreten algoritmalar|


# Purpose

Bu dokümanın amacı, müşteri davranışlarını analiz ederek kişiselleştirilmiş ürün önerileri sunan bir akıllı e-ticaret öneri sistemi için gereksinimleri tanımlamaktır. Sistem, kullanıcının sitede gezinme hareketlerini inceleyerek ilgi alanlarını anlamaya çalışacak ve buna göre uygun ürün önerileri üretecektir.


# Scope

Sistem, kullanıcıların e-ticaret sitesindeki davranışlarını kullanarak öneri üretmeyi hedeflemektedir. Davranış verileri arasında yönetsel sayfa ziyaretleri, bilgilendirme sayfaları, ürün sayfaları, sayfalarda geçirilen süre, çıkış oranları, hafta sonu ziyareti, ziyaretçi tipi, tarayıcı ve trafik türü gibi değişkenler yer almaktadır.

Bu proje kapsamında sistemin:

- kullanıcı davranış verilerini alması  
- bu verileri analiz etmesi  
- kullanıcı eğilimini yorumlaması  
- satın alma eğilimine göre öneri üretmesi  
- sonuçları kullanıcıya göstermesi  


# Intended Audience

Bu doküman:

- online müşteriler  
- sürekli ziyaret eden online müşteriler  
- yeni ziyaretçiler  
- e-ticaret platformu kullanıcıları  

için hazırlanmıştır.


# Project Overview

Bu sistemin temel amacı, kullanıcının site içindeki hareketlerini yorumlayarak ona daha uygun ürünler önermektir.

Kullanıcının özellikle ürün sayfalarında geçirdiği süre, ürünle ilgili sayfa sayısı, bilgilendirici içeriklere ilgisi, sayfadan çıkış davranışı ve ziyaret zamanı gibi bilgiler öneri mekanizmasında kullanılacaktır.

Proje bir öğrenci çalışması olduğundan sistem şu düzeyde ele alınacaktır:

- temel kullanıcı davranışı analizi  
- basit ya da orta düzey öneri mantığı  
- veri odaklı karar verme yaklaşımı  
- teknik gereksinimlerin belgelendirilmesi  


# Stakeholders

|Stakeholder ID|Açıklama|
|---|---|
|SH1|Sistemi kullanan çevrim içi alıcı|
|SH2|Projeyi geliştiren öğrenci ekibi|
|SH3|Dersi değerlendiren öğretim elemanı|
|SH4|Sistemin veri ve model kısmını hazırlayan geliştirici öğrenci|
|SH5|Arayüz ve API kısmını geliştiren geliştirici öğrenci|


# Business Requirements

Bu bölüm, projenin hangi hedeflere ulaşmayı amaçladığını açıklar.

|ID|Gereksinim|
|---|---|
|BR1|Kullanıcının ilgi duyabileceği ürünleri daha görünür hale getirmek|
|BR2|Kullanıcı deneyimini daha kişisel ve daha akıcı hale getirmek|
|BR3|Kullanıcının sitede geçirdiği süreyi artırmak|
|BR4|Kullanıcının satın alma olasılığı yüksek ürünlere yönlendirilmesini sağlamak|
|BR5|Öğrenci projesi kapsamında veri analizi, öneri sistemi mantığı ve gereksinim belgelemesini göstermek|


# Functional Requirements

Bu bölüm, sistemin ne yapması gerektiğini açıklar.

|ID|Gereksinim|
|---|---|
|FR1|Sistem, kullanıcının ziyaret ettiği sayfa türlerini kaydetmelidir|
|FR2|Sistem, kullanıcının administrative, informational ve product-related sayfalarda geçirdiği süreyi analiz etmelidir|
|FR3|Sistem, kullanıcının ürün sayfalarına olan ilgisini ProductRelated ve ProductRelated_Duration değişkenleri üzerinden değerlendirmelidir|
|FR4|Sistem, BounceRates ve ExitRates verilerini kullanarak kullanıcının siteden ayrılma eğilimini analiz etmelidir|
|FR5|Sistem, PageValues verisini kullanarak kullanıcının satın alma sürecine ne kadar yaklaştığını yorumlamalıdır|
|FR6|Sistem, SpecialDay ve Month bilgilerini kullanarak kullanıcının özel günlere bağlı alışveriş eğilimini değerlendirmelidir|
|FR7|Sistem, VisitorType verisini kullanarak yeni ve geri dönen kullanıcıları ayırt etmelidir|
|FR8|Sistem, Weekend bilgisini kullanarak ziyaretin hafta içi mi hafta sonu mu gerçekleştiğini dikkate almalıdır|
|FR9|Sistem, OperatingSystems ve Browser verilerini kullanarak kullanıcı oturum bilgisini destekleyici bağlam olarak değerlendirmelidir|
|FR10|Sistem, TrafficType verisini kullanarak kullanıcının siteye geliş kanalını analiz etmelidir|
|FR11|Sistem, Region verisini kullanarak bölgesel farklılıkları analiz edebilmelidir|
|FR12|Sistem, kullanıcının davranışlarına göre kişiselleştirilmiş ürün önerileri üretmelidir|
|FR13|Sistem, önerilen ürünleri kullanıcı arayüzünde göstermelidir|
|FR14|Sistem, satın alma gerçekleşip gerçekleşmediğini Revenue değişkeni ile etiket olarak kullanabilmelidir|
|FR15|Sistem, yeterli veri olmayan kullanıcılar için genel/popüler öneriler sunabilmelidir|


# Non-Functional Requirements

|ID|Gereksinim|
|---|---|
|NFR1|Sistem önerileri kısa sürede oluşturmalıdır|
|NFR2|Sistem öğrenci projesi düzeyinde anlaşılır ve test edilebilir bir yapıda olmalıdır|
|NFR3|Sistem modüler bir mimari ile tasarlanmalıdır|
|NFR4|Sistem yeni özellikler eklenebilecek şekilde geliştirilebilir olmalıdır|
|NFR5|Sistem kullanıcıya önerileri anlaşılır biçimde sunmalıdır|
|NFR6|Sistem hatalı veya eksik veri durumlarında tamamen çökmeden çalışabilmelidir|
|NFR7|Sistem veri güvenliği açısından örnek proje düzeyinde dikkatli veri kullanımı yaklaşımına sahip olmalıdır|
|NFR8|Sistem farklı veri kümeleriyle test edilebilir yapıda olmalıdır|


# Technical Requirements

|ID|Gereksinim|
|---|---|
|TR1|Sistem kullanıcı davranış verilerini CSV veya veri tabanı kaynağından okuyabilmelidir|
|TR2|Sistem veri ön işleme adımlarını desteklemelidir|
|TR3|Sistem kategorik ve sayısal değişkenleri işleyebilmelidir|
|TR4|Sistem öneri üretimi için kural tabanlı veya makine öğrenmesi tabanlı yapı kullanabilmelidir|
|TR5|Sistem öneri sonuçlarını bir arayüz veya API üzerinden sunabilmelidir|
|TR6|Sistem Revenue etiketine göre kullanıcı eğilimini analiz edebilmelidir|
|TR7|Sistem geliştiricilerin rahatça test edebileceği dosya yapısına sahip olmalıdır|
|TR8|Sistem veri analizi, modelleme ve arayüz katmanlarını birbirinden ayırmalıdır|


# Data Requirements

Bu bölüm sistemde kullanılacak müşteri davranışı değişkenlerini açıklar.

|Feature|Açıklama|
|---|---|
|Administrative|Kullanıcının ziyaret ettiği yönetimsel sayfa sayısı|
|Administrative_Duration|Kullanıcının bu sayfalarda geçirdiği süre|
|Informational|Kullanıcının ziyaret ettiği bilgilendirici sayfa sayısı|
|Informational_Duration|Kullanıcının bu sayfalarda geçirdiği süre|
|ProductRelated|Kullanıcının ziyaret ettiği ürünle ilgili sayfa sayısı|
|ProductRelated_Duration|Kullanıcının ürünle ilgili sayfalarda geçirdiği süre|
|BounceRates|Kullanıcının giriş yaptığı sayfadan başka etkileşim olmadan ayrılma oranı|
|ExitRates|Kullanıcının bir sayfayı görüntüledikten sonra siteden çıkma oranı|
|PageValues|Sayfanın satın alma sürecine katkı düzeyi|
|SpecialDay|Ziyaret tarihinin özel günlere yakınlık derecesi|
|Month|Ziyaretin gerçekleştiği ay|
|OperatingSystems|Kullanıcının kullandığı işletim sistemi|
|Browser|Kullanıcının kullandığı tarayıcı|
|Region|Kullanıcının bölgesi|
|TrafficType|Kullanıcının siteye hangi trafik kaynağından geldiği|
|VisitorType|Kullanıcının yeni ziyaretçi veya geri dönen ziyaretçi olması|
|Weekend|Ziyaretin hafta sonu olup olmaması|
|Revenue|Satın alma gerçekleşip gerçekleşmediği bilgisi|


# Use Case Scenarios

UC1 — As an online buyer, ürünle ilgili sayfalarda gösterdiğim ilgiye göre bana ürün önerilmesini istiyorum.  

UC2 — As an online buyer, bilgilendirici sayfalara göre bana uygun ürünlerin önerilmesini istiyorum.  

UC3 — As an online buyer, davranışlarıma göre satın alma eğiliminin analiz edilmesini istiyorum.  

UC4 — As an online buyer, siteden ayrılmadan önce ilgimi çekebilecek ürünlerin gösterilmesini istiyorum.  

UC5 — As a returning online buyer, önceki ziyaret alışkanlıklarıma benzer öneriler almak istiyorum.  

UC6 — As an online buyer, özel günlerde bana uygun ürünlerin önerilmesini istiyorum.  

UC7 — As an online buyer, siteye geliş biçimime göre davranışımın analiz edilmesini istiyorum.  

UC8 — As an online buyer, bulunduğum bölgeye göre daha uygun ürünlerin önerilmesini istiyorum.  


# Acceptance Criteria

|ID|Kriter|
|---|---|
|AC1|Sistem kullanıcı davranış verilerini okuyabilmelidir|
|AC2|Sistem davranış verilerine göre en az bir öneri mantığı çalıştırabilmelidir|
|AC3|Sistem öneri sonucunu kullanıcıya gösterebilmelidir|
|AC4|Sistem yeni kullanıcı ve geri dönen kullanıcı ayrımını yapabilmelidir|
|AC5|Sistem ürün sayfası ilgisini ve çıkış eğilimini yorumlayabilmelidir|
|AC6|Sistem özel gün ve zaman bilgisini öneri sürecine dahil edebilmelidir|


# Assumptions and Constraints

Kullanıcı davranış verilerinin doğru ve erişilebilir olduğu varsayılmıştır.

Revenue değişkeninin satın alma sonucunu temsil ettiği kabul edilmiştir.

Proje öğrenci düzeyinde geliştirileceği için öneri sistemi temel/orta ölçekli tutulacaktır.

Gerçek zamanlı büyük ölçekli üretim ortamı hedeflenmemektedir.

Tam ticari entegrasyon yerine prototip yaklaşımı kullanılacaktır.

Güvenlik, ölçeklenebilirlik ve performans konuları temel proje seviyesinde ele alınacaktır.

Proje belirlenen zaman diliminde tamamlanmalıdır.