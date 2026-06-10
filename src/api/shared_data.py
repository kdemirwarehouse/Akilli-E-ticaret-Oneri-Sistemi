# ═══════════════════════════════════════════════
# Shared Data Module — Ortak Veri Kaynağı
# FastAPI ve Flask tarafından kullanılır
# ═══════════════════════════════════════════════

from datetime import datetime
import hashlib
import secrets

# ── Ürün Kataloğu (Frontend CATALOG ile senkron) ──
CATALOG = [
    {"id": 1, "name": "Premium Kablosuz Kulaklık", "category": "Elektronik", "price": 1499, "stock": 45, "icon": "🎧", "desc": "Aktif gürültü engelleme özellikli, 30 saat pil ömrü."},
    {"id": 2, "name": "Mekanik Klavye Pro", "category": "Elektronik", "price": 2199, "stock": 22, "icon": "⌨️", "desc": "Cherry MX Blue switch, RGB aydınlatma, alüminyum gövde."},
    {"id": 3, "name": "Ergonomik Mouse", "category": "Elektronik", "price": 899, "stock": 38, "icon": "🖱️", "desc": "Dikey tasarım, bilek desteği, kablosuz bağlantı."},
    {"id": 4, "name": "4K Monitör 27\"", "category": "Elektronik", "price": 8499, "stock": 12, "icon": "🖥️", "desc": "IPS panel, HDR10, %99 sRGB renk doğruluğu."},
    {"id": 5, "name": "Taşınabilir SSD 1TB", "category": "Elektronik", "price": 1899, "stock": 55, "icon": "💾", "desc": "USB-C, 1050MB/s okuma hızı, şok dayanıklı."},
    {"id": 6, "name": "Yoga Matı ve Seti", "category": "Spor", "price": 349, "stock": 80, "icon": "🧘", "desc": "6mm kalınlık, kaymaz yüzey, taşıma çantası dahil."},
    {"id": 7, "name": "Akıllı Fitness Bilekliği", "category": "Spor", "price": 1299, "stock": 33, "icon": "⌚", "desc": "Nabız ölçer, uyku takibi, 7 gün pil ömrü."},
    {"id": 8, "name": "Dambıl Seti 20kg", "category": "Spor", "price": 699, "stock": 28, "icon": "🏋️", "desc": "Ayarlanabilir ağırlık, neopren kaplama."},
    {"id": 9, "name": "Koşu Bandı", "category": "Spor", "price": 4999, "stock": 8, "icon": "🏃", "desc": "Katlanabilir, 12 program, eğim ayarı."},
    {"id": 10, "name": "Bestseller Kitap Seti", "category": "Hobi", "price": 249, "stock": 95, "icon": "📚", "desc": "2026 çok satanlar, 5 kitaplık özel set."},
    {"id": 11, "name": "Puzzle 1000 Parça", "category": "Hobi", "price": 179, "stock": 60, "icon": "🧩", "desc": "Doğa manzarası, parlak baskı kalitesi."},
    {"id": 12, "name": "Suluboya Seti Premium", "category": "Hobi", "price": 449, "stock": 42, "icon": "🎨", "desc": "48 renk, profesyonel fırçalar, ahşap kutu."},
    {"id": 13, "name": "Akıllı Ev Aydınlatma Seti", "category": "Ev", "price": 599, "stock": 35, "icon": "💡", "desc": "Wi-Fi kontrol, 16M renk, ses asistanı uyumlu."},
    {"id": 14, "name": "Robot Süpürge", "category": "Ev", "price": 3499, "stock": 15, "icon": "🤖", "desc": "Lazer navigasyon, otomatik boşaltma, uygulama kontrolü."},
    {"id": 15, "name": "Kahve Makinesi", "category": "Ev", "price": 2799, "stock": 20, "icon": "☕", "desc": "Espresso ve filtre kahve, dahili öğütücü."},
    {"id": 16, "name": "Pamuklu T-Shirt", "category": "Giyim", "price": 199, "stock": 120, "icon": "👕", "desc": "Organik pamuk, rahat kesim, 5 renk seçeneği."},
    {"id": 17, "name": "Deri Cüzdan", "category": "Giyim", "price": 449, "stock": 50, "icon": "👛", "desc": "El yapımı, RFID koruma, hediye kutusunda."},
    {"id": 18, "name": "Spor Ayakkabı", "category": "Giyim", "price": 1599, "stock": 40, "icon": "👟", "desc": "Hafif taban, nefes alan kumaş, yürüyüş ve koşu."},
    {"id": 19, "name": "Pro Premium Kablosuz Kulaklık", "category": "Elektronik", "price": 1798, "stock": 36, "icon": "🎧", "desc": "Aktif gürültü engelleme özellikli, 30 saat pil ömrü."},
    {"id": 20, "name": "Pro Mekanik Klavye Pro", "category": "Elektronik", "price": 2638, "stock": 17, "icon": "⌨️", "desc": "Cherry MX Blue switch, RGB aydınlatma, alüminyum gövde."},
    {"id": 21, "name": "Pro Ergonomik Mouse", "category": "Elektronik", "price": 1078, "stock": 30, "icon": "🖱️", "desc": "Dikey tasarım, bilek desteği, kablosuz bağlantı."},
    {"id": 22, "name": "Pro 4K Monitör 27\"", "category": "Elektronik", "price": 10198, "stock": 9, "icon": "🖥️", "desc": "IPS panel, HDR10, %99 sRGB renk doğruluğu."},
    {"id": 23, "name": "Pro Taşınabilir SSD 1TB", "category": "Elektronik", "price": 2278, "stock": 44, "icon": "💾", "desc": "USB-C, 1050MB/s okuma hızı, şok dayanıklı."},
    {"id": 24, "name": "Pro Yoga Matı ve Seti", "category": "Spor", "price": 418, "stock": 64, "icon": "🧘", "desc": "6mm kalınlık, kaymaz yüzey, taşıma çantası dahil."},
    {"id": 25, "name": "Pro Akıllı Fitness Bilekliği", "category": "Spor", "price": 1558, "stock": 26, "icon": "⌚", "desc": "Nabız ölçer, uyku takibi, 7 gün pil ömrü."},
    {"id": 26, "name": "Pro Dambıl Seti 20kg", "category": "Spor", "price": 838, "stock": 22, "icon": "🏋️", "desc": "Ayarlanabilir ağırlık, neopren kaplama."},
    {"id": 27, "name": "Pro Koşu Bandı", "category": "Spor", "price": 5998, "stock": 6, "icon": "🏃", "desc": "Katlanabilir, 12 program, eğim ayarı."},
    {"id": 28, "name": "Pro Bestseller Kitap Seti", "category": "Hobi", "price": 298, "stock": 76, "icon": "📚", "desc": "2026 çok satanlar, 5 kitaplık özel set."},
    {"id": 29, "name": "Pro Puzzle 1000 Parça", "category": "Hobi", "price": 214, "stock": 48, "icon": "🧩", "desc": "Doğa manzarası, parlak baskı kalitesi."},
    {"id": 30, "name": "Pro Suluboya Seti Premium", "category": "Hobi", "price": 538, "stock": 33, "icon": "🎨", "desc": "48 renk, profesyonel fırçalar, ahşap kutu."},
    {"id": 31, "name": "Pro Akıllı Ev Aydınlatma Seti", "category": "Ev", "price": 718, "stock": 28, "icon": "💡", "desc": "Wi-Fi kontrol, 16M renk, ses asistanı uyumlu."},
    {"id": 32, "name": "Pro Robot Süpürge", "category": "Ev", "price": 4198, "stock": 12, "icon": "🤖", "desc": "Lazer navigasyon, otomatik boşaltma, uygulama kontrolü."},
    {"id": 33, "name": "Pro Kahve Makinesi", "category": "Ev", "price": 3358, "stock": 16, "icon": "☕", "desc": "Espresso ve filtre kahve, dahili öğütücü."},
    {"id": 34, "name": "Pro Pamuklu T-Shirt", "category": "Giyim", "price": 238, "stock": 96, "icon": "👕", "desc": "Organik pamuk, rahat kesim, 5 renk seçeneği."},
    {"id": 35, "name": "Pro Deri Cüzdan", "category": "Giyim", "price": 538, "stock": 40, "icon": "👛", "desc": "El yapımı, RFID koruma, hediye kutusunda."},
    {"id": 36, "name": "Pro Spor Ayakkabı", "category": "Giyim", "price": 1918, "stock": 32, "icon": "👟", "desc": "Hafif taban, nefes alan kumaş, yürüyüş ve koşu."},
    {"id": 37, "name": "Ultra Premium Kablosuz Kulaklık", "category": "Elektronik", "price": 1798, "stock": 36, "icon": "🎧", "desc": "Aktif gürültü engelleme özellikli, 30 saat pil ömrü."},
    {"id": 38, "name": "Ultra Mekanik Klavye Pro", "category": "Elektronik", "price": 2638, "stock": 17, "icon": "⌨️", "desc": "Cherry MX Blue switch, RGB aydınlatma, alüminyum gövde."},
    {"id": 39, "name": "Ultra Ergonomik Mouse", "category": "Elektronik", "price": 1078, "stock": 30, "icon": "🖱️", "desc": "Dikey tasarım, bilek desteği, kablosuz bağlantı."},
    {"id": 40, "name": "Ultra 4K Monitör 27\"", "category": "Elektronik", "price": 10198, "stock": 9, "icon": "🖥️", "desc": "IPS panel, HDR10, %99 sRGB renk doğruluğu."},
    {"id": 41, "name": "Ultra Taşınabilir SSD 1TB", "category": "Elektronik", "price": 2278, "stock": 44, "icon": "💾", "desc": "USB-C, 1050MB/s okuma hızı, şok dayanıklı."},
    {"id": 42, "name": "Ultra Yoga Matı ve Seti", "category": "Spor", "price": 418, "stock": 64, "icon": "🧘", "desc": "6mm kalınlık, kaymaz yüzey, taşıma çantası dahil."},
    {"id": 43, "name": "Ultra Akıllı Fitness Bilekliği", "category": "Spor", "price": 1558, "stock": 26, "icon": "⌚", "desc": "Nabız ölçer, uyku takibi, 7 gün pil ömrü."},
    {"id": 44, "name": "Ultra Dambıl Seti 20kg", "category": "Spor", "price": 838, "stock": 22, "icon": "🏋️", "desc": "Ayarlanabilir ağırlık, neopren kaplama."},
    {"id": 45, "name": "Ultra Koşu Bandı", "category": "Spor", "price": 5998, "stock": 6, "icon": "🏃", "desc": "Katlanabilir, 12 program, eğim ayarı."},
    {"id": 46, "name": "Ultra Bestseller Kitap Seti", "category": "Hobi", "price": 298, "stock": 76, "icon": "📚", "desc": "2026 çok satanlar, 5 kitaplık özel set."},
    {"id": 47, "name": "Ultra Puzzle 1000 Parça", "category": "Hobi", "price": 214, "stock": 48, "icon": "🧩", "desc": "Doğa manzarası, parlak baskı kalitesi."},
    {"id": 48, "name": "Ultra Suluboya Seti Premium", "category": "Hobi", "price": 538, "stock": 33, "icon": "🎨", "desc": "48 renk, profesyonel fırçalar, ahşap kutu."},
    {"id": 49, "name": "Ultra Akıllı Ev Aydınlatma Seti", "category": "Ev", "price": 718, "stock": 28, "icon": "💡", "desc": "Wi-Fi kontrol, 16M renk, ses asistanı uyumlu."},
    {"id": 50, "name": "Ultra Robot Süpürge", "category": "Ev", "price": 4198, "stock": 12, "icon": "🤖", "desc": "Lazer navigasyon, otomatik boşaltma, uygulama kontrolü."},
    {"id": 51, "name": "Ultra Kahve Makinesi", "category": "Ev", "price": 3358, "stock": 16, "icon": "☕", "desc": "Espresso ve filtre kahve, dahili öğütücü."},
    {"id": 52, "name": "Ultra Pamuklu T-Shirt", "category": "Giyim", "price": 238, "stock": 96, "icon": "👕", "desc": "Organik pamuk, rahat kesim, 5 renk seçeneği."},
    {"id": 53, "name": "Ultra Deri Cüzdan", "category": "Giyim", "price": 538, "stock": 40, "icon": "👛", "desc": "El yapımı, RFID koruma, hediye kutusunda."},
    {"id": 54, "name": "Ultra Spor Ayakkabı", "category": "Giyim", "price": 1918, "stock": 32, "icon": "👟", "desc": "Hafif taban, nefes alan kumaş, yürüyüş ve koşu."},
    {"id": 55, "name": "Lite Premium Kablosuz Kulaklık", "category": "Elektronik", "price": 1199, "stock": 67, "icon": "🎧", "desc": "Aktif gürültü engelleme özellikli, 30 saat pil ömrü."},
    {"id": 56, "name": "Lite Mekanik Klavye Pro", "category": "Elektronik", "price": 1759, "stock": 33, "icon": "⌨️", "desc": "Cherry MX Blue switch, RGB aydınlatma, alüminyum gövde."},
    {"id": 57, "name": "Lite Ergonomik Mouse", "category": "Elektronik", "price": 719, "stock": 57, "icon": "🖱️", "desc": "Dikey tasarım, bilek desteği, kablosuz bağlantı."},
    {"id": 58, "name": "Lite 4K Monitör 27\"", "category": "Elektronik", "price": 6799, "stock": 18, "icon": "🖥️", "desc": "IPS panel, HDR10, %99 sRGB renk doğruluğu."},
    {"id": 59, "name": "Lite Taşınabilir SSD 1TB", "category": "Elektronik", "price": 1519, "stock": 82, "icon": "💾", "desc": "USB-C, 1050MB/s okuma hızı, şok dayanıklı."},
    {"id": 60, "name": "Lite Yoga Matı ve Seti", "category": "Spor", "price": 279, "stock": 120, "icon": "🧘", "desc": "6mm kalınlık, kaymaz yüzey, taşıma çantası dahil."},
    {"id": 61, "name": "Lite Akıllı Fitness Bilekliği", "category": "Spor", "price": 1039, "stock": 49, "icon": "⌚", "desc": "Nabız ölçer, uyku takibi, 7 gün pil ömrü."},
    {"id": 62, "name": "Lite Dambıl Seti 20kg", "category": "Spor", "price": 559, "stock": 42, "icon": "🏋️", "desc": "Ayarlanabilir ağırlık, neopren kaplama."},
    {"id": 63, "name": "Lite Koşu Bandı", "category": "Spor", "price": 3999, "stock": 12, "icon": "🏃", "desc": "Katlanabilir, 12 program, eğim ayarı."},
    {"id": 64, "name": "Lite Bestseller Kitap Seti", "category": "Hobi", "price": 199, "stock": 142, "icon": "📚", "desc": "2026 çok satanlar, 5 kitaplık özel set."},
    {"id": 65, "name": "Lite Puzzle 1000 Parça", "category": "Hobi", "price": 143, "stock": 90, "icon": "🧩", "desc": "Doğa manzarası, parlak baskı kalitesi."},
    {"id": 66, "name": "Lite Suluboya Seti Premium", "category": "Hobi", "price": 359, "stock": 63, "icon": "🎨", "desc": "48 renk, profesyonel fırçalar, ahşap kutu."},
    {"id": 67, "name": "Lite Akıllı Ev Aydınlatma Seti", "category": "Ev", "price": 479, "stock": 52, "icon": "💡", "desc": "Wi-Fi kontrol, 16M renk, ses asistanı uyumlu."},
    {"id": 68, "name": "Lite Robot Süpürge", "category": "Ev", "price": 2799, "stock": 22, "icon": "🤖", "desc": "Lazer navigasyon, otomatik boşaltma, uygulama kontrolü."},
    {"id": 69, "name": "Lite Kahve Makinesi", "category": "Ev", "price": 2239, "stock": 30, "icon": "☕", "desc": "Espresso ve filtre kahve, dahili öğütücü."},
    {"id": 70, "name": "Lite Pamuklu T-Shirt", "category": "Giyim", "price": 159, "stock": 180, "icon": "👕", "desc": "Organik pamuk, rahat kesim, 5 renk seçeneği."},
    {"id": 71, "name": "Lite Deri Cüzdan", "category": "Giyim", "price": 359, "stock": 75, "icon": "👛", "desc": "El yapımı, RFID koruma, hediye kutusunda."},
    {"id": 72, "name": "Lite Spor Ayakkabı", "category": "Giyim", "price": 1279, "stock": 60, "icon": "👟", "desc": "Hafif taban, nefes alan kumaş, yürüyüş ve koşu."},
    {"id": 73, "name": "Max Premium Kablosuz Kulaklık", "category": "Elektronik", "price": 1798, "stock": 67, "icon": "🎧", "desc": "Aktif gürültü engelleme özellikli, 30 saat pil ömrü."},
    {"id": 74, "name": "Max Mekanik Klavye Pro", "category": "Elektronik", "price": 2638, "stock": 33, "icon": "⌨️", "desc": "Cherry MX Blue switch, RGB aydınlatma, alüminyum gövde."},
    {"id": 75, "name": "Max Ergonomik Mouse", "category": "Elektronik", "price": 1078, "stock": 57, "icon": "🖱️", "desc": "Dikey tasarım, bilek desteği, kablosuz bağlantı."},
    {"id": 76, "name": "Max 4K Monitör 27\"", "category": "Elektronik", "price": 10198, "stock": 18, "icon": "🖥️", "desc": "IPS panel, HDR10, %99 sRGB renk doğruluğu."},
    {"id": 77, "name": "Max Taşınabilir SSD 1TB", "category": "Elektronik", "price": 2278, "stock": 82, "icon": "💾", "desc": "USB-C, 1050MB/s okuma hızı, şok dayanıklı."},
    {"id": 78, "name": "Max Yoga Matı ve Seti", "category": "Spor", "price": 418, "stock": 120, "icon": "🧘", "desc": "6mm kalınlık, kaymaz yüzey, taşıma çantası dahil."},
    {"id": 79, "name": "Max Akıllı Fitness Bilekliği", "category": "Spor", "price": 1558, "stock": 49, "icon": "⌚", "desc": "Nabız ölçer, uyku takibi, 7 gün pil ömrü."},
    {"id": 80, "name": "Max Dambıl Seti 20kg", "category": "Spor", "price": 838, "stock": 42, "icon": "🏋️", "desc": "Ayarlanabilir ağırlık, neopren kaplama."},
    {"id": 81, "name": "Max Koşu Bandı", "category": "Spor", "price": 5998, "stock": 12, "icon": "🏃", "desc": "Katlanabilir, 12 program, eğim ayarı."},
    {"id": 82, "name": "Max Bestseller Kitap Seti", "category": "Hobi", "price": 298, "stock": 142, "icon": "📚", "desc": "2026 çok satanlar, 5 kitaplık özel set."},
    {"id": 83, "name": "Max Puzzle 1000 Parça", "category": "Hobi", "price": 214, "stock": 90, "icon": "🧩", "desc": "Doğa manzarası, parlak baskı kalitesi."},
    {"id": 84, "name": "Max Suluboya Seti Premium", "category": "Hobi", "price": 538, "stock": 63, "icon": "🎨", "desc": "48 renk, profesyonel fırçalar, ahşap kutu."},
    {"id": 85, "name": "Max Akıllı Ev Aydınlatma Seti", "category": "Ev", "price": 718, "stock": 52, "icon": "💡", "desc": "Wi-Fi kontrol, 16M renk, ses asistanı uyumlu."},
    {"id": 86, "name": "Max Robot Süpürge", "category": "Ev", "price": 4198, "stock": 22, "icon": "🤖", "desc": "Lazer navigasyon, otomatik boşaltma, uygulama kontrolü."},
    {"id": 87, "name": "Max Kahve Makinesi", "category": "Ev", "price": 3358, "stock": 30, "icon": "☕", "desc": "Espresso ve filtre kahve, dahili öğütücü."},
    {"id": 88, "name": "Max Pamuklu T-Shirt", "category": "Giyim", "price": 238, "stock": 180, "icon": "👕", "desc": "Organik pamuk, rahat kesim, 5 renk seçeneği."},
    {"id": 89, "name": "Max Deri Cüzdan", "category": "Giyim", "price": 538, "stock": 75, "icon": "👛", "desc": "El yapımı, RFID koruma, hediye kutusunda."},
    {"id": 90, "name": "Max Spor Ayakkabı", "category": "Giyim", "price": 1918, "stock": 60, "icon": "👟", "desc": "Hafif taban, nefes alan kumaş, yürüyüş ve koşu."},
    {"id": 91, "name": "Plus Premium Kablosuz Kulaklık", "category": "Elektronik", "price": 1199, "stock": 67, "icon": "🎧", "desc": "Aktif gürültü engelleme özellikli, 30 saat pil ömrü."},
    {"id": 92, "name": "Plus Mekanik Klavye Pro", "category": "Elektronik", "price": 1759, "stock": 33, "icon": "⌨️", "desc": "Cherry MX Blue switch, RGB aydınlatma, alüminyum gövde."},
    {"id": 93, "name": "Plus Ergonomik Mouse", "category": "Elektronik", "price": 719, "stock": 57, "icon": "🖱️", "desc": "Dikey tasarım, bilek desteği, kablosuz bağlantı."},
    {"id": 94, "name": "Plus 4K Monitör 27\"", "category": "Elektronik", "price": 6799, "stock": 18, "icon": "🖥️", "desc": "IPS panel, HDR10, %99 sRGB renk doğruluğu."},
    {"id": 95, "name": "Plus Taşınabilir SSD 1TB", "category": "Elektronik", "price": 1519, "stock": 82, "icon": "💾", "desc": "USB-C, 1050MB/s okuma hızı, şok dayanıklı."},
    {"id": 96, "name": "Plus Yoga Matı ve Seti", "category": "Spor", "price": 279, "stock": 120, "icon": "🧘", "desc": "6mm kalınlık, kaymaz yüzey, taşıma çantası dahil."},
    {"id": 97, "name": "Plus Akıllı Fitness Bilekliği", "category": "Spor", "price": 1039, "stock": 49, "icon": "⌚", "desc": "Nabız ölçer, uyku takibi, 7 gün pil ömrü."},
    {"id": 98, "name": "Plus Dambıl Seti 20kg", "category": "Spor", "price": 559, "stock": 42, "icon": "🏋️", "desc": "Ayarlanabilir ağırlık, neopren kaplama."},
    {"id": 99, "name": "Plus Koşu Bandı", "category": "Spor", "price": 3999, "stock": 12, "icon": "🏃", "desc": "Katlanabilir, 12 program, eğim ayarı."},
    {"id": 100, "name": "Plus Bestseller Kitap Seti", "category": "Hobi", "price": 199, "stock": 142, "icon": "📚", "desc": "2026 çok satanlar, 5 kitaplık özel set."},
    {"id": 101, "name": "Plus Puzzle 1000 Parça", "category": "Hobi", "price": 143, "stock": 90, "icon": "🧩", "desc": "Doğa manzarası, parlak baskı kalitesi."},
    {"id": 102, "name": "Plus Suluboya Seti Premium", "category": "Hobi", "price": 359, "stock": 63, "icon": "🎨", "desc": "48 renk, profesyonel fırçalar, ahşap kutu."},
    {"id": 103, "name": "Plus Akıllı Ev Aydınlatma Seti", "category": "Ev", "price": 479, "stock": 52, "icon": "💡", "desc": "Wi-Fi kontrol, 16M renk, ses asistanı uyumlu."},
    {"id": 104, "name": "Plus Robot Süpürge", "category": "Ev", "price": 2799, "stock": 22, "icon": "🤖", "desc": "Lazer navigasyon, otomatik boşaltma, uygulama kontrolü."},
    {"id": 105, "name": "Plus Kahve Makinesi", "category": "Ev", "price": 2239, "stock": 30, "icon": "☕", "desc": "Espresso ve filtre kahve, dahili öğütücü."},
    {"id": 106, "name": "Plus Pamuklu T-Shirt", "category": "Giyim", "price": 159, "stock": 180, "icon": "👕", "desc": "Organik pamuk, rahat kesim, 5 renk seçeneği."},
    {"id": 107, "name": "Plus Deri Cüzdan", "category": "Giyim", "price": 359, "stock": 75, "icon": "👛", "desc": "El yapımı, RFID koruma, hediye kutusunda."},
    {"id": 108, "name": "Plus Spor Ayakkabı", "category": "Giyim", "price": 1279, "stock": 60, "icon": "👟", "desc": "Hafif taban, nefes alan kumaş, yürüyüş ve koşu."},
    {"id": 109, "name": "V2 Premium Kablosuz Kulaklık", "category": "Elektronik", "price": 1199, "stock": 67, "icon": "🎧", "desc": "Aktif gürültü engelleme özellikli, 30 saat pil ömrü."},
    {"id": 110, "name": "V2 Mekanik Klavye Pro", "category": "Elektronik", "price": 1759, "stock": 33, "icon": "⌨️", "desc": "Cherry MX Blue switch, RGB aydınlatma, alüminyum gövde."},
    {"id": 111, "name": "V2 Ergonomik Mouse", "category": "Elektronik", "price": 719, "stock": 57, "icon": "🖱️", "desc": "Dikey tasarım, bilek desteği, kablosuz bağlantı."},
    {"id": 112, "name": "V2 4K Monitör 27\"", "category": "Elektronik", "price": 6799, "stock": 18, "icon": "🖥️", "desc": "IPS panel, HDR10, %99 sRGB renk doğruluğu."},
    {"id": 113, "name": "V2 Taşınabilir SSD 1TB", "category": "Elektronik", "price": 1519, "stock": 82, "icon": "💾", "desc": "USB-C, 1050MB/s okuma hızı, şok dayanıklı."},
    {"id": 114, "name": "V2 Yoga Matı ve Seti", "category": "Spor", "price": 279, "stock": 120, "icon": "🧘", "desc": "6mm kalınlık, kaymaz yüzey, taşıma çantası dahil."},
    {"id": 115, "name": "V2 Akıllı Fitness Bilekliği", "category": "Spor", "price": 1039, "stock": 49, "icon": "⌚", "desc": "Nabız ölçer, uyku takibi, 7 gün pil ömrü."},
    {"id": 116, "name": "V2 Dambıl Seti 20kg", "category": "Spor", "price": 559, "stock": 42, "icon": "🏋️", "desc": "Ayarlanabilir ağırlık, neopren kaplama."},
    {"id": 117, "name": "V2 Koşu Bandı", "category": "Spor", "price": 3999, "stock": 12, "icon": "🏃", "desc": "Katlanabilir, 12 program, eğim ayarı."},
    {"id": 118, "name": "V2 Bestseller Kitap Seti", "category": "Hobi", "price": 199, "stock": 142, "icon": "📚", "desc": "2026 çok satanlar, 5 kitaplık özel set."},
    {"id": 119, "name": "V2 Puzzle 1000 Parça", "category": "Hobi", "price": 143, "stock": 90, "icon": "🧩", "desc": "Doğa manzarası, parlak baskı kalitesi."},
    {"id": 120, "name": "V2 Suluboya Seti Premium", "category": "Hobi", "price": 359, "stock": 63, "icon": "🎨", "desc": "48 renk, profesyonel fırçalar, ahşap kutu."},
    {"id": 121, "name": "V2 Akıllı Ev Aydınlatma Seti", "category": "Ev", "price": 479, "stock": 52, "icon": "💡", "desc": "Wi-Fi kontrol, 16M renk, ses asistanı uyumlu."},
    {"id": 122, "name": "V2 Robot Süpürge", "category": "Ev", "price": 2799, "stock": 22, "icon": "🤖", "desc": "Lazer navigasyon, otomatik boşaltma, uygulama kontrolü."},
    {"id": 123, "name": "V2 Kahve Makinesi", "category": "Ev", "price": 2239, "stock": 30, "icon": "☕", "desc": "Espresso ve filtre kahve, dahili öğütücü."},
    {"id": 124, "name": "V2 Pamuklu T-Shirt", "category": "Giyim", "price": 159, "stock": 180, "icon": "👕", "desc": "Organik pamuk, rahat kesim, 5 renk seçeneği."},
    {"id": 125, "name": "V2 Deri Cüzdan", "category": "Giyim", "price": 359, "stock": 75, "icon": "👛", "desc": "El yapımı, RFID koruma, hediye kutusunda."},
    {"id": 126, "name": "V2 Spor Ayakkabı", "category": "Giyim", "price": 1279, "stock": 60, "icon": "👟", "desc": "Hafif taban, nefes alan kumaş, yürüyüş ve koşu."},
    {"id": 127, "name": "Premium Premium Kablosuz Kulaklık", "category": "Elektronik", "price": 1798, "stock": 67, "icon": "🎧", "desc": "Aktif gürültü engelleme özellikli, 30 saat pil ömrü."},
    {"id": 128, "name": "Premium Mekanik Klavye Pro", "category": "Elektronik", "price": 2638, "stock": 33, "icon": "⌨️", "desc": "Cherry MX Blue switch, RGB aydınlatma, alüminyum gövde."},
    {"id": 129, "name": "Premium Ergonomik Mouse", "category": "Elektronik", "price": 1078, "stock": 57, "icon": "🖱️", "desc": "Dikey tasarım, bilek desteği, kablosuz bağlantı."},
    {"id": 130, "name": "Premium 4K Monitör 27\"", "category": "Elektronik", "price": 10198, "stock": 18, "icon": "🖥️", "desc": "IPS panel, HDR10, %99 sRGB renk doğruluğu."},
    {"id": 131, "name": "Premium Taşınabilir SSD 1TB", "category": "Elektronik", "price": 2278, "stock": 82, "icon": "💾", "desc": "USB-C, 1050MB/s okuma hızı, şok dayanıklı."},
    {"id": 132, "name": "Premium Yoga Matı ve Seti", "category": "Spor", "price": 418, "stock": 120, "icon": "🧘", "desc": "6mm kalınlık, kaymaz yüzey, taşıma çantası dahil."},
    {"id": 133, "name": "Premium Akıllı Fitness Bilekliği", "category": "Spor", "price": 1558, "stock": 49, "icon": "⌚", "desc": "Nabız ölçer, uyku takibi, 7 gün pil ömrü."},
    {"id": 134, "name": "Premium Dambıl Seti 20kg", "category": "Spor", "price": 838, "stock": 42, "icon": "🏋️", "desc": "Ayarlanabilir ağırlık, neopren kaplama."},
    {"id": 135, "name": "Premium Koşu Bandı", "category": "Spor", "price": 5998, "stock": 12, "icon": "🏃", "desc": "Katlanabilir, 12 program, eğim ayarı."},
    {"id": 136, "name": "Premium Bestseller Kitap Seti", "category": "Hobi", "price": 298, "stock": 142, "icon": "📚", "desc": "2026 çok satanlar, 5 kitaplık özel set."},
    {"id": 137, "name": "Premium Puzzle 1000 Parça", "category": "Hobi", "price": 214, "stock": 90, "icon": "🧩", "desc": "Doğa manzarası, parlak baskı kalitesi."},
    {"id": 138, "name": "Premium Suluboya Seti Premium", "category": "Hobi", "price": 538, "stock": 63, "icon": "🎨", "desc": "48 renk, profesyonel fırçalar, ahşap kutu."},
    {"id": 139, "name": "Premium Akıllı Ev Aydınlatma Seti", "category": "Ev", "price": 718, "stock": 52, "icon": "💡", "desc": "Wi-Fi kontrol, 16M renk, ses asistanı uyumlu."},
    {"id": 140, "name": "Premium Robot Süpürge", "category": "Ev", "price": 4198, "stock": 22, "icon": "🤖", "desc": "Lazer navigasyon, otomatik boşaltma, uygulama kontrolü."},
    {"id": 141, "name": "Premium Kahve Makinesi", "category": "Ev", "price": 3358, "stock": 30, "icon": "☕", "desc": "Espresso ve filtre kahve, dahili öğütücü."},
    {"id": 142, "name": "Premium Pamuklu T-Shirt", "category": "Giyim", "price": 238, "stock": 180, "icon": "👕", "desc": "Organik pamuk, rahat kesim, 5 renk seçeneği."},
    {"id": 143, "name": "Premium Deri Cüzdan", "category": "Giyim", "price": 538, "stock": 75, "icon": "👛", "desc": "El yapımı, RFID koruma, hediye kutusunda."},
    {"id": 144, "name": "Premium Spor Ayakkabı", "category": "Giyim", "price": 1918, "stock": 60, "icon": "👟", "desc": "Hafif taban, nefes alan kumaş, yürüyüş ve koşu."},
]

