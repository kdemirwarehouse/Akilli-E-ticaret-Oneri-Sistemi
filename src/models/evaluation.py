from sklearn.model_selection import train_test_split
#Veriyi egitim ve test olarak ayirmak icin kullandik.

from sklearn.linear_model import LogisticRegression
#Logistic Regression modelini ice aktariyoruz

from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
#performans metriklerini ice aktariyoruz

def evaluate_model(df, target_col="target"):
    """
    Veri seti üzerinde model eğitimini ve değerlendirmesini gerçekleştirir.
    :param df: Pandas DataFrame
    :param target_col: Hedef değişken (sütun) adı
    :return: metrikler sözlüğü
    """
    # Özellik ve hedef ayrımı
    X = df.drop(target_col, axis=1)
    y = df[target_col]

    # Veriyi eğitim ve test olarak ayırıyoruz
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Model oluşturma
    model = LogisticRegression(max_iter=1000)

    # Modeli eğitme
    model.fit(X_train, y_train)

    # Tahmin yapma
    y_pred = model.predict(X_test)

    # Metrikleri hesaplama
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average='weighted', zero_division=0)
    recall = recall_score(y_test, y_pred, average='weighted', zero_division=0)
    f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)
    cm = confusion_matrix(y_test, y_pred)

    # Sonuçları yazdırma
    print("=== Model Performans Raporu ===")
    print("Accuracy: ", accuracy)
    print("Precision: ", precision)
    print("Recall: ", recall)
    print("F1 score: ", f1)
    print("Confusion matrix: \n", cm)
    
    return {
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1_score": f1,
        "confusion_matrix": cm
    }

# Örnek Kullanım:
# import pandas as pd
# df_ornek = pd.DataFrame({'feature1': [1,2,3,4,5], 'target': [0,1,0,1,0]})
# evaluate_model(df_ornek)
