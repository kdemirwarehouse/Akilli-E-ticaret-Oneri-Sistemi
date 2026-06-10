"""
ShopAI — V2 Backend
FastAPI + PostgreSQL + Item-Based Collaborative Filtering

Endpoint'ler:
  POST /api/v1/auth/register        → Kayıt
  POST /api/v1/auth/login           → Giriş (JWT döner)
  GET  /api/v1/products             → Tüm ürünler (isteğe bağlı ?category=)
  POST /api/v1/interactions         → Etkileşim kaydet (like / cart / view)
  GET  /api/v1/recommendations/{id} → Kişiselleştirilmiş öneri (CF)
  GET  /api/v1/users/me             → Kullanıcı profili + etiket
  GET  /                            → index.html
"""

# ─────────────────────────────── IMPORTS ────────────────────────────────── #
import os
import math
import hashlib
import hmac
import base64
import json
import time
from datetime import datetime, timedelta
from typing import Optional, List

import psycopg2
import psycopg2.extras
import numpy as np
from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, HTTPException, Depends, Header, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr

# ─────────────────────────────── CONFIG ─────────────────────────────────── #
DATABASE_URL = os.environ.get("DATABASE_URL", "")   # Render otomatik inject eder
SECRET_KEY    = os.environ.get("SECRET_KEY", "shopai-super-secret-key-change-in-prod")
JWT_EXP_HOURS = 72

# ─────────────────────────────── ÜRÜN KATALOĞU ──────────────────────────── #
def _load_catalog():
    import csv, pathlib
    path = pathlib.Path(__file__).parent / "seed_products.csv"
    if not path.exists():
        return []
    with open(path, encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))
    # image_url sütunu varsa dahil et, yoksa None
    result = []
    for r in rows:
        image_url = r.get("image_url") or None
        result.append((r["name"], r["category"], float(r["price"]), image_url))
    return result

PRODUCT_CATALOG = _load_catalog()

# ─────────────────────────────── PYDANTIC MODELS ────────────────────────── #
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class InteractionRequest(BaseModel):
    product_id: int
    interaction_type: str   # "like" | "cart" | "view"

class OrderItemModel(BaseModel):
    product_id: int
    quantity:   int

class CheckoutRequest(BaseModel):
    items:   List[OrderItemModel]
    address: str = ""

# ─────────────────────────────── JWT (sıfırdan, kütüphane yok) ──────────── #
def _b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()

def _b64url_decode(s: str) -> bytes:
    pad = 4 - len(s) % 4
    return base64.urlsafe_b64decode(s + "=" * (pad % 4))

def create_token(user_id: int, email: str) -> str:
    header  = _b64url(json.dumps({"alg": "HS256", "typ": "JWT"}).encode())
    payload = _b64url(json.dumps({
        "sub":   user_id,
        "email": email,
        "exp":   int(time.time()) + JWT_EXP_HOURS * 3600
    }).encode())
    sig = _b64url(hmac.new(
        SECRET_KEY.encode(), f"{header}.{payload}".encode(), hashlib.sha256
    ).digest())
    return f"{header}.{payload}.{sig}"

def verify_token(token: str) -> dict:
    try:
        header, payload, sig = token.split(".")
        expected = _b64url(hmac.new(
            SECRET_KEY.encode(), f"{header}.{payload}".encode(), hashlib.sha256
        ).digest())
        if not hmac.compare_digest(sig, expected):
            raise ValueError("bad sig")
        data = json.loads(_b64url_decode(payload))
        if data["exp"] < int(time.time()):
            raise ValueError("expired")
        return data
    except Exception:
        raise HTTPException(status_code=401, detail="Geçersiz veya süresi dolmuş token.")

def hash_password(pw: str) -> str:
    return hashlib.sha256(pw.encode()).hexdigest()

# ─────────────────────────────── DB HELPERS ─────────────────────────────── #
def get_conn():
    """Her çağrıda yeni bağlantı döner. Render Free Tier için yeterli."""
    if not DATABASE_URL:
        raise HTTPException(status_code=503, detail="Veritabanı bağlantı URL'si tanımlı değil.")
    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
    conn.autocommit = False
    return conn

