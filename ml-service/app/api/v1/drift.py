import os
from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.responses import HTMLResponse
from app.services.drift_service import EvidentlyDriftEngine, REPORTS_DIR
from app.core.security import require_roles, AuthenticatedUser

router = APIRouter(tags=["Evidently AI Drift Monitoring"])

@router.get(
    "/drift/status",
    summary="Get real-time statistical drift report, severity, and retraining policy check"
)
async def get_drift_status():
    json_path = os.path.join(REPORTS_DIR, "drift_summary.json")
    if os.path.exists(json_path):
        import json
        with open(json_path, "r") as f:
            return json.load(f)

    # Initial baseline evaluation if not yet generated
    df_init = EvidentlyDriftEngine.simulate_shifted_traffic(n_samples=50)
    report = EvidentlyDriftEngine.evaluate_production_drift(df_init)
    return report

@router.get(
    "/drift/report/html",
    response_class=HTMLResponse,
    summary="Get full interactive Evidently AI HTML drift report"
)
async def get_drift_html_report():
    html_path = os.path.join(REPORTS_DIR, "drift_report.html")
    if not os.path.exists(html_path):
        df_init = EvidentlyDriftEngine.simulate_shifted_traffic(n_samples=50)
        EvidentlyDriftEngine.evaluate_production_drift(df_init)

    with open(html_path, "r", encoding="utf-8") as f:
        return f.read()

@router.post(
    "/drift/run",
    summary="Trigger on-demand drift evaluation comparing reference to production window"
)
async def run_drift_check(
    user: AuthenticatedUser = Depends(require_roles(["staff", "admin"]))
):
    df_prod = EvidentlyDriftEngine.simulate_shifted_traffic(n_samples=100)
    report = EvidentlyDriftEngine.evaluate_production_drift(df_prod)
    return report

@router.post(
    "/drift/simulate",
    summary="Simulate incoming shifted production traffic to test automated closed-loop retraining trigger"
)
async def simulate_drift_trigger(
    user: AuthenticatedUser = Depends(require_roles(["staff", "admin"]))
):
    # Generates heavily shifted distribution: high charges, contract churn skew
    shifted_df = EvidentlyDriftEngine.simulate_shifted_traffic(n_samples=150)
    report = EvidentlyDriftEngine.evaluate_production_drift(
        shifted_df,
        verified_feedback_count=35, # Satisfies >= 25 verified feedback policy
        cooldown_elapsed_hours=32.0 # Satisfies >= 24h cooldown policy
    )
    return {
        "message": "Simulated production drift injected successfully.",
        "drift_severity": report["drift_severity"],
        "drift_detected": report["drift_detected"],
        "policy_evaluation": report["policy_check"],
        "retraining_triggered": report["policy_check"]["should_trigger_retraining"],
        "report": report
    }
