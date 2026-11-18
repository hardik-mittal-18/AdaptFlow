import os
import numpy as np
import pandas as pd

def generate_telco_churn_dataset(output_path: str = "ml-pipeline/data/raw/telco_churn_baseline.csv", n_samples: int = 7043, seed: int = 42):
    """
    Synthesizes realistic IBM Telco Churn dataset benchmark (7,043 samples, 20 columns).
    Deterministic seed for 100% reproducibility across MLOps runs.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    rng = np.random.RandomState(seed)

    customer_ids = [f"CUST-{1000 + i}" for i in range(n_samples)]
    genders = rng.choice(["Male", "Female"], size=n_samples, p=[0.505, 0.495])
    senior_citizens = rng.choice([0, 1], size=n_samples, p=[0.838, 0.162])
    partners = rng.choice(["Yes", "No"], size=n_samples, p=[0.483, 0.517])
    dependents = rng.choice(["Yes", "No"], size=n_samples, p=[0.299, 0.701])
    tenures = rng.randint(1, 73, size=n_samples)
    phone_services = rng.choice(["Yes", "No"], size=n_samples, p=[0.903, 0.097])
    multiple_lines = rng.choice(["Yes", "No", "No phone service"], size=n_samples, p=[0.422, 0.481, 0.097])
    internet_services = rng.choice(["Fiber optic", "DSL", "No"], size=n_samples, p=[0.440, 0.344, 0.216])
    online_securities = rng.choice(["Yes", "No", "No internet service"], size=n_samples, p=[0.287, 0.497, 0.216])
    online_backups = rng.choice(["Yes", "No", "No internet service"], size=n_samples, p=[0.345, 0.439, 0.216])
    device_protections = rng.choice(["Yes", "No", "No internet service"], size=n_samples, p=[0.344, 0.440, 0.216])
    tech_supports = rng.choice(["Yes", "No", "No internet service"], size=n_samples, p=[0.290, 0.494, 0.216])
    streaming_tvs = rng.choice(["Yes", "No", "No internet service"], size=n_samples, p=[0.384, 0.400, 0.216])
    streaming_movies = rng.choice(["Yes", "No", "No internet service"], size=n_samples, p=[0.388, 0.396, 0.216])
    contracts = rng.choice(["Month-to-month", "One year", "Two year"], size=n_samples, p=[0.550, 0.209, 0.241])
    paperless_billings = rng.choice(["Yes", "No"], size=n_samples, p=[0.592, 0.408])
    payment_methods = rng.choice(
        ["Electronic check", "Mailed check", "Bank transfer (automatic)", "Credit card (automatic)"],
        size=n_samples,
        p=[0.335, 0.228, 0.219, 0.218]
    )

    # Base monthly charges depending on internet and streaming
    monthly_charges = []
    for i in range(n_samples):
        base = 20.0 if internet_services[i] == "No" else (45.0 if internet_services[i] == "DSL" else 75.0)
        addons = (1 if streaming_tvs[i] == "Yes" else 0) * 10 + (1 if streaming_movies[i] == "Yes" else 0) * 10
        addons += (1 if tech_supports[i] == "Yes" else 0) * 5 + (1 if online_securities[i] == "Yes" else 0) * 5
        charge = base + addons + rng.uniform(-2.5, 5.0)
        monthly_charges.append(round(charge, 2))

    total_charges = [round(monthly_charges[i] * tenures[i] + rng.uniform(0, 15), 2) for i in range(n_samples)]

    # Compute churn probability log-odds
    churn_labels = []
    for i in range(n_samples):
        z = -1.35
        if contracts[i] == "Month-to-month": z += 1.40
        elif contracts[i] == "Two year": z -= 1.50
        if internet_services[i] == "Fiber optic": z += 0.85
        if tenures[i] < 12: z += 0.70
        elif tenures[i] > 48: z -= 0.85
        if payment_methods[i] == "Electronic check": z += 0.50
        if tech_supports[i] == "No" and internet_services[i] != "No": z += 0.30
        p = 1.0 / (1.0 + np.exp(-z))
        churn_labels.append("Yes" if rng.rand() < p else "No")

    df = pd.DataFrame({
        "customerID": customer_ids,
        "gender": genders,
        "SeniorCitizen": senior_citizens,
        "Partner": partners,
        "Dependents": dependents,
        "tenure": tenures,
        "PhoneService": phone_services,
        "MultipleLines": multiple_lines,
        "InternetService": internet_services,
        "OnlineSecurity": online_securities,
        "OnlineBackup": online_backups,
        "DeviceProtection": device_protections,
        "TechSupport": tech_supports,
        "StreamingTV": streaming_tvs,
        "StreamingMovies": streaming_movies,
        "Contract": contracts,
        "PaperlessBilling": paperless_billings,
        "PaymentMethod": payment_methods,
        "MonthlyCharges": monthly_charges,
        "TotalCharges": total_charges,
        "Churn": churn_labels
    })

    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} samples at {output_path}. Churn rate: {(df['Churn'] == 'Yes').mean():.2%}")
    return df

if __name__ == "__main__":
    generate_telco_churn_dataset()
