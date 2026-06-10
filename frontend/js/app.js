// ═══════════════════════════════════════════════
// ShopAI — Akıllı E-Ticaret Öneri Sistemi
// Role-Based Frontend Application Controller
// ═══════════════════════════════════════════════

// API URL — Render canlı adresini kullanır, lokalde ise localhost:8000'e düşer
const API_BASE = window.SHOPAI_API_URL || 
  (location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    ? 'http://localhost:8000'
    : 'https://akilli-e-ticaret-oneri-sistemi-rtqm.onrender.com');
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ── API Service Layer ──
const Api = {
  online: false,

  async _fetch(path, options = {}) {
    try {
      const url = `${API_BASE}${path}`;
      const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || err.error || `HTTP ${res.status}`);
      }
      this.online = true;
      return await res.json();
    } catch (e) {
      this.online = false;
      throw e;
    }
  },

  // Health
  async health() { return this._fetch('/api/health'); },

  // Auth
  async login(email, password) {
    return this._fetch('/api/v1/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password })
    });
  },
  async register(name, email, password, role) {
    return this._fetch('/api/v1/auth/register', {
      method: 'POST', body: JSON.stringify({ name, email, password, role })
    });
  },

  // Products
  async getProducts(category) {
    const q = category && category !== 'Tümü' ? `?category=${encodeURIComponent(category)}` : '';
    return this._fetch(`/api/v1/products${q}`);
  },
  async getProduct(id) { return this._fetch(`/api/v1/products/${id}`); },

  // Recommendations
  async getRecommendations(userId, topN = 8) {
    return this._fetch(`/api/v1/recommendations/${userId}?top_n=${topN}`);
  },

  // Users (admin)
  async getUsers() { return this._fetch('/api/v1/users'); },

  // Cart
  async getCart(email) { return this._fetch(`/api/v1/cart/${encodeURIComponent(email)}`); },
  async addToCart(email, productId, qty = 1) {
    return this._fetch(`/api/v1/cart/${encodeURIComponent(email)}`, {
      method: 'POST', body: JSON.stringify({ product_id: productId, qty })
    });
  },
  async removeFromCart(email, productId) {
    return this._fetch(`/api/v1/cart/${encodeURIComponent(email)}/${productId}`, { method: 'DELETE' });
  },

  // Orders
  async getOrders(email) { return this._fetch(`/api/v1/orders/${encodeURIComponent(email)}`); },
  async createOrder(email, shippingAddress = null, paymentMethod = null) {
    return this._fetch(`/api/v1/orders/${encodeURIComponent(email)}`, {
      method: 'POST',
      body: JSON.stringify({ shipping_address: shippingAddress, payment_method: paymentMethod })
    });
  },
  async cancelOrder(email, orderId) {
    return this._fetch(`/api/v1/orders/${encodeURIComponent(email)}/cancel/${encodeURIComponent(orderId)}`, {
      method: 'POST'
    });
  },

  // Interactions
  async logInteraction(userId, productId, type) {
    return this._fetch('/api/v1/interactions', {
      method: 'POST', body: JSON.stringify({ user_id: userId, product_id: productId, type })
    }).catch(() => {}); // Etkileşim kaydı sessizce başarısız olabilir
  },

  // Profile & Account Management
  async updateProfileDetails(email, name) {
    return this._fetch(`/api/v1/users/profile/update-details/${encodeURIComponent(email)}`, {
      method: 'POST', body: JSON.stringify({ name })
    });
  },
  async changePassword(email, oldPassword, newPassword) {
    return this._fetch(`/api/v1/users/profile/change-password/${encodeURIComponent(email)}`, {
      method: 'POST', body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
    });
  },
  async deleteAccount(email) {
    return this._fetch(`/api/v1/users/profile/${encodeURIComponent(email)}`, {
      method: 'DELETE'
    });
  }
};

// ── Default Users ──
const DEFAULT_USERS = [
  { name: 'İsmail Özdemir', email: 'admin@shopai.com',  password: '123456', role: 'admin', date: '2026-01-15' },
  { name: 'Ayşe Demir',     email: 'ayse@shopai.com',   password: '123456', role: 'user',  date: '2026-06-01' },
  { name: 'Fatma Yılmaz',   email: 'fatma@shopai.com',  password: '123456', role: 'user',  date: '2026-06-02' },
  { name: 'Ali Yücel',      email: 'ali@shopai.com',    password: '123456', role: 'user',  date: '2026-06-03' },
];

// Mevcut önbellekteki eski kullanıcıları temizle ki yeni liste devreye girsin
localStorage.removeItem('shopai_users');

