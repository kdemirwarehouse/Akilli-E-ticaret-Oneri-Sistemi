from sklearn.model_selection import train_test_split
#Veriyi egitim ve test olarak ayirmak icin kullandik.

from sklearn.linear_model import LogisticRegression
#Logistic Regression modelini ice aktariyoruz

from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
#performans metriklerini ice aktariyoruz

#Sample features
X = df.drop("target", axis=1)
#target sutunu disindaki verileri ozellik olarak aliyoruz.

y = df["target"]
#tahmin edilecek sutun

#veriyi egitim ve test olarak ayiriyoruz
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

#Model olusturma
model = LogisticRegression()

#Modeli egitme
model.fit(X_train, y_train)

#tahmin yapma
y_pred = model.predict(X_test)

#acc hesaplama
accuracy = accuracy_score(y_test, y_pred)

#precision hesaplama
precision = precision_score(y_test, y_pred)

#recall hesaplama
recall = recall_score(y_test, y_pred)

#f1 score hesaplama
f1 = f1_score(y_test, y_pred)

#Confusion matrix olusturma
cm = confusion_matrix(y_test, y_pred)

#sonuclari yazdirma
print("Accuracy: ", accuracy)
print("Precision: ", precision)
print("Recall: ", recall)
print("F1 score: ", f1)
print("Confusion matrix: ")
print(cm)
