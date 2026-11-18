import pytest
import numpy as np
import pandas as pd
from ml_service.app.services.drift_service import EvidentlyDriftEngine
from ml_service.app.services.deployment_gate import deployment_gate, DeploymentGateMode

def test_kolmogorov_smirnov_drift_detection():
    # Baseline normal distribution
    baseline = np.random.normal(loc=50.0, scale=10.0, size=500)
    # Similar distribution -> No drift
    stable = np.random.normal(loc=50.2, scale=10.1, size=200)
    p_val_stable = EvidentlyDriftEngine.compute_ks_p_value(baseline, stable)
    assert p_val_stable > 0.05, f"Expected p-value > 0.05, got {p_val_stable}"

    # Heavily shifted distribution -> Drift confirmed
    shifted = np.random.normal(loc=85.0, scale=15.0, size=200)
    p_val_shifted = EvidentlyDriftEngine.compute_ks_p_value(baseline, shifted)
    assert p_val_shifted < 0.05, f"Expected drift p-value < 0.05, got {p_val_shifted}"

def test_psi_categorical_drift():
    # Baseline categories
    baseline_cat = pd.Series(["Month-to-month"] * 300 + ["One year"] * 150 + ["Two year"] * 150)
    # Similar distribution
    stable_cat = pd.Series(["Month-to-month"] * 100 + ["One year"] * 50 + ["Two year"] * 50)
    psi_stable = EvidentlyDriftEngine.compute_psi(baseline_cat, stable_cat)
    assert psi_stable < 0.10, f"Expected PSI < 0.10, got {psi_stable}"

    # Drifted categories (90% month-to-month)
    shifted_cat = pd.Series(["Month-to-month"] * 180 + ["One year"] * 10 + ["Two year"] * 10)
    psi_shifted = EvidentlyDriftEngine.compute_psi(baseline_cat, shifted_cat)
    assert psi_shifted > 0.10, f"Expected PSI > 0.10, got {psi_shifted}"

def test_deployment_gate_canary_routing():
    # Set canary to 10%
    deployment_gate.set_canary(10, operator="test@adaptflow.ai", reason="Unit test canary 10%")
    assert deployment_gate.mode == DeploymentGateMode.CANARY_10
    assert deployment_gate.canary_percentage == 10

    # Route 1000 requests to check probabilistic distribution
    challenger_count = sum(1 for _ in range(1000) if deployment_gate.route_traffic()[1])
    # Challenger count should be around 100 (50 to 160 acceptable for 99.9% binomial bounds)
    assert 40 <= challenger_count <= 180, f"Expected ~100 canary calls, got {challenger_count}"

def test_deployment_gate_rollback():
    # Execute rollback
    res = deployment_gate.rollback(reason="Test emergency rollback", operator="admin@adaptflow.ai")
    assert res["status"] == "ROLLED_BACK"
    assert deployment_gate.mode == DeploymentGateMode.ROLLED_BACK
    # After rollback, 100% of traffic routes to champion
    for _ in range(50):
        target, is_challenger = deployment_gate.route_traffic()
        assert is_challenger is False