// ── Product Catalog ──
const CATALOG = [
  {id: 1, name: "Premium Kablosuz Kulaklık", category: "Elektronik", price: 1499, stock: 45, icon: "🎧", desc: "Aktif gürültü engelleme özellikli, 30 saat pil ömrü."},
  {id: 2, name: "Mekanik Klavye Pro", category: "Elektronik", price: 2199, stock: 22, icon: "⌨️", desc: "Cherry MX Blue switch, RGB aydınlatma, alüminyum gövde."},
  {id: 3, name: "Ergonomik Mouse", category: "Elektronik", price: 899, stock: 38, icon: "🖱️", desc: "Dikey tasarım, bilek desteği, kablosuz bağlantı."},
  {id: 4, name: "4K Monitör 27\"", category: "Elektronik", price: 8499, stock: 12, icon: "🖥️", desc: "IPS panel, HDR10, %99 sRGB renk doğruluğu."},
  {id: 5, name: "Taşınabilir SSD 1TB", category: "Elektronik", price: 1899, stock: 55, icon: "💾", desc: "USB-C, 1050MB/s okuma hızı, şok dayanıklı."},
  {id: 6, name: "Yoga Matı ve Seti", category: "Spor", price: 349, stock: 80, icon: "🧘", desc: "6mm kalınlık, kaymaz yüzey, taşıma çantası dahil."},
  {id: 7, name: "Akıllı Fitness Bilekliği", category: "Spor", price: 1299, stock: 33, icon: "⌚", desc: "Nabız ölçer, uyku takibi, 7 gün pil ömrü."},
  {id: 8, name: "Dambıl Seti 20kg", category: "Spor", price: 699, stock: 28, icon: "🏋️", desc: "Ayarlanabilir ağırlık, neopren kaplama."},
  {id: 9, name: "Koşu Bandı", category: "Spor", price: 4999, stock: 8, icon: "🏃", desc: "Katlanabilir, 12 program, eğim ayarı."},
  {id: 10, name: "Bestseller Kitap Seti", category: "Hobi", price: 249, stock: 95, icon: "📚", desc: "2026 çok satanlar, 5 kitaplık özel set."},
  {id: 11, name: "Puzzle 1000 Parça", category: "Hobi", price: 179, stock: 60, icon: "🧩", desc: "Doğa manzarası, parlak baskı kalitesi."},
  {id: 12, name: "Suluboya Seti Premium", category: "Hobi", price: 449, stock: 42, icon: "🎨", desc: "48 renk, profesyonel fırçalar, ahşap kutu."},
  {id: 13, name: "Akıllı Ev Aydınlatma Seti", category: "Ev", price: 599, stock: 35, icon: "💡", desc: "Wi-Fi kontrol, 16M renk, ses asistanı uyumlu."},
  {id: 14, name: "Robot Süpürge", category: "Ev", price: 3499, stock: 15, icon: "🤖", desc: "Lazer navigasyon, otomatik boşaltma, uygulama kontrolü."},
  {id: 15, name: "Kahve Makinesi", category: "Ev", price: 2799, stock: 20, icon: "☕", desc: "Espresso ve filtre kahve, dahili öğütücü."},
  {id: 16, name: "Pamuklu T-Shirt", category: "Giyim", price: 199, stock: 120, icon: "👕", desc: "Organik pamuk, rahat kesim, 5 renk seçeneği."},
  {id: 17, name: "Deri Cüzdan", category: "Giyim", price: 449, stock: 50, icon: "👛", desc: "El yapımı, RFID koruma, hediye kutusunda."},
  {id: 18, name: "Spor Ayakkabı", category: "Giyim", price: 1599, stock: 40, icon: "👟", desc: "Hafif taban, nefes alan kumaş, yürüyüş ve koşu."},
  {id: 19, name: "Pro Premium Kablosuz Kulaklık", category: "Elektronik", price: 1798, stock: 36, icon: "🎧", desc: "Aktif gürültü engelleme özellikli, 30 saat pil ömrü."},
  {id: 20, name: "Pro Mekanik Klavye Pro", category: "Elektronik", price: 2638, stock: 17, icon: "⌨️", desc: "Cherry MX Blue switch, RGB aydınlatma, alüminyum gövde."},
  {id: 21, name: "Pro Ergonomik Mouse", category: "Elektronik", price: 1078, stock: 30, icon: "🖱️", desc: "Dikey tasarım, bilek desteği, kablosuz bağlantı."},
  {id: 22, name: "Pro 4K Monitör 27\"", category: "Elektronik", price: 10198, stock: 9, icon: "🖥️", desc: "IPS panel, HDR10, %99 sRGB renk doğruluğu."},
  {id: 23, name: "Pro Taşınabilir SSD 1TB", category: "Elektronik", price: 2278, stock: 44, icon: "💾", desc: "USB-C, 1050MB/s okuma hızı, şok dayanıklı."},
  {id: 24, name: "Pro Yoga Matı ve Seti", category: "Spor", price: 418, stock: 64, icon: "🧘", desc: "6mm kalınlık, kaymaz yüzey, taşıma çantası dahil."},
  {id: 25, name: "Pro Akıllı Fitness Bilekliği", category: "Spor", price: 1558, stock: 26, icon: "⌚", desc: "Nabız ölçer, uyku takibi, 7 gün pil ömrü."},
  {id: 26, name: "Pro Dambıl Seti 20kg", category: "Spor", price: 838, stock: 22, icon: "🏋️", desc: "Ayarlanabilir ağırlık, neopren kaplama."},
  {id: 27, name: "Pro Koşu Bandı", category: "Spor", price: 5998, stock: 6, icon: "🏃", desc: "Katlanabilir, 12 program, eğim ayarı."},
  {id: 28, name: "Pro Bestseller Kitap Seti", category: "Hobi", price: 298, stock: 76, icon: "📚", desc: "2026 çok satanlar, 5 kitaplık özel set."},
  {id: 29, name: "Pro Puzzle 1000 Parça", category: "Hobi", price: 214, stock: 48, icon: "🧩", desc: "Doğa manzarası, parlak baskı kalitesi."},
  {id: 30, name: "Pro Suluboya Seti Premium", category: "Hobi", price: 538, stock: 33, icon: "🎨", desc: "48 renk, profesyonel fırçalar, ahşap kutu."},
  {id: 31, name: "Pro Akıllı Ev Aydınlatma Seti", category: "Ev", price: 718, stock: 28, icon: "💡", desc: "Wi-Fi kontrol, 16M renk, ses asistanı uyumlu."},
  {id: 32, name: "Pro Robot Süpürge", category: "Ev", price: 4198, stock: 12, icon: "🤖", desc: "Lazer navigasyon, otomatik boşaltma, uygulama kontrolü."},
  {id: 33, name: "Pro Kahve Makinesi", category: "Ev", price: 3358, stock: 16, icon: "☕", desc: "Espresso ve filtre kahve, dahili öğütücü."},
  {id: 34, name: "Pro Pamuklu T-Shirt", category: "Giyim", price: 238, stock: 96, icon: "👕", desc: "Organik pamuk, rahat kesim, 5 renk seçeneği."},
  {id: 35, name: "Pro Deri Cüzdan", category: "Giyim", price: 538, stock: 40, icon: "👛", desc: "El yapımı, RFID koruma, hediye kutusunda."},
  {id: 36, name: "Pro Spor Ayakkabı", category: "Giyim", price: 1918, stock: 32, icon: "👟", desc: "Hafif taban, nefes alan kumaş, yürüyüş ve koşu."},
  {id: 37, name: "Ultra Premium Kablosuz Kulaklık", category: "Elektronik", price: 1798, stock: 36, icon: "🎧", desc: "Aktif gürültü engelleme özellikli, 30 saat pil ömrü."},
  {id: 38, name: "Ultra Mekanik Klavye Pro", category: "Elektronik", price: 2638, stock: 17, icon: "⌨️", desc: "Cherry MX Blue switch, RGB aydınlatma, alüminyum gövde."},
  {id: 39, name: "Ultra Ergonomik Mouse", category: "Elektronik", price: 1078, stock: 30, icon: "🖱️", desc: "Dikey tasarım, bilek desteği, kablosuz bağlantı."},
  {id: 40, name: "Ultra 4K Monitör 27\"", category: "Elektronik", price: 10198, stock: 9, icon: "🖥️", desc: "IPS panel, HDR10, %99 sRGB renk doğruluğu."},
  {id: 41, name: "Ultra Taşınabilir SSD 1TB", category: "Elektronik", price: 2278, stock: 44, icon: "💾", desc: "USB-C, 1050MB/s okuma hızı, şok dayanıklı."},
  {id: 42, name: "Ultra Yoga Matı ve Seti", category: "Spor", price: 418, stock: 64, icon: "🧘", desc: "6mm kalınlık, kaymaz yüzey, taşıma çantası dahil."},
  {id: 43, name: "Ultra Akıllı Fitness Bilekliği", category: "Spor", price: 1558, stock: 26, icon: "⌚", desc: "Nabız ölçer, uyku takibi, 7 gün pil ömrü."},
  {id: 44, name: "Ultra Dambıl Seti 20kg", category: "Spor", price: 838, stock: 22, icon: "🏋️", desc: "Ayarlanabilir ağırlık, neopren kaplama."},
  {id: 45, name: "Ultra Koşu Bandı", category: "Spor", price: 5998, stock: 6, icon: "🏃", desc: "Katlanabilir, 12 program, eğim ayarı."},
  {id: 46, name: "Ultra Bestseller Kitap Seti", category: "Hobi", price: 298, stock: 76, icon: "📚", desc: "2026 çok satanlar, 5 kitaplık özel set."},
  {id: 47, name: "Ultra Puzzle 1000 Parça", category: "Hobi", price: 214, stock: 48, icon: "🧩", desc: "Doğa manzarası, parlak baskı kalitesi."},
  {id: 48, name: "Ultra Suluboya Seti Premium", category: "Hobi", price: 538, stock: 33, icon: "🎨", desc: "48 renk, profesyonel fırçalar, ahşap kutu."},
  {id: 49, name: "Ultra Akıllı Ev Aydınlatma Seti", category: "Ev", price: 718, stock: 28, icon: "💡", desc: "Wi-Fi kontrol, 16M renk, ses asistanı uyumlu."},
  {id: 50, name: "Ultra Robot Süpürge", category: "Ev", price: 4198, stock: 12, icon: "🤖", desc: "Lazer navigasyon, otomatik boşaltma, uygulama kontrolü."},
  {id: 51, name: "Ultra Kahve Makinesi", category: "Ev", price: 3358, stock: 16, icon: "☕", desc: "Espresso ve filtre kahve, dahili öğütücü."},
  {id: 52, name: "Ultra Pamuklu T-Shirt", category: "Giyim", price: 238, stock: 96, icon: "👕", desc: "Organik pamuk, rahat kesim, 5 renk seçeneği."},
  {id: 53, name: "Ultra Deri Cüzdan", category: "Giyim", price: 538, stock: 40, icon: "👛", desc: "El yapımı, RFID koruma, hediye kutusunda."},
  {id: 54, name: "Ultra Spor Ayakkabı", category: "Giyim", price: 1918, stock: 32, icon: "👟", desc: "Hafif taban, nefes alan kumaş, yürüyüş ve koşu."},
  {id: 55, name: "Lite Premium Kablosuz Kulaklık", category: "Elektronik", price: 1199, stock: 67, icon: "🎧", desc: "Aktif gürültü engelleme özellikli, 30 saat pil ömrü."},
  {id: 56, name: "Lite Mekanik Klavye Pro", category: "Elektronik", price: 1759, stock: 33, icon: "⌨️", desc: "Cherry MX Blue switch, RGB aydınlatma, alüminyum gövde."},
  {id: 57, name: "Lite Ergonomik Mouse", category: "Elektronik", price: 719, stock: 57, icon: "🖱️", desc: "Dikey tasarım, bilek desteği, kablosuz bağlantı."},
  {id: 58, name: "Lite 4K Monitör 27\"", category: "Elektronik", price: 6799, stock: 18, icon: "🖥️", desc: "IPS panel, HDR10, %99 sRGB renk doğruluğu."},
  {id: 59, name: "Lite Taşınabilir SSD 1TB", category: "Elektronik", price: 1519, stock: 82, icon: "💾", desc: "USB-C, 1050MB/s okuma hızı, şok dayanıklı."},
  {id: 60, name: "Lite Yoga Matı ve Seti", category: "Spor", price: 279, stock: 120, icon: "🧘", desc: "6mm kalınlık, kaymaz yüzey, taşıma çantası dahil."},
  {id: 61, name: "Lite Akıllı Fitness Bilekliği", category: "Spor", price: 1039, stock: 49, icon: "⌚", desc: "Nabız ölçer, uyku takibi, 7 gün pil ömrü."},
  {id: 62, name: "Lite Dambıl Seti 20kg", category: "Spor", price: 559, stock: 42, icon: "🏋️", desc: "Ayarlanabilir ağırlık, neopren kaplama."},
  {id: 63, name: "Lite Koşu Bandı", category: "Spor", price: 3999, stock: 12, icon: "🏃", desc: "Katlanabilir, 12 program, eğim ayarı."},
  {id: 64, name: "Lite Bestseller Kitap Seti", category: "Hobi", price: 199, stock: 142, icon: "📚", desc: "2026 çok satanlar, 5 kitaplık özel set."},
  {id: 65, name: "Lite Puzzle 1000 Parça", category: "Hobi", price: 143, stock: 90, icon: "🧩", desc: "Doğa manzarası, parlak baskı kalitesi."},
  {id: 66, name: "Lite Suluboya Seti Premium", category: "Hobi", price: 359, stock: 63, icon: "🎨", desc: "48 renk, profesyonel fırçalar, ahşap kutu."},
  {id: 67, name: "Lite Akıllı Ev Aydınlatma Seti", category: "Ev", price: 479, stock: 52, icon: "💡", desc: "Wi-Fi kontrol, 16M renk, ses asistanı uyumlu."},
  {id: 68, name: "Lite Robot Süpürge", category: "Ev", price: 2799, stock: 22, icon: "🤖", desc: "Lazer navigasyon, otomatik boşaltma, uygulama kontrolü."},
  {id: 69, name: "Lite Kahve Makinesi", category: "Ev", price: 2239, stock: 30, icon: "☕", desc: "Espresso ve filtre kahve, dahili öğütücü."},
  {id: 70, name: "Lite Pamuklu T-Shirt", category: "Giyim", price: 159, stock: 180, icon: "👕", desc: "Organik pamuk, rahat kesim, 5 renk seçeneği."},
  {id: 71, name: "Lite Deri Cüzdan", category: "Giyim", price: 359, stock: 75, icon: "👛", desc: "El yapımı, RFID koruma, hediye kutusunda."},
  {id: 72, name: "Lite Spor Ayakkabı", category: "Giyim", price: 1279, stock: 60, icon: "👟", desc: "Hafif taban, nefes alan kumaş, yürüyüş ve koşu."},
  {id: 73, name: "Max Premium Kablosuz Kulaklık", category: "Elektronik", price: 1798, stock: 67, icon: "🎧", desc: "Aktif gürültü engelleme özellikli, 30 saat pil ömrü."},
  {id: 74, name: "Max Mekanik Klavye Pro", category: "Elektronik", price: 2638, stock: 33, icon: "⌨️", desc: "Cherry MX Blue switch, RGB aydınlatma, alüminyum gövde."},
  {id: 75, name: "Max Ergonomik Mouse", category: "Elektronik", price: 1078, stock: 57, icon: "🖱️", desc: "Dikey tasarım, bilek desteği, kablosuz bağlantı."},
  {id: 76, name: "Max 4K Monitör 27\"", category: "Elektronik", price: 10198, stock: 18, icon: "🖥️", desc: "IPS panel, HDR10, %99 sRGB renk doğruluğu."},
  {id: 77, name: "Max Taşınabilir SSD 1TB", category: "Elektronik", price: 2278, stock: 82, icon: "💾", desc: "USB-C, 1050MB/s okuma hızı, şok dayanıklı."},
  {id: 78, name: "Max Yoga Matı ve Seti", category: "Spor", price: 418, stock: 120, icon: "🧘", desc: "6mm kalınlık, kaymaz yüzey, taşıma çantası dahil."},
  {id: 79, name: "Max Akıllı Fitness Bilekliği", category: "Spor", price: 1558, stock: 49, icon: "⌚", desc: "Nabız ölçer, uyku takibi, 7 gün pil ömrü."},
  {id: 80, name: "Max Dambıl Seti 20kg", category: "Spor", price: 838, stock: 42, icon: "🏋️", desc: "Ayarlanabilir ağırlık, neopren kaplama."},
  {id: 81, name: "Max Koşu Bandı", category: "Spor", price: 5998, stock: 12, icon: "🏃", desc: "Katlanabilir, 12 program, eğim ayarı."},
  {id: 82, name: "Max Bestseller Kitap Seti", category: "Hobi", price: 298, stock: 142, icon: "📚", desc: "2026 çok satanlar, 5 kitaplık özel set."},
  {id: 83, name: "Max Puzzle 1000 Parça", category: "Hobi", price: 214, stock: 90, icon: "🧩", desc: "Doğa manzarası, parlak baskı kalitesi."},
  {id: 84, name: "Max Suluboya Seti Premium", category: "Hobi", price: 538, stock: 63, icon: "🎨", desc: "48 renk, profesyonel fırçalar, ahşap kutu."},
  {id: 85, name: "Max Akıllı Ev Aydınlatma Seti", category: "Ev", price: 718, stock: 52, icon: "💡", desc: "Wi-Fi kontrol, 16M renk, ses asistanı uyumlu."},
  {id: 86, name: "Max Robot Süpürge", category: "Ev", price: 4198, stock: 22, icon: "🤖", desc: "Lazer navigasyon, otomatik boşaltma, uygulama kontrolü."},
  {id: 87, name: "Max Kahve Makinesi", category: "Ev", price: 3358, stock: 30, icon: "☕", desc: "Espresso ve filtre kahve, dahili öğütücü."},
  {id: 88, name: "Max Pamuklu T-Shirt", category: "Giyim", price: 238, stock: 180, icon: "👕", desc: "Organik pamuk, rahat kesim, 5 renk seçeneği."},
  {id: 89, name: "Max Deri Cüzdan", category: "Giyim", price: 538, stock: 75, icon: "👛", desc: "El yapımı, RFID koruma, hediye kutusunda."},
  {id: 90, name: "Max Spor Ayakkabı", category: "Giyim", price: 1918, stock: 60, icon: "👟", desc: "Hafif taban, nefes alan kumaş, yürüyüş ve koşu."},
  {id: 91, name: "Plus Premium Kablosuz Kulaklık", category: "Elektronik", price: 1199, stock: 67, icon: "🎧", desc: "Aktif gürültü engelleme özellikli, 30 saat pil ömrü."},
  {id: 92, name: "Plus Mekanik Klavye Pro", category: "Elektronik", price: 1759, stock: 33, icon: "⌨️", desc: "Cherry MX Blue switch, RGB aydınlatma, alüminyum gövde."},
  {id: 93, name: "Plus Ergonomik Mouse", category: "Elektronik", price: 719, stock: 57, icon: "🖱️", desc: "Dikey tasarım, bilek desteği, kablosuz bağlantı."},
  {id: 94, name: "Plus 4K Monitör 27\"", category: "Elektronik", price: 6799, stock: 18, icon: "🖥️", desc: "IPS panel, HDR10, %99 sRGB renk doğruluğu."},
  {id: 95, name: "Plus Taşınabilir SSD 1TB", category: "Elektronik", price: 1519, stock: 82, icon: "💾", desc: "USB-C, 1050MB/s okuma hızı, şok dayanıklı."},
  {id: 96, name: "Plus Yoga Matı ve Seti", category: "Spor", price: 279, stock: 120, icon: "🧘", desc: "6mm kalınlık, kaymaz yüzey, taşıma çantası dahil."},
  {id: 97, name: "Plus Akıllı Fitness Bilekliği", category: "Spor", price: 1039, stock: 49, icon: "⌚", desc: "Nabız ölçer, uyku takibi, 7 gün pil ömrü."},
  {id: 98, name: "Plus Dambıl Seti 20kg", category: "Spor", price: 559, stock: 42, icon: "🏋️", desc: "Ayarlanabilir ağırlık, neopren kaplama."},
  {id: 99, name: "Plus Koşu Bandı", category: "Spor", price: 3999, stock: 12, icon: "🏃", desc: "Katlanabilir, 12 program, eğim ayarı."},
  {id: 100, name: "Plus Bestseller Kitap Seti", category: "Hobi", price: 199, stock: 142, icon: "📚", desc: "2026 çok satanlar, 5 kitaplık özel set."},
  {id: 101, name: "Plus Puzzle 1000 Parça", category: "Hobi", price: 143, stock: 90, icon: "🧩", desc: "Doğa manzarası, parlak baskı kalitesi."},
  {id: 102, name: "Plus Suluboya Seti Premium", category: "Hobi", price: 359, stock: 63, icon: "🎨", desc: "48 renk, profesyonel fırçalar, ahşap kutu."},
  {id: 103, name: "Plus Akıllı Ev Aydınlatma Seti", category: "Ev", price: 479, stock: 52, icon: "💡", desc: "Wi-Fi kontrol, 16M renk, ses asistanı uyumlu."},
  {id: 104, name: "Plus Robot Süpürge", category: "Ev", price: 2799, stock: 22, icon: "🤖", desc: "Lazer navigasyon, otomatik boşaltma, uygulama kontrolü."},
  {id: 105, name: "Plus Kahve Makinesi", category: "Ev", price: 2239, stock: 30, icon: "☕", desc: "Espresso ve filtre kahve, dahili öğütücü."},
  {id: 106, name: "Plus Pamuklu T-Shirt", category: "Giyim", price: 159, stock: 180, icon: "👕", desc: "Organik pamuk, rahat kesim, 5 renk seçeneği."},
  {id: 107, name: "Plus Deri Cüzdan", category: "Giyim", price: 359, stock: 75, icon: "👛", desc: "El yapımı, RFID koruma, hediye kutusunda."},
  {id: 108, name: "Plus Spor Ayakkabı", category: "Giyim", price: 1279, stock: 60, icon: "👟", desc: "Hafif taban, nefes alan kumaş, yürüyüş ve koşu."},
  {id: 109, name: "V2 Premium Kablosuz Kulaklık", category: "Elektronik", price: 1199, stock: 67, icon: "🎧", desc: "Aktif gürültü engelleme özellikli, 30 saat pil ömrü."},
  {id: 110, name: "V2 Mekanik Klavye Pro", category: "Elektronik", price: 1759, stock: 33, icon: "⌨️", desc: "Cherry MX Blue switch, RGB aydınlatma, alüminyum gövde."},
  {id: 111, name: "V2 Ergonomik Mouse", category: "Elektronik", price: 719, stock: 57, icon: "🖱️", desc: "Dikey tasarım, bilek desteği, kablosuz bağlantı."},
  {id: 112, name: "V2 4K Monitör 27\"", category: "Elektronik", price: 6799, stock: 18, icon: "🖥️", desc: "IPS panel, HDR10, %99 sRGB renk doğruluğu."},
  {id: 113, name: "V2 Taşınabilir SSD 1TB", category: "Elektronik", price: 1519, stock: 82, icon: "💾", desc: "USB-C, 1050MB/s okuma hızı, şok dayanıklı."},
  {id: 114, name: "V2 Yoga Matı ve Seti", category: "Spor", price: 279, stock: 120, icon: "🧘", desc: "6mm kalınlık, kaymaz yüzey, taşıma çantası dahil."},
  {id: 115, name: "V2 Akıllı Fitness Bilekliği", category: "Spor", price: 1039, stock: 49, icon: "⌚", desc: "Nabız ölçer, uyku takibi, 7 gün pil ömrü."},
  {id: 116, name: "V2 Dambıl Seti 20kg", category: "Spor", price: 559, stock: 42, icon: "🏋️", desc: "Ayarlanabilir ağırlık, neopren kaplama."},
  {id: 117, name: "V2 Koşu Bandı", category: "Spor", price: 3999, stock: 12, icon: "🏃", desc: "Katlanabilir, 12 program, eğim ayarı."},
  {id: 118, name: "V2 Bestseller Kitap Seti", category: "Hobi", price: 199, stock: 142, icon: "📚", desc: "2026 çok satanlar, 5 kitaplık özel set."},
  {id: 119, name: "V2 Puzzle 1000 Parça", category: "Hobi", price: 143, stock: 90, icon: "🧩", desc: "Doğa manzarası, parlak baskı kalitesi."},
  {id: 120, name: "V2 Suluboya Seti Premium", category: "Hobi", price: 359, stock: 63, icon: "🎨", desc: "48 renk, profesyonel fırçalar, ahşap kutu."},
  {id: 121, name: "V2 Akıllı Ev Aydınlatma Seti", category: "Ev", price: 479, stock: 52, icon: "💡", desc: "Wi-Fi kontrol, 16M renk, ses asistanı uyumlu."},
  {id: 122, name: "V2 Robot Süpürge", category: "Ev", price: 2799, stock: 22, icon: "🤖", desc: "Lazer navigasyon, otomatik boşaltma, uygulama kontrolü."},
  {id: 123, name: "V2 Kahve Makinesi", category: "Ev", price: 2239, stock: 30, icon: "☕", desc: "Espresso ve filtre kahve, dahili öğütücü."},
  {id: 124, name: "V2 Pamuklu T-Shirt", category: "Giyim", price: 159, stock: 180, icon: "👕", desc: "Organik pamuk, rahat kesim, 5 renk seçeneği."},
  {id: 125, name: "V2 Deri Cüzdan", category: "Giyim", price: 359, stock: 75, icon: "👛", desc: "El yapımı, RFID koruma, hediye kutusunda."},
  {id: 126, name: "V2 Spor Ayakkabı", category: "Giyim", price: 1279, stock: 60, icon: "👟", desc: "Hafif taban, nefes alan kumaş, yürüyüş ve koşu."},
  {id: 127, name: "Premium Premium Kablosuz Kulaklık", category: "Elektronik", price: 1798, stock: 67, icon: "🎧", desc: "Aktif gürültü engelleme özellikli, 30 saat pil ömrü."},
  {id: 128, name: "Premium Mekanik Klavye Pro", category: "Elektronik", price: 2638, stock: 33, icon: "⌨️", desc: "Cherry MX Blue switch, RGB aydınlatma, alüminyum gövde."},
  {id: 129, name: "Premium Ergonomik Mouse", category: "Elektronik", price: 1078, stock: 57, icon: "🖱️", desc: "Dikey tasarım, bilek desteği, kablosuz bağlantı."},
  {id: 130, name: "Premium 4K Monitör 27\"", category: "Elektronik", price: 10198, stock: 18, icon: "🖥️", desc: "IPS panel, HDR10, %99 sRGB renk doğruluğu."},
  {id: 131, name: "Premium Taşınabilir SSD 1TB", category: "Elektronik", price: 2278, stock: 82, icon: "💾", desc: "USB-C, 1050MB/s okuma hızı, şok dayanıklı."},
  {id: 132, name: "Premium Yoga Matı ve Seti", category: "Spor", price: 418, stock: 120, icon: "🧘", desc: "6mm kalınlık, kaymaz yüzey, taşıma çantası dahil."},
  {id: 133, name: "Premium Akıllı Fitness Bilekliği", category: "Spor", price: 1558, stock: 49, icon: "⌚", desc: "Nabız ölçer, uyku takibi, 7 gün pil ömrü."},
  {id: 134, name: "Premium Dambıl Seti 20kg", category: "Spor", price: 838, stock: 42, icon: "🏋️", desc: "Ayarlanabilir ağırlık, neopren kaplama."},
  {id: 135, name: "Premium Koşu Bandı", category: "Spor", price: 5998, stock: 12, icon: "🏃", desc: "Katlanabilir, 12 program, eğim ayarı."},
  {id: 136, name: "Premium Bestseller Kitap Seti", category: "Hobi", price: 298, stock: 142, icon: "📚", desc: "2026 çok satanlar, 5 kitaplık özel set."},
  {id: 137, name: "Premium Puzzle 1000 Parça", category: "Hobi", price: 214, stock: 90, icon: "🧩", desc: "Doğa manzarası, parlak baskı kalitesi."},
  {id: 138, name: "Premium Suluboya Seti Premium", category: "Hobi", price: 538, stock: 63, icon: "🎨", desc: "48 renk, profesyonel fırçalar, ahşap kutu."},
  {id: 139, name: "Premium Akıllı Ev Aydınlatma Seti", category: "Ev", price: 718, stock: 52, icon: "💡", desc: "Wi-Fi kontrol, 16M renk, ses asistanı uyumlu."},
  {id: 140, name: "Premium Robot Süpürge", category: "Ev", price: 4198, stock: 22, icon: "🤖", desc: "Lazer navigasyon, otomatik boşaltma, uygulama kontrolü."},
  {id: 141, name: "Premium Kahve Makinesi", category: "Ev", price: 3358, stock: 30, icon: "☕", desc: "Espresso ve filtre kahve, dahili öğütücü."},
  {id: 142, name: "Premium Pamuklu T-Shirt", category: "Giyim", price: 238, stock: 180, icon: "👕", desc: "Organik pamuk, rahat kesim, 5 renk seçeneği."},
  {id: 143, name: "Premium Deri Cüzdan", category: "Giyim", price: 538, stock: 75, icon: "👛", desc: "El yapımı, RFID koruma, hediye kutusunda."},
  {id: 144, name: "Premium Spor Ayakkabı", category: "Giyim", price: 1918, stock: 60, icon: "👟", desc: "Hafif taban, nefes alan kumaş, yürüyüş ve koşu."},
];

