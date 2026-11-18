# AdaptFlow Enterprise Architecture & Closed Feedback Loop Specification

## 1. System Overview
AdaptFlow is an enterprise-grade self-adaptive machine learning system engineered to predict, monitor, and adapt to telecommunications customer churn in real time. It resolves production model decay by closing the loop between inference, ground-truth ingestion, statistical drift detection, automated DVC retraining, and Blue-Green canary deployments.

```mermaid
flowchart TD
    subgraph ClientLayer ["Client Layer (React / Vite JSX)"]
        UI_Consumer["Consumer Portal (/dashboard)"]
        UI_Staff["Staff Portal (/staff)"]
        UI_Admin["Admin Center (/admin)"]
        UI_Vendor["Vendor Portal (/vendor)"]
    end

    subgraph GatewayLayer ["Node / Express Gateway (:3000)"]
        AuthGuard["JWT & Role Authorization Guard"]
        ProxyRouter["FastAPI Proxy & Fallback Engine"]
        AuditLogger["Audit Log Service"]
    end

    subgraph MLServiceLayer ["FastAPI ML Service (:8000)"]
        PredictEndpoint["POST /predict & Batch"]
        FeedbackEndpoint["POST /feedback (Ground Truth)"]
        DriftEngine["Evidently AI Drift Engine (KS / PSI)"]
        DeployGate["Blue-Green & Canary Gatekeeper"]
        Telemetry["Prometheus Metrics Exporter"]
    end

    subgraph PipelineLayer ["Continuous Retraining Pipeline"]
        DVCSync["DVC Remote Sync & Versioning"]
        PanderaGate["Pandera Schema Validation"]
        TrainXGB["Optuna-tuned XGBoost + Baseline LR"]
        EvalGate["Validation Gates (F1 lift >= +0.005)"]
        MLflowReg["MLflow Model Registry (champion/challenger)"]
    end

    subgraph ObservabilityLayer ["Observability & Storage"]
        Prometheus[":9090 Prometheus TSDB"]
        Grafana[":3001 Grafana Operational Dashboards"]
        Postgres[":5432 PostgreSQL (MLflow & Audits)"]
    end

    ClientLayer --> AuthGuard
    AuthGuard --> ProxyRouter
    ProxyRouter --> PredictEndpoint
    ProxyRouter --> FeedbackEndpoint
    ProxyRouter --> DriftEngine
    ProxyRouter --> DeployGate

    PredictEndpoint --> Telemetry
    FeedbackEndpoint --> DVCSync
    DriftEngine --> PipelineLayer
    DeployGate --> MLflowReg

    Telemetry --> Prometheus
    Prometheus --> Grafana
    MLflowReg --> Postgres
```

---

## 2. End-to-End Closed Feedback Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Consumer as Consumer / Client
    participant Gateway as Express Gateway (:3000)
    participant MLService as FastAPI ML Service (:8000)
    participant Evidently as Evidently AI Engine
    participant DVC as DVC & MLflow Pipeline
    actor Admin as Super Admin

    Consumer->>Gateway: POST /api/predict (Customer Telco Features)
    Gateway->>MLService: Proxy /predict (Role Verified)
    MLService->>MLService: Compute Churn Prob + SHAP Explanation
    MLService-->>Consumer: Returns Churn Probability, Risk Tier & Top Factors (<3.8ms)
    
    Note over Consumer,MLService: Real Customer Outcome is Verified (30 days later)
    Consumer->>Gateway: POST /api/feedback (Actual Outcome: Churn/Retain)
    Gateway->>MLService: Ingest Verified Ground Truth
    
    loop Rolling Window Analysis
        MLService->>Evidently: Run KS (numeric) & PSI (categorical) tests
    end
    
    Evidently-->>MLService: Drift Alert: tenure p=0.0084, contract PSI=0.185 (CRITICAL)
    
    opt Drift Confirmed & Feedback Threshold Reached
        MLService->>DVC: Trigger Continuous Retraining Pipeline
        DVC->>DVC: Pandera Schema Validation
        DVC->>DVC: 5-Fold Stratified Cross-Validation (XGBoost)
        DVC->>DVC: Evaluate Candidate Against Champion
        DVC->>MLService: Register Model v1.1.0 as "challenger" alias
    end

    Admin->>Gateway: POST /api/deployment/canary (Split: 10% -> 50%)
    Gateway->>MLService: Update Traffic Weight
    Admin->>Gateway: POST /api/deployment/promote (Full Cutover)
    Gateway->>MLService: Promote "challenger" to "champion"
    MLService-->>Admin: Promotion Complete (Zero Downtime)
```
