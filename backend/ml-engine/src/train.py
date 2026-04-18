import pandas as pd
import joblib
import os
import numpy as np

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

def train_model():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, 'data', 'processed', 'merged_reviews.csv')
    artifacts_dir = os.path.join(base_dir, 'artifacts')

    print("📂 Loading dataset...")
    df = pd.read_csv(data_path)
    df['cleaned_text'] = df['cleaned_text'].astype(str).fillna('')

    print(f"📊 Training on {len(df)} reviews...")
    print("🧮 Vectorizing text (TF-IDF)...")
    tfidf = TfidfVectorizer(
        max_features=2000,
        stop_words='english',
        ngram_range=(1, 2),
        min_df=2,
        max_df=0.95
    )

    X_tfidf = tfidf.fit_transform(df['cleaned_text'])
    print("📏 Engineering stylometric features...")

    caps = df['caps_ratio'].fillna(0).values.reshape(-1, 1)
    punct = df['punct_count'].fillna(0).values.reshape(-1, 1)
    length = np.log1p(df['text_len'].fillna(0).values).reshape(-1, 1)
    word_count = df['cleaned_text'].apply(lambda x: len(x.split())).values.reshape(-1, 1)
    exclamation_ratio = df['cleaned_text'].apply(lambda x: x.count('!') / (len(x) + 1)).values.reshape(-1, 1)

    X_style = np.hstack([caps, punct, length, word_count, exclamation_ratio])
    print("⚖️ Scaling stylometric features...")
    scaler = StandardScaler()
    X_style_scaled = scaler.fit_transform(X_style)
    print("🔗 Combining TF-IDF + Stylometric features...")

    X_final = np.hstack([
        X_tfidf.toarray(),
        X_style_scaled
    ]).astype('float32')

    print(f"✅ Final feature shape: {X_final.shape}")
    print("🌲 Training Isolation Forest (balanced)...")

    iso_forest = IsolationForest(
        n_estimators=400,
        contamination=0.05,
        max_samples='auto',
        random_state=42,
        n_jobs=-1
    )

    iso_forest.fit(X_final)
    os.makedirs(artifacts_dir, exist_ok=True)

    joblib.dump(tfidf, os.path.join(artifacts_dir, 'vectorizer_v2.pkl'))
    joblib.dump(scaler, os.path.join(artifacts_dir, 'scaler_v2.pkl'))   # 🔥 NEW
    joblib.dump(iso_forest, os.path.join(artifacts_dir, 'model_v2.pkl'))

    print("💾 Artifacts saved:")
    print("   - vectorizer_v2.pkl")
    print("   - scaler_v2.pkl")
    print("   - model_v2.pkl")

    print("🚀 TRAINING COMPLETE")
if __name__ == "__main__":
    train_model()