const CATEGORY_ICONS = { "Elektronik": "🎧", "Spor": "🏃", "Hobi": "📚", "Ev": "🏠", "Giyim": "👗", "default": "📦" };
const CATEGORIES = [...new Set(CATALOG.map(p => p.category))];

const ENDPOINTS = [
  { method: 'GET',  path: '/api/v1/recommendations/{user_id}', desc: 'Kullanıcıya özel ürün önerileri' },
  { method: 'GET',  path: '/api/v1/products',                   desc: 'Tüm ürün listesi' },
  { method: 'GET',  path: '/api/v1/products/{product_id}',      desc: 'Ürün detay bilgisi' },
  { method: 'POST', path: '/api/v1/interactions',               desc: 'Kullanıcı etkileşimi kaydet' },
  { method: 'GET',  path: '/api/v1/users/{user_id}/history',    desc: 'Kullanıcı geçmişi' },
  { method: 'GET',  path: '/api/health',                         desc: 'Sistem sağlık kontrolü' },
];

const CHART_DATA = {
  category:    [{ label:'Elektronik',value:42,color:'var(--pastel-lavender)' },{ label:'Spor',value:28,color:'var(--pastel-mint)' },{ label:'Hobi',value:18,color:'var(--pastel-pink)' },{ label:'Ev',value:12,color:'var(--pastel-peach)' }],
  interaction: [{ label:'Görüntüleme',value:45,color:'var(--pastel-lavender)' },{ label:'Sepete Ekleme',value:25,color:'var(--pastel-mint)' },{ label:'Satın Alma',value:18,color:'var(--pastel-pink)' },{ label:'Favorilere',value:12,color:'var(--pastel-peach)' }],
  segment:     [{ label:'Teknoloji',value:35,color:'var(--pastel-lavender)' },{ label:'Spor',value:25,color:'var(--pastel-mint)' },{ label:'Ev & Yaşam',value:22,color:'var(--pastel-pink)' },{ label:'Hobi',value:18,color:'var(--pastel-peach)' }],
};

