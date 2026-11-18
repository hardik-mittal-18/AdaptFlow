import random
from locust import HttpUser, task, between

SAMPLE_CUSTOMERS = [
    {
        "gender": "Female",
        "SeniorCitizen": 0,
        "Partner": "Yes",
        "Dependents": "No",
        "tenure": 1,
        "PhoneService": "No",
        "MultipleLines": "No phone service",
        "InternetService": "DSL",
        "OnlineSecurity": "No",
        "OnlineBackup": "Yes",
        "DeviceProtection": "No",
        "TechSupport": "No",
        "StreamingTV": "No",
        "StreamingMovies": "No",
        "Contract": "Month-to-month",
        "PaperlessBilling": "Yes",
        "PaymentMethod": "Electronic check",
        "MonthlyCharges": 29.85,
        "TotalCharges": 29.85
    },
    {
        "gender": "Male",
        "SeniorCitizen": 0,
        "Partner": "No",
        "Dependents": "No",
        "tenure": 34,
        "PhoneService": "Yes",
        "MultipleLines": "No",
        "InternetService": "DSL",
        "OnlineSecurity": "Yes",
        "OnlineBackup": "No",
        "DeviceProtection": "Yes",
        "TechSupport": "No",
        "StreamingTV": "No",
        "StreamingMovies": "No",
        "Contract": "One year",
        "PaperlessBilling": "No",
        "PaymentMethod": "Mailed check",
        "MonthlyCharges": 56.95,
        "TotalCharges": 1889.50
    },
    {
        "gender": "Female",
        "SeniorCitizen": 1,
        "Partner": "No",
        "Dependents": "No",
        "tenure": 2,
        "PhoneService": "Yes",
        "MultipleLines": "Yes",
        "InternetService": "Fiber optic",
        "OnlineSecurity": "No",
        "OnlineBackup": "No",
        "DeviceProtection": "No",
        "TechSupport": "No",
        "StreamingTV": "Yes",
        "StreamingMovies": "Yes",
        "Contract": "Month-to-month",
        "PaperlessBilling": "Yes",
        "PaymentMethod": "Electronic check",
        "MonthlyCharges": 104.5,
        "TotalCharges": 209.0
    }
]

class TelcoChurnUser(HttpUser):
    wait_time = between(0.01, 0.05)  # High throughput load testing

    @task(10)
    def predict_single(self):
        sample = random.choice(SAMPLE_CUSTOMERS)
        payload = {
            "customerId": f"LOCUST-{random.randint(1000, 9999)}",
            "features": sample
        }
        headers = {
            "x-user-role": "consumer",
            "x-user-id": "locust-load-agent"
        }
        with self.client.post("/predict", json=payload, headers=headers, catch_response=True) as response:
            if response.status_code == 200:
                data = response.json()
                latency_ms = data.get("inferenceDurationMs", 0)
                if latency_ms > 10.0:
                    response.failure(f"Latency SLA breached: {latency_ms}ms > 10ms")
                else:
                    response.success()
            else:
                response.failure(f"HTTP {response.status_code}: {response.text}")

    @task(2)
    def model_info(self):
        self.client.get("/model/info")

    @task(1)
    def health_check(self):
        self.client.get("/health")