def init_db():
    """Tabloları oluşturur, ürün kataloğunu seed'ler. Uygulama başlangıcında çalışır."""
    conn = get_conn()
    cur  = conn.cursor()
    try:
        # Advisory lock: aynı anda sadece bir worker çalışsın
        conn.autocommit = True
        cur.execute("SELECT pg_try_advisory_lock(20260610)")
        locked = cur.fetchone()[0]
        conn.autocommit = False
        if not locked:
            print("[DB] init_db: başka worker çalıştırıyor, atlandı.")
            return

        # ── Tablolar ──────────────────────────────────────────────────────
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                user_id    SERIAL PRIMARY KEY,
                name       VARCHAR(100) NOT NULL,
                email      VARCHAR(150) UNIQUE NOT NULL,
                password   TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS products (
                product_id SERIAL PRIMARY KEY,
                name       VARCHAR(250) NOT NULL,
                category   VARCHAR(100),
                price      NUMERIC(10,2) CHECK (price > 0),
                image_url  TEXT,
                stock      INT DEFAULT 100,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS orders (
                order_id    SERIAL PRIMARY KEY,
                user_id     INT NOT NULL REFERENCES users(user_id),
                order_date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                total_price NUMERIC(10,2)
            );
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS order_items (
                order_item_id SERIAL PRIMARY KEY,
                order_id      INT REFERENCES orders(order_id),
                product_id    INT REFERENCES products(product_id),
                quantity      INT NOT NULL,
                price         NUMERIC(10,2)
            );
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS interactions (
                interaction_id   SERIAL PRIMARY KEY,
                user_id          INT REFERENCES users(user_id),
                product_id       INT REFERENCES products(product_id),
                interaction_type VARCHAR(50),
                created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        # ── İndeksler ─────────────────────────────────────────────────────
        cur.execute("CREATE INDEX IF NOT EXISTS idx_users_email            ON users(email);")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_products_category      ON products(category);")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_orders_user_id         ON orders(user_id);")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_interactions_user_prod ON interactions(user_id, product_id);")

        # ── Migrasyon ─────────────────────────────────────────────────────
        try:
            cur.execute("ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;")
            cur.execute("ALTER TABLE products ALTER COLUMN name TYPE VARCHAR(250);")
        except Exception:
            conn.rollback()

        # ── Ürün seed ─────────────────────────────────────────────────────
        cur.execute("SELECT COUNT(*) FROM products;")
        existing = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) FROM products WHERE image_url IS NOT NULL;")
        with_images = cur.fetchone()[0]
        needs_reseed = (existing == 0 or existing != len(PRODUCT_CATALOG) or with_images == 0)

        if needs_reseed and PRODUCT_CATALOG:
            cur.execute("TRUNCATE interactions, order_items, products RESTART IDENTITY CASCADE;")
            psycopg2.extras.execute_values(
                cur,
                "INSERT INTO products (name, category, price, image_url) VALUES %s",
                PRODUCT_CATALOG
            )
            print(f"[SEED] {len(PRODUCT_CATALOG)} ürün eklendi.")

        conn.commit()
        print("[DB] Tablolar hazır.")
    except Exception as e:
        conn.rollback()
        print(f"[DB ERROR] init_db: {e}")
    finally:
        cur.close()
        conn.close()

# ─────────────────────────────── ÖNERI MOTORU ───────────────────────────── #
# Strateji:
#   1. Kullanıcının interaction'larından etkilendiği kategoriler çıkarılır.
#   2. Bu kategorilere ağırlık (like=3, cart=5, view=1) verilir.
#   3. En ağırlıklı kategori(ler) öncelikli gösterilir.
#   4. Kullanıcının zaten etkileşime girdiği ürünler filtrelenir.
#   5. Eğer interaction yoksa → popüler ürünler (en çok etkileşim alan) döner.

INTERACTION_WEIGHTS = {"like": 3, "cart": 5, "view": 1}

