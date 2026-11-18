from prometheus_client import (
    Counter,
    Histogram,
    Gauge,
    generate_latest,
    CONTENT_TYPE_LATEST,
    CollectorRegistry,
    REGISTRY
)

# Request and Latency Counters
PREDICTION_REQUESTS = Counter(
    "mlops_prediction_requests_total",
    "Total prediction requests served by ml-service",
    ["endpoint", "model_version", "status"]
)

INFERENCE_LATENCY = Histogram(
    "mlops_inference_latency_seconds",
    "Inference latency distribution in seconds",
    ["algorithm", "model_version"],
    buckets=(0.001, 0.002, 0.005, 0.010, 0.020, 0.050, 0.100, 0.250, 0.500, 1.0)
)

CHURN_PROBABILITY_HISTOGRAM = Histogram(
    "mlops_churn_probability_distribution",
    "Distribution of output churn probabilities across inferences",
    buckets=(0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0)
)

MODEL_INFO = Gauge(
    "mlops_active_model_info",
    "Information regarding active serving model champion",
    ["model_name", "model_version", "algorithm", "alias", "dvc_hash"]
)

VERIFIED_FEEDBACK_COUNTER = Counter(
    "mlops_verified_feedback_total",
    "Total verified ground-truth feedback outcomes ingested",
    ["outcome"]
)

FEATURE_DRIFT_SCORE = Gauge(
    "mlops_feature_drift_p_value",
    "Kolmogorov-Smirnov p-value / PSI score per monitored feature",
    ["feature_name", "test_type"]
)

RETRAINING_RUNS_TOTAL = Counter(
    "mlops_retraining_runs_total",
    "Total automated retraining runs triggered",
    ["trigger_reason", "status"]
)

def render_prometheus_metrics() -> tuple[bytes, str]:
    """Generates Prometheus scrapable text format payload."""
    return generate_latest(REGISTRY), CONTENT_TYPE_LATEST
