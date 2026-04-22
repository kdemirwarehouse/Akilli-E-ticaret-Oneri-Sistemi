from flask import Flask, jsonify, request
import logging

app = Flask(__name__)

# 1. Logging (Loglama) Mekanizması: Hataları ve işlemleri dosyaya kaydeder
logging.basicConfig(filename='api_logs.log', level=logging.INFO,
                    format='%(asctime)s %(levelname)s: %(message)s')

# Örnek Veri Seti
products = [
    {"id": 1, "name": "Laptop", "category": "Elektronik"},
    {"id": 2, "name": "Mouse", "category": "Elektronik"},
    {"id": 3, "name": "Kitap", "category": "Hobi"}
]

@app.route('/')
def home():
    app.logger.info("Ana sayfa ziyaret edildi.")
    return jsonify({"mesaj": "Flask Oneri API'sine Hos Geldiniz!"})

# 2. Ürün Önerileri Endpoint'i
@app.route('/api/v1/recommendations/<int:user_id>', methods=['GET'])
def get_recommendations(user_id):
    app.logger.info(f"Kullanici {user_id} icin oneri istendi.")
    
    # Basit bir mantık: Herkese ürün listesini dönüyoruz
    return jsonify({
        "user_id": user_id,
        "recommendations": products
    })

# 3. Temel Hata Yönetimi
@app.errorhandler(404)
def not_found(error):
    app.logger.error("Sayfa bulunamadi hatasi (404) olustu.")
    return jsonify({"hata": "Istenen kaynak bulunamadi"}), 404

@app.errorhandler(500)
def internal_error(error):
    app.logger.error("Sunucu hatasi (500) olustu.")
    return jsonify({"hata": "Sunucu ic hatasi"}), 500

if __name__ == '__main__':
    app.run(debug=True)