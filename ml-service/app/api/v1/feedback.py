import time
import uuid
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from app.schemas.telco import FeedbackRequest, FeedbackResponse
from app.services.db_logger import log_feedback_async
from app.core.metrics import VERIFIED_FEEDBACK_COUNTER
from app.core.security import require_roles, AuthenticatedUser

router = APIRouter(tags=["Supervised Feedback"])

@router.post(
    "/feedback",
    response_model=FeedbackResponse,
    summary="Submit verified ground-truth customer churn outcome for supervised retraining"
)
async def submit_ground_truth(
    request: FeedbackRequest,
    background_tasks: BackgroundTasks,
    user: AuthenticatedUser = Depends(require_roles(["consumer", "staff", "admin"]))
):
    if request.actualOutcome not in ["Churn", "No Churn"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="actualOutcome must be either 'Churn' or 'No Churn'"
        )

    feedback_id = f"fb-{uuid.uuid4().hex[:8]}"

    # Increment Prometheus metric
    VERIFIED_FEEDBACK_COUNTER.labels(outcome=request.actualOutcome).inc()

    # Async logging
    background_tasks.add_task(
        log_feedback_async,
        feedback_id=feedback_id,
        prediction_id=request.predictionId,
        customer_id=request.customerId,
        actual_outcome=request.actualOutcome,
        comments=request.comments,
        user_id=user.user_id
    )

    return FeedbackResponse(
        success=True,
        feedbackId=feedback_id,
        message=f"Verified ground truth outcome '{request.actualOutcome}' recorded for customer {request.customerId}.",
        admittedToRetrainingPool=True,
        timestamp=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    )