// ═══════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════
let currentUser = null;
let cart = [];
let currentCatalogFilter = 'Tümü';
let currentModalProduct = null;

// ═══════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  initAuth();
  initNavbar();
  initAuthModal();
  initMobile();
  initProductModal();
  initCheckoutModal();
});

// ═══════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════
function initStorage() {
  if (!localStorage.getItem('shopai_users')) {
    localStorage.setItem('shopai_users', JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem('shopai_orders')) {
    localStorage.setItem('shopai_orders', JSON.stringify([]));
  }
}

function getUsers() { return JSON.parse(localStorage.getItem('shopai_users') || '[]'); }
function saveUsers(users) { localStorage.setItem('shopai_users', JSON.stringify(users)); }
function getOrders() { return JSON.parse(localStorage.getItem('shopai_orders') || '[]'); }
function saveOrders(orders) { localStorage.setItem('shopai_orders', JSON.stringify(orders)); }

function loadCart() {
  cart = JSON.parse(sessionStorage.getItem('shopai_cart') || '[]');
}
function saveCart() {
  sessionStorage.setItem('shopai_cart', JSON.stringify(cart));
}

// ═══════════════════════════════════════════════
// AUTH MODULE
// ═══════════════════════════════════════════════
function initAuth() {
  const session = sessionStorage.getItem('shopai_user');
  if (session) {
    currentUser = JSON.parse(session);
    loadCart();
    enterDashboard(currentUser);
  }
}

async function login(email, password) {
  // API'den dene
  try {
    const data = await Api.login(email, password);
    if (data && data.user) {
      currentUser = data.user;
      currentUser.password = password; // fallback için sakla
      sessionStorage.setItem('shopai_user', JSON.stringify(currentUser));
      // API'deki kullanıcıyı local'e de kaydet
      const users = getUsers();
      if (!users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        users.push(currentUser);
        saveUsers(users);
      }
      loadCart();
      return currentUser;
    }
  } catch {
    // API kapalı — localStorage'dan dene
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      currentUser = user;
      sessionStorage.setItem('shopai_user', JSON.stringify(user));
      loadCart();
      return user;
    }
  }
  return null;
}

async function register(name, email, password, role) {
  // API'den dene
  try {
    const result = await Api.register(name, email, password, role);
    // API başarılı — local'e de kaydet
    const users = getUsers();
    if (!users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      users.push({ name, email, password, role, date: new Date().toISOString().split('T')[0] });
      saveUsers(users);
    }
    return result;
  } catch (e) {
    // API kapalı veya hata
    if (e.message.includes('kayıtlı') || e.message.includes('409')) {
      return { error: 'Bu e-posta adresi zaten kayıtlı.' };
    }
    // Fallback: localStorage
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { error: 'Bu e-posta adresi zaten kayıtlı.' };
    }
    users.push({ name, email, password, role, date: new Date().toISOString().split('T')[0] });
    saveUsers(users);
    return { success: true };
  }
}

function logout() {
  currentUser = null;
  cart = [];
  sessionStorage.removeItem('shopai_user');
  sessionStorage.removeItem('shopai_cart');
  showView('welcome');
  closeAuthModal();
}

// ═══════════════════════════════════════════════
// VIEW ROUTER
// ═══════════════════════════════════════════════
function showView(viewName) {
  $('#welcome-view').classList.remove('active');
  $('#dashboard-view').classList.remove('active');
  if (viewName === 'welcome') $('#welcome-view').classList.add('active');
  else if (viewName === 'dashboard') $('#dashboard-view').classList.add('active');
}

