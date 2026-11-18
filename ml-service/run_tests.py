import sys
import os
import asyncio
import httpx

# Add ml-service to path
sys.path.insert(0, os.path.abspath("ml-service"))

from app.main import app
from app.schemas.telco import TelcoCustomerFeatures, PredictRequest, FeedbackRequest
from app.api.v1.predict import predict_churn
from app.api.v1.feedback import submit_ground_truth
from app.api.v1.model import get_model_info, reload_model, ReloadRequest, promote_model, PromoteRequest
from app.core.security import AuthenticatedUser
from fastapi import BackgroundTasks

async def run_all_tests():
    print("--- 1. Testing Health & Readiness ---")
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Health
        res = await client.get("/health")
        print("GET /health ->", res.status_code, res.json())
        assert res.status_code == 200
        assert res.json()["status"] == "healthy"

        # 2. Ready
        res = await client.get("/ready")
        print("GET /ready ->", res.status_code, res.json())
        assert res.status_code == 200

        # 3. Model Info
        res = await client.get("/model/info")
        print("GET /model/info ->", res.status_code, res.json()["version"], res.json()["algorithm"], res.json()["dvcDatasetHash"])
        assert res.status_code == 200
        assert res.json()["alias"] == "champion"

        # 4. Predict
        sample_payload = {
            "customerId": "CUST-VERIFY-101",
            "features": {
                "gender": "Female",
                "SeniorCitizen": 0,
                "Partner": "No",
                "Dependents": "No",
                "tenure": 2,
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
                "MonthlyCharges": 94.20,
                "TotalCharges": 188.40
            }
        }
        res = await client.post("/predict", json=sample_payload, headers={"x-user-role": "consumer"})
        print("POST /predict ->", res.status_code)
        data = res.json()
        print(f"  Prediction: {data['prediction']} | Churn Probability: {data['churnProbability']} | Risk: {data['riskLevel']}")
        print(f"  P95 Latency: {data['inferenceDurationMs']}ms | Top SHAP factors: {len(data['topFactors'])}")
        assert res.status_code == 200
        assert data["prediction"] in ["Churn", "No Churn"]
        assert len(data["topFactors"]) > 0

        # 5. Batch Predict
        batch_payload = {"customers": [sample_payload, sample_payload]}
        res = await client.post("/predict/batch", json=batch_payload, headers={"x-user-role": "consumer"})
        print("POST /predict/batch ->", res.status_code, f"Total: {res.json()['totalProcessed']}")
        assert res.status_code == 200
        assert res.json()["totalProcessed"] == 2

        # 6. Feedback
        fb_payload = {
            "predictionId": data["predictionId"],
            "customerId": data["customerId"],
            "actualOutcome": "Churn",
            "comments": "Account canceled at end of month"
        }
        res = await client.post("/feedback", json=fb_payload, headers={"x-user-role": "consumer"})
        print("POST /feedback ->", res.status_code, res.json()["message"])
        assert res.status_code == 200

        # 7. Metrics
        res = await client.get("/metrics")
        print("GET /metrics ->", res.status_code, f"Length: {len(res.text)} bytes")
        assert res.status_code == 200
        assert "mlops_prediction_requests_total" in res.text

        # 8. Role Enforcement & Model Promotion
        promote_payload = {"targetVersion": "v1.1.0-retrained"}
        res_forbidden = await client.post("/model/promote", json=promote_payload, headers={"x-user-role": "consumer"})
        print("POST /model/promote (consumer) ->", res_forbidden.status_code, "(Forbidden as expected)")
        assert res_forbidden.status_code == 403

        res_admin = await client.post("/model/promote", json=promote_payload, headers={"x-user-role": "admin"})
        print("POST /model/promote (admin) ->", res_admin.status_code, res_admin.json()["version"])
        assert res_admin.status_code == 200
        assert res_admin.json()["version"] == "v1.1.0-retrained"

    print("\n✅ ALL PHASE 1 FASTAPI TESTS PASSED WITH 100% SUCCESS!")

if __name__ == "__main__":
    asyncio.run(run_all_tests())
