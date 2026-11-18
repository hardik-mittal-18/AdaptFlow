import json
import pandas as pd
import pandera as pa
from pandera import Column, Check, DataFrameSchema
from typing import Tuple, Dict, Any

# Define the strict Pandera validation schema for Telco Churn datasets
TELCO_SCHEMA = DataFrameSchema(
    columns={
        "customerID": Column(str, nullable=False, required=False),
        "gender": Column(str, Check.isin(["Male", "Female"]), nullable=False),
        "SeniorCitizen": Column(int, Check.isin([0, 1]), nullable=False),
        "Partner": Column(str, Check.isin(["Yes", "No"]), nullable=False),
        "Dependents": Column(str, Check.isin(["Yes", "No"]), nullable=False),
        "tenure": Column(int, Check.in_range(0, 120), nullable=False),
        "PhoneService": Column(str, Check.isin(["Yes", "No"]), nullable=False),
        "MultipleLines": Column(str, Check.isin(["Yes", "No", "No phone service"]), nullable=False),
        "InternetService": Column(str, Check.isin(["DSL", "Fiber optic", "No"]), nullable=False),
        "OnlineSecurity": Column(str, Check.isin(["Yes", "No", "No internet service"]), nullable=False),
        "OnlineBackup": Column(str, Check.isin(["Yes", "No", "No internet service"]), nullable=False),
        "DeviceProtection": Column(str, Check.isin(["Yes", "No", "No internet service"]), nullable=False),
        "TechSupport": Column(str, Check.isin(["Yes", "No", "No internet service"]), nullable=False),
        "StreamingTV": Column(str, Check.isin(["Yes", "No", "No internet service"]), nullable=False),
        "StreamingMovies": Column(str, Check.isin(["Yes", "No", "No internet service"]), nullable=False),
        "Contract": Column(str, Check.isin(["Month-to-month", "One year", "Two year"]), nullable=False),
        "PaperlessBilling": Column(str, Check.isin(["Yes", "No"]), nullable=False),
        "PaymentMethod": Column(
            str,
            Check.isin([
                "Electronic check",
                "Mailed check",
                "Bank transfer (automatic)",
                "Credit card (automatic)"
            ]),
            nullable=False
        ),
        "MonthlyCharges": Column(float, Check.in_range(0.0, 500.0), nullable=False),
        "TotalCharges": Column(float, Check.in_range(0.0, 25000.0), nullable=True),
        "Churn": Column(str, Check.isin(["Yes", "No"]), nullable=True, required=False)
    },
    coerce=True,
    strict=False
)

def validate_dataset(df: pd.DataFrame) -> Tuple[bool, Dict[str, Any]]:
    """
    Validates a DataFrame against Pandera schema specifications.
    Returns (is_valid, validation_report).
    """
    try:
        validated_df = TELCO_SCHEMA.validate(df, lazy=True)
        return True, {
            "status": "PASSED",
            "totalRecords": len(df),
            "errorsCount": 0,
            "violations": [],
            "message": "Data schema and statistical bounds verified successfully."
        }
    except pa.errors.SchemaErrors as err:
        failure_cases = err.failure_cases
        violations = []
        for _, row in failure_cases.head(10).iterrows():
            violations.append({
                "column": str(row.get("column", "dataset")),
                "check": str(row.get("check", "type_check")),
                "failureCase": str(row.get("failure_case", "")),
                "index": int(row.get("index", -1)) if pd.notnull(row.get("index")) else None
            })
        return False, {
            "status": "FAILED",
            "totalRecords": len(df),
            "errorsCount": len(failure_cases),
            "violations": violations,
            "message": f"Dataset validation failed with {len(failure_cases)} schema errors."
        }

if __name__ == "__main__":
    import sys
    data_file = sys.argv[1] if len(sys.argv) > 1 else "ml-pipeline/data/raw/telco_churn_baseline.csv"
    df = pd.read_csv(data_file)
    is_valid, report = validate_dataset(df)
    print(json.dumps(report, indent=2))
    sys.exit(0 if is_valid else 1)
