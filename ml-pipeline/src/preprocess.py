import os
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer

RANDOM_SEED = 42

def preprocess_pipeline(
    input_path: str = "ml-pipeline/data/processed/merged_churn_data.csv",
    output_dir: str = "ml-pipeline/data/processed",
    test_size: float = 0.20
):
    os.makedirs(output_dir, exist_ok=True)
    df = pd.read_csv(input_path)

    X = df.drop(columns=["customerID", "Churn"], errors="ignore")
    y = (df["Churn"] == "Yes").astype(int)

    numeric_cols = X.select_dtypes(include=["int64", "float64"]).columns.tolist()
    categorical_cols = X.select_dtypes(include=["object"]).columns.tolist()

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numeric_cols),
            ("cat", OneHotEncoder(drop="first", handle_unknown="ignore", sparse_output=False), categorical_cols)
        ]
    )

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=RANDOM_SEED, stratify=y
    )

    X_train_proc = preprocessor.fit_transform(X_train)
    X_test_proc = preprocessor.transform(X_test)

    # Save artifacts
    np.save(os.path.join(output_dir, "X_train.npy"), X_train_proc)
    np.save(os.path.join(output_dir, "X_test.npy"), X_test_proc)
    np.save(os.path.join(output_dir, "y_train.npy"), y_train.values)
    np.save(os.path.join(output_dir, "y_test.npy"), y_test.values)
    joblib.dump(preprocessor, os.path.join(output_dir, "preprocessor.joblib"))

    print(f"Preprocessed {len(df)} samples into {X_train_proc.shape[1]} features.")
    print(f"Training split: {X_train_proc.shape[0]} | Test split: {X_test_proc.shape[0]}")

if __name__ == "__main__":
    preprocess_pipeline()