def get_recommendations(user_id: int, limit: int = 12) -> list:
    conn = get_conn()
    cur  = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    try:
        # 1. Kullanıcının tüm interaction'ları
        cur.execute("""
            SELECT i.product_id, i.interaction_type, p.category
            FROM   interactions i
            JOIN   products p ON p.product_id = i.product_id
            WHERE  i.user_id = %s
        """, (user_id,))
        interactions = cur.fetchall()

        # 2. Kategori ağırlıkları hesapla
        category_scores: dict = {}
        seen_product_ids: set = set()
        for row in interactions:
            seen_product_ids.add(row["product_id"])
            w = INTERACTION_WEIGHTS.get(row["interaction_type"], 1)
            category_scores[row["category"]] = category_scores.get(row["category"], 0) + w

        if category_scores:
            # ── KİŞİSELLEŞTİRİLMİŞ ÖNERİ ─────────────────────────────
            # Kategorileri ağırlığa göre sırala
            sorted_cats = sorted(category_scores.items(), key=lambda x: x[1], reverse=True)

            # Her kategoriden kaç ürün alınacağını hesapla (toplam ağırlığa orantılı)
            total_score   = sum(s for _, s in sorted_cats)
            recommendations = []

            for cat, score in sorted_cats:
                cat_limit = max(1, round(limit * score / total_score))
                # Zaten görülen ürünleri dışarıda bırak
                placeholders = ",".join(["%s"] * len(seen_product_ids)) if seen_product_ids else "0"
                query = f"""
                    SELECT p.product_id, p.name, p.category, p.price, p.image_url,
                           COALESCE(SUM(
                               CASE i.interaction_type
                                   WHEN 'cart' THEN 5
                                   WHEN 'like' THEN 3
                                   WHEN 'view' THEN 1
                                   ELSE 0
                               END
                           ), 0) AS popularity_score
                    FROM   products p
                    LEFT JOIN interactions i ON i.product_id = p.product_id
                    WHERE  p.category = %s
                      AND  p.product_id NOT IN ({placeholders})
                    GROUP BY p.product_id, p.name, p.category, p.price, p.image_url
                    ORDER  BY popularity_score DESC, RANDOM()
                    LIMIT  %s
                """
                params = [cat] + list(seen_product_ids) + [cat_limit]
                cur.execute(query, params)
                recommendations.extend(cur.fetchall())

            # Yeterli ürün yoksa geri kalanı diğer kategorilerden tamamla
            if len(recommendations) < limit:
                already_ids = [r["product_id"] for r in recommendations] + list(seen_product_ids)
                placeholders = ",".join(["%s"] * len(already_ids)) if already_ids else "0"
                needed = limit - len(recommendations)
                cur.execute(f"""
                    SELECT p.product_id, p.name, p.category, p.price, p.image_url,
                           COALESCE(SUM(
                               CASE i.interaction_type
                                   WHEN 'cart' THEN 5
                                   WHEN 'like' THEN 3
                                   WHEN 'view' THEN 1
                                   ELSE 0
                               END
                           ), 0) AS popularity_score
                    FROM   products p
                    LEFT JOIN interactions i ON i.product_id = p.product_id
                    WHERE  p.product_id NOT IN ({placeholders})
                    GROUP BY p.product_id, p.name, p.category, p.price, p.image_url
                    ORDER  BY popularity_score DESC, RANDOM()
                    LIMIT  %s
                """, already_ids + [needed])
                recommendations.extend(cur.fetchall())

            return [dict(r) for r in recommendations[:limit]]

        else:
            # ── YENİ KULLANICI → POPÜLER ÜRÜNLER ──────────────────────
            cur.execute("""
                SELECT p.product_id, p.name, p.category, p.price,
                       COALESCE(SUM(
                           CASE i.interaction_type
                               WHEN 'cart' THEN 5
                               WHEN 'like' THEN 3
                               WHEN 'view' THEN 1
                               ELSE 0
                           END
                       ), 0) AS popularity_score
                FROM   products p
                LEFT JOIN interactions i ON i.product_id = p.product_id
                GROUP BY p.product_id, p.name, p.category, p.price
                ORDER  BY popularity_score DESC, RANDOM()
                LIMIT  %s
            """, (limit,))
            return [dict(r) for r in cur.fetchall()]

    finally:
        cur.close()
        conn.close()

