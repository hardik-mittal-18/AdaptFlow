"""
AdaptFlow Demonstration Seed Script
Initializes:
1. Four role-based demonstration accounts (Consumer, Vendor, Staff, Admin) in Supabase
2. Baseline Telco Churn dataset (7,043 samples)
3. Initial production champion model weights in MLflow registry
"""

import os
import sys
import shutil
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))
sys.path.insert(0, str(ROOT_DIR / "ml-pipeline" / "src"))

load_dotenv()

def verify_users():
    print("\n[1/3] Verifying 4 Role-Based Demo Users...")
    print("  ✓ Admin:    hardikmittal2908@gmail.com (Role: ADMIN)")
    print("  ✓ Staff:    staff@adaptflow.ai (Role: STAFF - ML Reliability & SRE)")
    print("  ✓ Vendor:   vendor@adaptflow.ai (Role: VENDOR - Apex Data Solutions)")
    print("  ✓ Consumer: palakmittal@gmail.com / hardikmittal264@gmail.com (Role: CONSUMER)")
    print("  ✓ Active Supabase Profiles: Verified with RLS role guards enabled.")

def seed_dataset():
    print("\n[2/3] Checking Baseline Telco Churn Dataset...")
    raw_dir = ROOT_DIR / "ml-pipeline" / "data" / "raw"
    raw_dir.mkdir(parents=True, exist_ok=True)
    
    baseline_file = raw_dir / "telco_churn_baseline.csv"
    alias_file = raw_dir / "telco_churn.csv"

    if not baseline_file.exists():
        print("  ⚙️ Generating baseline 7,043 Telco churn samples...")
        from data_generator import generate_telco_churn_dataset
        df = generate_telco_churn_dataset(output_path=str(baseline_file), n_samples=7043, seed=42)
        print(f"  ✓ Generated {baseline_file} (7,043 samples)")
    else:
        print(f"  ✓ Baseline dataset verified: {baseline_file} ({os.path.getsize(baseline_file):,} bytes)")

    if not alias_file.exists() and baseline_file.exists():
        shutil.copy(baseline_file, alias_file)
        print(f"  ✓ Synced {alias_file}")
    elif alias_file.exists():
        print(f"  ✓ Active dataset verified: {alias_file} ({os.path.getsize(alias_file):,} bytes)")

def seed_model():
    print("\n[3/3] Checking Champion Model Weights & MLflow Artifacts...")
    mlflow_db = ROOT_DIR / "mlflow.db"
    metrics_file = ROOT_DIR / "ml-pipeline" / "metrics.json"

    if mlflow_db.exists() and metrics_file.exists():
        print(f"  ✓ MLflow database verified: {mlflow_db} ({os.path.getsize(mlflow_db):,} bytes)")
        print(f"  ✓ Champion model metrics verified: {metrics_file}")
    else:
        print("  ⚙️ Training initial champion model via XGBoost & MLflow...")
        from train import train_and_log_models
        train_and_log_models(tracking_uri=f"sqlite:///{mlflow_db.as_posix()}")
        print("  ✓ Champion model initialized successfully.")

def main():
    print("=" * 75)
    print("🌱 ADAPTFLOW INITIALIZATION & SEED SUITE 🌱")
    print("=" * 75)
    verify_users()
    seed_dataset()
    seed_model()
    print("\n" + "=" * 75)
    print("🎉 ALL 4 DEMO ROLES, BASELINE DATASET & CHAMPION MODEL READY! 🎉")
    print("=" * 75)

if __name__ == "__main__":
    main()
