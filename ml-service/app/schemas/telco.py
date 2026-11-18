from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

class TelcoCustomerFeatures(BaseModel):
    """
    Telco customer attributes for Churn Risk prediction.
    Features follow IBM Telco Churn dataset benchmark standards.
    """
    model_config = ConfigDict(populate_by_name=True)

    gender: str = Field(default="Female", description="Gender of customer: 'Female' or 'Male'")
    SeniorCitizen: int = Field(default=0, ge=0, le=1, description="Whether customer is a senior citizen (1, 0)")
    Partner: str = Field(default="No", description="Whether customer has a partner: 'Yes' or 'No'")
    Dependents: str = Field(default="No", description="Whether customer has dependents: 'Yes' or 'No'")
    tenure: int = Field(default=12, ge=0, le=120, description="Number of months customer has stayed with company")
    PhoneService: str = Field(default="Yes", description="Whether customer has phone service: 'Yes' or 'No'")
    MultipleLines: str = Field(default="No", description="Multiple phone lines: 'Yes', 'No', 'No phone service'")
    InternetService: str = Field(default="Fiber optic", description="Internet service type: 'DSL', 'Fiber optic', 'No'")
    OnlineSecurity: str = Field(default="No", description="Online security service: 'Yes', 'No', 'No internet service'")
    OnlineBackup: str = Field(default="No", description="Online backup service: 'Yes', 'No', 'No internet service'")
    DeviceProtection: str = Field(default="No", description="Device protection plan: 'Yes', 'No', 'No internet service'")
    TechSupport: str = Field(default="No", description="Tech support service: 'Yes', 'No', 'No internet service'")
    StreamingTV: str = Field(default="Yes", description="Streaming TV service: 'Yes', 'No', 'No internet service'")
    StreamingMovies: str = Field(default="Yes", description="Streaming movies service: 'Yes', 'No', 'No internet service'")
    Contract: str = Field(default="Month-to-month", description="Contract term: 'Month-to-month', 'One year', 'Two year'")
    PaperlessBilling: str = Field(default="Yes", description="Paperless billing enabled: 'Yes' or 'No'")
    PaymentMethod: str = Field(default="Electronic check", description="Payment method")
    MonthlyCharges: float = Field(default=85.5, ge=0.0, le=500.0, description="Current monthly bill amount ($)")
    TotalCharges: float = Field(default=1026.0, ge=0.0, le=20000.0, description="Total cumulative charges ($)")


class FeatureImpact(BaseModel):
    feature: str = Field(..., description="Feature name")
    importance: float = Field(..., description="Calculated SHAP attribution / importance coefficient")
    direction: str = Field(..., description="'risk_increasing' or 'risk_decreasing'")
    display_name: str = Field(..., description="Human-friendly feature label")
    description: str = Field(..., description="Business explanation of impact")


class PredictRequest(BaseModel):
    customerId: Optional[str] = Field(default=None, description="Unique customer ID (e.g. CUST-8492)")
    features: TelcoCustomerFeatures = Field(..., description="Telco features dictionary")


class PredictResponse(BaseModel):
    predictionId: str = Field(..., description="Unique prediction telemetry record ID")
    customerId: str = Field(..., description="Customer identifier")
    prediction: str = Field(..., description="'Churn' or 'No Churn'")
    churnProbability: float = Field(..., description="Calibrated churn probability [0.0 - 1.0]")
    riskLevel: str = Field(..., description="'Low', 'Moderate', or 'Critical'")
    topFactors: List[FeatureImpact] = Field(default_factory=list, description="Top SHAP feature attributions")
    modelVersion: str = Field(..., description="Active serving model version")
    algorithm: str = Field(..., description="Active model algorithm (e.g. XGBoost, LogisticRegression)")
    modelAlias: str = Field(default="champion", description="MLflow registry alias (champion, challenger)")
    inferenceDurationMs: float = Field(..., description="P95 latency measurement in milliseconds")
    timestamp: str = Field(..., description="ISO 8601 UTC timestamp")


class BatchPredictRequest(BaseModel):
    customers: List[PredictRequest] = Field(..., description="List of customers for inference")


class BatchPredictResponse(BaseModel):
    totalProcessed: int = Field(..., description="Total records evaluated")
    churnCount: int = Field(..., description="Count flagged as High/Critical Churn")
    averageRisk: float = Field(..., description="Average churn risk across batch")
    predictions: List[PredictResponse] = Field(..., description="List of individual prediction responses")


class FeedbackRequest(BaseModel):
    predictionId: str = Field(..., description="Corresponding prediction identifier")
    customerId: str = Field(..., description="Customer ID")
    actualOutcome: str = Field(..., description="Verified ground truth: 'Churn' or 'No Churn'")
    comments: Optional[str] = Field(default=None, description="Operator context / feedback notes")


class FeedbackResponse(BaseModel):
    success: bool = True
    feedbackId: str
    message: str
    admittedToRetrainingPool: bool = True
    timestamp: str


class ModelInfoResponse(BaseModel):
    name: str = "AdaptFlow-Churn-Predictor"
    version: str
    alias: str = "champion"
    algorithm: str
    accuracy: float
    f1Score: float
    rocAuc: float
    p95LatencyMs: float
    dvcDatasetHash: str
    stage: str = "Production"
    servingStatus: str = "Healthy"
    lastRetrainedAt: str
    featuresCount: int = 19


class HealthResponse(BaseModel):
    status: str = "healthy"
    ready: bool = True
    version: str = "1.0.0"
    modelLoaded: bool = True
    activeAlias: str = "champion"
    timestamp: str