def get_user_label(category_scores: dict) -> str:
    """Kullanıcının en çok etkileşim kurduğu kategoriye göre etiket döner."""
    if not category_scores:
        return "Yeni Üye"
    top = max(category_scores, key=category_scores.get)
    labels = {
        "Elektronik":                    "Teknoloji Tutkunu ⚡",
        "Kadın":                         "Moda Kurdu 👗",
        "Erkek":                         "Tarz Sahibi 👔",
        "Ev ve Mobilya":                 "Yuva Düşkünü 🏠",
        "Süpermarket":                   "Pratik Yaşam Sever 🛒",
        "Spor Outdoor":                  "Spor & Doğa Aşığı 🏃",
        "Kozmetik":                      "Güzellik Uzmanı 💄",
        "Çocuk":                         "Aile Odaklı 👨‍👩‍👧",
        "Anne & Bebek & Çocuk":          "Aile Odaklı 👶",
        "Oyuncak":                       "Oyun Ustası 🧸",
        "Hobi":                          "Yaratıcı Ruh 🎨",
        "Kırtasiye Ofis Malzemeleri":    "Organizasyon Gurusu 📎",
        "Bahçe & Yapı Market":           "Bahçe & Yapı Sever 🌿",
        "Otomobil ve Motosiklet":        "Yol Tutkunu 🚗",
    }
    return labels.get(top, "Keşifçi 🌟")

# ─────────────────────────────── DEPENDENCY ─────────────────────────────── #
def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Yetkilendirme başlığı eksik.")
    return verify_token(authorization[7:])

# ─────────────────────────────── APP ────────────────────────────────────── #
app = FastAPI(title="ShopAI V2", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    if DATABASE_URL:
        try:
            init_db()
        except Exception as e:
            print(f"[STARTUP ERROR] {e}")
    else:
        print("[WARN] DATABASE_URL yok — DB işlemleri çalışmaz.")

# ── Statik dosyalar (index.html + varsa CSS/JS dosyaları) ─────────────────
FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "frontend")
if os.path.isdir(FRONTEND_DIR):
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

@app.get("/", include_in_schema=False)
def serve_index():
    path = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(path):
        return FileResponse(path)
    return JSONResponse({"message": "ShopAI V2 API çalışıyor."})

# ─────────────────────────────── AUTH ───────────────────────────────────── #
@app.post("/api/v1/auth/register", status_code=201)
def register(body: RegisterRequest):
    conn = get_conn()
    cur  = conn.cursor()
    try:
        cur.execute("SELECT user_id FROM users WHERE email = %s", (body.email,))
        if cur.fetchone():
            raise HTTPException(status_code=409, detail="Bu e-posta zaten kayıtlı.")
        cur.execute(
            "INSERT INTO users (name, email, password) VALUES (%s, %s, %s) RETURNING user_id",
            (body.name.strip(), body.email.strip().lower(), hash_password(body.password))
        )
        user_id = cur.fetchone()[0]
        conn.commit()
        token = create_token(user_id, body.email)
        return {"message": "Kayıt başarılı.", "token": token, "user_id": user_id, "name": body.name}
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@app.post("/api/v1/auth/login")
def login(body: LoginRequest):
    conn = get_conn()
    cur  = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    try:
        cur.execute(
            "SELECT user_id, name, email, password FROM users WHERE email = %s",
            (body.email.strip().lower(),)
        )
        user = cur.fetchone()
        if not user or user["password"] != hash_password(body.password):
            raise HTTPException(status_code=401, detail="E-posta veya şifre hatalı.")
        token = create_token(user["user_id"], user["email"])
        return {
            "token":   token,
            "user_id": user["user_id"],
            "name":    user["name"],
            "email":   user["email"],
        }
    finally:
        cur.close()
        conn.close()

