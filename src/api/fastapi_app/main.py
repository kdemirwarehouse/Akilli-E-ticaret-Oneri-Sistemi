from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os

app = FastAPI(title="E-Ticaret Oneri Sistemi")

# CORS (Cross-Origin Resource Sharing) Ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Canlıda buraya kendi domaininizi yazmanız güvenlidir
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sahte veri seti (İleride veritabanından gelecek)
urunler = [
    {"id": 1, "ad": "Kablosuz Kulaklık", "kategori": "Elektronik", "fiyat": 1500},
    {"id": 2, "ad": "Akıllı Saat", "kategori": "Elektronik", "fiyat": 3000},
    {"id": 3, "ad": "Sırt Çantası", "kategori": "Moda", "fiyat": 750}
]

@app.get("/")
def ana_sayfa():
    # Frontend arayüzünü ana sayfada göster
    html_path = os.path.join("frontend", "index.html")
    if os.path.exists(html_path):
        return FileResponse(html_path)
    return {"mesaj": "Oneri API'sine Hos Geldiniz (Arayüz bulunamadı)"}

@app.get("/api/v1/recommendations/{user_id}")
def get_recommendations(user_id: int):
    # Şimdilik herkese tüm ürünleri öneren basit bir mantık
    return {
        "kullanici_id": user_id,
        "onerilen_urunler": urunler
    }

@app.get("/api/v1/products/{product_id}")
def get_product_detail(product_id: int):
    # Ürün listesinde arama yap
    urun = next((item for item in urunler if item["id"] == product_id), None)
    if urun:
        return urun
    return {"hata": "Urun bulunamadi"}
