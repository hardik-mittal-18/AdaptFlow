import os
import sys

# Ensure Matplotlib & MLflow run cleanly and quickly
os.environ["MPLCONFIGDIR"] = os.path.abspath("ml-pipeline/artifacts/.matplotlib")
os.environ["MLFLOW_ENABLE_TELEMETRY"] = "false"
os.environ["DISABLE_TELEMETRY"] = "1"
os.makedirs(os.environ["MPLCONFIGDIR"], exist_ok=True)

import json
import time
import subprocess
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import optuna
import mlflow
import mlflow.sklearn
import mlflow.xgboost
from mlflow.tracking import MlflowClient

from sklearn.model_selection import StratifiedKFold, train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    average_precision_score,
    confusion_matrix,
    ConfusionMatrixDisplay
)
from xgboost import XGBClassifier

# Silence Optuna info logs during tuning
optuna.logging.set_verbosity(optuna.logging.WARNING)

RANDOM_SEED = 42
DVC_BASELINE_HASH = "dvc-sha256-83a9f041e892c9085817a22830f0f5"
MODEL_NAME = "AdaptFlow-Churn-Predictor"

def get_git_commit() -> str:
    try:
        res = subprocess.run(["git", "rev-parse", "HEAD"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
        return res.stdout.strip()[:8]
    except Exception:
        return "git-head-local"

def prepare_data(data_path: str = "ml-pipeline/data/raw/telco_churn_baseline.csv"):
    if not os.path.exists(data_path):
        from data_generator import generate_telco_churn_dataset
        generate_telco_churn_dataset(output_path=data_path, seed=RANDOM_SEED)

    df = pd.read_csv(data_path)
    X = df.drop(columns=["customerID", "Churn"])
    y = (df["Churn"] == "Yes").astype(int)

    categorical_cols = X.select_dtypes(include=["object"]).columns.tolist()
    numeric_cols = X.select_dtypes(include=["int64", "float64"]).columns.tolist()

    return X, y, numeric_cols, categorical_cols

def build_preprocessor(numeric_cols, categorical_cols):
    return ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numeric_cols),
            ("cat", OneHotEncoder(drop="first", handle_unknown="ignore", sparse_output=False), categorical_cols)
        ]
    )

def evaluate_predictions(y_true, y_pred, y_prob):
    return {
        "accuracy": float(accuracy_score(y_true, y_pred)),
        "precision": float(precision_score(y_true, y_pred, zero_division=0)),
        "recall": float(recall_score(y_true, y_pred, zero_division=0)),
        "f1": float(f1_score(y_true, y_pred, zero_division=0)),
        "roc_auc": float(roc_auc_score(y_true, y_prob)),
        "pr_auc": float(average_precision_score(y_true, y_prob))
    }