# ─────────────────────────────── PRODUCTS ───────────────────────────────── #
@app.get("/api/v1/products")
def list_products(category: Optional[str] = None):
    conn = get_conn()
    cur  = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    try:
        if category:
            cur.execute(
                "SELECT product_id, name, category, price, image_url, stock FROM products WHERE category = %s ORDER BY product_id",
                (category,)
            )
        else:
            cur.execute("SELECT product_id, name, category, price, image_url, stock FROM products ORDER BY product_id")
        return {"products": [dict(r) for r in cur.fetchall()]}
    finally:
        cur.close()
        conn.close()

@app.get("/api/v1/products/{product_id}")
def get_product(product_id: int):
    conn = get_conn()
    cur  = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    try:
        cur.execute("SELECT * FROM products WHERE product_id = %s", (product_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Ürün bulunamadı.")
        # Benzer ürünler (aynı kategori, aynı ürün hariç, 4 adet)
        cur.execute(
            "SELECT product_id, name, category, price, image_url FROM products WHERE category = %s AND product_id != %s ORDER BY RANDOM() LIMIT 4",
            (row["category"], product_id)
        )
        similar = [dict(r) for r in cur.fetchall()]
        result  = dict(row)
        result["similar_products"] = similar
        return result
    finally:
        cur.close()
        conn.close()

@app.get("/api/v1/categories")
def list_categories():
    conn = get_conn()
    cur  = conn.cursor()
    try:
        cur.execute("SELECT DISTINCT category FROM products ORDER BY category")
        return {"categories": [r[0] for r in cur.fetchall()]}
    finally:
        cur.close()
        conn.close()

# ─────────────────────────────── INTERACTIONS ───────────────────────────── #
@app.post("/api/v1/interactions", status_code=201)
def record_interaction(body: InteractionRequest, user: dict = Depends(get_current_user)):
    valid_types = {"like", "cart", "view"}
    if body.interaction_type not in valid_types:
        raise HTTPException(status_code=422, detail=f"interaction_type şunlardan biri olmalı: {valid_types}")

    conn = get_conn()
    cur  = conn.cursor()
    try:
        # Ürün var mı?
        cur.execute("SELECT product_id FROM products WHERE product_id = %s", (body.product_id,))
        if not cur.fetchone():
            raise HTTPException(status_code=404, detail="Ürün bulunamadı.")

        # "like" ve "cart" için aynı (user, product, type) ikilisi tekrar kaydedilmez
        if body.interaction_type in ("like", "cart"):
            cur.execute(
                "SELECT interaction_id FROM interactions WHERE user_id=%s AND product_id=%s AND interaction_type=%s",
                (user["sub"], body.product_id, body.interaction_type)
            )
            if cur.fetchone():
                return {"message": "Etkileşim zaten mevcut."}

        cur.execute(
            "INSERT INTO interactions (user_id, product_id, interaction_type) VALUES (%s, %s, %s)",
            (user["sub"], body.product_id, body.interaction_type)
        )
        conn.commit()
        return {"message": "Etkileşim kaydedildi."}
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@app.get("/api/v1/interactions/me")
def my_interactions(user: dict = Depends(get_current_user)):
    """Kullanıcının beğeni ve sepet geçmişini döner."""
    conn = get_conn()
    cur  = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    try:
        cur.execute("""
            SELECT i.product_id, i.interaction_type, i.created_at,
                   p.name, p.category, p.price
            FROM   interactions i
            JOIN   products p ON p.product_id = i.product_id
            WHERE  i.user_id = %s
            ORDER  BY i.created_at DESC
        """, (user["sub"],))
        return {"interactions": [dict(r) for r in cur.fetchall()]}
    finally:
        cur.close()
        conn.close()

# ─────────────────────────────── RECOMMENDATİONS ────────────────────────── #
@app.get("/api/v1/recommendations/{user_id}")
def recommend(user_id: int, limit: int = 12):
    """
    Kişiselleştirilmiş öneri endpoint'i.
    - Kullanıcının interaction geçmişine göre ağırlıklı kategori hesaplar.
    - Yeni kullanıcılar için popülerlik bazlı öneri döner.
    - Her ürüne similarity_score eklenir (frontend uyumluluğu için).
    """
    recs = get_recommendations(user_id, limit)
    # Frontend'in beklediği similarity_score alanını hesapla
    max_pop = max((r.get("popularity_score", 0) for r in recs), default=1) or 1
    for r in recs:
        pop = r.get("popularity_score", 0)
        # 0.50 – 0.99 arasında normalize et
        r["similarity_score"] = round(0.50 + 0.49 * (pop / max_pop), 2)
        r["id"] = r.pop("product_id")  # frontend id bekliyor
        r["name"] = r["name"]
    return {"user_id": user_id, "recommendations": recs, "count": len(recs)}

@app.get("/api/v1/recommendations/me/personalized")
def my_recommendations(limit: int = 12, user: dict = Depends(get_current_user)):
    """Token'lı kişisel öneri endpoint'i — /me rotası."""
    return recommend(user["sub"], limit)

# ─────────────────────────────── USER PROFILE ───────────────────────────── #
@app.get("/api/v1/users/me")
def my_profile(user: dict = Depends(get_current_user)):
    conn = get_conn()
    cur  = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    try:
        cur.execute("SELECT user_id, name, email, created_at FROM users WHERE user_id = %s", (user["sub"],))
        profile = dict(cur.fetchone())

        # Kategori ağırlıkları
        cur.execute("""
            SELECT p.category,
                   SUM(CASE i.interaction_type WHEN 'cart' THEN 5 WHEN 'like' THEN 3 WHEN 'view' THEN 1 ELSE 0 END) AS score
            FROM   interactions i
            JOIN   products p ON p.product_id = i.product_id
            WHERE  i.user_id = %s
            GROUP  BY p.category
            ORDER  BY score DESC
        """, (user["sub"],))
        cat_scores = {r["category"]: r["score"] for r in cur.fetchall()}

        # İstatistikler
        cur.execute("SELECT COUNT(*) FROM interactions WHERE user_id=%s AND interaction_type='like'", (user["sub"],))
        liked = cur.fetchone()["count"]
        cur.execute("SELECT COUNT(*) FROM interactions WHERE user_id=%s AND interaction_type='cart'", (user["sub"],))
        carted = cur.fetchone()["count"]

        profile["label"]             = get_user_label(cat_scores)
        profile["category_scores"]   = cat_scores
        profile["top_category"]      = max(cat_scores, key=cat_scores.get) if cat_scores else None
        profile["liked_count"]       = liked
        profile["cart_count"]        = carted
        return profile
    finally:
        cur.close()
        conn.close()

# ─────────────────────────────── CHECKOUT ───────────────────────────────── #
@app.post("/api/v1/orders/checkout", status_code=201)
def checkout(body: CheckoutRequest, user: dict = Depends(get_current_user)):
    if not body.items:
        raise HTTPException(status_code=400, detail="Sepet boş.")
    conn = get_conn()
    cur  = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    try:
        pids = [it.product_id for it in body.items]
        placeholders = ",".join(["%s"] * len(pids))
        cur.execute(f"SELECT product_id, price FROM products WHERE product_id IN ({placeholders})", pids)
        price_map = {r["product_id"]: float(r["price"]) for r in cur.fetchall()}

        total = sum(price_map.get(it.product_id, 0) * it.quantity for it in body.items)

        cur2 = conn.cursor()
        cur2.execute(
            "INSERT INTO orders (user_id, total_price) VALUES (%s, %s) RETURNING order_id",
            (user["sub"], total)
        )
        order_id = cur2.fetchone()[0]
        for it in body.items:
            if it.product_id in price_map:
                cur2.execute(
                    "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (%s, %s, %s, %s)",
                    (order_id, it.product_id, it.quantity, price_map[it.product_id])
                )
        conn.commit()
        return {"message": "Sipariş oluşturuldu.", "order_id": order_id, "total": round(total, 2)}
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

# ─────────────────────────────── HEALTH ─────────────────────────────────── #
@app.get("/api/v1/health")
def health():
    db_ok = False
    if DATABASE_URL:
        try:
            conn = get_conn()
            conn.cursor().execute("SELECT 1")
            conn.close()
            db_ok = True
        except Exception:
            pass
    return {
        "status":    "ok" if db_ok else "degraded",
        "database":  "connected" if db_ok else "unreachable",
        "version":   "2.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }
