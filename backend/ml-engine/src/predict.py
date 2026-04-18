import joblib
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'artifacts', 'model_v1.pkl')
VECTORIZER_PATH = os.path.join(BASE_DIR, 'artifacts', 'vectorizer_v1.pkl')

model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)

def predict_review(text):
    X = vectorizer.transform([text]).toarray().astype('float32')
    prediction = model.predict(X)
    score = model.decision_function(X)
    
    return {
        "text": text,
        "label": "FAKE/ANOMALY" if prediction[0] == -1 else "GENUINE",
        "confidence_score": float(score[0])
    }

if __name__ == "__main__":
    test_text = "Amazing product! Best ever! Buy now!"
    print(predict_review(test_text))