function enterDashboard(user) {
  currentUser = user;

  // Update sidebar user info
  $('#userName').textContent = user.name;
  $('#userEmail').textContent = user.email;
  $('#userAvatar').textContent = getInitials(user.name);
  const badge = $('#userRoleBadge');
  badge.textContent = user.role === 'admin' ? 'Admin' : 'Kullanıcı';
  badge.className = `user-role-badge ${user.role}`;

  // Greeting
  const hour = new Date().getHours();
  let greeting = hour < 12 ? 'Günaydın' : hour >= 18 ? 'İyi akşamlar' : 'İyi günler';
  $('#dashGreeting').textContent = `${greeting}, ${user.name.split(' ')[0]}!`;

  // Build sidebar based on role
  buildSidebar(user.role);

  showView('dashboard');

  // Activate first panel
  const firstItem = $('.sidebar-item');
  if (firstItem) firstItem.click();
}

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
}

// ═══════════════════════════════════════════════
// SIDEBAR BUILDER
// ═══════════════════════════════════════════════
function buildSidebar(role) {
  const nav = $('#sidebarNav');

  const adminItems = [
    { panel: 'admin-overview',        icon: '🏠', label: 'Genel Bakış' },
    { panel: 'admin-users',           icon: '👥', label: 'Kayıtlı Kullanıcılar' },
    { panel: 'admin-system',          icon: '🔌', label: 'Sistem Durumu' },
    { divider: true },
    { label: 'ANALİTİK', section: true },
    { panel: 'admin-recommendations', icon: '🤖', label: 'Ürün Önerileri' },
    { panel: 'admin-analytics',       icon: '📊', label: 'Davranış Analizi' },
    { divider: true },
    { panel: 'profile-settings',      icon: '⚙️', label: 'Hesap Ayarları' }
  ];

  const userItems = [
    { panel: 'user-home',    icon: '🏠', label: 'Ana Sayfa' },
    { panel: 'user-catalog', icon: '🛍️', label: 'Kategoriler' },
    { divider: true },
    { label: 'ALIŞVERİŞ', section: true },
    { panel: 'user-cart',    icon: '🛒', label: 'Sepetim' },
    { panel: 'user-orders',  icon: '📦', label: 'Siparişlerim' },
    { divider: true },
    { panel: 'profile-settings', icon: '⚙️', label: 'Hesap Ayarları' }
  ];

  const items = role === 'admin' ? adminItems : userItems;

  nav.innerHTML = items.map(item => {
    if (item.divider) return '<div class="sidebar-divider"></div>';
    if (item.section) return `<div class="sidebar-label">${item.label}</div>`;
    return `<button class="sidebar-item" data-panel="${item.panel}"><span class="item-icon">${item.icon}</span>${item.label}</button>`;
  }).join('');

  // Bind sidebar clicks
  nav.querySelectorAll('.sidebar-item').forEach(btn => {
    btn.addEventListener('click', () => {
      nav.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activatePanel(btn.dataset.panel);
      closeMobileSidebar();
    });
  });

  // Make user info block clickable to open settings
  const sidebarUser = $('#sidebarUser');
  if (sidebarUser) {
    sidebarUser.style.cursor = 'pointer';
    sidebarUser.addEventListener('click', (e) => {
      if (e.target.closest('#logoutBtn')) return;
      const settingsBtn = nav.querySelector('.sidebar-item[data-panel="profile-settings"]');
      if (settingsBtn) {
        settingsBtn.click();
      }
    });
  }

  // Logout
  $('#logoutBtn').addEventListener('click', logout);
}

function activatePanel(panelName) {
  $$('.dash-panel').forEach(p => p.classList.remove('active'));
  const panel = $(`#panel-${panelName}`);
  if (panel) {
    panel.classList.add('active');
    panel.style.animation = 'none';
    panel.offsetHeight;
    panel.style.animation = 'fadeInUp 0.4s ease';
  }

  // Title mapping
  const titles = {
    'admin-overview': 'Genel Bakış', 'admin-users': 'Kayıtlı Kullanıcılar',
    'admin-system': 'Sistem Durumu', 'admin-recommendations': 'Ürün Önerileri',
    'admin-analytics': 'Davranış Analizi',
    'user-home': 'Ana Sayfa', 'user-catalog': 'Kategoriler',
    'user-cart': 'Sepetim', 'user-orders': 'Siparişlerim',
    'profile-settings': 'Hesap Ayarları'
  };
  $('#dashTitle').textContent = titles[panelName] || '';

  // Initialize panel content
  if (panelName === 'admin-overview') initAdminOverview();
  if (panelName === 'admin-users') renderUsersTable();
  if (panelName === 'admin-system') renderEndpoints();
  if (panelName === 'admin-recommendations') initRecommendations();
  if (panelName === 'admin-analytics') renderCharts();
  if (panelName === 'user-home') renderUserHome();
  if (panelName === 'user-catalog') renderCatalog();
  if (panelName === 'user-cart') renderCart();
  if (panelName === 'user-orders') renderOrders();
  if (panelName === 'profile-settings') initProfileSettings();
}

// ═══════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════
function initNavbar() {
  const nav = $('#welcomeNav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ═══════════════════════════════════════════════
// AUTH MODAL
// ═══════════════════════════════════════════════
function initAuthModal() {
  const loginOverlay = $('#loginOverlay');
  const loginForm = $('#loginForm');
  const registerForm = $('#registerForm');
  const tabs = $$('.auth-tab');

  // Open
  $('#loginOpenBtn').addEventListener('click', openAuthModal);
  $('#heroLoginBtn').addEventListener('click', openAuthModal);
  $('#loginCloseBtn').addEventListener('click', closeAuthModal);
  loginOverlay.addEventListener('click', (e) => { if (e.target === loginOverlay) closeAuthModal(); });

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchAuthTab(tab.dataset.auth));
  });
  $('#switchToRegister').addEventListener('click', () => switchAuthTab('register'));
  $('#switchToLogin').addEventListener('click', () => switchAuthTab('login'));

  // Login submit
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = $('#loginEmail').value.trim();
    const password = $('#loginPassword').value.trim();
    if (!email || !password) return;

    const user = await login(email, password);
    if (user) {
      clearAuthErrors();
      closeAuthModal();
      enterDashboard(user);
    } else {
      $('#loginError').classList.add('visible');
      $('#loginEmail').classList.add('error');
      $('#loginPassword').classList.add('error');
    }
  });

  // Register submit
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = $('#regName').value.trim();
    const email = $('#regEmail').value.trim();
    const password = $('#regPassword').value.trim();
    const confirm = $('#regPasswordConfirm').value.trim();
    const role = 'user'; // Sadece kullanıcılar kayıt olabilir

    // Validation
    $('#registerError').classList.remove('visible');
    $('#registerSuccess').classList.remove('visible');

    if (!name || !email || !password || !confirm) {
      showRegError('Lütfen tüm alanları doldurun.');
      return;
    }
    if (password.length < 6) {
      showRegError('Şifre en az 6 karakter olmalıdır.');
      return;
    }
    if (password !== confirm) {
      showRegError('Şifreler eşleşmiyor.');
      return;
    }

    const result = await register(name, email, password, role);
    if (result.error) {
      showRegError(result.error);
    } else {
      $('#registerSuccess').classList.add('visible');
      registerForm.reset();
      setTimeout(() => switchAuthTab('login'), 1500);
    }
  });

  // Clear on input
  $('#loginEmail').addEventListener('input', clearAuthErrors);
  $('#loginPassword').addEventListener('input', clearAuthErrors);

  // Learn more
  $('#heroLearnBtn').addEventListener('click', () => {
    document.querySelector('.features-section').scrollIntoView({ behavior: 'smooth' });
  });
}

function openAuthModal() {
  $('#loginOverlay').classList.add('active');
  switchAuthTab('login');
  setTimeout(() => $('#loginEmail').focus(), 300);
}

function closeAuthModal() {
  $('#loginOverlay').classList.remove('active');
  $('#loginForm').reset();
  $('#registerForm').reset();
  clearAuthErrors();
  $('#registerSuccess').classList.remove('visible');
  $('#registerError').classList.remove('visible');
}

function switchAuthTab(tab) {
  $$('.auth-tab').forEach(t => t.classList.remove('active'));
  $$(`.auth-tab[data-auth="${tab}"]`).forEach(t => t.classList.add('active'));
  $$('.auth-form').forEach(f => f.classList.remove('active'));
  $(`#${tab === 'login' ? 'loginForm' : 'registerForm'}`).classList.add('active');
  clearAuthErrors();
  $('#registerSuccess').classList.remove('visible');
  $('#registerError').classList.remove('visible');
}

function clearAuthErrors() {
  $('#loginError').classList.remove('visible');
  $('#loginEmail').classList.remove('error');
  $('#loginPassword').classList.remove('error');
}

function showRegError(msg) {
  const el = $('#registerError');
  el.textContent = msg;
  el.classList.add('visible');
}

// ═══════════════════════════════════════════════
// MOBILE
// ═══════════════════════════════════════════════
function initMobile() {
  $('#mobileMenuBtn').addEventListener('click', () => {
    $('#sidebar').classList.add('mobile-open');
    $('#mobileOverlay').classList.add('active');
  });
  $('#mobileOverlay').addEventListener('click', closeMobileSidebar);
}
function closeMobileSidebar() {
  $('#sidebar').classList.remove('mobile-open');
  $('#mobileOverlay').classList.remove('active');
}

// ═══════════════════════════════════════════════
// ADMIN: OVERVIEW
// ═══════════════════════════════════════════════
function initAdminOverview() {
  const users = getUsers();
  const el = $('#adminUserCount');
  if (el) el.textContent = users.length;

  const banner = $('#bannerGreeting');
  if (banner && currentUser) {
    banner.textContent = `👋 Hoş Geldiniz, ${currentUser.name.split(' ')[0]}!`;
  }
}

// ═══════════════════════════════════════════════
// ADMIN: USERS TABLE
// ═══════════════════════════════════════════════
async function renderUsersTable() {
  const tbody = $('#usersTableBody');
  if (!tbody) return;

  let users;
  try {
    const data = await Api.getUsers();
    users = data.users || [];
  } catch {
    users = getUsers(); // Fallback: localStorage
  }

  tbody.innerHTML = users.map(u => `
    <tr>
      <td style="font-weight:600;">${u.name}</td>
      <td>${u.email}</td>
      <td><span class="role-badge ${u.role}">${u.role === 'admin' ? '🛡️ Admin' : '🛒 Kullanıcı'}</span></td>
      <td>${formatDate(u.date)}</td>
      <td><span class="status-active">● Aktif</span></td>
    </tr>
  `).join('');
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ═══════════════════════════════════════════════
// ADMIN: RECOMMENDATIONS
// ═══════════════════════════════════════════════
let recoInitialized = false;
function initRecommendations() {
  if (!recoInitialized) {
    $('#refreshBtn').addEventListener('click', loadRecommendations);
    $('#userSelect').addEventListener('change', loadRecommendations);
    recoInitialized = true;
  }
  loadRecommendations();
}

async function loadRecommendations() {
  const userId = $('#userSelect').value;
  const grid = $('#productGrid');
  const dot = $('#statusDot');
  const text = $('#statusText');
  const count = $('#resultsCount');

  grid.innerHTML = '<div class="loading-container"><div class="spinner"></div><p>Yapay zeka sizin için en iyi ürünleri seçiyor...</p></div>';
  count.textContent = 'Yükleniyor...';
  dot.className = 'status-dot';
  text.textContent = 'Bağlanıyor...';

  try {
    const data = await Api.getRecommendations(userId);
    dot.className = 'status-dot active';
    text.textContent = 'API Bağlı ✅';
    renderRecoProducts(data.recommendations || []);
  } catch {
    text.textContent = 'Çevrimdışı (Örnek Veri)';
    dot.className = 'status-dot error';
    renderRecoProducts(CATALOG.slice(0, 8).map(p => ({ ...p, similarity_score: Math.random() * 0.3 + 0.65 })));
  }
}

function renderRecoProducts(products) {
  const grid = $('#productGrid');
  const count = $('#resultsCount');
  count.textContent = `${products.length} ürün bulundu`;

  if (!products.length) {
    grid.innerHTML = '<div class="loading-container"><p>😕 Bu kullanıcı için eşleşen ürün bulunamadı.</p></div>';
    return;
  }

  grid.innerHTML = '';
  products.forEach((p, i) => {
    const icon = CATEGORY_ICONS[p.category] || CATEGORY_ICONS.default;
    const score = Math.round((p.similarity_score || 0.75) * 100);
    const card = document.createElement('div');
    card.className = 'product-card glass-card';
    card.style.animation = `fadeInUp 0.5s ease ${i * 0.08}s both`;
    card.innerHTML = `
      <div class="card-header"><span class="category">${p.category || 'Ürün'}</span><span class="match-score">%${score} Uyum</span></div>
      <div class="card-icon">${icon}</div>
      <h3 class="card-title">${p.name}</h3>
      <span class="card-price">${p.price ? '₺' + p.price.toLocaleString('tr-TR') : ''}</span>
    `;
    card.addEventListener('click', () => openProductModal(p));
    grid.appendChild(card);
  });
}

// ═══════════════════════════════════════════════
// ADMIN: CHARTS
// ═══════════════════════════════════════════════
function renderCharts() {
  renderBarChart('barChart', CHART_DATA.category);
  renderDonutChart('donutChart', CHART_DATA.interaction);
  renderBarChart('segmentChart', CHART_DATA.segment);
}

function renderBarChart(id, data) {
  const el = $(`#${id}`);
  if (!el) return;
  const max = Math.max(...data.map(d => d.value));
  el.innerHTML = data.map(d => `
    <div class="bar-item"><span class="bar-value">${d.value}%</span><div class="bar" style="height:${(d.value/max)*100}%;background:${d.color};"></div><span class="bar-label">${d.label}</span></div>
  `).join('');
}

function renderDonutChart(id, data) {
  const el = $(`#${id}`);
  if (!el) return;
  const total = data.reduce((s, d) => s + d.value, 0);
  let cum = 0;
  const parts = data.map(d => { const s = cum; cum += (d.value / total) * 100; return `${d.color} ${s}% ${cum}%`; });
  el.innerHTML = `
    <div class="donut" style="background:conic-gradient(${parts.join(',')});">
      <div class="donut-center"><span class="donut-value">${total}%</span><span class="donut-label">Toplam</span></div>
    </div>
    <div class="donut-legend">${data.map(d => `<div class="legend-item"><div class="legend-dot" style="background:${d.color};"></div><span>${d.label} (${d.value}%)</span></div>`).join('')}</div>
  `;
}

// ═══════════════════════════════════════════════
// ADMIN: ENDPOINTS
// ═══════════════════════════════════════════════
function renderEndpoints() {
  const el = $('#endpointList');
  if (!el) return;
  el.innerHTML = ENDPOINTS.map(ep => `
    <div class="endpoint-item">
      <span class="endpoint-method ${ep.method.toLowerCase()}">${ep.method}</span>
      <span class="endpoint-path">${ep.path}</span>
      <span class="endpoint-desc">${ep.desc}</span>
      <div class="endpoint-status offline" title="Çevrimdışı"></div>
    </div>
  `).join('');
  checkApiHealth();
}

async function checkApiHealth() {
  try {
    await Api.health();
    $$('.endpoint-status').forEach(d => { d.classList.replace('offline', 'online'); d.title = 'Çevrimiçi'; });
  } catch {}
}

// ═══════════════════════════════════════════════
// USER: HOME
// ═══════════════════════════════════════════════
async function renderUserHome() {
  const banner = $('#userBannerGreeting');
  if (banner && currentUser) {
    banner.textContent = `👋 Hoş Geldiniz, ${currentUser.name.split(' ')[0]}!`;
  }

  const grid = $('#userRecoGrid');
  if (!grid) return;

  let products;
  try {
    const data = await Api.getRecommendations(currentUser?.id || 1, 6);
    products = data.recommendations || [];
  } catch {
    products = [...CATALOG].sort(() => Math.random() - 0.5).slice(0, 6);
  }

  grid.innerHTML = '';
  products.forEach((p, i) => {
    const card = createCatalogCard(p, i);
    grid.appendChild(card);
  });
}

// ═══════════════════════════════════════════════
// USER: CATALOG
// ═══════════════════════════════════════════════
function renderCatalog() {
  renderCatalogFilters();
  renderCatalogGrid();
}

function renderCatalogFilters() {
  const container = $('#catalogFilters');
  if (!container) return;

  const counts = {};
  CATALOG.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });

  const allBtn = `<button class="filter-btn ${currentCatalogFilter === 'Tümü' ? 'active' : ''}" data-filter="Tümü">Tümü <span class="filter-count">${CATALOG.length}</span></button>`;
  const catBtns = CATEGORIES.map(c =>
    `<button class="filter-btn ${currentCatalogFilter === c ? 'active' : ''}" data-filter="${c}">${CATEGORY_ICONS[c] || '📦'} ${c} <span class="filter-count">${counts[c]}</span></button>`
  ).join('');

  container.innerHTML = allBtn + catBtns;

  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentCatalogFilter = btn.dataset.filter;
      renderCatalog();
    });
  });
}

async function renderCatalogGrid() {
  const grid = $('#catalogGrid');
  if (!grid) return;

  let products;
  try {
    const data = await Api.getProducts(currentCatalogFilter);
    products = data.products || [];
  } catch {
    products = currentCatalogFilter === 'Tümü' ? CATALOG : CATALOG.filter(p => p.category === currentCatalogFilter);
  }

  grid.innerHTML = '';
  products.forEach((p, i) => {
    const card = createCatalogCard(p, i);
    grid.appendChild(card);
  });
}

function createCatalogCard(product, index) {
  const card = document.createElement('div');
  card.className = 'catalog-card glass-card';
  card.style.animation = `fadeInUp 0.4s ease ${index * 0.05}s both`;

  card.innerHTML = `
    <div class="card-icon">${product.icon}</div>
    <div class="card-category">${product.category}</div>
    <h3 class="card-title">${product.name}</h3>
    <p class="card-desc">${product.desc}</p>
    <div class="card-bottom">
      <span class="card-price">₺${product.price.toLocaleString('tr-TR')}</span>
      <span class="card-stock">Stok: ${product.stock}</span>
    </div>
    <button class="btn btn-add-cart" data-id="${product.id}">🛒 Sepete Ekle</button>
  `;

  // Click card to open modal
  card.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-add-cart')) return;
    openProductModal(product);
  });

  // Add to cart button
  card.querySelector('.btn-add-cart').addEventListener('click', (e) => {
    e.stopPropagation();
    addToCart(product);
  });

  return card;
}

// ═══════════════════════════════════════════════
// USER: CART
// ═══════════════════════════════════════════════
function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();

  // Visual feedback: brief button text change
  const btn = document.querySelector(`.btn-add-cart[data-id="${product.id}"]`);
  if (btn) {
    const original = btn.textContent;
    btn.textContent = '✅ Eklendi!';
    btn.style.background = 'var(--pastel-mint-light)';
    setTimeout(() => { btn.textContent = original; btn.style.background = ''; }, 1000);
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  renderCart();
}

function updateCartQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(productId); return; }
  saveCart();
  renderCart();
}

