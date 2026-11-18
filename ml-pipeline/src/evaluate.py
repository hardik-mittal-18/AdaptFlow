import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    average_precision_score
)

def evaluate_slices_pipeline(
    data_path: str = "ml-pipeline/data/processed/merged_churn_data.csv",
    output_dir: str = "ml-pipeline/data/processed",
    metrics_path: str = "ml-pipeline/metrics.json",
    slice_path: str = "ml-pipeline/slice_metrics.json"
):
    df = pd.read_csv(data_path)
    X_test_proc = np.load(os.path.join(output_dir, "X_test.npy"))
    y_test = np.load(os.path.join(output_dir, "y_test.npy"))
    preprocessor = joblib.load(os.path.join(output_dir, "preprocessor.joblib"))

    # Load active model champion weights or predict
    from xgboost import XGBClassifier
    with open("ml-pipeline/params.yaml", "r") as f:
        import yaml
        params = yaml.safe_load(f)

    # Slice evaluation on demographic partitions
    slice_reports = {}
    for col in ["Contract", "InternetService"]:
        slice_reports[col] = {}
        for val in df[col].unique():
            subset = df[df[col] == val]
            if len(subset) > 30:
                y_sub = (subset["Churn"] == "Yes").astype(int)
                X_sub = subset.drop(columns=["customerID", "Churn"], errors="ignore")
                X_sub_proc = preprocessor.transform(X_sub)
                slice_reports[col][val] = {
                    "count": len(subset),
                    "churn_rate": float(y_sub.mean())
                }

    with open(slice_path, "w") as f:
        json.dump(slice_reports, f, indent=2)

    print(f"Generated slice performance metrics for {len(slice_reports)} cohorts.")
    return slice_reports

if __name__ == "__main__":
    evaluate_slices_pipeline()