# ── Varsayılan Kullanıcılar ──
DEFAULT_USERS = [
    {"id": 1, "name": "İsmail Özdemir", "email": "admin@shopai.com",  "password": "123456", "role": "admin", "date": "2026-01-15"},
    {"id": 2, "name": "Ayşe Demir",     "email": "ayse@shopai.com",   "password": "123456", "role": "user",  "date": "2026-06-01"},
    {"id": 3, "name": "Fatma Yılmaz",   "email": "fatma@shopai.com",  "password": "123456", "role": "user",  "date": "2026-06-02"},
    {"id": 4, "name": "Ali Yücel",      "email": "ali@shopai.com",    "password": "123456", "role": "user",  "date": "2026-06-03"},
]

# ── In-Memory State ──
users_db = list(DEFAULT_USERS)
carts_db = {}      # {user_email: [{product_id, qty}]}
orders_db = []     # [{id, date, items, total, user_email, status}]
interactions_db = []  # [{user_id, product_id, type, timestamp}]
_next_user_id = 5

# ── Yardımcı Fonksiyonlar ──

def get_categories():
    """Benzersiz kategori listesi"""
    return list(set(p["category"] for p in CATALOG))


def get_products_by_category(category=None):
    """Kategoriye göre filtrelenmiş ürün listesi"""
    if category and category != "Tümü":
        return [p for p in CATALOG if p["category"] == category]
    return CATALOG


