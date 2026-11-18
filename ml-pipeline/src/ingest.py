import os
import hashlib
import json
import pandas as pd
from typing import Tuple

def compute_file_sha256(filepath: str) -> str:
    """Calculates SHA-256 cryptographic digest of a data file."""
    sha256 = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            sha256.update(chunk)
    return f"dvc-sha256-{sha256.hexdigest()[:32]}"

def ingest_and_merge_data(
    raw_path: str = "ml-pipeline/data/raw/telco_churn_baseline.csv",
    feedback_path: str = "ml-pipeline/data/feedback/verified_feedback.csv",
    output_path: str = "ml-pipeline/data/processed/merged_churn_data.csv",
    info_path: str = "ml-pipeline/data/processed/dataset_info.json"
) -> Tuple[str, int]:
    """
    Merges baseline data with newly admitted ground-truth feedback rows.
    Computes cryptographic DVC hash fingerprint for end-to-end model provenance.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    if not os.path.exists(raw_path):
        from data_generator import generate_telco_churn_dataset
        generate_telco_churn_dataset(output_path=raw_path)

    df_raw = pd.read_csv(raw_path)
    feedback_admitted = 0

    # Ingest feedback if available
    if os.path.exists(feedback_path):
        try:
            df_feedback = pd.read_csv(feedback_path)
            if not df_feedback.empty:
                # Align columns
                df_merged = pd.concat([df_raw, df_feedback], ignore_index=True)
                df_merged = df_merged.drop_duplicates(subset=["customerID"], keep="last")
                feedback_admitted = len(df_feedback)
                df_raw = df_merged
        except Exception as e:
            print(f"Warning: feedback ingest exception: {e}")

    df_raw.to_csv(output_path, index=False)
    dataset_hash = compute_file_sha256(output_path)

    info = {
        "dataset_hash": dataset_hash,
        "total_records": len(df_raw),
        "feedback_samples_admitted": feedback_admitted,
        "raw_samples": len(df_raw) - feedback_admitted,
        "columns_count": len(df_raw.columns),
        "output_path": output_path
    }

    with open(info_path, "w") as f:
        json.dump(info, f, indent=2)

    print(f"Ingested {len(df_raw)} records ({feedback_admitted} verified feedback admitted).")
    print(f"Dataset DVC Cryptographic Hash: {dataset_hash}")
    return dataset_hash, len(df_raw)

if __name__ == "__main__":
    ingest_and_merge_data()
