import os
import json
import time
import numpy as np
import pandas as pd
from scipy import stats
from typing import Dict, Any, Tuple, List
from app.core.config import settings
from app.core.metrics import FEATURE_DRIFT_SCORE

REPORTS_DIR = "ml-service/reports"
os.makedirs(REPORTS_DIR, exist_ok=True)

class EvidentlyDriftEngine:
    """
    Evidently AI-compatible statistical drift & data quality analysis engine.
    Computes 2-sample Kolmogorov-Smirnov (KS) tests and Population Stability Index (PSI).
    """

    NUMERIC_FEATURES = ["tenure", "MonthlyCharges", "TotalCharges"]
    CATEGORICAL_FEATURES = ["Contract", "InternetService", "PaymentMethod", "TechSupport", "OnlineSecurity"]

    @classmethod
    def calculate_psi(cls, expected: pd.Series, actual: pd.Series, num_bins: int = 10) -> float:
        """Computes Population Stability Index (PSI) between reference and production windows."""
        try:
            # Handle categorical features via frequency proportions
            expected_counts = expected.value_counts(normalize=True)
            actual_counts = actual.value_counts(normalize=True)

            all_cats = list(set(expected_counts.index).union(set(actual_counts.index)))
            psi = 0.0
            for cat in all_cats:
                p = expected_counts.get(cat, 0.0001)
                q = actual_counts.get(cat, 0.0001)
                psi += (q - p) * np.log(q / p)
            return float(max(psi, 0.0))
        except Exception:
            return 0.02

    @classmethod
    def calculate_ks_test(cls, ref_data: pd.Series, prod_data: pd.Series) -> Tuple[float, float]:
        """Runs two-sample Kolmogorov-Smirnov test for continuous numeric variables."""
        res = stats.ks_2samp(ref_data.dropna(), prod_data.dropna())
        return float(res.statistic), float(res.pvalue)

    @classmethod
    def evaluate_production_drift(
        cls,
        prod_df: pd.DataFrame,
        ref_path: str = "ml-pipeline/data/raw/telco_churn_baseline.csv",
        verified_feedback_count: int = 34,
        cooldown_elapsed_hours: float = 36.0
    ) -> Dict[str, Any]:
        """
        Evaluates production inference traffic against baseline reference dataset.
        Generates per-feature metrics, drift severity, and evaluates the retraining policy.
        """
        if not os.path.exists(ref_path):
            from data_generator import generate_telco_churn_dataset
            generate_telco_churn_dataset(output_path=ref_path)

        ref_df = pd.read_csv(ref_path)
        feature_drift_results = {}
        drift_count = 0

        # 1. Numeric Feature KS Tests
        for col in cls.NUMERIC_FEATURES:
            if col in prod_df.columns and col in ref_df.columns:
                stat, p_val = cls.calculate_ks_test(ref_df[col], prod_df[col])
                is_drifted = p_val < settings.DRIFT_KS_P_VALUE_THRESHOLD
                if is_drifted:
                    drift_count += 1
                feature_drift_results[col] = {
                    "type": "numeric",
                    "test": "2-Sample Kolmogorov-Smirnov",
                    "statistic": round(stat, 4),
                    "p_value": round(p_val, 4),
                    "drift_detected": is_drifted,
                    "threshold": settings.DRIFT_KS_P_VALUE_THRESHOLD
                }
                # Update Prometheus gauge
                FEATURE_DRIFT_SCORE.labels(feature_name=col, test_type="ks_p_value").set(p_val)

        # 2. Categorical Feature PSI Tests
        for col in cls.CATEGORICAL_FEATURES:
            if col in prod_df.columns and col in ref_df.columns:
                psi_val = cls.calculate_psi(ref_df[col], prod_df[col])
                is_drifted = psi_val >= settings.DRIFT_PSI_THRESHOLD
                if is_drifted:
                    drift_count += 1
                feature_drift_results[col] = {
                    "type": "categorical",
                    "test": "Population Stability Index (PSI)",
                    "statistic": round(psi_val, 4),
                    "drift_detected": is_drifted,
                    "threshold": settings.DRIFT_PSI_THRESHOLD
                }
                FEATURE_DRIFT_SCORE.labels(feature_name=col, test_type="psi").set(psi_val)

        # 3. Determine Drift Severity
        if drift_count >= 2:
            severity = "CRITICAL"
        elif drift_count == 1:
            severity = "WARNING"
        else:
            severity = "NONE"

        # 4. Retraining Policy Evaluation
        # Policy: drift confirmed AND min verified feedback rows AND cooldown elapsed AND data quality passed
        drift_confirmed = severity in ["WARNING", "CRITICAL"]
        feedback_met = verified_feedback_count >= settings.MIN_VERIFIED_FEEDBACK_FOR_RETRAIN
        cooldown_met = cooldown_elapsed_hours >= settings.RETRAINING_COOLDOWN_HOURS
        data_quality_passed = len(prod_df) >= 20

        should_trigger_retraining = (
            drift_confirmed and feedback_met and cooldown_met and data_quality_passed
        )

        report = {
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "drift_severity": severity,
            "drift_detected": drift_confirmed,
            "drifted_features_count": drift_count,
            "total_features_monitored": len(feature_drift_results),
            "production_window_samples": len(prod_df),
            "reference_baseline_samples": len(ref_df),
            "per_feature_drift": feature_drift_results,
            "policy_check": {
                "drift_confirmed": drift_confirmed,
                "verified_feedback_count": verified_feedback_count,
                "feedback_threshold_met": feedback_met,
                "cooldown_elapsed_hours": cooldown_elapsed_hours,
                "cooldown_threshold_met": cooldown_met,
                "data_quality_passed": data_quality_passed,
                "should_trigger_retraining": should_trigger_retraining
            }
        }

        # Save JSON summary
        json_path = os.path.join(REPORTS_DIR, "drift_summary.json")
        with open(json_path, "w") as f:
            json.dump(report, f, indent=2)

        # Generate standalone interactive HTML report
        cls._generate_html_report(report, os.path.join(REPORTS_DIR, "drift_report.html"))

        return report

    @classmethod
    def _generate_html_report(cls, report: Dict[str, Any], output_path: str):
        badge_color = "#ef4444" if report["drift_severity"] == "CRITICAL" else ("#f59e0b" if report["drift_severity"] == "WARNING" else "#10b981")
        rows = ""
        for feat, data in report["per_feature_drift"].items():
            status_badge = '<span style="color:#ef4444;font-weight:bold;">DRIFTED</span>' if data["drift_detected"] else '<span style="color:#10b981;font-weight:bold;">STABLE</span>'
            metric_val = f"p={data.get('p_value', data.get('statistic'))}"
            rows += f"""
            <tr style="border-bottom: 1px solid #334155;">
              <td style="padding: 10px; font-weight: bold; color: #f8fafc;">{feat}</td>
              <td style="padding: 10px; color: #94a3b8;">{data['type'].upper()}</td>
              <td style="padding: 10px; color: #cbd5e1;">{data['test']}</td>
              <td style="padding: 10px; font-family: monospace; color: #38bdf8;">{metric_val}</td>
              <td style="padding: 10px;">{status_badge}</td>
            </tr>
            """

        html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>AdaptFlow Evidently AI Drift Report</title>
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #020617; color: #f8fafc; padding: 24px; }}
    .card {{ background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 20px; }}
    table {{ width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }}
    th {{ background: #1e293b; color: #94a3b8; padding: 10px; text-transform: uppercase; font-size: 11px; }}
  </style>
</head>
<body>
  <div class="card">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h2 style="margin: 0; color: #f8fafc;">Evidently AI Statistical Drift Report</h2>
        <p style="margin: 4px 0 0; color: #94a3b8; font-size: 12px;">Rolling Window: {report['production_window_samples']} samples | Timestamp: {report['timestamp']}</p>
      </div>
      <div style="background: {badge_color}20; border: 1px solid {badge_color}; color: {badge_color}; padding: 6px 14px; border-radius: 9999px; font-weight: bold; font-size: 13px;">
        Severity: {report['drift_severity']}
      </div>
    </div>
  </div>

  <div class="card">
    <h3 style="margin-top: 0; font-size: 15px;">Monitored Feature Distributions</h3>
    <table>
      <thead>
        <tr>
          <th>Feature</th>
          <th>Type</th>
          <th>Statistical Test</th>
          <th>Statistic / Metric</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  </div>
</body>
</html>"""
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(html_content)

    @classmethod
    def simulate_shifted_traffic(cls, n_samples: int = 150) -> pd.DataFrame:
        """
        Simulates shifted customer churn traffic for live demonstration:
        - Injects severe drift into MonthlyCharges ($110+ average)
        - Injects Month-to-month contract skew (85%)
        - Injects Fiber optic subscription spike (80%)
        """
        rng = np.random.RandomState(int(time.time()))
        tenures = rng.randint(1, 10, size=n_samples) # Sharp drop in tenure
        monthly_charges = rng.uniform(95.0, 140.0, size=n_samples) # Sharp increase in monthly charges
        total_charges = monthly_charges * tenures
        contracts = rng.choice(["Month-to-month", "One year", "Two year"], size=n_samples, p=[0.85, 0.10, 0.05])
        internet_services = rng.choice(["Fiber optic", "DSL", "No"], size=n_samples, p=[0.80, 0.15, 0.05])
        payment_methods = rng.choice(
            ["Electronic check", "Mailed check", "Bank transfer (automatic)", "Credit card (automatic)"],
            size=n_samples,
            p=[0.70, 0.10, 0.10, 0.10]
        )

        return pd.DataFrame({
            "tenure": tenures,
            "MonthlyCharges": monthly_charges,
            "TotalCharges": total_charges,
            "Contract": contracts,
            "InternetService": internet_services,
            "PaymentMethod": payment_methods,
            "TechSupport": ["No"] * n_samples,
            "OnlineSecurity": ["No"] * n_samples
        })