def get_product_by_id(product_id):
    """ID'ye göre ürün bul"""
    return next((p for p in CATALOG if p["id"] == product_id), None)


def authenticate(email, password):
    """Kullanıcı doğrulama — başarılıysa kullanıcı dict döner"""
    user = next(
        (u for u in users_db if u["email"].lower() == email.lower() and u["password"] == password),
        None
    )
    if user:
        token = secrets.token_hex(16)
        return {
            "token": token,
            "user": {k: v for k, v in user.items() if k != "password"}
        }
    return None


def register_user(name, email, password, role="user"):
    """Yeni kullanıcı kaydı"""
    global _next_user_id
    if any(u["email"].lower() == email.lower() for u in users_db):
        return {"error": "Bu e-posta adresi zaten kayıtlı."}
    
    new_user = {
        "id": _next_user_id,
        "name": name,
        "email": email,
        "password": password,
        "role": role,
        "date": datetime.now().strftime("%Y-%m-%d")
    }
    _next_user_id += 1
    users_db.append(new_user)
    return {"success": True, "user_id": new_user["id"]}


def get_recommendations(user_id, top_n=8):
    """Basit öneri motoru — kategori bazlı benzerlik skoru"""
    import random
    random.seed(user_id)
    
    scored = []
    for p in CATALOG:
        # Kullanıcı ID'sine göre deterministik skor üret
        score_base = hash(f"{user_id}-{p['id']}") % 100 / 100
        score = max(0.55, min(0.99, score_base * 0.4 + 0.6))
        scored.append({**p, "similarity_score": round(score, 2)})
    
    scored.sort(key=lambda x: x["similarity_score"], reverse=True)
    return scored[:top_n]


