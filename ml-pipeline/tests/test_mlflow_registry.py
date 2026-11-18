import mlflow
from mlflow.tracking import MlflowClient

def test_mlflow_registry_aliases():
    mlflow.set_tracking_uri("sqlite:///mlflow.db")
    client = MlflowClient()

    model_name = "AdaptFlow-Churn-Predictor"
    registered_model = client.get_registered_model(model_name)
    assert registered_model.name == model_name

    # Check champion alias
    champion_model = client.get_model_version_by_alias(model_name, "champion")
    assert champion_model is not None
    assert int(champion_model.version) >= 1
    print(f"Verified Champion Model: Version {champion_model.version} (Run ID: {champion_model.run_id})")

    # Check previous alias
    previous_model = client.get_model_version_by_alias(model_name, "previous")
    assert previous_model is not None
    print(f"Verified Previous Model: Version {previous_model.version} (Run ID: {previous_model.run_id})")

    # Verify run metrics & tags
    run = client.get_run(champion_model.run_id)
    assert "f1" in run.data.metrics
    assert "roc_auc" in run.data.metrics
    assert "dvc_dataset_hash" in run.data.tags
    assert "git_commit" in run.data.tags
    print(f"Champion Metrics: F1={run.data.metrics['f1']:.4f}, ROC-AUC={run.data.metrics['roc_auc']:.4f}")
    print(f"Dataset DVC Hash: {run.data.tags['dvc_dataset_hash']}")

    print("\n✅ MLflow Model Registry & Experiment Tracking verification successful!")

if __name__ == "__main__":
    test_mlflow_registry_aliases()
