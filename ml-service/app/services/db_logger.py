import time
import uuid
import logging
import httpx
from typing import Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger("ml_service.db_logger")

# In-memory fast ring-buffer of inferences & ground truth
PREDICTIONS_STORE: list[Dict[str, Any]] = []
FEEDBACK_STORE: list[Dict[str, Any]] = []

async def log_prediction_async(
    request_id: str,
    customer_id: str,
    features: Dict[str, Any],
    prediction: str,
    churn_probability: float,
    risk_level: str,
    model_version: str,
    algorithm: str,
    latency_ms: float,
    user_id: str = "anonymous-user"
):
    """
    Logs prediction event to local memory buffer and dispatches to Supabase if available.
    """
    record = {
        "id": request_id,
        "customer_id": customer_id,
        "features": features,
        "prediction": prediction,
        "churn_probability": churn_probability,
        "risk_level": risk_level,
        "model_version": model_version,
        "algorithm": algorithm,
        "inference_latency_ms": latency_ms,
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "user_id": user_id
    }
    PREDICTIONS_STORE.append(record)
    if len(PREDICTIONS_STORE) > 1000:
        PREDICTIONS_STORE.pop(0)

    # Optional async write to Supabase REST endpoint if configured
    if settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY:
        try:
            async with httpx.AsyncClient(timeout=1.5) as client:
                headers = {
                    "apikey": settings.SUPABASE_ANON_KEY,
                    "Authorization": f"Bearer {settings.SUPABASE_ANON_KEY}",
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal"
                }
                # Log to predictions table if exists
                await client.post(
                    f"{settings.SUPABASE_URL}/rest/v1/predictions",
                    headers=headers,
                    json=record
                )
        except Exception:
            # Non-blocking: failure to post to remote does not delay inference response
            pass


async def log_feedback_async(
    feedback_id: str,
    prediction_id: str,
    customer_id: str,
    actual_outcome: str,
    comments: Optional[str],
    user_id: str = "staff-operator"
):
    record = {
        "id": feedback_id,
        "prediction_id": prediction_id,
        "customer_id": customer_id,
        "actual_outcome": actual_outcome,
        "comments": comments or "",
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "user_id": user_id
    }
    FEEDBACK_STORE.append(record)

    # Update matching prediction feedback status if present in local buffer
    for p in PREDICTIONS_STORE:
        if p.get("id") == prediction_id or p.get("customer_id") == customer_id:
            p["feedback"] = {
                "actual_outcome": actual_outcome,
                "comments": comments
            }
            break

    if settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY:
        try:
            async with httpx.AsyncClient(timeout=1.5) as client:
                headers = {
                    "apikey": settings.SUPABASE_ANON_KEY,
                    "Authorization": f"Bearer {settings.SUPABASE_ANON_KEY}",
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal"
                }
                await client.post(
                    f"{settings.SUPABASE_URL}/rest/v1/feedback",
                    headers=headers,
                    json=record
                )
        except Exception:
            pass