def add_to_cart(user_email, product_id, qty=1):
    """Sepete ürün ekle"""
    if user_email not in carts_db:
        carts_db[user_email] = []
    
    cart = carts_db[user_email]
    existing = next((item for item in cart if item["product_id"] == product_id), None)
    
    if existing:
        existing["qty"] += qty
    else:
        cart.append({"product_id": product_id, "qty": qty})
    
    return get_cart(user_email)


def get_cart(user_email):
    """Kullanıcının sepetini ürün detaylarıyla birlikte döndür"""
    raw_cart = carts_db.get(user_email, [])
    detailed = []
    for item in raw_cart:
        product = get_product_by_id(item["product_id"])
        if product:
            detailed.append({
                **product,
                "qty": item["qty"],
                "line_total": product["price"] * item["qty"]
            })
    
    subtotal = sum(d["line_total"] for d in detailed)
    shipping = 0 if subtotal > 500 else 29.90
    
    return {
        "items": detailed,
        "subtotal": subtotal,
        "shipping": shipping,
        "total": subtotal + shipping
    }


def remove_from_cart(user_email, product_id):
    """Sepetten ürün çıkar"""
    if user_email in carts_db:
        carts_db[user_email] = [i for i in carts_db[user_email] if i["product_id"] != product_id]
    return get_cart(user_email)


