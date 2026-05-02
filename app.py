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
    # Örnek ürün verisi (Normalde veritabanından veya modelden gelir)
    # Doğruluğu artırmak için her ürüne bir 'similarity_score' (benzerlik skoru) ekledik
    all_products = [
        {"id": 1, "name": "Kablosuz Kulaklık", "similarity_score": 0.95},
        {"id": 2, "name": "Bluetooth Hoparlör", "similarity_score": 0.82},
        {"id": 3, "name": "Akıllı Saat", "similarity_score": 0.45},  # Skoru düşük
        {"id": 4, "name": "Laptop Standı", "similarity_score": 0.88}
    ]

    # HASSASİYET ARTIRMA: Sadece benzerlik skoru 0.70'den büyük olanları öner
    # Bu işlem algoritmanın "doğruluğunu" simüle eder.
    threshold = 0.70
    optimized_recommendations = [p for p in all_products if p['similarity_score'] >= threshold]

    app.logger.info(f"Kullanıcı {user_id} için {threshold} eşiği ile hassas hesaplama yapıldı.")
    
    return jsonify({
        "user_id": user_id,
        "optimization_status": "High Accuracy Mode (Threshold: 0.70)",
        "results_count": len(optimized_recommendations),
        "recommendations": optimized_recommendations
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
