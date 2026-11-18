import time
import logging
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.metrics import render_prometheus_metrics
from app.schemas.telco import HealthResponse
from app.services.registry_loader import registry_service
from app.api.v1 import predict, feedback, model, drift, deployment

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("ml_service")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="High-performance Telco Customer Churn Prediction & Continuous MLOps Telemetry Service",
    docs_url="/docs",
    openapi_url="/openapi.json"
)

# Cross-Origin Resource Sharing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include v1 API routes
app.include_router(predict.router, prefix=settings.API_V1_PREFIX)
app.include_router(feedback.router, prefix=settings.API_V1_PREFIX)
app.include_router(model.router, prefix=settings.API_V1_PREFIX)
app.include_router(drift.router, prefix=settings.API_V1_PREFIX)
app.include_router(deployment.router, prefix=settings.API_V1_PREFIX)

# Also expose primary endpoints at root level for seamless reverse proxying
app.include_router(predict.router)
app.include_router(feedback.router)
app.include_router(model.router)
app.include_router(drift.router)
app.include_router(deployment.router)

@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Liveness probe confirming service process is active."""
    return HealthResponse(
        status="healthy",
        ready=True,
        version=settings.VERSION,
        modelLoaded=registry_service.get_model() is not None,
        activeAlias=registry_service._active_alias,
        timestamp=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    )

@app.get("/ready", response_model=HealthResponse, tags=["Health"])
async def readiness_probe():
    """Readiness probe confirming model weights are cached and serving."""
    is_ready = registry_service.get_model() is not None
    return HealthResponse(
        status="ready" if is_ready else "not_ready",
        ready=is_ready,
        version=settings.VERSION,
        modelLoaded=is_ready,
        activeAlias=registry_service._active_alias,
        timestamp=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    )

@app.get("/metrics", tags=["Observability"])
async def metrics_endpoint():
    """Prometheus metrics scraping endpoint."""
    payload, content_type = render_prometheus_metrics()
    return Response(content=payload, media_type=content_type)

@app.on_event("startup")
async def startup_event():
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION}")
    logger.info(f"Active Model Loaded: {registry_service.get_metadata()['version']} ({registry_service.get_metadata()['algorithm']})")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