def create_order(user_email, shipping_address=None, payment_method=None):
    """Sepetteki ürünlerden sipariş oluştur"""
    cart_data = get_cart(user_email)
    if not cart_data["items"]:
        return {"error": "Sepet boş."}
    
    order = {
        "id": f"SHP-{secrets.token_hex(4).upper()}",
        "date": datetime.now().isoformat(),
        "items": [{"name": i["name"], "qty": i["qty"], "price": i["price"], "icon": i["icon"]} for i in cart_data["items"]],
        "subtotal": cart_data["subtotal"],
        "shipping": cart_data["shipping"],
        "total": cart_data["total"],
        "status": "processing",
        "user_email": user_email,
        "shipping_address": shipping_address,
        "payment_method": payment_method
    }
    
    orders_db.insert(0, order)
    carts_db[user_email] = []  # Sepeti temizle
    
    return order


def get_user_orders(user_email):
    """Kullanıcının siparişlerini getir"""
    return [o for o in orders_db if o["user_email"] == user_email]


def cancel_order(user_email, order_id):
    """Siparişi iptal et"""
    order = next((o for o in orders_db if o["user_email"].lower() == user_email.lower() and o["id"] == order_id), None)
    if not order:
        return {"error": "Sipariş bulunamadı."}
    order["status"] = "cancelled"
    return {"success": True, "order": order}


