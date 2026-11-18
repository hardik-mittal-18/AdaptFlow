import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

SAMPLE_CUSTOMER = {
    "customerId": "CUST-TEST-001",
    "features": {
        "gender": "Female",
        "SeniorCitizen": 0,
        "Partner": "No",
        "Dependents": "No",
        "tenure": 3,
        "PhoneService": "Yes",
        "MultipleLines": "No",
        "InternetService": "Fiber optic",
        "OnlineSecurity": "No",
        "OnlineBackup": "No",
        "DeviceProtection": "No",
        "TechSupport": "No",
        "StreamingTV": "Yes",
        "StreamingMovies": "Yes",
        "Contract": "Month-to-month",
        "PaperlessBilling": "Yes",
        "PaymentMethod": "Electronic check",
        "MonthlyCharges": 92.5,
        "TotalCharges": 277.5
    }
}

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["ready"] is True
    assert "timestamp" in data

def test_readiness_probe():
    response = client.get("/ready")
    assert response.status_code == 200
    data = response.json()
    assert data["ready"] is True
    assert data["modelLoaded"] is True

def test_model_info():
    response = client.get("/model/info")
    assert response.status_code == 200
    data = response.json()
    assert "version" in data
    assert data["alias"] == "champion"
    assert "accuracy" in data
    assert "dvcDatasetHash" in data
    assert data["stage"] == "Production"

def test_prediction():
    response = client.post("/predict", json=SAMPLE_CUSTOMER, headers={"x-user-role": "consumer"})
    assert response.status_code == 200
    data = response.json()
    assert data["customerId"] == "CUST-TEST-001"
    assert data["prediction"] in ["Churn", "No Churn"]
    assert 0.0 <= data["churnProbability"] <= 1.0
    assert data["riskLevel"] in ["Low", "Moderate", "Critical"]
    assert len(data["topFactors"]) > 0
    assert data["inferenceDurationMs"] > 0
    assert "predictionId" in data

def test_batch_prediction():
    batch_payload = {
        "customers": [
            SAMPLE_CUSTOMER,
            {
                "customerId": "CUST-TEST-002",
                "features": {
                    "gender": "Male",
                    "SeniorCitizen": 0,
                    "Partner": "Yes",
                    "Dependents": "Yes",
                    "tenure": 60,
                    "PhoneService": "Yes",
                    "MultipleLines": "Yes",
                    "InternetService": "DSL",
                    "OnlineSecurity": "Yes",
                    "OnlineBackup": "Yes",
                    "DeviceProtection": "Yes",
                    "TechSupport": "Yes",
                    "StreamingTV": "No",
                    "StreamingMovies": "No",
                    "Contract": "Two year",
                    "PaperlessBilling": "No",
                    "PaymentMethod": "Credit card (automatic)",
                    "MonthlyCharges": 45.0,
                    "TotalCharges": 2700.0
                }
            }
        ]
    }
    response = client.post("/predict/batch", json=batch_payload, headers={"x-user-role": "consumer"})
    assert response.status_code == 200
    data = response.json()
    assert data["totalProcessed"] == 2
    assert len(data["predictions"]) == 2
    assert 0.0 <= data["averageRisk"] <= 1.0

def test_feedback_submission():
    payload = {
        "predictionId": "pred-unit-test-1",
        "customerId": "CUST-TEST-001",
        "actualOutcome": "Churn",
        "comments": "Ground truth verified after 30-day billing cycle."
    }
    response = client.post("/feedback", json=payload, headers={"x-user-role": "consumer"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["admittedToRetrainingPool"] is True
    assert "feedbackId" in data

def test_prometheus_metrics():
    response = client.get("/metrics")
    assert response.status_code == 200
    content = response.text
    assert "mlops_prediction_requests_total" in content
    assert "mlops_active_model_info" in content

def test_role_enforcement():
    # Admin-only promotion route
    promote_payload = {"targetVersion": "v1.1.0-retrained"}
    # Consumer should be forbidden (403)
    response_consumer = client.post("/model/promote", json=promote_payload, headers={"x-user-role": "consumer"})
    assert response_consumer.status_code == 403

    # Admin should be allowed (200)
    response_admin = client.post("/model/promote", json=promote_payload, headers={"x-user-role": "admin"})
    assert response_admin.status_code == 200
    assert response_admin.json()["version"] == "v1.1.0-retrained"
