import os
import sys
from fastapi import FastAPI
from core.config import settings
from core.security import setup_cors
from api.v1.endpoints import router as api_router
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'ml-engine', 'src'))

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version="1.0.0",
        description="Production-grade Anomaly Detection Pipeline for Fake Reviews"
    )
    setup_cors(app)
    app.include_router(api_router, prefix=settings.API_V1_STR)
    @app.get("/", tags=["Health"])
    async def root():
        return {
            "status": "Online",
            "engine": settings.PROJECT_NAME,
            "version": "1.0.0",
            "artifacts_loaded": True
        }

    return app
app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)