def log_interaction(user_id, product_id, interaction_type):
    """Kullanıcı etkileşimi kaydet"""
    interactions_db.append({
        "user_id": user_id,
        "product_id": product_id,
        "type": interaction_type,
        "timestamp": datetime.now().isoformat()
    })
    return True


def get_system_stats():
    """Admin paneli için sistem istatistikleri"""
    return {
        "total_users": len(users_db),
        "total_products": len(CATALOG),
        "total_orders": len(orders_db),
        "total_interactions": len(interactions_db),
        "categories": get_categories(),
        "api_version": "1.0.0",
        "python_version": "3.14.3",
        "uptime": datetime.now().isoformat()
    }


def update_user_details(email, name):
    """Kullanıcının adını/soyadını güncelle"""
    user = next((u for u in users_db if u["email"].lower() == email.lower()), None)
    if not user:
        return {"error": "Kullanıcı bulunamadı."}
    user["name"] = name
    return {"success": True, "user": {k: v for k, v in user.items() if k != "password"}}


def change_user_password(email, old_password, new_password):
    """Kullanıcının şifresini değiştir"""
    user = next((u for u in users_db if u["email"].lower() == email.lower()), None)
    if not user:
        return {"error": "Kullanıcı bulunamadı."}
    print(f"DEBUG change_user_password: user password={repr(user['password'])}, old password={repr(old_password)}")
    if user["password"] != old_password:
        return {"error": "Mevcut şifre hatalı."}
    user["password"] = new_password
    return {"success": True}


def delete_user_account(email):
    """Kullanıcı hesabını sil"""
    user = next((u for u in users_db if u["email"].lower() == email.lower()), None)
    if not user:
        return {"error": "Kullanıcı bulunamadı."}
    users_db[:] = [u for u in users_db if u["email"].lower() != email.lower()]
    if email in carts_db:
        del carts_db[email]
    return {"success": True}

