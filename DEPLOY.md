# ShopAI V2 — Proje Yapısı ve Deploy Rehberi

## Klasör Yapısı

Reponun root'u şöyle görünmeli:

```
akilli-e-ticaret-oneri-sistemi/   ← repo root
├── main.py                        ← V2 backend (bu dosya)
├── requirements.txt               ← pip bağımlılıkları
├── render.yaml                    ← Render otomatik deploy ayarları
└── frontend/
    └── index.html                 ← V2 frontend (bu dosya)
```

> ⚠️ `index.html` mutlaka `frontend/` klasörünün içinde olmalı.
> `main.py` bunu `frontend/index.html` yolundan servis ediyor.

---

## Yerel Test (opsiyonel)

```bash
# Bağımlılıkları yükle
pip install -r requirements.txt

# Geçici olarak DATABASE_URL olmadan çalıştır (DB işlemleri çalışmaz ama sunucu ayağa kalkar)
uvicorn main:app --reload --port 8000
```

Tarayıcıda `http://localhost:8000` → `frontend/index.html` görünmeli.

---

## Render Deploy Adımları

### 1. Render PostgreSQL DB oluştur
- Render Dashboard → **New → PostgreSQL**
- Name: `shopai-db`
- Plan: **Free**
- Oluştur, bekleme bitmeden devam edebilirsin.

### 2. Web Service oluştur
- **New → Web Service → Connect a repository**
- GitHub reponuzu bağla
- Render `render.yaml` dosyasını otomatik okur — ayarlar hazır gelir
- **Environment Variables** kısmında `DATABASE_URL` zaten `render.yaml`'dan inject edilir

### 3. İlk deploy
- Deploy başlar → Render `pip install -r requirements.txt` çalıştırır
- Sonra `gunicorn main:app ...` ile başlatır
- Uygulama ilk açılışta tabloları ve 50 ürünü otomatik oluşturur (init_db)

### 4. SECRET_KEY güncelle (önemli!)
- Render Dashboard → Web Service → Environment
- `SECRET_KEY` değerini güçlü rastgele bir string ile değiştir
- Örnek: `openssl rand -hex 32` çıktısını kullan

---

## Endpoint'ler

| Method | Path | Açıklama | Auth |
|--------|------|----------|------|
| GET | `/` | index.html | — |
| POST | `/api/v1/auth/register` | Kayıt | — |
| POST | `/api/v1/auth/login` | Giriş | — |
| GET | `/api/v1/products` | Tüm ürünler | — |
| GET | `/api/v1/products?category=Elektronik` | Kategori filtreli | — |
| GET | `/api/v1/products/{id}` | Ürün detay + benzerler | — |
| GET | `/api/v1/categories` | Kategori listesi | — |
| POST | `/api/v1/interactions` | Etkileşim kaydet | ✅ JWT |
| GET | `/api/v1/interactions/me` | Kendi geçmişim | ✅ JWT |
| GET | `/api/v1/recommendations/{user_id}` | Kişisel öneri | — |
| GET | `/api/v1/users/me` | Profil + etiket | ✅ JWT |
| GET | `/api/v1/health` | DB durumu | — |

---

## Öneri Algoritması

```
Kullanıcı beğenir / sepete ekler / ürüne bakar
        ↓
interactions tablosuna kaydedilir
        ↓
Kategori ağırlıkları hesaplanır:
  view  = 1 puan
  like  = 3 puan
  cart  = 5 puan
        ↓
Ağırlığa orantılı olarak her kategoriden ürün seçilir
(daha önce etkileşime girilmiş ürünler çıkarılır)
        ↓
"Size Özel Öneriler" güncellenir
```

**Yeni kullanıcıda:** Global popularite sırası (en çok etkileşim alan ürünler) gösterilir.
