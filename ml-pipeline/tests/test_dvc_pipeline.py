import os
import sys
import json
import pandas as pd
import pytest

# Add ml-pipeline to path
sys.path.insert(0, os.path.abspath("ml-pipeline/src"))

from validate import validate_dataset
from ingest import ingest_and_merge_data, compute_file_sha256
from preprocess import preprocess_pipeline
from evaluate import evaluate_slices_pipeline
from register import apply_validation_gates_and_register

def test_ingest_and_hashing():
    dataset_hash, count = ingest_and_merge_data()
    assert dataset_hash.startswith("dvc-sha256-")
    assert count >= 7000
    assert os.path.exists("ml-pipeline/data/processed/merged_churn_data.csv")
    print(f"Ingest passed: {count} rows, Hash: {dataset_hash}")

def test_pandera_valid_data():
    df = pd.read_csv("ml-pipeline/data/processed/merged_churn_data.csv")
    is_valid, report = validate_dataset(df)
    assert is_valid is True
    assert report["status"] == "PASSED"
    assert report["errorsCount"] == 0
    print("Pandera valid data test passed.")

def test_pandera_rejects_corrupted_vendor_upload():
    # Corrupt dataset with negative charges, illegal contract, and bad gender
    corrupt_df = pd.DataFrame({
        "customerID": ["CUST-BAD-1", "CUST-BAD-2"],
        "gender": ["Alien", "Female"],
        "SeniorCitizen": [5, 0], # invalid integer
        "Partner": ["Maybe", "No"], # invalid category
        "Dependents": ["No", "No"],
        "tenure": [-10, 5], # negative tenure
        "PhoneService": ["Yes", "Yes"],
        "MultipleLines": ["No", "No"],
        "InternetService": ["Satellite", "DSL"], # invalid ISP
        "OnlineSecurity": ["No", "No"],
        "OnlineBackup": ["No", "No"],
        "DeviceProtection": ["No", "No"],
        "TechSupport": ["No", "No"],
        "StreamingTV": ["No", "No"],
        "StreamingMovies": ["No", "No"],
        "Contract": ["Permanent Lifetime", "One year"], # invalid contract
        "PaperlessBilling": ["Yes", "Yes"],
        "PaymentMethod": ["Cryptocurrency Bitcoin", "Electronic check"], # invalid payment
        "MonthlyCharges": [-999.0, 45.0], # negative charge
        "TotalCharges": [10.0, 200.0]
    })

    is_valid, report = validate_dataset(corrupt_df)
    assert is_valid is False
    assert report["status"] == "FAILED"
    assert report["errorsCount"] > 0
    assert len(report["violations"]) > 0
    print("Pandera rejection test passed: Successfully rejected malformed vendor payload with", report["errorsCount"], "violations.")

def test_preprocessing():
    preprocess_pipeline()
    assert os.path.exists("ml-pipeline/data/processed/X_train.npy")
    assert os.path.exists("ml-pipeline/data/processed/preprocessor.joblib")
    print("Preprocessing passed.")

def test_evaluation_and_slices():
    slices = evaluate_slices_pipeline()
    assert "Contract" in slices
    assert "InternetService" in slices
    assert os.path.exists("ml-pipeline/slice_metrics.json")
    print("Evaluation and slice check passed.")

def test_validation_gates_and_register():
    passed = apply_validation_gates_and_register()
    assert passed is True
    print("Validation gates passed.")

if __name__ == "__main__":
    test_ingest_and_hashing()
    test_pandera_valid_data()
    test_pandera_rejects_corrupted_vendor_upload()
    test_preprocessing()
    test_evaluation_and_slices()
    test_validation_gates_and_register()
    print("\n🎉 ALL PHASE 3 DVC & DATA VALIDATION TESTS PASSED 100%!")
