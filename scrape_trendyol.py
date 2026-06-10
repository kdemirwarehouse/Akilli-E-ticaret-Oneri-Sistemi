"""
Trendyol kategori sayfalarından ürün adı, fiyat ve CDN resim URL'si scrape eder.
Sonucu seed_products.csv olarak kaydeder (image_url sütunu dahil).
Kullanım: python scrape_trendyol.py
"""
import sys, io, csv, time, random, re, pathlib
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

from playwright.sync_api import sync_playwright

CATEGORIES = [
    ("Kadın",                     "https://www.trendyol.com/kadin-x-g1"),
    ("Erkek",                     "https://www.trendyol.com/erkek-x-g2"),
    ("Elektronik",                "https://www.trendyol.com/elektronik-x-c104024"),
    ("Kozmetik",                  "https://www.trendyol.com/kozmetik-x-c89"),
    ("Süpermarket",               "https://www.trendyol.com/supermarket-x-c103799"),
    ("Ev ve Mobilya",             "https://www.trendyol.com/mobilya-x-c1119"),
    ("Bahçe & Yapı Market",       "https://www.trendyol.com/yapi-market-x-c103720"),
    ("Kırtasiye Ofis Malzemeleri","https://www.trendyol.com/kirtasiye-ofis-malzemeleri-x-c104125"),
    ("Hobi",                      "https://www.trendyol.com/hobi-x-c97"),
    ("Oyuncak",                   "https://www.trendyol.com/oyuncak-x-c90"),
    ("Spor Outdoor",              "https://www.trendyol.com/outdoor-x-c103507"),
    ("Çocuk",                     "https://www.trendyol.com/cocuk-x-g3"),
    ("Anne & Bebek & Çocuk",      "https://www.trendyol.com/bebek-giyim-x-c104158"),
    ("Otomobil ve Motosiklet",    "https://www.trendyol.com/otomobil-ve-motosiklet-x-c105777"),
]

TARGET_PER_CAT = 50
OUT_CSV = pathlib.Path(__file__).parent / "seed_products.csv"


def parse_price(text: str) -> float | None:
    """'7.649,10 TL' veya '999 TL' -> float"""
    if not text:
        return None
    cleaned = re.sub(r'[^\d,.]', '', text.replace('.', '').replace(',', '.'))
    try:
        return round(float(cleaned), 2)
    except ValueError:
        return None


def scrape_category(page, cat_name: str, url: str, target: int) -> list[dict]:
    products = []
    page_num = 1

    while len(products) < target:
        paginated_url = f"{url}?pi={page_num}" if page_num > 1 else url
        print(f"  [{cat_name}] Sayfa {page_num}: {paginated_url}")

        try:
            page.goto(paginated_url, wait_until="domcontentloaded", timeout=30000)
        except Exception as e:
            print(f"  GOTO HATA: {e}")
            break

        # Sayfa yüklensin, kartlar renderlansin
        time.sleep(random.uniform(3.0, 4.5))

        # Sayfayi asagi kaydır - lazy-load için
        page.evaluate("window.scrollTo(0, document.body.scrollHeight / 2)")
        time.sleep(1.5)
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        time.sleep(2.0)

        cards_data = page.evaluate("""() => {
            const cards = Array.from(document.querySelectorAll('.product-card'));
            return cards.map(card => {
                const img = card.querySelector('img.image');
                const nameEl = card.querySelector('span.product-name, .prdct-desc-cntnr-name, .prdct-desc-cntnr-ttl');
                // Önce indirimli fiyat, sonra normal fiyat
                const priceEl = card.querySelector('span.price-value, .prc-box-sllng, .prc-box-dscntd');
                return {
                    img:   img   ? img.src                        : null,
                    name:  nameEl ? nameEl.textContent.trim()     : null,
                    price: priceEl ? priceEl.textContent.trim()   : null,
                };
            });
        }""")

        if not cards_data:
            print(f"  [{cat_name}] Kart bulunamadı, duruyorum.")
            break

        new_count = 0
        for c in cards_data:
            if len(products) >= target:
                break
            name  = (c.get("name") or "").strip()
            img   = (c.get("img")  or "").strip()
            price = parse_price(c.get("price") or "")

            # Filtreler
            if not name or not img or not price:
                continue
            if not img.startswith("https://cdn.dsmcdn.com"):
                continue
            if price <= 0:
                continue
            # Duplikasyon engelle
            if any(p["name"] == name for p in products):
                continue

            products.append({"name": name, "category": cat_name, "price": price, "image_url": img})
            new_count += 1

        print(f"  [{cat_name}] Sayfa {page_num}: {new_count} yeni ürün (toplam {len(products)})")

        if new_count == 0:
            print(f"  [{cat_name}] Yeni ürün yok, bir sonraki sayfaya geç.")
        if len(products) >= target:
            break

        page_num += 1
        if page_num > 5:
            print(f"  [{cat_name}] 5 sayfa limiti aşıldı, duruyorum.")
            break
        time.sleep(random.uniform(2.0, 3.5))

    return products[:target]


def main():
    all_products = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1440, "height": 900},
            locale="tr-TR",
            extra_http_headers={"Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8"},
        )
        page = ctx.new_page()

        for cat_name, cat_url in CATEGORIES:
            print(f"\n=== {cat_name} ===")
            products = scrape_category(page, cat_name, cat_url, TARGET_PER_CAT)
            print(f"  => {len(products)} ürün alındı")
            all_products.extend(products)
            # Kategoriler arası bekleme (ban koruması)
            time.sleep(random.uniform(3.0, 6.0))

        browser.close()

    # CSV'ye yaz
    with open(OUT_CSV, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=["name", "category", "price", "image_url"])
        writer.writeheader()
        writer.writerows(all_products)

    print(f"\n✓ {len(all_products)} ürün kaydedildi → {OUT_CSV}")

    # Özet
    from collections import Counter
    counts = Counter(p["category"] for p in all_products)
    for cat, n in sorted(counts.items()):
        print(f"  {cat}: {n}")


if __name__ == "__main__":
    main()
