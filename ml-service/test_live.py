import requests
import json

BASE_URL = "http://127.0.0.1:8000"

print("--- 1. Testing GET /health ---")
r = requests.get(f"{BASE_URL}/health")
print("Status:", r.status_code, r.json())
assert r.status_code == 200
assert r.json()["status"] == "healthy"

print("\n--- 2. Testing GET /ready ---")
r = requests.get(f"{BASE_URL}/ready")
print("Status:", r.status_code, r.json())
assert r.status_code == 200
assert r.json()["ready"] is True

print("\n--- 3. Testing GET /model/info ---")
r = requests.get(f"{BASE_URL}/model/info")
print("Status:", r.status_code)
info = r.json()
print(f"  Version: {info['version']} | Algorithm: {info['algorithm']} | Accuracy: {info['accuracy']}")
print(f"  DVC Hash: {info['dvcDatasetHash']} | Stage: {info['stage']}")
assert r.status_code == 200
assert info["alias"] == "champion"

print("\n--- 4. Testing POST /predict ---")
sample_customer = {
    "customerId": "CUST-LIVE-901",
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
r = requests.post(f"{BASE_URL}/predict", json=sample_customer, headers={"x-user-role": "consumer"})
print("Status:", r.status_code)
pred = r.json()
print(f"  Customer: {pred['customerId']} | Prediction: {pred['prediction']}")
print(f"  Churn Probability: {pred['churnProbability']} | Risk Level: {pred['riskLevel']}")
print(f"  Latency: {pred['inferenceDurationMs']}ms | Model: {pred['modelVersion']}")
print("  Top Explainable SHAP factors:")
for f in pred["topFactors"]:
    print(f"    - {f['display_name']} ({f['direction']}): {f['description']}")
assert r.status_code == 200
assert pred["prediction"] in ["Churn", "No Churn"]
assert len(pred["topFactors"]) > 0

print("\n--- 5. Testing POST /predict/batch ---")
batch_data = {
    "customers": [
        sample_customer,
        {
            "customerId": "CUST-LIVE-902",
            "features": {
                "gender": "Male",
                "SeniorCitizen": 0,
                "Partner": "Yes",
                "Dependents": "Yes",
                "tenure": 65,
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
                "MonthlyCharges": 42.50,
                "TotalCharges": 2762.50
            }
        }
    ]
}
r = requests.post(f"{BASE_URL}/predict/batch", json=batch_data, headers={"x-user-role": "consumer"})
print("Status:", r.status_code)
batch_res = r.json()
print(f"  Total Processed: {batch_res['totalProcessed']} | Churn Count: {batch_res['churnCount']} | Average Risk: {batch_res['averageRisk']}")
assert r.status_code == 200
assert batch_res["totalProcessed"] == 2

print("\n--- 6. Testing POST /feedback (Supervised Ground Truth) ---")
feedback_payload = {
    "predictionId": pred["predictionId"],
    "customerId": pred["customerId"],
    "actualOutcome": "Churn",
    "comments": "Confirmed canceled by customer success team."
}
r = requests.post(f"{BASE_URL}/feedback", json=feedback_payload, headers={"x-user-role": "consumer"})
print("Status:", r.status_code, r.json()["message"])
assert r.status_code == 200
assert r.json()["admittedToRetrainingPool"] is True

print("\n--- 7. Testing GET /metrics (Prometheus Format) ---")
r = requests.get(f"{BASE_URL}/metrics")
print("Status:", r.status_code)
lines = [l for l in r.text.split("\n") if "mlops_" in l and not l.startswith("#")]
print("  Sample Prometheus gauges/counters captured:")
for l in lines[:6]:
    print("   ", l)
assert r.status_code == 200
assert "mlops_prediction_requests_total" in r.text

print("\n--- 8. Testing RBAC Role Enforcement ---")
# Consumer trying to promote model -> 403 Forbidden
r_forbidden = requests.post(
    f"{BASE_URL}/model/promote",
    json={"targetVersion": "v1.1.0-retrained"},
    headers={"x-user-role": "consumer"}
)
print("  Consumer promoting model -> Status:", r_forbidden.status_code, "(Forbidden as expected)")
assert r_forbidden.status_code == 403

# Admin promoting model -> 200 OK
r_admin = requests.post(
    f"{BASE_URL}/model/promote",
    json={"targetVersion": "v1.1.0-retrained"},
    headers={"x-user-role": "admin"}
)
print("  Admin promoting model -> Status:", r_admin.status_code, "Promoted to:", r_admin.json()["version"])
assert r_admin.status_code == 200
assert r_admin.json()["version"] == "v1.1.0-retrained"

# Hot-reload back to champion
r_reload = requests.post(
    f"{BASE_URL}/model/reload",
    json={"alias": "champion", "version": "v1.0.0-champion"},
    headers={"x-user-role": "staff"}
)
print("  Staff hot-reloading model -> Status:", r_reload.status_code, "Active:", r_reload.json()["version"])
assert r_reload.status_code == 200

print("\n🎉 ALL PHASE 1 LIVE VERIFICATION TESTS PASSED SUCCESSFULLY!")
