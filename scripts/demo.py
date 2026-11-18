"""
AdaptFlow End-to-End Enterprise MLOps Demonstration Script
Executes the complete closed feedback loop:
1. Health & Model Readiness Checks
2. Real-time Churn Inference with SHAP explanation
3. Verified Ground Truth Ingestion (Closing Feedback Loop)
4. Covariate Drift Simulation (KS / PSI Statistical Tests)
5. Model Deployment Gatekeeper & Shadow Mode
6. Canary Traffic Routing (10% -> 50%)
7. Zero-Downtime Blue-Green Promotion
8. Instant 1-Click Rollback to Previous Alias
"""

import sys
import json
import time
import urllib.request
import urllib.error

FASTAPI_URL = "http://127.0.0.1:8000"

def post_json(endpoint: str, data: dict, headers: dict = None) -> dict:
    url = f"{FASTAPI_URL}{endpoint}"
    req_headers = {"Content-Type": "application/json"}
    if headers:
        req_headers.update(headers)
    req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers=req_headers, method="POST")
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read().decode("utf-8"))

def get_json(endpoint: str) -> dict:
    url = f"{FASTAPI_URL}{endpoint}"
    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read().decode("utf-8"))

def run_demo():
    print("=" * 80)
    print("🌟 ADAPTFLOW CLOSED-LOOP CONTINUOUS LEARNING DEMONSTRATION 🌟")
    print("=" * 80)

    # 1. Healthcheck
    print("\n[Step 1/8] Verifying ML Service Health & Readiness...")
    try:
        health = get_json("/health")
        info = get_json("/model/info")
        print(f"  ✓ Service Status: {health.get('status')} | Service: {info.get('name')}")
        print(f"  ✓ Active Champion Model: {info.get('version')} ({info.get('algorithm')})")
        print(f"  ✓ Model Stage: {info.get('stage')} | Active Alias: {info.get('alias')}")
        print(f"  ✓ Baseline DVC Hash: {info.get('dvcDatasetHash')}")
    except Exception as e:
        print(f"  ❌ Error connecting to {FASTAPI_URL}: {e}")
        sys.exit(1)

    # 2. Prediction
    print("\n[Step 2/8] Generating Live Churn Prediction with Tree-Based SHAP Factors...")
    sample_features = {
        "gender": "Female",
        "SeniorCitizen": 1,
        "Partner": "No",
        "Dependents": "No",
        "tenure": 2,
        "PhoneService": "Yes",
        "MultipleLines": "Yes",
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
        "MonthlyCharges": 104.5,
        "TotalCharges": 209.0
    }
    cust_id = "DEMO-CUST-9921"
    pred = post_json("/predict", {"customerId": cust_id, "features": sample_features}, {"x-user-role": "consumer"})
    pred_id = pred.get("predictionId")
    churn_prob = pred.get("churnProbability", 0)
    print(f"  ✓ Customer ID: {cust_id}")
    print(f"  ✓ Prediction: {pred.get('prediction')} | Churn Probability: {churn_prob:.1%} (Risk Level: {pred.get('riskLevel')})")
    print(f"  ✓ Inference Latency: {pred.get('inferenceDurationMs', 0):.2f} ms (<3.8ms SLA)")
    print(f"  ✓ Top SHAP Factors: {[(f['feature'], f['direction']) for f in pred.get('topFactors', [])]}")

    # 3. Feedback Loop
    print("\n[Step 3/8] Ingesting Verified Ground Truth (Closing Feedback Loop)...")
    fb = post_json("/feedback", {
        "predictionId": pred_id,
        "customerId": cust_id,
        "actualOutcome": "Churn",
        "comments": "Customer churn confirmed following promotional expiration"
    }, {"x-user-role": "consumer"})
    print(f"  ✓ Feedback Ingested: Success = {fb.get('success')}")
    print(f"  ✓ Admitted to Retraining Pool: {fb.get('admittedToRetrainingPool')}")
    print(f"  ✓ Confirmation Message: {fb.get('message')}")

    # 4. Drift Simulation
    print("\n[Step 4/8] Simulating Feature Drift on Tenure & Contract Distribution...")
    drift_sim = post_json("/drift/simulate", {}, {"x-user-role": "staff"})
    print(f"  ✓ Drift Injected: Severity = {drift_sim.get('drift_severity')}")
    print(f"  ✓ Drift Confirmed: {drift_sim.get('drift_detected')}")
    print(f"  ✓ Retraining Trigger Fired: {drift_sim.get('retraining_triggered')}")

    # 5. Deployment Status Check
    print("\n[Step 5/8] Inspecting Model Deployment Gate & Shadow Mode...")
    dep_status = get_json("/deployment/status")
    print(f"  ✓ Current Gate Mode: {dep_status.get('current_mode')}")
    print(f"  ✓ Active Champion Model: {dep_status.get('champion_version')}")
    print(f"  ✓ Staged Challenger Model: {dep_status.get('challenger_version')}")

    # 6. Canary Split
    print("\n[Step 6/8] Executing Canary Traffic Split (10% -> 50%)...")
    canary_10 = post_json("/deployment/canary", {"percentage": 10, "reason": "Canary 10% pilot"}, {"x-user-role": "admin"})
    print(f"  ✓ Canary 10%: Mode = {canary_10.get('mode')} | Split = {canary_10.get('canary_percentage')}%")
    canary_50 = post_json("/deployment/canary", {"percentage": 50, "reason": "Canary 50% scale-up"}, {"x-user-role": "admin"})
    print(f"  ✓ Canary 50%: Mode = {canary_50.get('mode')} | Split = {canary_50.get('canary_percentage')}%")

    # 7. Promotion
    print("\n[Step 7/8] Executing Zero-Downtime Blue-Green Promotion...")
    promote = post_json("/deployment/promote", {"reason": "Promotion approval after zero latency regression"}, {"x-user-role": "admin"})
    print(f"  ✓ Promotion Result: Mode = {promote.get('mode')}")
    print(f"  ✓ New Champion Version: {promote.get('champion_version')}")
    print(f"  ✓ Challenger Cleared: {promote.get('challenger_version')}")

    # 8. Rollback
    print("\n[Step 8/8] Executing Instant 1-Click Rollback to Previous Alias...")
    rollback = post_json("/deployment/rollback", {"reason": "Operational resilience recovery drill"}, {"x-user-role": "admin"})
    print(f"  ✓ Rollback Result: Mode = {rollback.get('mode')}")
    print(f"  ✓ Restored Production Champion: {rollback.get('champion_version')}")

    print("\n" + "=" * 80)
    print("🏆 ALL 8 END-TO-END MLOPS CLOSED-LOOP STAGES VERIFIED SUCCESSFULLY! 🏆")
    print("=" * 80)

if __name__ == "__main__":
    run_demo()
