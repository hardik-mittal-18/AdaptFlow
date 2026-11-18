import requests

BASE_URL = "http://127.0.0.1:8000"

print("--- 1. Testing GET /deployment/status ---")
r = requests.get(f"{BASE_URL}/deployment/status")
print("Status:", r.status_code)
status_data = r.json()
print(f"  Mode: {status_data['mode']} | Canary Ratio: {status_data['canary_ratio']} ({status_data['canary_percentage']}%)")
print(f"  Champion: {status_data['champion_version']} | Challenger: {status_data['challenger_version']} | Previous: {status_data['previous_version']}")
assert r.status_code == 200

print("\n--- 2. Testing Canary Traffic Splitting (10% and 50%) ---")
# Consumer attempting canary shift -> 403 Forbidden
r_forbidden = requests.post(
    f"{BASE_URL}/deployment/canary",
    json={"percentage": 10},
    headers={"x-user-role": "consumer"}
)
print("  Consumer adjusting canary -> Status:", r_forbidden.status_code, "(Forbidden as expected)")
assert r_forbidden.status_code == 403

# Admin adjusting to 10% canary
r_canary_10 = requests.post(
    f"{BASE_URL}/deployment/canary",
    json={"percentage": 10, "reason": "Initial 10% canary roll-out verification"},
    headers={"x-user-role": "admin"}
)
print("  Admin set Canary 10% -> Status:", r_canary_10.status_code, "New Mode:", r_canary_10.json()["mode"])
assert r_canary_10.status_code == 200
assert r_canary_10.json()["canary_percentage"] == 10

# Admin adjusting to 50% canary
r_canary_50 = requests.post(
    f"{BASE_URL}/deployment/canary",
    json={"percentage": 50, "reason": "Canary scale to 50% traffic"},
    headers={"x-user-role": "admin"}
)
print("  Admin set Canary 50% -> Status:", r_canary_50.status_code, "New Mode:", r_canary_50.json()["mode"])
assert r_canary_50.status_code == 200
assert r_canary_50.json()["canary_percentage"] == 50

print("\n--- 3. Testing Blue-Green Production Promotion ---")
r_promote = requests.post(
    f"{BASE_URL}/deployment/promote",
    json={"reason": "Candidate passed all F1, latency and drift gates. Promoting to 100% production."},
    headers={"x-user-role": "admin"}
)
print("  Admin Blue-Green Promote -> Status:", r_promote.status_code)
promoted_data = r_promote.json()
print(f"  New Champion: {promoted_data['champion_version']} | Mode: {promoted_data['mode']}")
assert r_promote.status_code == 200
assert promoted_data["mode"] == "PROMOTED"
assert promoted_data["canary_percentage"] == 0

print("\n--- 4. Testing 1-Click Instant Rollback ---")
r_rollback = requests.post(
    f"{BASE_URL}/deployment/rollback",
    json={"reason": "Simulated production error rate spike triggering immediate rollback to previous version"},
    headers={"x-user-role": "admin"}
)
print("  Admin 1-Click Rollback -> Status:", r_rollback.status_code)
rollback_data = r_rollback.json()
print(f"  Restored Stable Champion: {rollback_data['champion_version']} | Mode: {rollback_data['mode']}")
assert r_rollback.status_code == 200
assert rollback_data["mode"] == "ROLLED_BACK"

print("\n--- 5. Testing Audit Trail Logging ---")
r_audit = requests.get(f"{BASE_URL}/deployment/audit", headers={"x-user-role": "admin"})
print("Status:", r_audit.status_code)
audit_data = r_audit.json()
print(f"  Total Audit Events: {audit_data['total_records']}")
print("  Latest 3 Audit Entries:")
for entry in audit_data["audit_trail"][:3]:
    print(f"    [{entry['timestamp']}] {entry['action']} by {entry['operator']}: {entry['reason']}")
assert r_audit.status_code == 200
assert audit_data["total_records"] >= 4

print("\n--- 6. Testing Model Card Generation ---")
r_card = requests.get(f"{BASE_URL}/deployment/model-card")
print("Status:", r_card.status_code, f"Card length: {len(r_card.text)} chars")
assert r_card.status_code == 200
assert "# Model Card:" in r_card.text
assert "DVC Dataset Hash" in r_card.text

print("\n🎉 ALL PHASE 5 CONTROLLED RETRAINING & DEPLOYMENT TESTS PASSED 100%!")
