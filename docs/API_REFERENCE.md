# AdaptFlow API Reference

This document catalogs the REST API endpoints provided by the **FastAPI ML Service** (Port `8000`) and the **Express Gateway** (Port `3000`).

---

## 1. FastAPI Model Serving API (:8000)

### `POST /predict`
Generates a calibrated customer churn probability with top tree-based SHAP factor attributions.
- **Headers**:
  - `x-user-role`: `consumer` | `staff` | `admin` | `vendor`
  - `x-user-id`: string
- **Request Body**:
```json
{
  "customerId": "CUST-8492",
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
    "MonthlyCharges": 92.5,
    "TotalCharges": 185.0
  }
}
```
- **Response** (`200 OK`):
```json
{
  "predictionId": "pred-48b209d7-8321",
  "customerId": "CUST-8492",
  "churnProbability": 0.742,
  "prediction": "Churn",
  "riskLevel": "high",
  "modelVersion": "v1.0.0",
  "algorithm": "XGBoost",
  "inferenceDurationMs": 0.16,
  "topFactors": [
    { "feature": "Contract", "importance": 0.18, "direction": "positive" },
    { "feature": "tenure", "importance": 0.14, "direction": "positive" }
  ]
}
```

---

### `POST /feedback`
Ingests verified ground-truth customer retention/churn outcomes to close the feedback loop.
- **Request Body**:
```json
{
  "predictionId": "pred-48b209d7-8321",
  "actualOutcome": "Churn",
  "verified": true,
  "comments": "Customer churned after promo ended"
}
```

---

### `GET /drift/status`
Returns live statistical feature drift metrics, KS p-values, PSI, and drift severity index (`NONE`, `WARNING`, `CRITICAL`).

### `POST /drift/simulate`
Simulates a covariate distribution shift in the rolling inference window (e.g. shifts tenure and contract durations) to test automated retraining triggers.

### `GET /deployment/status`
Returns active model routing mode (`shadow`, `canary`, `promoted`), canary weight, champion version, and challenger version.

### `POST /deployment/canary`
Updates canary traffic distribution percentage (`{"weight": 0.25}`).

### `POST /deployment/promote`
Super Admin promotion gate: promotes `challenger` alias to `champion` in the MLflow Model Registry.

### `POST /deployment/rollback`
Super Admin emergency rollback: immediately restores traffic to `previous` model alias with zero downtime.
