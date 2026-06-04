# 🚀 Akıllı E-Ticaret Öneri Sistemi (Smart E-Commerce Recommendation System)

Bu proje, e-ticaret platformları için kullanıcı hareketlerine ve ürün benzerliklerine dayalı akıllı bir ürün öneri sistemi (Recommendation Engine) geliştirmeyi amaçlamaktadır. Proje, veri işleme, makine öğrenmesi modelleri ve bu modelleri dışa açan bir REST API mimarisinden oluşmaktadır.

---

## 📂 Proje Mimarisi (Klasör Yapısı)

Proje, geliştirme, test ve canlı ortamlarda (production) temiz bir ayrım sağlamak amacıyla aşağıdaki modüler yapıya bölünmüştür:

- **`src/`**: Ana kaynak kodlarının bulunduğu dizin.
  - `api/fastapi_app/`: **FastAPI** tabanlı ana web servisi kodları. (Production ortamı için varsayılan)
  - `api/flask_app/`: Alternatif olarak geliştirilmiş **Flask** web servisi kodları.
  - `models/`: Makine öğrenmesi modellerinin, eğitim ve metrik hesaplama (`evaluation.py`) scriptlerinin bulunduğu dizin.
- **`frontend/`**: Kullanıcıların API ile etkileşime geçeceği statik web dosyaları (`index.html`).
- **`notebooks/`**: Veri bilimi analizleri, keşifsel veri analizi (EDA) ve özellik mühendisliği adımlarını içeren Jupyter Notebook (`.ipynb`) dosyaları.
- **`db/`**: Veritabanı şemaları, SQL dökümleri (`database.sql`) ve E-R diyagram görselleri.
- **`docs/`**: Projenin detaylı dökümantasyonları, araştırma raporları, API ve UI planlama dosyaları.

---

## 🛠️ Teknolojiler

- **Backend:** Python 3.11, FastAPI (Ana Servis), Flask (Alternatif)
- **Sunucu & Deployment:** Uvicorn, Gunicorn, Render.com (IaC)
- **Veri Bilimi:** Pandas, Scikit-Learn, Numpy
- **Frontend:** Vanilla HTML/JS

---

## 💻 Kurulum ve Çalıştırma (Lokal Ortam)

Projeyi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin:

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/250542024/Akilli-E-ticaret-Oneri-Sistemi.git
cd Akilli-E-ticaret-Oneri-Sistemi
```

### 2. Sanal Ortam Oluşturun ve Aktif Edin
**Windows için:**
```bash
python -m venv venv
venv\Scripts\activate
```
**Linux / MacOS için:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Bağımlılıkları Yükleyin
```bash
pip install -r requirements.txt
```

### 4. API'yi Başlatın (FastAPI)
```bash
uvicorn src.api.fastapi_app.main:app --reload
```
API çalışmaya başladıktan sonra tarayıcınızdan http://localhost:8000/docs adresine giderek otomatik oluşturulan Swagger UI arayüzünden testlerinizi gerçekleştirebilirsiniz.

---

## 🌐 Canlıya Alma (Deployment - Render.com)

Bu proje **Render.com** üzerinde otomatik olarak çalışacak şekilde yapılandırılmıştır (`render.yaml`).

1. Reponuzu GitHub'a pushlayın.
2. Render hesabınıza girip **New > Blueprint** seçeneğine tıklayın.
3. Bu repoyu bağladığınız anda:
   - **Backend API:** Gunicorn ve Uvicorn worker'lar kullanılarak ayağa kaldırılacak.
   - **Frontend:** Statik site olarak yayına alınacaktır.

Herhangi bir sunucu komutu girmenize gerek kalmadan deployment işlemi IaC (*Infrastructure as Code*) kurallarına göre otomatik işlenecektir.

---

## 📚 Dokümantasyonlar

Sistemin iç işleyişine dair detaylı bilgiler için `docs/` klasörüne göz atabilirsiniz:
- `oneri_algoritmasi_arastirma_raporu.md`: Öneri motorunun matematiksel altyapısı.
- `model_performance_report.md`: Algoritma performans raporları.
- `ui_entegrasyon_plani.md`: API - Frontend haberleşme dokümanı.
- `flask_api.md` & Diğer tasarım raporları.