import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "AdaptFlow ML Service"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    PORT: int = int(os.getenv("ML_SERVICE_PORT", "8000"))
    HOST: str = "0.0.0.0"

    # Supabase Integration
    SUPABASE_URL: str = os.getenv("VITE_SUPABASE_URL", os.getenv("SUPABASE_URL", "https://cyacddpoainhjzrajxui.supabase.co"))
    SUPABASE_ANON_KEY: str = os.getenv("VITE_SUPABASE_ANON_KEY", os.getenv("SUPABASE_ANON_KEY", ""))
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "super-secret-jwt-token-with-at-least-32-bytes-long")

    # MLflow & Model Registry
    MLFLOW_TRACKING_URI: str = os.getenv("MLFLOW_TRACKING_URI", "http://localhost:5000")
    MODEL_NAME: str = os.getenv("MODEL_NAME", "AdaptFlow-Churn-Predictor")
    MODEL_ALIAS: str = os.getenv("MODEL_ALIAS", "champion")
    MODEL_CACHE_DIR: str = os.getenv("MODEL_CACHE_DIR", "./models_cache")

    # MLOps Drift & Retraining Policies
    DRIFT_KS_P_VALUE_THRESHOLD: float = 0.05
    DRIFT_PSI_THRESHOLD: float = 0.15
    MIN_VERIFIED_FEEDBACK_FOR_RETRAIN: int = 25
    RETRAINING_COOLDOWN_HOURS: int = 24

    # Security
    ADMIN_INVITE_CODE: str = os.getenv("ADMIN_INVITE_CODE", "ADAPTFLOW_SECRET_ADMIN_2026")

settings = Settings()
