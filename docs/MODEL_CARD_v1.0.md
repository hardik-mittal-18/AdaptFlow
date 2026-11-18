# Model Card: AdaptFlow Telco Churn Predictor (v1.0.0-champion)

## Model Overview
- **Name**: AdaptFlow-Churn-Predictor
- **Version**: v1.0.0-champion
- **Framework**: XGBoost 3.4.1 (Python 3.13)
- **Task**: Binary Customer Churn Risk Classification (0: No Churn, 1: Churn)
- **Date**: November 2026
- **License**: Enterprise Proprietary
- **Serving Architecture**: FastAPI / Uvicorn + Prometheus Telemetry + Blue-Green Canary Gates

---

## Intended Use
- **Primary Use**: Real-time customer churn risk scoring and explainability for enterprise subscription accounts.
- **Out-of-Scope Use**: Fully automated credit or lending denials without human operator verification.

---

## Performance Benchmarks (20% Holdout Test Partition)
- **Accuracy**: 71.19%
- **F1 Score**: 0.6721 (+2.23% lift over Logistic Regression baseline)
- **ROC-AUC**: 0.7844
- **Average Precision (PR-AUC)**: 0.6912
- **P95 Latency**: < 3.8 ms per inference request

---

## Demographic & Fairness Considerations
- **Contract Cohorts**: Month-to-month contracts have the highest baseline churn (48%), while 2-year contracts show 8% churn.
- **Service Types**: Fiber Optic customers exhibit higher price sensitivity compared to DSL subscribers.
- **Slice Equity**: No demographic slice exhibits greater than 2% performance regression.

---

## Provenance & Data Versioning
- **DVC Dataset Hash**: `dvc-sha256-7840bb59ebbb23826ccd13faad8e3d19`
- **Verified Ground-Truth Feedback Ingested**: True
- **Drift Gating Engine**: Evidently AI 2-Sample Kolmogorov-Smirnov & PSI
- **Reproducibility**: Fixed random seed (`seed=42`) across data splits, Stratified 5-fold CV, and Optuna TPE samplers.
