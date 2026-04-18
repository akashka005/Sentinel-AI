import os
from pathlib import Path
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Sentinel AI"
    API_V1_STR: str = "/api/v1"
    BASE_DIR: Path = Path(__file__).resolve().parent.parent

    MODEL_PATH: str = str(BASE_DIR / "ml-engine" / "artifacts" / "model_v2.pkl")
    VECTORIZER_PATH: str = str(BASE_DIR / "ml-engine" / "artifacts" / "vectorizer_v2.pkl")
    SCALER_PATH: str = str(BASE_DIR / "ml-engine" / "artifacts" / "scaler_v2.pkl")

    ALLOWED_HOSTS: list = ["*"]
    DEBUG: bool = True

settings = Settings()