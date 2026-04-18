import pandas as pd
import re
import string
import os
from sklearn.base import BaseEstimator, TransformerMixin

class TextCleaner(BaseEstimator, TransformerMixin):
    def __init__(self):
        pass

    def clean_text(self, text):
        if not isinstance(text, str):
            return ""
        text = text.lower()
        text = text.translate(str.maketrans('', '', string.punctuation))
        text = re.sub(r'\d+', '', text)
        text = text.strip()
        return text

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        return [self.clean_text(t) for t in X]

def load_and_merge_data(amazon_path, yelp_path):
    print("🚀 Loading and standardizing datasets...")
    
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    df_a = pd.read_csv(amazon_path)
    df_a = df_a[['text', 'rating']].copy()
    df_a['source'] = 'amazon'

    # Load Yelp
    try:
        df_y = pd.read_csv(yelp_path).sample(n=50000, random_state=42)
        if 'stars' in df_y.columns:
            df_y = df_y.rename(columns={'stars': 'rating'})
        df_y = df_y[['text', 'rating']].copy()
        df_y['source'] = 'yelp'
        combined = pd.concat([df_a, df_y], ignore_index=True)
    except Exception as e:
        print(f"⚠️ Yelp file not found or error: {e}. Proceeding with Amazon only.")
        combined = df_a

    combined = combined.sample(frac=1, random_state=42).reset_index(drop=True)
    combined = combined.dropna(subset=['text'])
    
    print("🧪 Engineering stylometric features...")
    combined['caps_ratio'] = combined['text'].apply(
        lambda x: sum(1 for c in str(x) if c.isupper()) / (len(str(x)) + 1)
    )
    combined['punct_count'] = combined['text'].apply(
        lambda x: sum(str(x).count(p) for p in "!?$")
    )
    
    combined['text_len'] = combined['text'].apply(lambda x: len(str(x)))
    
    return combined

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    raw_dir = os.path.join(base_dir, 'data', 'raw')
    processed_dir = os.path.join(base_dir, 'data', 'processed')
    
    amazon_csv = os.path.join(raw_dir, 'amazon.csv')
    yelp_csv = os.path.join(raw_dir, 'yelp.csv')

    data = load_and_merge_data(amazon_csv, yelp_csv)
    print(f"✅ Combined dataset size: {len(data)}")
    
    cleaner = TextCleaner()
    data['cleaned_text'] = cleaner.transform(data['text'])
    os.makedirs(processed_dir, exist_ok=True)
    data.to_csv(os.path.join(processed_dir, 'merged_reviews.csv'), index=False)
    print(f"📂 Saved cleaned data with stylometric features to {processed_dir}")