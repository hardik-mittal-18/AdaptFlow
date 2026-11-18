from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.telco import ModelInfoResponse
from app.services.registry_loader import registry_service
from app.core.security import require_roles, AuthenticatedUser

router = APIRouter(tags=["Model Registry Governance"])

class ReloadRequest(BaseModel):
    alias: Optional[str] = "champion"
    version: Optional[str] = None

class PromoteRequest(BaseModel):
    targetVersion: str
    targetAlias: str = "champion"
    reason: Optional[str] = "Automated Blue-Green promotion gate cleared"

class RollbackRequest(BaseModel):
    targetAlias: str = "previous"
    reason: str = "Production drift or performance degradation rollback"

@router.get(
    "/model/info",
    response_model=ModelInfoResponse,
    summary="Get active champion model telemetry, DVC dataset hash, and accuracy benchmarks"
)
async def get_model_info():
    metadata = registry_service.get_metadata()
    return ModelInfoResponse(**metadata)


@router.post(
    "/model/reload",
    response_model=ModelInfoResponse,
    summary="Hot-reload active model from MLflow registry alias without service downtime"
)
async def reload_model(
    request: ReloadRequest,
    user: AuthenticatedUser = Depends(require_roles(["staff", "admin"]))
):
    updated = registry_service.hot_reload(alias=request.alias or "champion", model_version=request.version)
    return ModelInfoResponse(**updated)


@router.post(
    "/model/promote",
    response_model=ModelInfoResponse,
    summary="Promote candidate model to active champion (Super Admin Gate)"
)
async def promote_model(
    request: PromoteRequest,
    user: AuthenticatedUser = Depends(require_roles(["admin"]))
):
    updated = registry_service.hot_reload(alias="champion", model_version=request.targetVersion)
    return ModelInfoResponse(**updated)


@router.post(
    "/model/rollback",
    response_model=ModelInfoResponse,
    summary="Instant zero-downtime rollback to previous known stable model (Super Admin)"
)
async def rollback_model(
    request: RollbackRequest,
    user: AuthenticatedUser = Depends(require_roles(["admin"]))
):
    updated = registry_service.hot_reload(alias="champion", model_version="v1.0.0-champion")
    return ModelInfoResponse(**updated)
