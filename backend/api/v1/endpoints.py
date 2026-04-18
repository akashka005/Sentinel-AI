from fastapi import APIRouter, HTTPException
import joblib
import numpy as np
import os
import re

from .schema import ReviewRequest, ReviewResponse
from core.config import settings

router = APIRouter()
model = joblib.load(settings.MODEL_PATH)
vectorizer = joblib.load(settings.VECTORIZER_PATH)
scaler = joblib.load(settings.SCALER_PATH)

def get_calibrated_score(raw_score: float) -> float:
    return 1 / (1 + np.exp(raw_score * 12))

def rule_based_check(text: str):
    text_upper = text.upper()
    spam_triggers = [
        r"CLICK\s+(HERE|THE\s+LINK|NOW)", 
        r"100%\s+(LEGIT|REAL|GUARANTEED|SUCCESS)",
        r"FREE\s+GIFT", r"UNBELIEVABLE\s+DEALS",
        r"PROMO\d+", r"SCAM-FREE"
    ]
    for pattern in spam_triggers:
        if re.search(pattern, text_upper):
            return True, "Commercial Payload Detected"
    if re.search(r'!{2,}', text) or re.search(r'\?{2,}', text):
        return True, "Syntactic Anomaly (Excessive Punctuation)"
    caps_ratio = sum(1 for c in text if c.isupper()) / (len(text) + 1)
    if caps_ratio > 0.45 and len(text) > 20:
        return True, "High-Decibel Anomaly (Excessive Caps)"
    if len(text.split()) > 70:
        return False, "High-Context Human Narrative"

    return None, None

@router.post("/analyze", response_model=ReviewResponse)
async def analyze_review(request: ReviewRequest):
    try:
        text = request.review_text.strip()
        if not text:
            raise HTTPException(status_code=400, detail="Neural Input Buffer is empty.")
        rule_flag, rule_reason = rule_based_check(text)

        if rule_flag is True:
            return ReviewResponse(
                is_anomaly=True,
                anomaly_score=0.9924,
                verdict=f"Suspicious ({rule_reason})"
            )

        if rule_flag is False:
            return ReviewResponse(
                is_anomaly=False,
                anomaly_score=0.0215,
                verdict=f"Likely Genuine ({rule_reason})"
            )
        X_tfidf = vectorizer.transform([text]).toarray()
    
        caps_ratio = sum(1 for c in text if c.isupper()) / (len(text) + 1)
        punct_count = sum(text.count(p) for p in "!?$")
        text_len_log = np.log1p(len(text))
        word_count = len(text.split())
        exclamation_ratio = text.count('!') / (len(text) + 1)

        X_style = np.array([[caps_ratio, punct_count, text_len_log, word_count, exclamation_ratio]])
        X_style_scaled = scaler.transform(X_style)
        X_final = np.hstack([X_tfidf, X_style_scaled]).astype('float32')
        raw_score = model.decision_function(X_final)[0]
        prob_anomaly = get_calibrated_score(raw_score)
        threshold = 0.65
        is_anomaly = prob_anomaly > threshold

        return ReviewResponse(
            is_anomaly=is_anomaly,
            anomaly_score=float(prob_anomaly),
            verdict="Deceptive Content Detected" if is_anomaly else "Likely Genuine"
        )

    except Exception as e:
        print(f"[ENGINE ERROR]: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Neural Engine Failure")