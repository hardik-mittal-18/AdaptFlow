# AdaptFlow SRE & MLOps Operations Runbook

## 1. Automated Drift Detection & Retraining Policy
AdaptFlow continuously checks data drift against the reference baseline (7,043 Telco churn records).

### Retraining Trigger Criteria:
An automated retraining job is triggered when:
1. `Drift Severity == CRITICAL` (at least 2 key features with KS test $p < 0.05$ or PSI $> 0.10$).
2. `Verified Feedback Records >= 25` (verified supervised ground-truth samples).
3. `Cooldown Elapsed >= 24 hours` since last retraining run.
4. `Pandera Data Quality Gate == PASSED` (zero type violations or missing values).

---

## 2. Canary Traffic Promotion SOP
When a candidate model passes acceptance gates, it enters **Shadow Mode** as the `challenger` alias.

### Promotion Steps:
1. **Canary 10% Phase**:
   - Send `POST /deployment/canary` with `{"weight": 0.10}`.
   - Monitor Grafana Dashboard `AdaptFlow 01: Serving Health`. Verify P95 latency remains $< 20\text{ms}$ and error rate is $0\%$.
2. **Canary 50% Phase**:
   - Send `POST /deployment/canary` with `{"weight": 0.50}`.
   - Monitor rolling F1-score and slice metrics on Contract types.
3. **Full Cutover (100% Promotion)**:
   - Super Admin clicks "Approve & Deploy Candidate to Production" in the UI.
   - The MLflow alias `champion` is updated to the challenger version.
   - The former champion receives the alias `previous` for instant rollback capability.

---

## 3. Emergency 1-Click Rollback SOP
If an active model exhibits performance decay, elevated latency, or prediction anomalies:
1. Navigate to `/admin/deployments` in the UI, or execute:
   ```bash
   curl -X POST http://localhost:8000/deployment/rollback \
     -H "x-user-role: admin" \
     -H "Content-Type: application/json" \
     -d '{"reason": "Latency anomaly detected in production window"}'
   ```
2. FastAPI switches the active inference pointer immediately to the `previous` alias in memory.
3. Verification: Check `GET /model/info` to confirm active model is restored to previous stable release.
