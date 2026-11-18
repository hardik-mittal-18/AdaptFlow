import os
import json
import sys
import yaml
import mlflow
from mlflow.tracking import MlflowClient

def apply_validation_gates_and_register(
    params_path: str = "ml-pipeline/params.yaml",
    metrics_path: str = "ml-pipeline/metrics.json"
):
    with open(params_path, "r") as f:
        params = yaml.safe_load(f)

    with open(metrics_path, "r") as f:
        metrics = json.load(f)

    gate_cfg = params.get("gates", {})
    min_f1_lift = gate_cfg.get("min_f1_lift", 0.005)
    max_latency = gate_cfg.get("max_latency_ms", 10.0)

    f1_lift = metrics.get("f1_lift", 0.0)
    latency = metrics.get("latency_ms", 0.0)

    print("--- Evaluating Retraining Candidate Against Production Gates ---")
    print(f"Candidate F1 Lift: {f1_lift:+.4f} (Required Min: +{min_f1_lift:.4f})")
    print(f"P95 Inference Latency: {latency:.4f} ms (Limit: {max_latency} ms)")

    passed_lift = f1_lift >= min_f1_lift
    passed_lat = latency <= max_latency

    if passed_lift and passed_lat:
        print("✅ VALIDATION GATES PASSED: Challenger model admitted.")
        mlflow.set_tracking_uri("sqlite:///mlflow.db")
        client = MlflowClient()
        model_name = "AdaptFlow-Churn-Predictor"
        version = str(metrics.get("champion_version", "4"))
        try:
            client.set_registered_model_alias(model_name, "challenger", version)
            print(f"Assigned alias 'challenger' to Model Version {version} for Blue-Green canary gating.")
        except Exception as e:
            print(f"Warning setting alias: {e}")
        return True
    else:
        rejection_reasons = []
        if not passed_lift: rejection_reasons.append(f"Insufficient F1 lift ({f1_lift:.4f} < {min_f1_lift:.4f})")
        if not passed_lat: rejection_reasons.append(f"Excessive latency ({latency:.2f}ms > {max_latency}ms)")
        print(f"❌ VALIDATION GATES FAILED: {', '.join(rejection_reasons)}")
        return False

if __name__ == "__main__":
    success = apply_validation_gates_and_register()
    sys.exit(0 if success else 1)