function renderCart() {
  const container = $('#cartContent');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🛒</div>
        <p>Sepetiniz boş</p>
        <p class="empty-sub">Kategoriler sayfasından ürün ekleyebilirsiniz.</p>
      </div>
    `;
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 500 ? 0 : 29.90;
  const total = subtotal + shipping;

  container.innerHTML = `
    <div class="cart-container">
      <div class="cart-items">
        ${cart.map(item => `
          <div class="cart-item glass-card">
            <div class="item-icon">${item.icon}</div>
            <div class="item-info">
              <div class="item-name">${item.name}</div>
              <div class="item-category">${item.category}</div>
            </div>
            <div class="qty-controls">
              <button class="qty-btn" onclick="updateCartQty(${item.id}, -1)">−</button>
              <span class="qty-value">${item.qty}</span>
              <button class="qty-btn" onclick="updateCartQty(${item.id}, 1)">+</button>
            </div>
            <div class="item-price">₺${(item.price * item.qty).toLocaleString('tr-TR')}</div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">✕</button>
          </div>
        `).join('')}
      </div>
      <div class="cart-summary glass-card">
        <h3>Sipariş Özeti</h3>
        <div class="summary-row"><span>Ara Toplam</span><span>₺${subtotal.toLocaleString('tr-TR')}</span></div>
        <div class="summary-row"><span>Kargo</span><span>${shipping === 0 ? 'Ücretsiz' : '₺' + shipping.toLocaleString('tr-TR')}</span></div>
        <div class="summary-row total"><span>Toplam</span><span>₺${total.toLocaleString('tr-TR')}</span></div>
        <button class="checkout-btn" onclick="checkout()">💳 Satın Al</button>
        ${subtotal > 500 ? '<p style="text-align:center;font-size:0.75rem;color:var(--success);margin-top:0.5rem;">🎉 500₺ üzeri ücretsiz kargo!</p>' : ''}
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════
// USER: CHECKOUT
// ═══════════════════════════════════════════════
function checkout() {
  if (cart.length === 0) return;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 500 ? 0 : 29.90;
  const total = subtotal + shipping;

  // Set total in the checkout footer
  $('#checkoutTotalAmount').textContent = `₺${total.toLocaleString('tr-TR')}`;

  // Autofill name and address if user is logged in
  if (currentUser) {
    $('#checkoutFullName').value = currentUser.name || '';
  }

  // Open checkout modal
  $('#checkoutModalOverlay').classList.add('active');
}

function closeCheckoutModal() {
  $('#checkoutModalOverlay').classList.remove('active');
  $('#checkoutForm').reset();
  $('#cardPreviewHolder').textContent = 'AD SOYAD';
  $('#cardPreviewNumber').textContent = '•••• •••• •••• ••••';
  $('#cardPreviewExpiry').textContent = 'AA/YY';
  $('#cardPreviewCvv').textContent = '•••';
  $('#cardBrandLogo').textContent = 'GENERIC';
  const cardPreview = $('#creditCardPreview');
  if (cardPreview) cardPreview.classList.remove('flipped');
  $('#checkoutError').classList.remove('visible');
}

function initCheckoutModal() {
  const overlay = $('#checkoutModalOverlay');
  if (!overlay) return;

  $('#checkoutCloseBtn').addEventListener('click', closeCheckoutModal);
  $('#checkoutCancelBtn').addEventListener('click', closeCheckoutModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeCheckoutModal(); });

  const cardHolder = $('#cardHolder');
  const cardNumber = $('#cardNumber');
  const cardExpiry = $('#cardExpiry');
  const cardCvc = $('#cardCvc');

  // Input bindings for real-time card preview updates
  if (cardHolder) {
    cardHolder.addEventListener('input', (e) => {
      const val = e.target.value;
      $('#cardPreviewHolder').textContent = val.trim() ? val.toUpperCase() : 'AD SOYAD';
    });
  }

  if (cardNumber) {
    cardNumber.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      let formatted = '';
      for (let i = 0; i < val.length; i++) {
        if (i > 0 && i % 4 === 0) formatted += ' ';
        formatted += val[i];
      }
      e.target.value = formatted;
      
      // Preview number sync
      $('#cardPreviewNumber').textContent = formatted || '•••• •••• •••• ••••';

      // Detect brand
      const firstDigit = val[0];
      const logoEl = $('#cardBrandLogo');
      if (logoEl) {
        if (firstDigit === '4') {
          logoEl.textContent = 'VISA';
        } else if (firstDigit === '5') {
          logoEl.textContent = 'MASTERCARD';
        } else if (firstDigit === '9' || firstDigit === '3') {
          logoEl.textContent = 'TROY';
        } else {
          logoEl.textContent = 'GENERIC';
        }
      }
    });
  }

  if (cardExpiry) {
    cardExpiry.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 2) {
        e.target.value = val.substring(0, 2) + '/' + val.substring(2, 4);
      } else {
        e.target.value = val;
      }
      $('#cardPreviewExpiry').textContent = e.target.value || 'AA/YY';
    });
  }

  if (cardCvc) {
    cardCvc.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      e.target.value = val;
      $('#cardPreviewCvv').textContent = val || '•••';
    });

    // Flip card preview on CVC focus
    cardCvc.addEventListener('focus', () => {
      const cardPreview = $('#creditCardPreview');
      if (cardPreview) cardPreview.classList.add('flipped');
    });

    cardCvc.addEventListener('blur', () => {
      const cardPreview = $('#creditCardPreview');
      if (cardPreview) cardPreview.classList.remove('flipped');
    });
  }

  // Form submit
  const checkoutForm = $('#checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payBtn = $('#checkoutPayBtn');
      const spinner = payBtn.querySelector('.pay-spinner');
      const text = payBtn.querySelector('.pay-text');
      const errorDiv = $('#checkoutError');
      errorDiv.classList.remove('visible');

      const cardNumberVal = cardNumber.value.replace(/\s/g, '');
      if (cardNumberVal.length < 16) {
        errorDiv.textContent = 'Lütfen geçerli bir 16 haneli kart numarası girin.';
        errorDiv.classList.add('visible');
        return;
      }
      const cardExpiryVal = cardExpiry.value;
      if (!/^\d{2}\/\d{2}$/.test(cardExpiryVal)) {
        errorDiv.textContent = 'Son kullanma tarihi geçersiz (AA/YY formatında olmalı).';
        errorDiv.classList.add('visible');
        return;
      }
      const cardCvcVal = cardCvc.value;
      if (cardCvcVal.length < 3) {
        errorDiv.textContent = 'CVC kodu 3 haneli olmalıdır.';
        errorDiv.classList.add('visible');
        return;
      }

      // Start payment processing animation
      payBtn.disabled = true;
      if (spinner) spinner.style.display = 'inline-block';
      if (text) text.textContent = ' Ödeme Doğrulanıyor...';

      setTimeout(async () => {
        const address = $('#checkoutAddress').value;
        const fullName = $('#checkoutFullName').value;
        const phone = $('#checkoutPhone').value;
        const shippingAddress = {
          name: fullName,
          phone: phone,
          address: address
        };

        const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        const shipping = subtotal > 500 ? 0 : 29.90;
        const total = subtotal + shipping;

        const orderId = 'SHP-' + Date.now().toString(36).toUpperCase();
        const orderDate = new Date().toISOString();

        const newOrder = {
          id: orderId,
          date: orderDate,
          items: cart.map(item => ({ name: item.name, qty: item.qty, price: item.price, icon: item.icon })),
          subtotal,
          shipping,
          total,
          status: 'processing',
          userEmail: currentUser.email,
          shipping_address: shippingAddress,
          payment_method: 'Kredi Kartı'
        };

        try {
          // Send order to API
          await Api.createOrder(currentUser.email, shippingAddress, 'Kredi Kartı');
        } catch (err) {
          // Fallback to local only if API fails/offline
        }

        // Save locally
        const orders = getOrders();
        orders.unshift(newOrder);
        saveOrders(orders);

        // Reset cart
        cart = [];
        saveCart();

        // Reset button state
        payBtn.disabled = false;
        if (spinner) spinner.style.display = 'none';
        if (text) text.textContent = '💳 Güvenli Ödeme Yap';

        // Close modal
        closeCheckoutModal();

        // Render success screen in cartContent
        const container = $('#cartContent');
        if (container) {
          container.innerHTML = `
            <div class="empty-state" style="animation: fadeInUp 0.5s ease;">
              <div class="empty-icon">🎉</div>
              <p style="font-weight:700;color:var(--text-primary);font-size:1.1rem;">Siparişiniz Alındı!</p>
              <p class="empty-sub">Sipariş No: <strong>${newOrder.id}</strong></p>
              <p class="empty-sub">Toplam: <strong>₺${total.toLocaleString('tr-TR')}</strong></p>
              <button class="btn btn-primary" style="margin-top:1.5rem;" onclick="document.querySelector('[data-panel=user-orders]').click()">📦 Siparişlerimi Gör</button>
            </div>
          `;
        }
      }, 2000); // 2 second processing time
    });
  }
}

