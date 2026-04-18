from pydantic import BaseModel

class ReviewRequest(BaseModel):
    review_text: str

class ReviewResponse(BaseModel):
    is_anomaly: bool
    anomaly_score: float
    verdict: str