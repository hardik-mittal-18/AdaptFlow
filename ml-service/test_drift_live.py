import requests

BASE_URL = "http://127.0.0.1:8000"

print("--- 1. Testing GET /drift/status ---")
r = requests.get(f"{BASE_URL}/drift/status")
print("Status:", r.status_code)
data = r.json()
print(f"  Drift Severity: {data['drift_severity']} | Drift Detected: {data['drift_detected']}")
print(f"  Features Monitored: {data['total_features_monitored']} | Production Samples: {data['production_window_samples']}")
assert r.status_code == 200
assert "per_feature_drift" in data
assert "policy_check" in data

print("\n--- 2. Testing GET /drift/report/html ---")
r_html = requests.get(f"{BASE_URL}/drift/report/html")
print("Status:", r_html.status_code, f"HTML length: {len(r_html.text)} chars")
assert r_html.status_code == 200
assert "<title>AdaptFlow Evidently AI Drift Report</title>" in r_html.text

print("\n--- 3. Testing POST /drift/run ---")
r_run = requests.post(f"{BASE_URL}/drift/run", headers={"x-user-role": "staff"})
print("Status:", r_run.status_code)
data_run = r_run.json()
print(f"  On-demand Run: Drifted Features: {data_run['drifted_features_count']} | Severity: {data_run['drift_severity']}")
assert r_run.status_code == 200

print("\n--- 4. Testing POST /drift/simulate (Demonstrating Closed-Loop Retraining Trigger) ---")
r_sim = requests.post(f"{BASE_URL}/drift/simulate", headers={"x-user-role": "admin"})
print("Status:", r_sim.status_code)
sim_data = r_sim.json()
print(f"  Simulated Injection Message: {sim_data['message']}")
print(f"  Drift Severity: {sim_data['drift_severity']}")
print(f"  Policy Check - Feedback Threshold Met: {sim_data['policy_evaluation']['feedback_threshold_met']}")
print(f"  Policy Check - Cooldown Threshold Met: {sim_data['policy_evaluation']['cooldown_threshold_met']}")
print(f"  Retraining Triggered Status: {sim_data['retraining_triggered']}")
assert r_sim.status_code == 200
assert sim_data["drift_severity"] in ["WARNING", "CRITICAL"]
assert sim_data["retraining_triggered"] is True

print("\n--- 5. Testing Prometheus Drift Gauges ---")
r_metrics = requests.get(f"{BASE_URL}/metrics")
assert r_metrics.status_code == 200
drift_lines = [l for l in r_metrics.text.split("\n") if "mlops_feature_drift_p_value" in l and not l.startswith("#")]
print("  Captured Prometheus Feature Drift Gauges:")
for l in drift_lines[:4]:
    print("   ", l)
assert len(drift_lines) > 0

print("\n🎉 ALL PHASE 4 EVIDENTLY AI DRIFT TESTS PASSED 100%!")
