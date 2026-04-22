from fastapi import FastAPI

app = FastAPI(title="E-Ticaret Oneri Sistemi")

# Sahte veri seti (İleride veritabanından gelecek)
urunler = [
    {"id": 1, "ad": "Kablosuz Kulaklık", "kategori": "Elektronik", "fiyat": 1500},
    {"id": 2, "ad": "Akıllı Saat", "kategori": "Elektronik", "fiyat": 3000},
    {"id": 3, "ad": "Sırt Çantası", "kategori": "Moda", "fiyat": 750}
]

@app.get("/")
def ana_sayfa():
    return {"mesaj": "Oneri API'sine Hos Geldiniz"}

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