// ═══════════════════════════════════════════════
// USER: ORDERS
// ═══════════════════════════════════════════════
function renderOrders() {
  const container = $('#ordersContent');
  if (!container) return;

  const allOrders = getOrders();
  const myOrders = currentUser ? allOrders.filter(o => o.userEmail === currentUser.email) : [];

  if (myOrders.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📦</div>
        <p>Henüz siparişiniz yok</p>
        <p class="empty-sub">İlk siparişinizi vermek için alışverişe başlayın.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="orders-list">
      ${myOrders.map(order => `
        <div class="order-card glass-card">
          <div class="order-header">
            <span class="order-id">${order.id}</span>
            <span class="order-date">${new Date(order.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            <span class="order-status ${order.status}">
              ${order.status === 'delivered' ? '✅ Teslim Edildi' : order.status === 'cancelled' ? '❌ İptal Edildi' : '🔄 Hazırlanıyor'}
            </span>
          </div>
          <div class="order-items-list">
            ${order.items.map(item => `
              <div class="order-item-row">
                <span>${item.icon} ${item.name} × ${item.qty}</span>
                <span>₺${(item.price * item.qty).toLocaleString('tr-TR')}</span>
              </div>
            `).join('')}
          </div>
          ${order.shipping_address ? `
            <div class="order-delivery-info" style="border-top: 1px dashed var(--surface-border); padding: 0.6rem 0; margin-top: 0.4rem; font-size: 0.82rem; color: var(--text-secondary); text-align: left; width: 100%;">
              <div style="margin-bottom: 0.2rem;"><strong>📍 Alıcı / Adres:</strong> ${order.shipping_address.name} (${order.shipping_address.phone}) - ${order.shipping_address.address}</div>
              <div><strong>💳 Ödeme Yöntemi:</strong> ${order.payment_method || 'Kredi Kartı'}</div>
            </div>
          ` : ''}
          <div class="order-total-row" style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--surface-border); padding-top: 0.8rem; margin-top: 0.5rem; width: 100%;">
            <div>
              ${order.status !== 'cancelled' && order.status !== 'delivered' ? `
                <button class="btn btn-danger btn-sm" onclick="cancelOrder('${order.id}')" style="padding: 0.35rem 0.8rem; font-size: 0.78rem; border-radius: 8px;">Siparişi İptal Et</button>
              ` : ''}
            </div>
            <div class="order-total" style="border: none; padding: 0; margin: 0; font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 1.05rem; color: var(--text-primary);">Toplam: ₺${order.total.toLocaleString('tr-TR')}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

async function cancelOrder(orderId) {
  if (!window.location.search.includes('test=true') && !confirm('Siparişi iptal etmek istediğinize emin misiniz?')) return;

  try {
    if (Api.online) {
      await Api.cancelOrder(currentUser.email, orderId);
    }
  } catch (err) {
    // Fallback if offline
  }

  // Update locally
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = 'cancelled';
    saveOrders(orders);
  }

  // Refresh view
  renderOrders();
}

// ═══════════════════════════════════════════════
// PRODUCT MODAL
// ═══════════════════════════════════════════════
function initProductModal() {
  $('#productModalClose').addEventListener('click', closeProductModal);
  $('#modalCancelBtn').addEventListener('click', closeProductModal);
  $('#productModalOverlay').addEventListener('click', (e) => {
    if (e.target === $('#productModalOverlay')) closeProductModal();
  });
  $('#modalAddCartBtn').addEventListener('click', () => {
    if (currentModalProduct) {
      addToCart(currentModalProduct);
      closeProductModal();
    }
  });
}

function openProductModal(product) {
  currentModalProduct = product;
  const icon = product.icon || CATEGORY_ICONS[product.category] || CATEGORY_ICONS.default;
  const score = product.similarity_score ? Math.round(product.similarity_score * 100) : null;

  $('#modalIcon').textContent = icon;
  $('#modalTitle').textContent = product.name;
  $('#modalDesc').innerHTML = `
    ${product.desc ? product.desc + '<br><br>' : ''}
    ${score ? `<strong>Uyum Oranı:</strong> %${score}<br>` : ''}
    <strong>Kategori:</strong> ${product.category || 'Belirtilmemiş'}<br>
    <strong>Fiyat:</strong> ${product.price ? '₺' + product.price.toLocaleString('tr-TR') : 'Belirtilmemiş'}<br>
    ${product.stock ? `<strong>Stok:</strong> ${product.stock} adet` : ''}
  `;

  // Show/hide add to cart based on role
  const addBtn = $('#modalAddCartBtn');
  addBtn.style.display = (currentUser && currentUser.role === 'user') ? '' : 'none';

  $('#productModalOverlay').classList.add('active');
}

function closeProductModal() {
  $('#productModalOverlay').classList.remove('active');
  currentModalProduct = null;
}

// ═══════════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════════
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if ($('#loginOverlay').classList.contains('active')) closeAuthModal();
    if ($('#productModalOverlay').classList.contains('active')) closeProductModal();
    if ($('#checkoutModalOverlay').classList.contains('active')) closeCheckoutModal();
    closeMobileSidebar();
  }
});

// Make cart functions globally accessible for inline onclick handlers
window.updateCartQty = updateCartQty;
window.removeFromCart = removeFromCart;
window.checkout = checkout;
window.closeCheckoutModal = closeCheckoutModal;
window.cancelOrder = cancelOrder;

// ═══════════════════════════════════════════════
// THEME MANAGER (Dark/Light Mode)
// ═══════════════════════════════════════════════
function initTheme() {
  const savedTheme = localStorage.getItem('shopai_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);

  // Bind all toggle buttons
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const newTheme = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('shopai_theme', newTheme);
  updateThemeIcons(newTheme);
}

function updateThemeIcons(theme) {
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  });
}

// Initialize theme on load
initTheme();


// ═══════════════════════════════════════════════
// PROFILE SETTINGS
// ═══════════════════════════════════════════════
function initProfileSettings() {
  if (!currentUser) return;

  // Set initial input values
  $('#profileName').value = currentUser.name;
  $('#profileEmail').value = currentUser.email;

  // Clear messages
  $('#profileDetailsSuccess').classList.remove('visible');
  $('#profileDetailsError').classList.remove('visible');
  $('#profilePasswordSuccess').classList.remove('visible');
  $('#profilePasswordError').classList.remove('visible');
  $('#profileDeleteError').classList.remove('visible');

  // Reset forms
  $('#profilePasswordForm').reset();
  $('#profileDeleteForm').reset();

  // 1. Details form submit
  $('#profileDetailsForm').onsubmit = async (e) => {
    e.preventDefault();
    $('#profileDetailsSuccess').classList.remove('visible');
    $('#profileDetailsError').classList.remove('visible');

    const newName = $('#profileName').value.trim();
    if (!newName) return;

    try {
      // API call
      const res = await Api.updateProfileDetails(currentUser.email, newName);
      if (res.error) throw new Error(res.error);
      
      // Update local state
      currentUser.name = newName;
      sessionStorage.setItem('shopai_user', JSON.stringify(currentUser));

      // Sync with localStorage
      const users = getUsers();
      const userIndex = users.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
      if (userIndex !== -1) {
        users[userIndex].name = newName;
        saveUsers(users);
      }

      // Update UI
      $('#userName').textContent = currentUser.name;
      $('#userAvatar').textContent = getInitials(currentUser.name);
      
      const userGreetingEl = $('#userBannerGreeting');
      if (userGreetingEl) {
        userGreetingEl.textContent = `👋 Hoş Geldiniz, ${currentUser.name.split(' ')[0]}!`;
      }
      
      const hour = new Date().getHours();
      let greeting = hour < 12 ? 'Günaydın' : hour >= 18 ? 'İyi akşamlar' : 'İyi günler';
      $('#dashGreeting').textContent = `${greeting}, ${currentUser.name.split(' ')[0]}!`;

      $('#profileDetailsSuccess').classList.add('visible');
    } catch (err) {
      // Fallback if API offline
      const users = getUsers();
      const userIndex = users.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
      if (userIndex !== -1) {
        users[userIndex].name = newName;
        saveUsers(users);
        
        currentUser.name = newName;
        sessionStorage.setItem('shopai_user', JSON.stringify(currentUser));
        
        $('#userName').textContent = currentUser.name;
        $('#userAvatar').textContent = getInitials(currentUser.name);
        
        const userGreetingEl = $('#userBannerGreeting');
        if (userGreetingEl) {
          userGreetingEl.textContent = `👋 Hoş Geldiniz, ${currentUser.name.split(' ')[0]}!`;
        }
        
        const hour = new Date().getHours();
        let greeting = hour < 12 ? 'Günaydın' : hour >= 18 ? 'İyi akşamlar' : 'İyi günler';
        $('#dashGreeting').textContent = `${greeting}, ${currentUser.name.split(' ')[0]}!`;

        $('#profileDetailsSuccess').classList.add('visible');
      } else {
        $('#profileDetailsError').textContent = err.message || 'Bir hata oluştu.';
        $('#profileDetailsError').classList.add('visible');
      }
    }
  };

  // 2. Password form submit
  $('#profilePasswordForm').onsubmit = async (e) => {
    e.preventDefault();
    $('#profilePasswordSuccess').classList.remove('visible');
    $('#profilePasswordError').classList.remove('visible');

    const oldPassword = $('#profileOldPassword').value;
    const newPassword = $('#profileNewPassword').value;
    const confirmPassword = $('#profileConfirmNewPassword').value;

    if (newPassword.length < 6) {
      $('#profilePasswordError').textContent = 'Yeni şifre en az 6 karakter olmalıdır.';
      $('#profilePasswordError').classList.add('visible');
      return;
    }

    if (newPassword !== confirmPassword) {
      $('#profilePasswordError').textContent = 'Yeni şifreler eşleşmiyor.';
      $('#profilePasswordError').classList.add('visible');
      return;
    }

    try {
      // API call
      const res = await Api.changePassword(currentUser.email, oldPassword, newPassword);
      if (res.error) throw new Error(res.error);

      // Sync local user password
      currentUser.password = newPassword;
      sessionStorage.setItem('shopai_user', JSON.stringify(currentUser));

      const users = getUsers();
      const userIndex = users.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
      if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        saveUsers(users);
      }

      $('#profilePasswordSuccess').classList.add('visible');
      $('#profilePasswordForm').reset();
    } catch (err) {
      // Fallback
      const users = getUsers();
      const userIndex = users.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase() && u.password === oldPassword);
      if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        saveUsers(users);

        currentUser.password = newPassword;
        sessionStorage.setItem('shopai_user', JSON.stringify(currentUser));

        $('#profilePasswordSuccess').classList.add('visible');
        $('#profilePasswordForm').reset();
      } else {
        $('#profilePasswordError').textContent = err.message || 'Mevcut şifre hatalı.';
        $('#profilePasswordError').classList.add('visible');
      }
    }
  };

  // 3. Delete account form submit
  $('#profileDeleteForm').onsubmit = async (e) => {
    e.preventDefault();
    $('#profileDeleteError').classList.remove('visible');

    const confirmEmail = $('#profileDeleteConfirmEmail').value.trim();
    if (confirmEmail.toLowerCase() !== currentUser.email.toLowerCase()) {
      $('#profileDeleteError').textContent = 'Girdiğiniz e-posta adresi mevcut hesabınızla eşleşmiyor.';
      $('#profileDeleteError').classList.add('visible');
      return;
    }

    if (!confirm('Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) {
      return;
    }

    try {
      // API call
      await Api.deleteAccount(currentUser.email);
    } catch (e) {
      // ignore API failure and proceed to clean local storage (offline fallback)
    }

    // Remove user from localStorage
    const users = getUsers();
    const filteredUsers = users.filter(u => u.email.toLowerCase() !== currentUser.email.toLowerCase());
    saveUsers(filteredUsers);

    // Alert and logout
    alert('Hesabınız başarıyla silindi.');
    logout();
  };
}