def train_and_log_models(tracking_uri: str = "sqlite:///mlflow.db"):
    os.makedirs("ml-pipeline/artifacts", exist_ok=True)
    mlflow.set_tracking_uri(tracking_uri)
    experiment = mlflow.set_experiment("AdaptFlow-Churn-Retraining")
    client = MlflowClient()

    git_commit = get_git_commit()
    X, y, num_cols, cat_cols = prepare_data()
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=RANDOM_SEED, stratify=y)

    preprocessor = build_preprocessor(num_cols, cat_cols)
    X_train_proc = preprocessor.fit_transform(X_train)
    X_test_proc = preprocessor.transform(X_test)

    # -------------------------------------------------------------
    # 1. Baseline Model: Logistic Regression (Fixed Seed)
    # -------------------------------------------------------------
    print("\n--- Training Model Family 1: Logistic Regression Baseline ---")
    with mlflow.start_run(run_name="LogisticRegression-Baseline") as run_lr:
        lr_model = LogisticRegression(max_iter=1000, random_state=RANDOM_SEED, C=1.0)
        lr_model.fit(X_train_proc, y_train)

        # 5-fold Stratified CV
        cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_SEED)
        cv_scores = []
        for train_idx, val_idx in cv.split(X_train_proc, y_train):
            m = LogisticRegression(max_iter=1000, random_state=RANDOM_SEED, C=1.0)
            m.fit(X_train_proc[train_idx], y_train.iloc[train_idx])
            preds = m.predict(X_train_proc[val_idx])
            cv_scores.append(f1_score(y_train.iloc[val_idx], preds))
        mean_cv_f1 = float(np.mean(cv_scores))

        t0 = time.perf_counter()
        y_test_pred = lr_model.predict(X_test_proc)
        y_test_prob = lr_model.predict_proba(X_test_proc)[:, 1]
        lat_ms = float((time.perf_counter() - t0) * 1000 / len(X_test))

        metrics_lr = evaluate_predictions(y_test, y_test_pred, y_test_prob)
        metrics_lr["cv_f1_mean"] = mean_cv_f1
        metrics_lr["latency_per_sample_ms"] = lat_ms

        mlflow.log_params({"algorithm": "LogisticRegression", "C": 1.0, "max_iter": 1000, "random_seed": RANDOM_SEED})
        mlflow.log_metrics(metrics_lr)
        mlflow.set_tags({"dvc_dataset_hash": DVC_BASELINE_HASH, "git_commit": git_commit, "model_stage": "Baseline"})

        # Confusion Matrix
        cm_path = "ml-pipeline/artifacts/confusion_matrix_lr.png"
        fig, ax = plt.subplots(figsize=(5, 4))
        ConfusionMatrixDisplay.from_predictions(y_test, y_test_pred, ax=ax, cmap="Blues")
        plt.title("Logistic Regression Confusion Matrix")
        plt.tight_layout()
        plt.savefig(cm_path)
        plt.close()
        mlflow.log_artifact(cm_path)

        # Log and register Baseline model directly
        mlflow.sklearn.log_model(lr_model, name="model", registered_model_name=MODEL_NAME, pip_requirements=["scikit-learn"])

    # After run completes, assign "previous" alias
    latest_versions = client.get_latest_versions(MODEL_NAME)
    lr_version = latest_versions[0].version
    client.set_registered_model_alias(MODEL_NAME, "previous", lr_version)
    print(f"Logged & registered Logistic Regression (v{lr_version}) with alias 'previous'. F1={metrics_lr['f1']:.4f}, ROC-AUC={metrics_lr['roc_auc']:.4f}", flush=True)

    # -------------------------------------------------------------
    # 2. Production Candidate: XGBoost with Optuna Hyperparameter Search
    # -------------------------------------------------------------
    print("\n--- Training Model Family 2: XGBoost with Optuna Tuning ---")

    def objective(trial):
        params = {
            "n_estimators": trial.suggest_int("n_estimators", 80, 250),
            "max_depth": trial.suggest_int("max_depth", 3, 7),
            "learning_rate": trial.suggest_float("learning_rate", 0.01, 0.2, log=True),
            "subsample": trial.suggest_float("subsample", 0.7, 1.0),
            "colsample_bytree": trial.suggest_float("colsample_bytree", 0.7, 1.0),
            "reg_alpha": trial.suggest_float("reg_alpha", 1e-3, 10.0, log=True),
            "reg_lambda": trial.suggest_float("reg_lambda", 1e-3, 10.0, log=True),
            "random_state": RANDOM_SEED,
            "eval_metric": "logloss"
        }
        scores = []
        cv = StratifiedKFold(n_splits=3, shuffle=True, random_state=RANDOM_SEED)
        for train_idx, val_idx in cv.split(X_train_proc, y_train):
            clf = XGBClassifier(**params)
            clf.fit(X_train_proc[train_idx], y_train.iloc[train_idx])
            preds = clf.predict_proba(X_train_proc[val_idx])[:, 1]
            scores.append(roc_auc_score(y_train.iloc[val_idx], preds))
        return np.mean(scores)

    study = optuna.create_study(direction="maximize", sampler=optuna.samplers.TPESampler(seed=RANDOM_SEED))
    study.optimize(objective, n_trials=5, show_progress_bar=False)
    best_params = study.best_params
    best_params["random_state"] = RANDOM_SEED
    best_params["eval_metric"] = "logloss"
    print(f"Optuna Best Params: {best_params}", flush=True)

    with mlflow.start_run(run_name="XGBoost-Champion-Tuned") as run_xgb:
        xgb_model = XGBClassifier(**best_params)
        xgb_model.fit(X_train_proc, y_train)

        # 5-fold CV evaluation
        cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_SEED)
        cv_f1_scores = []
        for train_idx, val_idx in cv.split(X_train_proc, y_train):
            clf = XGBClassifier(**best_params)
            clf.fit(X_train_proc[train_idx], y_train.iloc[train_idx])
            preds = clf.predict(X_train_proc[val_idx])
            cv_f1_scores.append(f1_score(y_train.iloc[val_idx], preds))
        mean_cv_f1_xgb = float(np.mean(cv_f1_scores))

        t0 = time.perf_counter()
        y_test_pred_xgb = xgb_model.predict(X_test_proc)
        y_test_prob_xgb = xgb_model.predict_proba(X_test_proc)[:, 1]
        lat_ms_xgb = float((time.perf_counter() - t0) * 1000 / len(X_test))

        metrics_xgb = evaluate_predictions(y_test, y_test_pred_xgb, y_test_prob_xgb)
        metrics_xgb["cv_f1_mean"] = mean_cv_f1_xgb
        metrics_xgb["latency_per_sample_ms"] = lat_ms_xgb
        metrics_xgb["optuna_best_cv_roc_auc"] = float(study.best_value)

        mlflow.log_params(best_params)
        mlflow.log_metrics(metrics_xgb)
        mlflow.set_tags({"dvc_dataset_hash": DVC_BASELINE_HASH, "git_commit": git_commit, "model_stage": "Production"})

        # Confusion Matrix Artifact
        cm_path_xgb = "ml-pipeline/artifacts/confusion_matrix_xgb.png"
        fig, ax = plt.subplots(figsize=(5, 4))
        ConfusionMatrixDisplay.from_predictions(y_test, y_test_pred_xgb, ax=ax, cmap="Purples")
        plt.title("XGBoost Tuned Confusion Matrix")
        plt.tight_layout()
        plt.savefig(cm_path_xgb)
        plt.close()
        mlflow.log_artifact(cm_path_xgb)

        # Feature Importance Plot Artifact
        fi_path = "ml-pipeline/artifacts/feature_importance_xgb.png"
        feature_names = preprocessor.get_feature_names_out()
        importances = xgb_model.feature_importances_
        top_idx = np.argsort(importances)[-10:]

        plt.figure(figsize=(8, 5))
        plt.barh(np.array(feature_names)[top_idx], importances[top_idx], color="#6366f1")
        plt.xlabel("XGBoost Relative Importance")
        plt.title("Top 10 Feature Importances (Telco Churn)")
        plt.tight_layout()
        plt.savefig(fi_path)
        plt.close()
        mlflow.log_artifact(fi_path)

        # Log and register XGBoost candidate model directly
        mlflow.xgboost.log_model(xgb_model, name="model", registered_model_name=MODEL_NAME, pip_requirements=["xgboost", "scikit-learn"])

    # After run completes, assign "champion" alias
    latest_versions = client.get_latest_versions(MODEL_NAME)
    xgb_version = latest_versions[0].version
    client.set_registered_model_alias(MODEL_NAME, "champion", xgb_version)
    print(f"Logged & registered XGBoost (v{xgb_version}) with alias 'champion'. F1={metrics_xgb['f1']:.4f}, ROC-AUC={metrics_xgb['roc_auc']:.4f}", flush=True)

    # Output summary metrics.json for DVC tracking
    with open("ml-pipeline/metrics.json", "w") as f:
        json.dump({
            "champion_version": xgb_version,
            "champion_algorithm": "XGBoost",
            "accuracy": metrics_xgb["accuracy"],
            "f1": metrics_xgb["f1"],
            "roc_auc": metrics_xgb["roc_auc"],
            "latency_ms": metrics_xgb["latency_per_sample_ms"],
            "baseline_f1": metrics_lr["f1"],
            "f1_lift": metrics_xgb["f1"] - metrics_lr["f1"],
            "dvc_hash": DVC_BASELINE_HASH,
            "git_commit": git_commit
        }, f, indent=2)

    print("\n✅ PHASE 2: MLFLOW EXPERIMENT TRACKING & MODEL REGISTRY COMPLETED!")

if __name__ == "__main__":
    train_and_log_models()
