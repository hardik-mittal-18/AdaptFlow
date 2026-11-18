import time
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from app.schemas.telco import (
    PredictRequest,
    PredictResponse,
    BatchPredictRequest,
    BatchPredictResponse
)
from app.services.registry_loader import registry_service
from app.services.explainer import ChurnExplainabilityService
from app.services.db_logger import log_prediction_async
from app.core.metrics import (
    PREDICTION_REQUESTS,
    INFERENCE_LATENCY,
    CHURN_PROBABILITY_HISTOGRAM
)
from app.core.security import require_roles, AuthenticatedUser

router = APIRouter(tags=["Inference"])

@router.post(
    "/predict",
    response_model=PredictResponse,
    summary="Compute real-time Telco customer churn risk with XAI feature explanations"
)
async def predict_churn(
    request: PredictRequest,
    background_tasks: BackgroundTasks,
    user: AuthenticatedUser = Depends(require_roles(["consumer", "staff", "admin"]))
):
    start_time = time.perf_counter()
    model = registry_service.get_model()
    metadata = registry_service.get_metadata()

    customer_id = request.customerId or f"CUST-{uuid.uuid4().hex[:6].upper()}"
    request_id = f"pred-{uuid.uuid4().hex[:8]}"

    try:
        # Run inference
        churn_prob = model.predict_proba(request.features)
        prediction_label = "Churn" if churn_prob >= 0.50 else "No Churn"

        # Determine risk tier
        if churn_prob >= 0.65:
            risk_level = "Critical"
        elif churn_prob >= 0.35:
            risk_level = "Moderate"
        else:
            risk_level = "Low"

        # Explainable AI (SHAP attributions)
        top_factors = ChurnExplainabilityService.explain_prediction(request.features, churn_prob)

        duration_sec = time.perf_counter() - start_time
        duration_ms = round(duration_sec * 1000, 2)

        # Update Prometheus Telemetry
        PREDICTION_REQUESTS.labels(
            endpoint="/predict",
            model_version=metadata["version"],
            status="success"
        ).inc()
        INFERENCE_LATENCY.labels(
            algorithm=metadata["algorithm"],
            model_version=metadata["version"]
        ).observe(duration_sec)
        CHURN_PROBABILITY_HISTOGRAM.observe(churn_prob)

        # Async database logging
        background_tasks.add_task(
            log_prediction_async,
            request_id=request_id,
            customer_id=customer_id,
            features=request.features.model_dump(),
            prediction=prediction_label,
            churn_probability=round(churn_prob, 4),
            risk_level=risk_level,
            model_version=metadata["version"],
            algorithm=metadata["algorithm"],
            latency_ms=duration_ms,
            user_id=user.user_id
        )

        return PredictResponse(
            predictionId=request_id,
            customerId=customer_id,
            prediction=prediction_label,
            churnProbability=round(churn_prob, 4),
            riskLevel=risk_level,
            topFactors=top_factors,
            modelVersion=metadata["version"],
            algorithm=metadata["algorithm"],
            modelAlias=metadata["alias"],
            inferenceDurationMs=duration_ms,
            timestamp=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        )

    except Exception as e:
        PREDICTION_REQUESTS.labels(
            endpoint="/predict",
            model_version=metadata["version"],
            status="error"
        ).inc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference computation failed: {str(e)}"
        )


@router.post(
    "/predict/batch",
    response_model=BatchPredictResponse,
    summary="Batch inference for bulk customer datasets"
)
async def predict_batch(
    request: BatchPredictRequest,
    background_tasks: BackgroundTasks,
    user: AuthenticatedUser = Depends(require_roles(["consumer", "staff", "admin"]))
):
    if not request.customers:
        raise HTTPException(status_code=400, detail="Empty customers list in batch payload.")

    responses: List[PredictResponse] = []
    churn_count = 0
    total_risk = 0.0

    for item in request.customers:
        resp = await predict_churn(item, background_tasks, user)
        responses.append(resp)
        if resp.prediction == "Churn":
            churn_count += 1
        total_risk += resp.churnProbability

    avg_risk = round(total_risk / len(responses), 4)

    return BatchPredictResponse(
        totalProcessed=len(responses),
        churnCount=churn_count,
        averageRisk=avg_risk,
        predictions=responses
    )
